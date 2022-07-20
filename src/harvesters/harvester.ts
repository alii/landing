import {DiscordAPIError} from '@discordjs/rest';
import {Ticker, TickerType} from '@prisma/client';
import {APIChannel, ChannelType} from 'discord-api-types/v10';
import {prisma} from '../server/prisma';
import {DiscordAPI} from './impl/discord/api';

export enum TickerRequirement {
	NONE = 1 << 0,
	VOTE = 1 << 1,
}

export const FORMATTER_REPLACER = '%v';

export function humanize(value: number | string) {
	return Number(value)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function format(ticker: Ticker, value: number | string) {
	return ticker.format.replace(FORMATTER_REPLACER, humanize(value));
}

export type ValidateInput = (
	value: string,
	guildId: string
) => Promise<
	| {
			success: true;
			platform_id: string;
	  }
	| {
			success: false;
			message: string;
	  }
>;

export interface Harvester {
	validateInput: ValidateInput | null;
	requirement: TickerRequirement;
	harvest(ticker: Ticker): Promise<
		| {
				success: true;
		  }
		| {
				success: false;
				discord_error: false;
				code:
					| 'CHANNEL_DELETED'
					| 'NOT_VOICE_CHANNEL'
					| 'TYPE_MISMATCH'
					| 'TIMEOUT_HARVESTING'
					| 'TIMEOUT_UPDATING_CHANNEL'
					| 'HARVESTER_FAILED';
				message: string;
		  }
		| {
				success: false;
				discord_error: true;
				code: string | number;
		  }
	>;
}

export interface HarvesterUtils {
	ensureId(ticker: Ticker): asserts ticker is Ticker & {platform_id: string};
}

export function createHarvester<T extends TickerType>(
	type: T,
	config: {
		requirement: TickerRequirement;
		validateInput?: null | ValidateInput;
		harvest(
			ticker: Omit<Ticker, 'type'> & {type: T},
			utils: HarvesterUtils
		): Promise<number | string>;
	}
): Harvester {
	const utils: HarvesterUtils = {
		ensureId(ticker) {
			if (!ticker.platform_id) {
				throw new Error('Expected `.platform_id` for ticker ' + ticker.channel_id);
			}
		},
	};

	return {
		validateInput: config.validateInput ?? null,
		requirement: config.requirement,

		async harvest(ticker) {
			if (ticker.type !== type) {
				return {
					success: false,
					discord_error: false,
					code: 'TYPE_MISMATCH',
					message: 'The ticker types do not match',
				};
			}

			const promise = config
				.harvest(ticker as Omit<Ticker, 'type'> & {type: T}, utils)
				.then(value => ({
					success: true as const,
					value,
				}))
				.catch((error: Error) => ({
					success: false as const,
					error,
				}));

			const timeout = new Promise<{
				success: false;
				timeout: true;
			}>(resolve => {
				setTimeout(() => {
					resolve({
						success: false,
						timeout: true,
					});
				}, 30_000);
			});

			const harvestResult = await Promise.race([promise, timeout]);

			if (!harvestResult.success) {
				if ('timeout' in harvestResult) {
					return {
						success: false,
						discord_error: true,
						code: 'TIMEOUT_HARVESTING',
					};
				}

				return {
					success: false,
					discord_error: false,
					code: 'HARVESTER_FAILED',
					message: harvestResult.error.message,
				};
			}

			const channel = await DiscordAPI.getChannel(ticker.channel_id).catch((err: DiscordAPIError) =>
				err.code.toString()
			);

			if (typeof channel === 'string') {
				if (channel === '10003') {
					return {
						success: false,
						discord_error: false,
						code: 'CHANNEL_DELETED',
						message: 'That channel was deleted',
					};
				}

				return {
					success: false,
					discord_error: true,
					code: channel,
				};
			}

			if (!channel) {
				await prisma.ticker
					.delete({
						where: {
							channel_id: ticker.channel_id,
						},
					})
					.catch(() => null);

				return {
					success: false,
					discord_error: false,
					code: 'CHANNEL_DELETED',
					message: 'That channel has been deleted',
				};
			}

			if (channel.type !== ChannelType.GuildVoice) {
				return {
					success: false,
					discord_error: false,
					code: 'NOT_VOICE_CHANNEL',
					message: 'That channel is not a voice channel',
				};
			}

			const updateChannel = await DiscordAPI.editChannel(ticker.channel_id, {
				name: format(ticker, harvestResult.value),
			});

			const updateRace = await Promise.race([
				updateChannel,
				new Promise<never>((resolve, reject) => {
					setTimeout(reject, 30_000);
				}),
			]).catch(() => null);

			if (updateRace === null) {
				return {
					success: false,
					discord_error: true,
					code: 'TIMEOUT_UPDATING_CHANNEL',
				};
			}

			return {
				success: true,
			};
		},
	};
}

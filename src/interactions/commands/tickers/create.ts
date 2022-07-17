import {TickerType} from '@prisma/client';
import {
	SlashCommand,
	SlashCreator,
	CommandContext,
	CommandOptionType,
	ChannelType,
	ApplicationCommandOptionChoice,
} from 'slash-create';
import {harvesters} from '../../../harvesters';
import {prisma} from '../../../server/prisma';
import {tickerTypeNames} from '../../types/type-names';
import {is, enumerate} from '../../util';

export class CreateCommand extends SlashCommand {
	constructor(creator: SlashCreator) {
		super(creator, {
			name: 'create',
			description: 'Create a ticker.',
			options: [
				{
					name: 'channel',
					description: 'The voice channel to bind to',
					required: true,
					type: CommandOptionType.CHANNEL,
					channel_types: [ChannelType.GUILD_VOICE],
				},
				{
					name: 'type',
					description: 'The type of ticker to create',
					required: true,
					type: CommandOptionType.STRING,
					choices: Object.entries(tickerTypeNames).map<ApplicationCommandOptionChoice>(entry => {
						const [value, name] = entry;
						return {name, value};
					}),
				},
				{
					name: 'input',
					description: 'Any input required for the ticker',
					required: false,
					type: CommandOptionType.STRING,
				},
			],
		});
	}

	async run(ctx: CommandContext) {
		ctx.defer();

		if (!ctx.guildID) {
			throw new Error('This command can only be ran inside of a guild!');
		}

		if (!is(ctx.options.type, enumerate(TickerType))) {
			throw new Error('Invalid ticker type!');
		}

		// if (ctx.options.channel.type !== 'GUILD_VOICE' || !ctx.options.channel.isVoice()) {
		// 	throw new Error('Channel must be a voice channel!');
		// }

		const existingOnChannel = await prisma.ticker.findFirst({
			where: {channel_id: ctx.channelID},
		});

		if (existingOnChannel) {
			throw new Error('A ticker already exists on this channel!');
		}

		const harvester = harvesters[ctx.options.type];

		if (harvester.validateInput) {
			const result = await harvester.validateInput(ctx.options.input);

			if (!result.success) {
				throw new Error(result.message);
			}
		}

		const ticker = await prisma.ticker.create({
			data: {
				channel_id: ctx.options.channel,
				guild_id: ctx.guildID,
				type: ctx.options.type,
				refresh_after: new Date(),
				format: '%v', // TODO: get format from harvester
				platform_id: ctx.options.input ? ctx.options.input : null,
			},
		});

		await harvester.harvest(ticker);

		ctx.send('Ticker created (add more data here)');

		// TODO: post analytics about ticker creation
	}
}

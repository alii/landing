/* eslint-disable no-await-in-loop */
import axios from 'axios';
import {api} from './api';
import {env} from './env';
import {harvesters} from '../harvesters';
import {prisma} from './prisma';
import dayjs from 'dayjs';
import {logsnag} from './logsnag';

export const handler = api({
	async POST({ctx}) {
		const tickers = await ctx.prisma.ticker.findMany({
			take: 10,
			where: {
				refresh_after: {
					lt: new Date(),
				},
			},
			orderBy: {
				refresh_after: 'desc',
			},
		});

		const stats = {
			deleted: 0,
			updated: 0,
			fails: 0,
		};

		for (const ticker of tickers) {
			const harvester = harvesters[ticker.type];

			try {
				const result = await harvester.harvest(ticker);

				if (result.success) {
					await prisma.ticker.update({
						where: {channel_id: ticker.channel_id},
						data: {
							refresh_after: dayjs().add(1, 'hour').toDate(),
						},
					});

					stats.updated++;
				} else {
					await prisma.ticker.update({
						where: {channel_id: ticker.channel_id},
						data: {refresh_after: dayjs().add(2, 'days').toDate()},
					});

					if (result.discord_error) {
						await logsnag({
							channel: 'errors',
							event: "Couldn't resolve channel",
							icon: '⚠️',
							description: `Ticker ${ticker.channel_id} (${ticker.type}) timed out`,
							tags: {
								code: result.code,
								ticker: ticker.channel_id,
							},
							notify: true,
						});
					} else {
						await logsnag({
							channel: 'errors',
							event: "Couldn't refresh ticker",
							icon: '⚠️',
							description: `Was unable to refresh ${ticker.channel_id} (${ticker.type})`,
							tags: {
								code: result.code,
								ticker: ticker.channel_id,
							},
							notify: true,
						});
					}

					stats.fails++;
				}
			} catch (e: unknown) {
				await logsnag({
					channel: 'errors',
					event: 'Ticker update failed',
					icon: '🚨',
					description: JSON.stringify(e),
					tags: {
						ticker: ticker.channel_id,
					},
					notify: true,
				});

				await prisma.ticker.update({
					where: {channel_id: ticker.channel_id},
					data: {
						refresh_after: dayjs().add(7, 'day').toDate(),
					},
				});

				stats.fails++;
			}
		}
	},
});

/**
 * Enqueue a job to lowcake asking for an empty POST back
 *
 * @param url The URL to receive a request at for cron intervals
 * @param cron The cron to use for the interval. Defaults to "At every fifth minute"
 * @param queue The queue ID to use. Defaults to the one configured from environment
 */
export async function enqueue(url: string, interval = 10 * 1000, queue = env.LOWCAKE_QUEUE_ID) {
	const {data} = await axios.post<unknown>(
		`https://lowcake-api.otters.app/v1/queues/${queue}`,
		{
			url,
			payload: null,
			exclusive: false,
			override: true,
			retry: [],
			schedule: {
				type: 'every',
				meta: interval.toString(),
			},
		},
		{
			headers: {Authorization: `Bearer ${env.LOWCAKE_API_KEY}`},
		}
	);

	return data;
}

export async function dequeue(queue: string, job: string) {
	const {data} = await axios.delete<unknown>(
		`https://lowcake-api.otters.app/v1/queues/${queue}/jobs/${job}`,
		{headers: {Authorization: `Bearer ${env.LOWCAKE_API_KEY}`}}
	);

	return data;
}

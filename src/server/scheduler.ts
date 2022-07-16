import axios from 'axios';
import {api} from './api';
import {env} from './env';

export const handler = api({
	async POST({req}) {
		console.log('Received data from lowcake:', Date.now(), req.body);
	},
});

/**
 * Enqueue a job to lowcake asking for an empty POST back
 *
 * @param url The URL to receive a request at for cron intervals
 * @param cron The cron to use for the interval. Defaults to "At every fifth minute"
 * @param queue The queue ID to use. Defaults to the one configured from environment
 */
export async function enqueue(url: string, cron = '*/5 * * * *', queue = env.LOWCAKE_QUEUE_ID) {
	await axios.post(
		`https://lowcake-api.otters.app/v1/queues/${queue}`,
		{
			url,
			payload: null,
			exclusive: false,
			override: false,
			retry: [],
			schedule: {
				type: 'cron',
				meta: cron,
			},
		},
		{
			headers: {Authorization: env.LOWCAKE_API_KEY},
		}
	);
}

export async function dequeue() {
	throw new Error('Dequeueing is not implemented yet.');
}
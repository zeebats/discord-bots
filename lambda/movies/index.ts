import type { Config } from '@netlify/functions';

import type { Providers } from '../../types/movies';

import { getMovies } from '../../src/movies';
import { useWebhook } from '../../src/webhook';
import { escapeSummerTime } from '../../utils/dates';
import { $sentry, handleSentryError } from '../../utils/sentry';

const { SENTRY_DSN, WEBHOOK_MOVIES } = process.env;

$sentry.init({ dsn: SENTRY_DSN });

$sentry.setTag('bot', 'movies');

const handleUpdate = async (providers: Providers) =>
	useWebhook({
		url: WEBHOOK_MOVIES,
		webhook: {
			embeds: providers.map(({ color, movies, provider, thumbnail, url }) => ({
				color,
				fields: movies.map(movie => ({
					name: movie.title,
					value: `[🔗 Link](${movie.link})`,
				})),
				thumbnail: { url: thumbnail },
				title: `New on ${provider}`,
				url,
			})),
		},
	});

const handleEmpty = async () =>
	useWebhook({
		url: WEBHOOK_MOVIES,
		webhook: { embeds: [{ title: 'No new movies today!' }] },
	});

export default async () => {
	try {
		if (escapeSummerTime()) {
			return new Response('Success', { status: 200 });
		}

		const items = await getMovies();

		if (items.length === 0) {
			await handleEmpty();

			return new Response('Success', { status: 200 });
		}

		const response = await handleUpdate(items);

		if (!response.ok) {
			throw new Error(JSON.stringify(response));
		}

		return new Response('Success', { status: 200 });
	} catch (error: unknown) {
		handleSentryError($sentry, error);

		return new Response('Error', { status: 500 });
	}
};

export const config: Config = { schedule: '0 16-17 * * *' };

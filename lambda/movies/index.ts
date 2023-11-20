import type { Config } from '@netlify/functions';

import type { Providers } from '../../types/movies';

import { getMovies } from '../../src/movies';
import { useWebhook } from '../../src/webhook';
import { escapeSummerTime } from '../../utils/dates';
import { $sentry, handleSentryError } from '../../utils/sentry';

const {
	SENTRY_DSN,
	WEBHOOK_MOVIES,
} = process.env;

$sentry.init({ dsn: SENTRY_DSN });

$sentry.setTag('bot', 'movies');

// eslint-disable-next-line require-await
const handleUpdate = async (providers: Providers) => useWebhook({
	url: WEBHOOK_MOVIES,
	webhook: {
		embeds: providers.map(({
			color,
			movies,
			provider,
			thumbnail,
			url,
		}) => ({
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

// eslint-disable-next-line require-await
const handleEmpty = async () => useWebhook({
	url: WEBHOOK_MOVIES,
	webhook: { embeds: [{ title: 'No new movies today!' }] },
});

// eslint-disable-next-line max-statements
export default async () => {
	try {
		if (escapeSummerTime()) {
			return;
		}

		const items = await getMovies();

		if (items.length === 0) {
			await handleEmpty();

			return;
		}

		const response = await handleUpdate(items);

		if (!response.ok) {
			throw new Error(JSON.stringify(response));
		}
	} catch (error: unknown) {
		handleSentryError($sentry, error);
	}
};

export const config: Config = { schedule: '0 16-17 * * *' };

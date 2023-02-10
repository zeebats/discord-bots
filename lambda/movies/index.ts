import { Handler, schedule } from '@netlify/functions';

import { getMovies } from '@/src/movies';
import { useWebhook } from '@/src/webhook';
import { escapeDST } from '@/utils/dates';
import { handleSentryError, default as Sentry } from '@/utils/sentry';

import type { Providers } from '@/types/movies';

const {
	SENTRY_DSN,
	WEBHOOK_MOVIES,
} = process.env;

Sentry.init({ dsn: SENTRY_DSN });

Sentry.setTag('bot', 'movies');

const handleUpdate = (providers: Providers): Promise<Response> => useWebhook({
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

const handleEmpty = (): Promise<Response> => useWebhook({
	url: WEBHOOK_MOVIES,
	webhook: { embeds: [{ title: 'No new movies today!' }] },
});

// eslint-disable-next-line max-statements
export const handler: Handler = schedule('0 16-17 * * *', async (): Promise<{ statusCode: number; }> => {
	try {
		if (escapeDST()) {
			return { statusCode: 200 };
		}

		const items: Providers = await getMovies();

		if (items.length === 0) {
			handleEmpty();
		}

		const {
			ok,
			...response
		} = await handleUpdate(items);

		if (!ok) {
			throw response;
		}

		return { statusCode: 200 };
	} catch (error: unknown) {
		handleSentryError(Sentry, error);

		return { statusCode: 500 };
	}
});

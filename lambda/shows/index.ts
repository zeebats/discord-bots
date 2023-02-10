import { Handler, schedule } from '@netlify/functions';

import { getShows } from '@/src/shows';
import { useWebhook } from '@/src/webhook';
import { escapeDST } from '@/utils/dates';
import { handleSentryError, default as Sentry } from '@/utils/sentry';

import type { Providers } from '@/types/shows';

const {
	SENTRY_DSN,
	WEBHOOK_SHOWS,
} = process.env;

Sentry.init({ dsn: SENTRY_DSN });

Sentry.setTag('bot', 'shows');

const handleUpdate = (providers: Providers): Promise<Response> => useWebhook({
	url: WEBHOOK_SHOWS,
	webhook: {
		embeds: providers.map(({
			color,
			provider,
			shows,
			thumbnail,
			url,
		}) => ({
			color,
			fields: shows.map(show => ({
				name: show.title,
				value: `[${show.season} — ${show.episode}](${show.link})`,
			})),
			thumbnail: { url: thumbnail },
			title: `New on ${provider}`,
			url,
		})),
	},
});

const handleEmpty = (): Promise<Response> => useWebhook({
	url: WEBHOOK_SHOWS,
	webhook: { embeds: [{ title: 'No new shows today!' }] },
});

// eslint-disable-next-line max-statements
export const handler: Handler = schedule('0 16-17 * * *', async (): Promise<{ statusCode: number; }> => {
	try {
		if (escapeDST()) {
			return { statusCode: 200 };
		}

		const items: Providers = await getShows();

		if (items.length === 0) {
			handleEmpty();
		}

		const {
			ok, ...response
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

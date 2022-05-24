import { Handler, schedule } from '@netlify/functions';

import { default as Sentry, handleSentryError } from '@utils/sentry';

import { Providers } from '@ts/shows';
import { getShows } from '@src/shows';
import { useWebhook } from '@src/webhook';

const { SENTRY_DSN, WEBHOOK_SHOWS } = process.env;

Sentry.init({
    dsn: SENTRY_DSN,
});

Sentry.setTag('bot', 'shows');

const handleUpdate = (providers: Providers): Promise<Response> => useWebhook({
    url: WEBHOOK_SHOWS,
    webhook: {
        embeds: providers.map(({
            color,
            provider,
            thumbnail,
            shows,
            url,
        }) => ({
            color,
            fields: shows.map(show => ({
                name: show.title,
                value: `[${show.episode} in ${show.season}](${show.link})`,
            })),
            thumbnail: {
                url: thumbnail,
            },
            title: `New on ${provider}`,
            url,
        })),
    },
});

export const handler: Handler = schedule('0 16 * * *', async (): Promise<{ statusCode: number; }> => {
    try {
        const items: Providers = await getShows();

        const { ok, ...response } = await handleUpdate(items);

        if (!ok) {
            throw response;
        }

        return {
            statusCode: 200,
        };
    } catch (error: unknown) {
        handleSentryError(Sentry, error);

        return {
            statusCode: 500,
        };
    }
});

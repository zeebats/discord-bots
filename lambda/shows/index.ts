import * as Sentry from '@sentry/node';

import { Handler, schedule } from '@netlify/functions';

import { Providers } from '@ts/shows';
import { getShows } from '@src/shows';
import { useWebhook } from '@src/webhook';

const { NETLIFY_DEV, SENTRY_DSN, WEBHOOK_SHOWS } = process.env;

Sentry.init({
    dsn: SENTRY_DSN,
});

Sentry.setTag('bot', 'shows');

const handleUpdate = async (providers: Providers): Promise<void> => {
    await useWebhook({
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
};

export const handler: Handler = schedule('0 19 * * *', async (): Promise<{ statusCode: number; }> => {
    try {
        const items: Providers = await getShows();

        await handleUpdate(items);

        return {
            statusCode: 200,
        };
    } catch (error) {
        if (NETLIFY_DEV) {
            // eslint-disable-next-line no-console
            console.error(error);
        } else {
            Sentry.captureException(error);
        }

        return {
            statusCode: 500,
        };
    }
});

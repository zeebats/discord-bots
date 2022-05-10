import * as Sentry from '@sentry/node';

import { Handler, schedule } from '@netlify/functions';

import { Providers } from '@ts/movies';
import { getMovies } from '@src/movies';
import { useWebhook } from '@src/webhook';

const { NETLIFY_DEV, SENTRY_DSN, WEBHOOK_MOVIES } = process.env;

Sentry.init({
    dsn: SENTRY_DSN,
});

Sentry.setTag('bot', 'movies');

const handleUpdate = async (providers: Providers): Promise<void> => {
    await useWebhook({
        url: WEBHOOK_MOVIES,
        webhook: {
            embeds: providers.map(({
                color,
                provider,
                thumbnail,
                movies,
                url,
            }) => ({
                color,
                fields: movies.map(movie => ({
                    name: movie.title,
                    value: `[🔗 Link](${movie.link})`,
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
        const items: Providers = await getMovies();

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

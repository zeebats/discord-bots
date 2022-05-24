import { Handler, schedule } from '@netlify/functions';

import { default as Sentry, handleSentryError } from '@utils/sentry';

import { Providers } from '@ts/movies';
import { getMovies } from '@src/movies';
import { useWebhook } from '@src/webhook';

const { SENTRY_DSN, WEBHOOK_MOVIES } = process.env;

Sentry.init({
    dsn: SENTRY_DSN,
});

Sentry.setTag('bot', 'movies');

const handleUpdate = (providers: Providers): Promise<Response> => useWebhook({
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

export const handler: Handler = schedule('0 16 * * *', async (): Promise<{ statusCode: number; }> => {
    try {
        const items: Providers = await getMovies();

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

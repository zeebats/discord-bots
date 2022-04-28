import { Handler, schedule } from '@netlify/functions';

import { useWebhook } from '@src/webhook';
import { getMovies } from '@src/movies';
import { Providers } from '@ts/movies';

const { WEBHOOK_MOVIES } = process.env;

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
                title: `New on ${provider}`,
                thumbnail: {
                    url: thumbnail,
                },
                url,
                fields: movies.map(movie => ({
                    name: movie.title,
                    value: `[🔗 Link](${movie.link})`,
                })),
            })),
        },

    });
};

export const handler: Handler = schedule('0 16 * * *', async (): Promise<{ statusCode: number; }> => {
    try {
        const items: Providers = await getMovies();

        await handleUpdate(items);

        return {
            statusCode: 200,
        };
    } catch {
        return {
            statusCode: 500,
        };
    }
});

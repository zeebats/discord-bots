import { Handler, schedule } from '@netlify/functions';

import { useWebhook } from '@src/webhook';
import { Movies, getMovies } from '@src/movies';

const { WEBHOOK_MOVIES = '' } = process.env;

const handleUpdate = async (items: Movies): Promise<void> => {
    await useWebhook({
        url: WEBHOOK_MOVIES,
        webhook: {
            embeds: items.map(item => ({
                title: item.title,
                url: item.link,
                description: `[🔗 Trakt.tv](${item.link})`,
                image: {
                    url: item.poster,
                },
            })),
        },
    });
};

export const handler: Handler = schedule('0 18 * * *', async (): Promise<{ statusCode: number; }> => {
    try {
        const items: Movies = await getMovies();

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

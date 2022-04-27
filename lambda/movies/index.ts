import { Handler, schedule } from '@netlify/functions';

import { Movies, getMovies, getWebhook } from '@src/movies';

const handleUpdate = async (items: Movies): Promise<void> => {
    await getWebhook({
        embeds: items.map(item => ({
            title: item.title,
            url: item.link,
            description: `[🔗 Trakt.tv](${item.link})`,
            image: {
                url: item.poster,
            },
        })),
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

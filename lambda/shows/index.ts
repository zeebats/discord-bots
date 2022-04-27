import { Handler, schedule } from '@netlify/functions';

import { Shows, getShows, getWebhook } from '@src/shows';

const handleUpdate = async (items: Shows): Promise<void> => {
    await getWebhook({
        embeds: items.map(item => ({
            title: item.title,
            url: item.link,
            description: `[🔗 Trakt.tv](${item.link})\n\n${item.episode} in ${item.season}`,
            image: {
                url: item.poster,
            },
        })),
    });
};

export const handler: Handler = schedule('0 18 * * *', async (): Promise<{ statusCode: number; }> => {
    try {
        const items: Shows = await getShows();

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

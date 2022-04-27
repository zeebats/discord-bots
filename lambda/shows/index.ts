import { Handler, schedule } from '@netlify/functions';

import { useWebhook } from '@src/webhook';
import { Shows, getShows } from '@src/shows';

const { WEBHOOK_SHOWS = '' } = process.env;

const handleUpdate = async (items: Shows): Promise<void> => {
    await useWebhook({
        url: WEBHOOK_SHOWS,
        webhook: {
            embeds: items.map(item => ({
                title: item.title,
                url: item.link,
                description: `[🔗 Trakt.tv](${item.link})\n\n${item.episode} in ${item.season}`,
                image: {
                    url: item.poster,
                },
            })),
        },
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

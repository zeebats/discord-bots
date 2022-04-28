import { Handler, schedule } from '@netlify/functions';

import { useWebhook } from '@src/webhook';
import { getShows } from '@src/shows';
import { Providers } from '@ts/shows';

const { WEBHOOK_SHOWS } = process.env;

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
                title: `New on ${provider}`,
                thumbnail: {
                    url: thumbnail,
                },
                url,
                fields: shows.map(show => ({
                    name: show.title,
                    value: `[${show.episode} in ${show.season}](${show.link})`,
                })),
            })),
        },
    });
};

export const handler: Handler = schedule('0 16 * * *', async (): Promise<{ statusCode: number; }> => {
    try {
        const items: Providers = await getShows();

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

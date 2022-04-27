import fetch from 'cross-fetch';

import { RESTPostAPIWebhookWithTokenJSONBody } from 'discord-api-types/rest/v10/webhook';

export const useWebhook = async (
    {
        url,
        webhook,
    }: {
        url: string,
        webhook: RESTPostAPIWebhookWithTokenJSONBody
    },
): Promise<void> => {
    const { content = '', embeds } = webhook;

    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content,
            embeds,
        }),
    });
};

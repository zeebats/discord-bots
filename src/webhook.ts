import fetch from 'cross-fetch';

import { RESTPostAPIWebhookWithTokenJSONBody } from 'discord-api-types/rest/v10/webhook';

import { ENV_DEV } from '@utils/netlify';

export const useWebhook = (
    {
        url,
        webhook,
    }: {
        url: string,
        webhook: RESTPostAPIWebhookWithTokenJSONBody
    },
): Promise<Response> => {
    const { content = '', embeds } = webhook;

    return fetch(ENV_DEV ? 'https://discord.com/api/webhooks/968566804601516062/38e5JqBq52HVTqODgIDsEJaZsf8oo8YFDtHmskxbMrv-Y_ceVFkVSQTSQ0V_8nouzn88' : url, {
        body: JSON.stringify({
            content,
            embeds,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
    });
};

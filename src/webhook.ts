import fetch from 'cross-fetch';
import { RESTPostAPIWebhookWithTokenJSONBody } from 'discord-api-types/rest/v10/webhook';

import { ENV_DEV } from '@utils/netlify';

const { WEBHOOK_TEST } = process.env;

export const useWebhook = (
	{
		url,
		webhook,
	}: {
        url: NodeJS.ProcessEnvironment['WEBHOOK_SHOWS'],
        webhook: RESTPostAPIWebhookWithTokenJSONBody
    },
): Promise<Response> => {
	const {
		content = '', embeds,
	} = webhook;

	let fetchURL = url;

	if (ENV_DEV) {
		fetchURL = WEBHOOK_TEST;
	}

	if (!fetchURL) {
		throw new Error('No fetchURL set');
	}

	return fetch(fetchURL, {
		body: JSON.stringify({
			content,
			embeds,
		}),
		headers: { 'Content-Type': 'application/json' },
		method: 'POST',
	});
};

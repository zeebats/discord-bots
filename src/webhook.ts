import type { RESTPostAPIWebhookWithTokenJSONBody } from 'discord-api-types/v10';

import { ENV_DEV } from '../utils/netlify';

const { WEBHOOK_TEST } = process.env;

export const useWebhook = async ({
	url,
	webhook,
}: {
	url: string | undefined;
	webhook: RESTPostAPIWebhookWithTokenJSONBody;
}) => {
	const { content = '', embeds } = webhook;

	let fetchUrl = url;

	if (ENV_DEV) {
		fetchUrl = WEBHOOK_TEST;
	}

	if (fetchUrl === undefined) {
		throw new Error('No fetchURL set');
	}

	return fetch(fetchUrl, {
		body: JSON.stringify({
			content,
			embeds,
		}),
		headers: { 'Content-Type': 'application/json' },
		method: 'POST',
	});
};

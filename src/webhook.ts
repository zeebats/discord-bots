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

	let fetchURL = url;

	if (ENV_DEV) {
		fetchURL = WEBHOOK_TEST;
	}

	if (fetchURL === undefined) {
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

import type { RESTPostAPIWebhookWithTokenJSONBody } from 'discord-api-types/v10';

import { ENV_DEV } from '../utils/netlify';

const { WEBHOOK_TEST } = process.env;

export const useWebhook = async ({
	url,
	webhook,
}: {
	url: string | undefined,
	webhook: RESTPostAPIWebhookWithTokenJSONBody
	// eslint-disable-next-line require-await
}) => {
	const {
		content = '', embeds,
	} = webhook;

	let fetchURL = url;

	if (ENV_DEV) {
		fetchURL = WEBHOOK_TEST;
	}

	// eslint-disable-next-line no-undefined
	if (fetchURL === undefined) {
		throw new Error('No fetchURL set');
	}

	return fetch(fetchURL, {
		body: JSON.stringify({
			content,
			embeds,
		}),
		headers: { 'Content-Type': 'application/json' /* eslint-disable-line @typescript-eslint/naming-convention */ },
		method: 'POST',
	});
};

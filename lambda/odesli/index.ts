/* eslint-disable max-statements */

import { getData } from '@/src/odesli';
import { useWebhook } from '@/src/webhook';
import { produceDecimalColor } from '@/utils/color';
import Sentry, { handleSentryError } from '@/utils/sentry';

import type { Handler, HandlerEvent } from '@netlify/functions';

const {
	SENTRY_DSN,
	WEBHOOK_ODESLI,
} = process.env;

Sentry.init({ dsn: SENTRY_DSN });
Sentry.setTag('bot', 'odesli');

export const handler: Handler = async ({ queryStringParameters }: HandlerEvent) => {
	try {
		if (!queryStringParameters) {
			throw new Error('No URL was given');
		}

		const {
			requester,
			url,
		} = queryStringParameters;

		if (!url) {
			throw new Error('No URL was given');
		}

		const json = await getData(url);

		if (!json) {
			throw new Error('No data was found');
		}

		await useWebhook({
			url: WEBHOOK_ODESLI,
			webhook: {
				embeds: [
					{
						color: produceDecimalColor('#fff'),
						fields: [...json.links],
						thumbnail: { url: json.thumbnail },
						title: `${json.artistName} - ${json.title}`,
						url: json.pageUrl,
						...(json.genres ? { description: `**Genres**\n${json.genres}` } : {}),
						...(requester ? { footer: { text: `Requested by: ${requester}` } } : {}),
					},
				],
			},
		});

		return { statusCode: 200 };
	} catch (error) {
		handleSentryError(Sentry, error);

		return { statusCode: 500 };
	}
};

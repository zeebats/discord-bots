/* eslint-disable max-statements */

import UserAgent from 'user-agents';

import { prepareFormData } from '@/src/insta-meme';
import Sentry, { handleSentryError } from '@/utils/sentry';

import type { Handler, HandlerEvent } from '@netlify/functions';

const {
	SENTRY_DSN,
	WEBHOOK_INSTA_MEME,
} = process.env;

Sentry.init({ dsn: SENTRY_DSN });
Sentry.setTag('bot', 'insta-meme');

export const handler: Handler = async ({ queryStringParameters }: HandlerEvent) => {
	try {
		if (!queryStringParameters) {
			throw new Error('No URL was given');
		}

		const { url } = queryStringParameters;

		if (!url) {
			throw new Error('No URL was given');
		}

		const formData = await prepareFormData(url);
		const userAgent = new UserAgent({ deviceCategory: 'mobile' });

		await fetch(WEBHOOK_INSTA_MEME as string, {
			body: formData,
			headers: { 'User-Agent': userAgent.toString() },
			method: 'POST',
		});

		return { statusCode: 200 };
	} catch (error) {
		handleSentryError(Sentry, error);

		return { statusCode: 500 };
	}
};

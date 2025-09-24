import { Temporal } from '@js-temporal/polyfill';
import type { Config } from '@netlify/functions';
import { init, setTag } from '@sentry/node';
import { createStorage } from 'unstorage';
import netlifyBlobsDriver from 'unstorage/drivers/netlify-blobs';

import { isSummerTime } from '../../utils/dates';
import { handleSentryError } from '../../utils/sentry';
import { handleBefore } from './before';
import { handleFinally } from './finally';
import { handleUpdate } from './update';

export const $blob = createStorage({
	driver: netlifyBlobsDriver({
		name: 'spicey-la-vicey',
	}),
});

const { SENTRY_DSN } = process.env;

const sentryClient = init({ dsn: SENTRY_DSN });
setTag('bot', 'spicey-la-vicey');

export default async () => {
	try {
		const { hour } = Temporal.Now.zonedDateTimeISO('UTC');

		const firstInvocation = isSummerTime() ? 1 : 2;
		const beforeFirstInvocation = hour < firstInvocation;
		const isFirstInvocation = hour === firstInvocation;

		const lastInvocation = isSummerTime() ? 10 : 11;
		const isLastInvocation = hour >= lastInvocation;

		// If function fires before the first allowed invocation, return without doing anything else
		// During winterTime, the function fires at 01:00 UTC / 02:00 Amsterdam but we want it to start at 03:00 minimum
		if (beforeFirstInvocation) {
			return new Response('Success', { status: 200 });
		}

		if (isFirstInvocation) {
			await handleBefore();
		}

		const hasEscape = await handleUpdate(isFirstInvocation, isLastInvocation);

		if (hasEscape && isLastInvocation) {
			await handleFinally();
		}

		return new Response('Success', { status: 200 });
	} catch (error: unknown) {
		handleSentryError(sentryClient, error);

		return new Response('Error', { status: 500 });
	}
};

export const config: Config = { schedule: '0 1-11 * * 1' };

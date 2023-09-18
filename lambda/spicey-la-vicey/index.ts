import { Temporal } from '@js-temporal/polyfill';
import { schedule } from '@netlify/functions';
import * as Sentry from '@sentry/node';

import { handleBefore } from '@/lambda/spicey-la-vicey/before';
import { handleFinally } from '@/lambda/spicey-la-vicey/finally';
import { handleUpdate } from '@/lambda/spicey-la-vicey/update';
import { isSummerTime } from '@/utils/dates';
import { handleSentryError } from '@/utils/sentry';

const { SENTRY_DSN } = process.env;

Sentry.init({ dsn: SENTRY_DSN });

Sentry.setTag('bot', 'spicey-la-vicey');

// eslint-disable-next-line max-statements
export const handler = schedule('0 1-11 * * 1', async () => {
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
			return { statusCode: 200 };
		}

		if (isFirstInvocation) {
			await handleBefore();
		}

		const escape = await handleUpdate(
			isFirstInvocation,
			isLastInvocation,
		);

		if (escape && isLastInvocation) {
			await handleFinally();
		}

		return { statusCode: 200 };
	} catch (error: unknown) {
		handleSentryError(Sentry, error);

		return { statusCode: 500 };
	}
});

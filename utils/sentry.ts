import type * as $sentry from '@sentry/node';

export type SentryClient = typeof $sentry;

const { NETLIFY_DEV = 'false' } = process.env;

export const handleSentryError = (client: SentryClient, error: unknown) => {
	if (NETLIFY_DEV === 'true') {
		console.dir(error);
	} else {
		client.captureException(error);
	}
};

export * as $sentry from '@sentry/node';

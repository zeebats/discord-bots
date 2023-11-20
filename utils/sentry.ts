import type * as $sentry from '@sentry/node';

export type SentryClient = typeof $sentry; // eslint-disable-line @typescript-eslint/no-type-alias

const { NETLIFY_DEV = 'false' } = process.env;

export const handleSentryError = (client: SentryClient, error: unknown) => {
	if (NETLIFY_DEV === 'true') {
		console.dir(error); // eslint-disable-line no-console
	} else {
		client.captureException(error);
	}
};

// eslint-disable-next-line no-duplicate-imports
export * as $sentry from '@sentry/node';

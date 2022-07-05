import * as Sentry from '@sentry/node';

export type SentryClient = typeof Sentry;

const { NETLIFY_DEV } = process.env;

export const handleSentryError = (Sentry: SentryClient, error: unknown): void => {
	if (NETLIFY_DEV) {
		// eslint-disable-next-line no-console
		console.dir(error);
	} else {
		Sentry.captureException(error);
	}
};

export default Sentry;

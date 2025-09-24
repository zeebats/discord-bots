import type { init } from '@sentry/node';

const { NETLIFY_DEV = 'false' } = process.env;

export const handleSentryError = (client: ReturnType<typeof init>, error: unknown) => {
	if (NETLIFY_DEV === 'true') {
		// biome-ignore lint/suspicious/noConsole: For local debug only
		console.dir(error);
	} else {
		client?.captureException(error);
	}
};

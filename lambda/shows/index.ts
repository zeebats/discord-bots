import type { Config } from '@netlify/functions';
import { init, setTag } from '@sentry/node';

import type { Providers } from '../../types/shows';

import { getShows } from '../../src/shows';
import { useWebhook } from '../../src/webhook';
import { escapeSummerTime } from '../../utils/dates';
import { handleSentryError } from '../../utils/sentry';

const { SENTRY_DSN, WEBHOOK_SHOWS } = process.env;

const sentryClient = init({ dsn: SENTRY_DSN });
setTag('bot', 'shows');

const handleUpdate = async (providers: Providers) =>
	useWebhook({
		url: WEBHOOK_SHOWS,
		webhook: {
			embeds: providers.map(({ color, provider, shows, thumbnail, url }) => ({
				color,
				fields: shows.map(show => ({
					name: show.title,
					value: `[${show.season} — ${show.episode}](${show.link})`,
				})),
				thumbnail: { url: thumbnail },
				title: `New on ${provider}`,
				url,
			})),
		},
	});

const handleEmpty = async () =>
	useWebhook({
		url: WEBHOOK_SHOWS,
		webhook: { embeds: [{ title: 'No new shows today!' }] },
	});

export default async () => {
	try {
		if (escapeSummerTime()) {
			return new Response('Success', { status: 200 });
		}

		const items = await getShows();

		if (items.length === 0) {
			await handleEmpty();

			return new Response('Success', { status: 200 });
		}

		const response = await handleUpdate(items);

		if (!response.ok) {
			throw new Error(JSON.stringify(response));
		}

		return new Response('Success', { status: 200 });
	} catch (error: unknown) {
		handleSentryError(sentryClient, error);

		return new Response('Error', { status: 500 });
	}
};

export const config: Config = { schedule: '0 16-17 * * *' };

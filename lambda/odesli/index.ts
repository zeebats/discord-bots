import { getData } from '@/src/odesli';
import { useWebhook } from '@/src/webhook';
import { produceDecimalColor } from '@/utils/color';
import { $sentry, handleSentryError } from '@/utils/sentry';

const { SENTRY_DSN, WEBHOOK_ODESLI } = process.env;

$sentry.init({ dsn: SENTRY_DSN });
$sentry.setTag('bot', 'odesli');

export default async (request: Request) => {
	try {
		const parameters = new URL(request.url).searchParams;

		const url = parameters.get('url');
		const requester = parameters.get('requester');

		if (url === null) {
			throw new Error('No URL was given');
		}

		const json = await getData(url);

		if (json === null) {
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
						...(json.genres === null ? {} : { description: `**Genres**\n${json.genres}` }),
						...(requester === null ? {} : { footer: { text: `Requested by: ${requester}` } }),
					},
				],
			},
		});
	} catch (error) {
		handleSentryError($sentry, error);
	}
};

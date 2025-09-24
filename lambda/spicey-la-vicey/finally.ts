import { useWebhook } from '../../src/webhook';
import { produceDecimalColor } from '../../utils/color';
import { $blob } from './index';

const { WEBHOOK_SPICEY_LA_VICEY } = process.env;

export const handleFinally = async () => {
	await $blob.setItem('show:updated', true);
	await $blob.setItem('mix:updated', true);

	await useWebhook({
		url: WEBHOOK_SPICEY_LA_VICEY,
		webhook: {
			embeds: [
				{
					color: produceDecimalColor('#4B712B'),
					description:
						'🥦🥦🥦\n\nFinished checking for both new show & mix content. However, nothing new found this week, meh!',
					title: "Radio 1's Drum & Bass",
				},
			],
		},
	});
};

import { useWebhook } from '../../src/webhook';
import { produceDecimalColor } from '../../utils/color';
import { $blob } from './index';

const { WEBHOOK_SPICEY_LA_VICEY } = process.env;

// eslint-disable-next-line max-lines-per-function
export const handleBefore = async () => {
	await $blob.setItem('show:updated', false);
	await $blob.setItem('mix:updated', false);

	await useWebhook({
		url: WEBHOOK_SPICEY_LA_VICEY,
		webhook: {
			embeds: [
				{
					color: produceDecimalColor('#C9404C'),
					description: '🌶🌶🌶\n\nThe hottest D&B, exclusives and big guests.',
					fields: [
						{
							name: '🗄',
							value: '**[All available shows](https://www.bbc.co.uk/programmes/b09c12lj/episodes/player)**',
						},
						{
							name: '🗄',
							value: '**[All available mixes](https://www.bbc.co.uk/programmes/m0003l3c/episodes/player)**',
						},
					],
					thumbnail: { url: 'https://emojis.slackmojis.com/emojis/images/1643509700/43992/hyper-drum-time.gif?1643509700' },
					title: 'Radio 1\'s Drum & Bass',
				},
			],
		},
	});
};

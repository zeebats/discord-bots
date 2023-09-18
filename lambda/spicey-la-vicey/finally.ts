import { $supabase } from '@/lambda/spicey-la-vicey/supabase';
import { useWebhook } from '@/src/webhook';
import { produceDecimalColor } from '@/utils/color';

const { WEBHOOK_SPICEY_LA_VICEY } = process.env;

export const handleFinally = async () => {
	await $supabase
		.from('spicey-la-vicey')
		.update({ updatedThisWeek: true })
		.eq('id', 1);

	await $supabase
		.from('spicey-la-vicey')
		.update({ updatedThisWeek: true })
		.eq('id', 2);

	useWebhook({
		url: WEBHOOK_SPICEY_LA_VICEY,
		webhook: {
			embeds: [
				{
					color: produceDecimalColor('#4B712B'),
					description: '🥦🥦🥦\n\nFinished checking for both new show & mix content. However, nothing new found this week, meh!',
					title: 'Radio 1\'s Drum & Bass',
				},
			],
		},
	});
};

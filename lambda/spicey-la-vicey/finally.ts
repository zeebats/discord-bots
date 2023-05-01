import { $supabase } from '@/lambda/spicey-la-vicey/supabase';
import { useWebhook } from '@/src/webhook';

const { WEBHOOK_SPICEY_LA_VICEY } = process.env;

export const handleFinally = async () => {
	await $supabase
		.from('spicey-la-vicey')
		.update({ update: false })
		.eq('id', 1);

	await $supabase
		.from('spicey-la-vicey')
		.update({ update: false })
		.eq('id', 2);

	useWebhook({
		url: WEBHOOK_SPICEY_LA_VICEY,
		webhook: {
			embeds: [
				{
					color: 4_944_171,
					description: '🥦🥦🥦\n\nFinished checking new content. Nothing new found, meh!',
					title: 'Radio 1\'s Drum & Bass',
				},
			],
		},
	});
};

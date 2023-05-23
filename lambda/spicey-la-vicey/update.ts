import { format, fromUnixTime } from 'date-fns';

import { $supabase } from '@/lambda/spicey-la-vicey/supabase';
import { getNewestContent } from '@/src/spicey-la-vicey';
import { useWebhook } from '@/src/webhook';
import { produceDecimalColor } from '@/utils/color';

const { WEBHOOK_SPICEY_LA_VICEY } = process.env;

// eslint-disable-next-line max-lines-per-function, max-statements, complexity
export const handleUpdate = async (lastInvocation: boolean) => {
	const newContent = await getNewestContent();

	const { data } = await $supabase
		.from('spicey-la-vicey')
		.select()
		.limit(2);

	if (!data || data.length < 2) {
		throw new Error('[handleBefore] Data is incorrect, please check');
	}

	const [
		show,
		mix,
	] = data;

	const updateShow = show.timestamp && show.timestamp < newContent.show.timestamp && show.title !== newContent.show.title;
	const updateMix = mix.timestamp && mix.timestamp < newContent.mix.timestamp && mix.title !== newContent.mix.title;

	// If both show and mix have already been updated, return false to avoid handleFinally
	if (!updateShow && !updateMix) {
		return false;
	}

	// If we're at the last time the function checks each week
	// and we haven't found a new show AND a new mix, escape true to enter handleFinally
	if (lastInvocation && updateShow && updateMix) {
		return true;
	}

	if (updateShow) {
		await $supabase
			.from('spicey-la-vicey')
			.update({
				timestamp: newContent.show.timestamp,
				title: newContent.show.title,
				update: false,
			})
			.eq('id', 1);
	}

	if (updateMix) {
		await $supabase
			.from('spicey-la-vicey')
			.update({
				timestamp: newContent.mix.timestamp,
				title: newContent.mix.title,
				update: false,
			})
			.eq('id', 2);
	}

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
				...(updateShow ? [
					{
						color: produceDecimalColor('#C9404C'),
						description: newContent.show.description,
						fields: [
							{
								name: '▶️',
								value: `**[Listen now](${newContent.show.link})**`,
							},
						],
						footer: { text: `Posted on: ${format(fromUnixTime(newContent.show.timestamp), 'dd MMMM')}` },
						title: `Show: ${newContent.show.title}`,
						url: newContent.show.link,
					},
				] : [
					{
						color: produceDecimalColor('#4B712B'),
						description: '🥦\n\nFinished checking for new show content. Nothing new found, meh!',
						title: 'Show: No new content found',
					},
				]),
				...(updateMix ? [
					{
						color: produceDecimalColor('#C9404C'),
						description: newContent.mix.description,
						fields: [
							{
								name: '▶️',
								value: `**[Listen now](${newContent.mix.link})**`,
							},
						],
						footer: { text: `Posted on: ${format(fromUnixTime(newContent.mix.timestamp), 'dd MMMM')}` },
						title: `Mix: ${newContent.mix.title}`,
						url: newContent.mix.link,
					},
				] : [
					{
						color: produceDecimalColor('#4B712B'),
						description: '🥦\n\nFinished checking for new mix content. Nothing new found, meh!',
						title: 'Mix: No new content found',
					},
				]),
			],
		},
	});

	// Escape false after shooting a webhook to avoid handleFinally webhook
	return false;
};

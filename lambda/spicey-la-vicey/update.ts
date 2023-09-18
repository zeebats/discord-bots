import { format, fromUnixTime } from 'date-fns';

import { $supabase } from '@/lambda/spicey-la-vicey/supabase';
import { getNewestContent } from '@/src/spicey-la-vicey';
import { useWebhook } from '@/src/webhook';
import { produceDecimalColor } from '@/utils/color';

const { WEBHOOK_SPICEY_LA_VICEY } = process.env;

// eslint-disable-next-line max-lines-per-function, max-statements, complexity
export const handleUpdate = async (firstInvocation: boolean, lastInvocation: boolean) => {
	const newContent = await getNewestContent();

	const { data } = await $supabase
		.from('spicey-la-vicey')
		.select()
		.order('id', { ascending: true });

	if (!data || data.length < 2) {
		throw new Error('[handleBefore] Data is incorrect, please check');
	}

	const [
		show,
		mix,
	] = data;

	const sameShowAsLastWeek = show.timestamp && show.timestamp === newContent.show.timestamp && show.title === newContent.show.title;
	const sameMixAsLastWeek = mix.timestamp && mix.timestamp === newContent.mix.timestamp && mix.title === newContent.mix.title;

	// If we're at the last time the function checks each week
	// and we haven't found a new show AND a new mix, escape true to enter handleFinally
	if (lastInvocation && sameShowAsLastWeek && !show.updatedThisWeek && sameMixAsLastWeek && !mix.updatedThisWeek) {
		return true;
	}

	// If both show and mix have already been updated, return false to avoid handleFinally
	if (show.updatedThisWeek && mix.updatedThisWeek) {
		return false;
	}

	const showEmbeds = [];
	const mixEmbeds = [];

	if (!sameShowAsLastWeek && !show.updatedThisWeek) {
		await $supabase
			.from('spicey-la-vicey')
			.update({
				timestamp: newContent.show.timestamp,
				title: newContent.show.title,
				updatedThisWeek: true,
			})
			.eq('id', 1);

		showEmbeds.push({
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
		});
	}

	if (firstInvocation && sameShowAsLastWeek && !show.updatedThisWeek) {
		showEmbeds.push({
			color: produceDecimalColor('#8b8b8b'),
			description: '🔬 We\'ll check up until 12:00 for a new Show... stay tuned 🤞',
			title: 'Show: No new content found... yet!?',
		});
	}

	if (lastInvocation && sameShowAsLastWeek && !show.updatedThisWeek) {
		await $supabase
			.from('spicey-la-vicey')
			.update({ updatedThisWeek: true })
			.eq('id', 1);

		showEmbeds.push({
			color: produceDecimalColor('#4B712B'),
			description: '🥦 We\'ve finished checking for a Show update. Sadly, no new episode was found, meh!',
			title: 'Show: No new content found',
		});
	}

	if (!sameMixAsLastWeek && !mix.updatedThisWeek) {
		await $supabase
			.from('spicey-la-vicey')
			.update({
				timestamp: newContent.mix.timestamp,
				title: newContent.mix.title,
				updatedThisWeek: true,
			})
			.eq('id', 2);

		mixEmbeds.push({
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
		});
	}

	if (firstInvocation && sameMixAsLastWeek && !mix.updatedThisWeek) {
		mixEmbeds.push({
			color: produceDecimalColor('#8b8b8b'),
			description: '🔬 We\'ll check up until 12:00 for a new Mix... stay tuned 🤞',
			title: 'Mix: No new content found... yet!?',
		});
	}

	if (lastInvocation && sameMixAsLastWeek && !mix.updatedThisWeek) {
		await $supabase
			.from('spicey-la-vicey')
			.update({ updatedThisWeek: true })
			.eq('id', 2);

		mixEmbeds.push({
			color: produceDecimalColor('#4B712B'),
			description: '🥦 We\'ve finished checking for a Mix update. Sadly, no new episode was found, meh!',
			title: 'Mix: No new content found',
		});
	}

	if (showEmbeds.length === 0 && mixEmbeds.length === 0) {
		return false;
	}

	await Promise.allSettled(showEmbeds.map(async embed => {
		await useWebhook({
			url: WEBHOOK_SPICEY_LA_VICEY,
			webhook: { embeds: [embed] },
		});
	}));

	await Promise.allSettled(mixEmbeds.map(async embed => {
		await useWebhook({
			url: WEBHOOK_SPICEY_LA_VICEY,
			webhook: { embeds: [embed] },
		});
	}));

	// Escape false after shooting a webhook to avoid handleFinally webhook
	return false;
};

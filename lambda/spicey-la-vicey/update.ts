import { format, fromUnixTime } from 'date-fns';

import { getNewestContent } from '../../src/spicey-la-vicey';
import { useWebhook } from '../../src/webhook';
import { produceDecimalColor } from '../../utils/color';
import { $blob } from './index';

const { WEBHOOK_SPICEY_LA_VICEY } = process.env;

// eslint-disable-next-line max-lines-per-function, max-statements, complexity
export const handleUpdate = async (firstInvocation: boolean, lastInvocation: boolean) => {
	const newContent = await getNewestContent();

	const showTimestamp = await $blob.getItem<number>('show:timestamp') ?? 0;
	const showTitle = await $blob.getItem<string>('show:title') ?? '';
	const showUpdated = await $blob.getItem<boolean>('show:updated') ?? true;

	const mixTimestamp = await $blob.getItem<number>('mix:timestamp') ?? 0;
	const mixTitle = await $blob.getItem<string>('mix:title') ?? '';
	const mixUpdated = await $blob.getItem<boolean>('mix:updated') ?? true;

	const sameShowAsLastWeek = showTimestamp === newContent.show.timestamp && showTitle === newContent.show.title;
	const sameMixAsLastWeek = mixTimestamp === newContent.mix.timestamp && mixTitle === newContent.mix.title;

	// If we're at the last time the function checks each week
	// and we haven't found a new show AND a new mix, escape true to enter handleFinally
	if (lastInvocation && sameShowAsLastWeek && !showUpdated && sameMixAsLastWeek && !mixUpdated) {
		return true;
	}

	// If both show and mix have already been updated, return false to avoid handleFinally
	if (showUpdated && mixUpdated) {
		return false;
	}

	const showEmbeds = [];
	const mixEmbeds = [];

	if (!sameShowAsLastWeek && !showUpdated) {
		await $blob.setItem('show:timestamp', newContent.show.timestamp);
		await $blob.setItem('show:title', newContent.show.title);
		await $blob.setItem('show:updated', true);

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

	if (firstInvocation && sameShowAsLastWeek && !showUpdated) {
		showEmbeds.push({
			color: produceDecimalColor('#8b8b8b'),
			description: '🔬 We\'ll check up until 12:00 for a new Show... stay tuned 🤞',
			title: 'Show: No new content found... yet!?',
		});
	}

	if (lastInvocation && sameShowAsLastWeek && !showUpdated) {
		await $blob.setItem('show:updated', true);

		showEmbeds.push({
			color: produceDecimalColor('#4B712B'),
			description: '🥦 We\'ve finished checking for a Show update. Sadly, no new episode was found, meh!',
			title: 'Show: No new content found',
		});
	}

	if (!sameMixAsLastWeek && !mixUpdated) {
		await $blob.setItem('mix:timestamp', newContent.mix.timestamp);
		await $blob.setItem('mix:title', newContent.mix.title);
		await $blob.setItem('mix:updated', true);

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

	if (firstInvocation && sameMixAsLastWeek && !mixUpdated) {
		mixEmbeds.push({
			color: produceDecimalColor('#8b8b8b'),
			description: '🔬 We\'ll check up until 12:00 for a new Mix... stay tuned 🤞',
			title: 'Mix: No new content found... yet!?',
		});
	}

	if (lastInvocation && sameMixAsLastWeek && !mixUpdated) {
		await $blob.setItem('mix:updated', true);

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

import { type Handler, schedule } from '@netlify/functions';
import * as Sentry from '@sentry/node';
import { createClient } from '@supabase/supabase-js';
import { format, fromUnixTime, getHours } from 'date-fns';

import { getNewestContent } from '@/src/spicey-la-vicey';
import { useWebhook } from '@/src/webhook';
import { handleSentryError } from '@/utils/sentry';

import type { Database } from '@/types/supabase';

const {
	SENTRY_DSN,
	SUPABASE_API_KEY = '',
	SUPABASE_URL = '',
	WEBHOOK_SPICEY_LA_VICEY,
} = process.env;

Sentry.init({ dsn: SENTRY_DSN });

Sentry.setTag('bot', 'spicey-la-vicey');

const $supabase = createClient<Database>(SUPABASE_URL, SUPABASE_API_KEY);

const handleBefore = async () => {
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

	if (!show.update) {
		$supabase
			.from('spicey-la-vicey')
			.update({ update: true })
			.eq('id', 1);
	}

	if (!mix.update) {
		$supabase
			.from('spicey-la-vicey')
			.update({ update: true })
			.eq('id', 2);
	}
};

// eslint-disable-next-line max-lines-per-function, max-statements, complexity
const handleUpdate = async (lastCheck: boolean) => {
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

	// If we're at the twelfth hour (the last time the function checks each week)
	// and we've not found a new show or a new mix, escape true to enter handleFinally
	if (lastCheck && !updateShow && !updateMix) {
		return true;
	}

	// If we're not at the twelfth hour and both show or mix aren't new, escape false to avoid handleFinally
	if (!lastCheck && !(updateShow && updateMix)) {
		return false;
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
					color: 13_189_196,
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
						color: 13_189_196,
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
						color: 4_944_171,
						description: '🥦\n\nFinished checking for new show content. Nothing new found, meh!',
						title: 'Show: No new content found',
					},
				]),
				...(updateMix ? [
					{
						color: 13_189_196,
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
						color: 4_944_171,
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

const handleFinally = async () => {
	await $supabase
		.from('spicey-la-vicey')
		.update({ update: false })
		.eq('id', 1);

	await $supabase
		.from('spicey-la-vicey')
		.update({ update: false })
		.eq('id', 2);

	return useWebhook({
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

// eslint-disable-next-line max-statements, complexity
export const handler: Handler = schedule('0 0-12 * * 1', async () => {
	try {
		const currentHour = getHours(Date.now());

		if (currentHour === 0) {
			await handleBefore();
		}

		const escape = await handleUpdate(currentHour === 12);

		if (escape && currentHour === 12) {
			await handleFinally();
		}

		return { statusCode: 200 };
	} catch (error: unknown) {
		handleSentryError(Sentry, error);

		return { statusCode: 500 };
	}
});

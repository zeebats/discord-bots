import { getUnixTime, startOfDay } from 'date-fns';
import { parse } from 'node-html-parser';
import phin from 'phin';
import { get } from 'wild-wild-path';
import { z } from 'zod';

/* eslint-disable @typescript-eslint/naming-convention */
const schema = z.object({
	id: z.string(),
	release: z.object({ date: z.string().datetime() }),
	synopses: z.object({
		long: z.string().nullish(),
		medium: z.string().nullish(),
		short: z.string(),
	}),
	titles: z.object({ entity_title: z.string() }),
});
/* eslint-enable @typescript-eslint/naming-convention */

export const formatResponse = (response: string) => {
	const json = parse(response).querySelector('#__NEXT_DATA__')?.innerHTML ?? '';
	const target = JSON.parse(json) as unknown as { [key: string]: unknown };

	const {
		data,
		error,
	} = schema.safeParse(get(target, '**.state.data.data.1.data.0'));

	if (error !== undefined /* eslint-disable-line no-undefined */) {
		return {
			description: 'Something went wrong with scraping the page',
			link: undefined /* eslint-disable-line no-undefined */,
			timestamp: getUnixTime(startOfDay(Date.now())),
			title: 'Error',
		} as const;
	}

	return {
		description: data.synopses.long ?? data.synopses.medium ?? data.synopses.short,
		link: `https://www.bbc.co.uk/sounds/play/${data.id}`,
		timestamp: getUnixTime(startOfDay(data.release.date)),
		title: data.titles.entity_title,
	} as const;
};

export const getShow = async () => {
	const { body: response } = await phin({
		parse: 'string',
		url: 'https://www.bbc.co.uk/sounds/brand/b09c12lj',
	});

	return formatResponse(response);
};

export const getMix = async () => {
	const { body: response } = await phin({
		parse: 'string',
		url: 'https://www.bbc.co.uk/sounds/brand/m0003l3c',
	});

	return formatResponse(response);
};

export const getNewestContent = async () => ({
	mix: await getMix(),
	show: await getShow(),
});

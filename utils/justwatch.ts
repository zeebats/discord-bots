import { HTMLElement, parse } from 'node-html-parser';

import { selectedProviders } from '@/enums/providers';

import { produceDecimalColor } from './color';

export interface JustWatchResponse {
	response: string;
	url: string;
}

export interface TodayResponse {
	element: HTMLElement;
	url: string;
}

export const getTitle = (item: HTMLElement | null) => {
	const element = item?.querySelector('.picture-comp__img')?.getAttribute('alt') || item?.querySelector('.title-poster--no-poster')?.innerText;

	return element?.replace(/\s*-\s*season \d*/i, '') || '';
};

export const getThumbnail = (item: HTMLElement | null) => {
	const source = item?.querySelector('source[type=image/jpeg]');

	const attribute = source?.getAttribute('srcset') || source?.getAttribute('data-srcset') || '';

	return attribute?.replace(/.*?, (.*?)/, '$1');
};

export const getLink = (element: HTMLElement | null) => {
	const link = element?.querySelector('a')?.getAttribute('href') || '';

	return `https://www.justwatch.com${link}`;
};

export const getToday = (responses: JustWatchResponse[]) => {
	const parsed = responses.map(({
		response,
		url,
	}) => {
		const body = parse(response);

		const firstChild = body.querySelector('.timeline__timeframe:first-child');

		const header = firstChild?.querySelector('.timeline__header');

		if (header?.innerText !== 'Today') {
			return {
				element: parse(''),
				url,
			};
		}

		return {
			element: firstChild?.querySelector('.timeline__provider-block') || parse(''),
			url,
		};
	});

	const filtered = parsed.filter(({ element }) => element.textContent.trim() !== '');

	return filtered;
};

export const getShortcode = (element: HTMLElement | null) => {
	const classes = element?.getAttribute('class');

	return classes?.replace(/.*?--\d{4}-\d{2}-\d{2}--(.*?)/, '$1') || '';
};

export const getColor = (element: HTMLElement | null) => {
	const provider = getShortcode(element);

	return selectedProviders[provider]?.color || produceDecimalColor('#EFEFEF');
};

export const getProviderName = (element: HTMLElement | null) => {
	const provider = getShortcode(element);

	const [
		, selected,
	] = Object.entries(selectedProviders).find(([key]) => key === provider) || [];

	return selected?.name || '';
};

export const getProviderLink = (providerSlug: string, type: string) => `https://www.justwatch.com/us/provider/${providerSlug}/new/${type}`;

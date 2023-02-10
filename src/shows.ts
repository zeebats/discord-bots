import fetch from 'cross-fetch';

import { selectedProviders } from '@/enums/providers';
import {
	getColor,
	getProviderLink,
	getProviderName,
	getToday,
	JustWatchResponse,
} from '@/utils/justwatch';
import { getShowItems } from '@/utils/shows';

import type { Provider, Providers } from '@/types/shows';

export const formatShows = (responses: JustWatchResponse[]): Providers => {
	const today = getToday(responses);

	return today.map(({
		element,
		url,
	}) : Omit<Provider, 'thumbnail'> => ({
		color: getColor(element),
		provider: getProviderName(element),
		shows: getShowItems(element),
		url,
	})).map(({
		shows,
		...properties
	}) : Provider => ({
		...properties,
		shows,
		thumbnail: shows[0].thumbnail,
	})) || [];
};

export const getShows = async (): Promise<Providers> => {
	const collected = await Promise.all(
		Object.values(selectedProviders).map(async ({ slug }): Promise<JustWatchResponse> => {
			const url = getProviderLink(slug, 'tv-shows');

			const request = await fetch(url);
			const response = await request.text();

			return {
				response,
				url,
			};
		}),
	);

	return formatShows(collected);
};

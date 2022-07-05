import fetch from 'cross-fetch';

import { selectedProviders } from '@enums/providers';
import { Provider, Providers } from '@ts/shows';
import {
	getColor,
	getProviderLink,
	getProviderName,
	getThumbnail,
	getToday,
	JustWatchResponse,
} from '@utils/justwatch';
import { getShowItems } from '@utils/shows';

export const formatShows = (responses: JustWatchResponse[]): Providers => {
	const today = getToday(responses);

	return today.map(({
		element,
		url,
	}) : Provider => ({
		color: getColor(element),
		provider: getProviderName(element),
		shows: getShowItems(element),
		thumbnail: getThumbnail(element),
		url,
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

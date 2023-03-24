import phin from 'phin';

import { selectedProviders } from '@/enums/providers';
import {
	getColor,
	getProviderLink,
	getProviderName,
	getToday,
	type JustWatchResponse,
} from '@/utils/justwatch';
import { getShowItems } from '@/utils/shows';

import type { Provider } from '@/types/shows';

export const formatShows = (responses: JustWatchResponse[]) => {
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

export const getShows = async () => {
	const collected = await Promise.all(
		Object.values(selectedProviders).map(async ({ slug }) => {
			const url = getProviderLink(slug, 'tv-shows');

			const request = await phin({
				parse: 'string',
				url,
			});

			const response = request.body;

			return {
				response,
				url,
			};
		}),
	);

	return formatShows(collected);
};

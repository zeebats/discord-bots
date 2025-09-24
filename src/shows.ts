import { selectedProviders } from '../enums/providers';
import type { Provider } from '../types/shows';
import { getColor, getProviderLink, getProviderName, getToday, type JustWatchResponse } from '../utils/justwatch';
import { getShowItems } from '../utils/shows';

export const formatShows = (responses: JustWatchResponse[]) =>
	getToday(responses)
		.map(
			({ element, url }): Omit<Provider, 'thumbnail'> => ({
				color: getColor(element),
				provider: getProviderName(element),
				shows: getShowItems(element),
				url,
			}),
		)
		.map(
			({ shows, ...properties }): Provider => ({
				...properties,
				shows,
				thumbnail: shows[0].thumbnail,
			}),
		);

export const getShows = async () => {
	const requested = await Promise.allSettled(
		Object.values(selectedProviders).map(async ({ slug }) => {
			const url = getProviderLink(slug, 'tv-shows');

			const request = await fetch(url);
			const response = await request.text();

			return {
				response,
				url,
			};
		}),
	);
	const fulfilled = requested.filter(
		(request): request is PromiseFulfilledResult<{ response: string; url: string }> => request.status === 'fulfilled',
	);

	const formatted = formatShows(fulfilled.map(({ value }) => value));

	return formatted;
};

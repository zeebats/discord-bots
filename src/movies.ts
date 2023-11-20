import type { Provider } from '../types/movies';

import { selectedProviders } from '../enums/providers';
import {
	type JustWatchResponse,
	getColor,
	getProviderLink,
	getProviderName,
	getToday,
} from '../utils/justwatch';
import { getMovieItems } from '../utils/movies';

export const formatMovies = (responses: JustWatchResponse[]) => getToday(responses).map(({
	element,
	url,
}) : Omit<Provider, 'thumbnail'> => ({
	color: getColor(element),
	movies: getMovieItems(element),
	provider: getProviderName(element),
	url,
}))
	.map(({
		movies,
		...properties
	}) : Provider => ({
		...properties,
		movies,
		thumbnail: movies[0].thumbnail,
	}));

export const getMovies = async () => {
	const requested = await Promise.allSettled(
		Object.values(selectedProviders).map(async ({ slug }) => {
			const url = getProviderLink(slug, 'movies');

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

	return formatMovies(fulfilled.map(({ value }) => value));
};

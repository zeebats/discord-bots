import phin from 'phin';

import { selectedProviders } from '@/enums/providers';
import {
	getColor,
	getProviderLink,
	getProviderName,
	getToday,
	type JustWatchResponse,
} from '@/utils/justwatch';
import { getMovieItems } from '@/utils/movies';

import type { Provider } from '@/types/movies';

export const formatMovies = (responses: JustWatchResponse[]) => {
	const today = getToday(responses);

	return today.map(({
		element,
		url,
	}) : Omit<Provider, 'thumbnail'> => ({
		color: getColor(element),
		movies: getMovieItems(element),
		provider: getProviderName(element),
		url,
	})).map(({
		movies,
		...properties
	}) : Provider => ({
		...properties,
		movies,
		thumbnail: movies[0].thumbnail,
	})) || [];
};

export const getMovies = async () => {
	const collected = await Promise.all(
		Object.values(selectedProviders).map(async ({ slug }) => {
			const url = getProviderLink(slug, 'movies');

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

	return formatMovies(collected);
};

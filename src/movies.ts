import fetch from 'cross-fetch';

import { selectedProviders } from '@enums/providers';
import { Provider, Providers } from '@ts/movies';
import {
	getColor,
	getProviderLink,
	getProviderName,
	getThumbnail,
	getToday,
	JustWatchResponse,
} from '@utils/justwatch';
import { getMovieItems } from '@utils/movies';

export const formatMovies = (responses: JustWatchResponse[]): Providers => {
	const today = getToday(responses);

	return today.map(({
		element,
		url,
	}) : Provider => ({
		color: getColor(element),
		movies: getMovieItems(element),
		provider: getProviderName(element),
		thumbnail: getThumbnail(element),
		url,
	})) || [];
};

export const getMovies = async (): Promise<Providers> => {
	const collected = await Promise.all(
		Object.values(selectedProviders).map(async ({ slug }): Promise<JustWatchResponse> => {
			const url = getProviderLink(slug, 'movies');

			const request = await fetch(url);
			const response = await request.text();

			return {
				response,
				url,
			};
		}),
	);

	return formatMovies(collected);
};

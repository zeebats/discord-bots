import fetch from 'cross-fetch';

import {
    getToday,
    getProviders,
    getProviderColor,
    getProvider,
    getThumbnail,
} from '@utils/justwatch';

import { selectedProviders } from '@enums/providers';
import { getMovieItems, getProviderLink } from '@utils/movies';
import { Providers } from '@ts/movies';

export const formatMovies = (response: string): Providers => {
    const today = getToday(response);

    const providers = getProviders(today);

    return providers.map(provider => ({
        color: getProviderColor(provider),
        provider: getProvider(provider),
        movies: getMovieItems(provider),
        thumbnail: getThumbnail(provider),
        url: getProviderLink(provider),
    })) || [];
};

export const getMovies = async (): Promise<Providers> => {
    const request = await fetch(`https://www.justwatch.com/us/movies/new?providers=${Object.keys(selectedProviders).join(',')}`);
    const response = await request.text();

    return formatMovies(response);
};

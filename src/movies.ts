import fetch from 'cross-fetch';

import {
    getToday,
    getProviders,
    getProviderColor,
    getProvider,
    getThumbnail,
    getProviderLink,
} from '@utils/justwatch';

import { getMovieItems } from '@utils/movies';

import { Providers } from '@ts/movies';

// import { ENV_DEV } from '@utils/netlify';

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
    const request = await fetch('https://www.justwatch.com/nl/movies/new?providers=atp,dnp,nfx');
    const response = await request.text();

    return formatMovies(response);
};

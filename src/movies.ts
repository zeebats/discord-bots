import fetch from 'cross-fetch';

import {
    getColor,
    getProvider,
    getProviders,
    getThumbnail,
    getToday,
} from '@utils/justwatch';

import { getMovieItems, getProviderLink } from '@utils/movies';
import { Providers } from '@ts/movies';
import { selectedProviders } from '@enums/providers';

export const formatMovies = (response: string): Providers => {
    const today = getToday(response);

    const providers = getProviders(today);

    return providers.map(provider => ({
        color: getColor(provider),
        movies: getMovieItems(provider),
        provider: getProvider(provider),
        thumbnail: getThumbnail(provider),
        url: getProviderLink(provider),
    })) || [];
};

export const getMovies = async (): Promise<Providers> => {
    // https://www.justwatch.com/us/movies/new?providers=amp,atp,dnp,hbm,hlu,nfx
    const request = await fetch(`https://www.justwatch.com/us/movies/new?providers=${Object.keys(selectedProviders).join(',')}`);
    const response = await request.text();

    return formatMovies(response);
};

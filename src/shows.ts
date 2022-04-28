import fetch from 'cross-fetch';

import {
    getToday,
    getProviders,
    getProviderColor,
    getProvider,
    getThumbnail,
    getProviderLink,
} from '@utils/justwatch';

import { getShowItems } from '@utils/shows';

import { Providers } from '@ts/shows';

// import { ENV_DEV } from '@utils/netlify';

export const formatShows = (response: string): Providers => {
    const today = getToday(response);

    const providers = getProviders(today);

    return providers.map(provider => ({
        color: getProviderColor(provider),
        provider: getProvider(provider),
        shows: getShowItems(provider),
        thumbnail: getThumbnail(provider),
        url: getProviderLink(provider),
    })) || [];
};

export const getShows = async (): Promise<Providers> => {
    const request = await fetch('https://www.justwatch.com/nl/tv-series/new?providers=atp,dnp,nfx');
    const response = await request.text();

    return formatShows(response);
};

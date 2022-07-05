import fetch from 'cross-fetch';

import { selectedProviders } from '@enums/providers';
import { Providers } from '@ts/shows';
import {
	getColor,
	getProvider,
	getProviders,
	getThumbnail,
	getToday,
} from '@utils/justwatch';
import { getProviderLink, getShowItems } from '@utils/shows';

export const formatShows = (response: string): Providers => {
	const today = getToday(response);

	const providers = getProviders(today);

	return providers.map(provider => ({
		color: getColor(provider),
		provider: getProvider(provider),
		shows: getShowItems(provider),
		thumbnail: getThumbnail(provider),
		url: getProviderLink(provider),
	})) || [];
};

export const getShows = async (): Promise<Providers> => {
	// https://www.justwatch.com/us/tv-shows/new?providers=amp,atp,dnp,hbm,hlu,nfx
	const request = await fetch(`https://www.justwatch.com/us/tv-shows/new?providers=${Object.keys(selectedProviders).join(',')}`);
	const response = await request.text();

	return formatShows(response);
};

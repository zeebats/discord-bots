import { HTMLElement } from 'node-html-parser';

import { Shows } from '@ts/shows';
import { getLink, getThumbnail, getTitle } from '@utils/justwatch';

export const getSeason = (item: HTMLElement | null): string => {
	const element = item?.querySelector('.title-poster__badge');

	return element?.innerText?.toLowerCase() || '';
};

export const getEpisode = (item: HTMLElement | null): string => {
	const element = item?.querySelector('.title-poster__badge__new');

	return element?.innerText?.toLowerCase()?.replace('new ', '1 ') || '';
};

export const getShowItems = (element: HTMLElement | null): Shows => {
	const items = element?.querySelectorAll('.horizontal-title-list__item') || [];

	return items.map(item => ({
		episode: getEpisode(item),
		link: getLink(item),
		season: getSeason(item),
		thumbnail: getThumbnail(item),
		title: getTitle(item),
	})) || [];
};

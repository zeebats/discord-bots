import type { HTMLElement } from 'node-html-parser';

import { getLink, getThumbnail, getTitle } from './justwatch';

export const getSeason = (item: HTMLElement | null) => {
	const element = item?.querySelector('.title-poster__badge');

	return `Season ${element?.textContent.replace(/season /i, '')?.padStart(2, '0')}`;
};

export const getEpisode = (item: HTMLElement | null) => {
	const element = item?.querySelector('.title-poster__badge__new');

	const unmodified = element?.textContent.toLowerCase()?.split(' ');
	const modified = unmodified?.map(string => {
		if (string.includes('episode')) {
			return string;
		}

		return `${string.replace(/new/i, '1').padStart(2, '0')} new`;
	});

	return modified?.join(' ') ?? '';
};

export const getShowItems = (element: HTMLElement | null) => {
	const items = element?.querySelectorAll('.horizontal-title-list__item') ?? [];

	return items.map(item => ({
		episode: getEpisode(item),
		link: getLink(item),
		season: getSeason(item),
		thumbnail: getThumbnail(item),
		title: getTitle(item),
	})).sort((a, b) => `${a.title} ${a.season}`.localeCompare(`${b.title} ${b.season}`));
};

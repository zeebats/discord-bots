import { getLink, getThumbnail, getTitle } from '@/utils/justwatch';

import type { Shows } from '@/types/shows';
import type { HTMLElement } from 'node-html-parser';

export const getSeason = (item: HTMLElement | null): string => {
	const element = item?.querySelector('.title-poster__badge');

	return `Season ${element?.innerText?.replace(/season /i, '')?.padStart(2, '0')}` || '';
};

export const getEpisode = (item: HTMLElement | null): string => {
	const element = item?.querySelector('.title-poster__badge__new');

	const unmodified = element?.innerText?.toLowerCase()?.split(' ');
	const modified = unmodified?.map(string => {
		if ((/episode/).test(string)) {
			return string;
		}

		return `${string.replace(/new/i, '1').padStart(2, '0')} new`;
	});

	return modified?.join(' ') || '';
};

export const getShowItems = (element: HTMLElement | null): Shows => {
	const items = element?.querySelectorAll('.horizontal-title-list__item') || [];

	return items.map(item => ({
		episode: getEpisode(item),
		link: getLink(item),
		season: getSeason(item),
		thumbnail: getThumbnail(item),
		title: getTitle(item),
	})).sort((a, b): number => `${a.title} ${a.season}`.localeCompare(`${b.title} ${b.season}`)) || [];
};

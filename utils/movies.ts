import type { HTMLElement } from 'node-html-parser';

import { getLink, getThumbnail, getTitle } from './justwatch';

export const getMovieItems = (element: HTMLElement | null) => {
	const items = element?.querySelectorAll('.horizontal-title-list__item') ?? [];

	return items.map(item => ({
		link: getLink(item),
		thumbnail: getThumbnail(item),
		title: getTitle(item),
	})).sort((a, b) => a.title.localeCompare(b.title));
};

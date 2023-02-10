import { getLink, getThumbnail, getTitle } from '@/utils/justwatch';

import type { Movies } from '@/types/movies';
import type { HTMLElement } from 'node-html-parser';

export const getMovieItems = (element: HTMLElement | null): Movies => {
	const items = element?.querySelectorAll('.horizontal-title-list__item') || [];

	return items.map(item => ({
		link: getLink(item),
		thumbnail: getThumbnail(item),
		title: getTitle(item),
	})).sort((a, b): number => a.title.localeCompare(b.title)) || [];
};

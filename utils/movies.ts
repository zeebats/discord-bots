import { HTMLElement } from 'node-html-parser';

import { Movies } from '@ts/movies';
import { getLink, getThumbnail, getTitle } from '@utils/justwatch';

export const getMovieItems = (element: HTMLElement | null): Movies => {
	const items = element?.querySelectorAll('.horizontal-title-list__item') || [];

	return items.map(item => ({
		link: getLink(item),
		thumbnail: getThumbnail(item),
		title: getTitle(item),
	})) || [];
};

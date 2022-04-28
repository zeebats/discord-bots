import { HTMLElement } from 'node-html-parser';

import {
    getLink,
    getPoster,
    getTitle,
} from '@utils/justwatch';

import { Movies } from '@ts/movies';

export const getMovieItems = (element: HTMLElement | null): Movies => {
    const items = element?.querySelectorAll('.horizontal-title-list__item') || [];

    return items.map(item => ({
        link: getLink(item),
        poster: getPoster(item),
        title: getTitle(item),
    })) || [];
};

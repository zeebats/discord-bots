import { HTMLElement } from 'node-html-parser';

import {
    getLink,
    getShortcode,
    getThumbnail,
    getTitle,
} from '@utils/justwatch';

import { Movies } from '@ts/movies';

export const getMovieItems = (element: HTMLElement | null): Movies => {
    const items = element?.querySelectorAll('.horizontal-title-list__item') || [];

    return items.map(item => ({
        link: getLink(item),
        thumbnail: getThumbnail(item),
        title: getTitle(item),
    })) || [];
};

export const getProviderLink = (element: HTMLElement | null): string => {
    const provider = getShortcode(element);

    return `https://www.justwatch.com/us/movies/new=${provider}`;
};

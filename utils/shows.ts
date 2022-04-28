import { HTMLElement } from 'node-html-parser';

import {
    getLink,
    getPoster,
    getProviderShortcode,
    getTitle,
} from '@utils/justwatch';

import { Shows } from '@ts/shows';

export const getSeason = (item: HTMLElement | null): string => {
    const element = item?.querySelector('.title-poster__badge');

    return element?.innerText?.toLowerCase() || '';
};

const formatEpisode = (string: string): string => {
    let formatted = string.toLowerCase();

    formatted = formatted.replace('new ', '1 ');

    return formatted;
};

export const getEpisode = (item: HTMLElement | null): string => {
    const element = item?.querySelector('.title-poster__badge__new');

    return formatEpisode(element?.innerText || '');
};

export const getShowItems = (element: HTMLElement | null): Shows => {
    const items = element?.querySelectorAll('.horizontal-title-list__item') || [];

    return items.map(item => ({
        episode: getEpisode(item),
        link: getLink(item),
        poster: getPoster(item),
        season: getSeason(item),
        title: getTitle(item),
    })) || [];
};

export const getProviderLink = (element: HTMLElement | null): string => {
    const provider = getProviderShortcode(element);

    return `https://www.justwatch.com/us/tv-shows/new=${provider}`;
};

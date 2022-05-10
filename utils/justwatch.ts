const { NETLIFY_DEV } = process.env;

import { HTMLElement, default as parseLocal, parse as parseProduction } from 'node-html-parser';

import { selectedProviders } from '@enums/providers';

const parse = NETLIFY_DEV ? parseLocal : parseProduction;

export const getTitle = (item: HTMLElement | null): string => {
    const element = item?.querySelector('.picture-comp__img');

    return element?.getAttribute('alt')?.replace(/\s*-\s*season \d*/i, '') || '';
};

export const getThumbnail = (item: HTMLElement | null): string => {
    const source = item?.querySelector('source[type=image/jpeg]');

    const attribute = source?.getAttribute('srcset') || source?.getAttribute('data-srcset') || '';

    return attribute?.replace(/.*?, (.*?) 2x/, '$1');
};

export const getLink = (element: HTMLElement | null): string => {
    const link = element?.getAttribute('href') || '';

    return `https://www.justwatch.com${link}`;
};

export const getToday = (string: string): HTMLElement | null => {
    const body = parse(string);

    return body.querySelector('.timeline__timeframe:first-child');
};

export const getProviders = (element: HTMLElement | null): HTMLElement[] => {
    const providers = element?.querySelectorAll('.timeline__provider-block');

    return providers || [];
};

export const getProvider = (element: HTMLElement | null): string => {
    const provider = element?.querySelector('.timeline__provider-block__logo');

    return provider?.getAttribute('alt') || '';
};

export const getShortcode = (element: HTMLElement | null): string => {
    const classes = element?.getAttribute('class');

    return classes?.replace(/.*?--\d{4}-\d{2}-\d{2}--(.*?)/, '$1') || '';
};

export const getColor = (element: HTMLElement | null): number => {
    const provider = getShortcode(element);

    return selectedProviders[provider]?.color || 15_724_527;
};

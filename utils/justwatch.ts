import parse, { HTMLElement } from 'node-html-parser';

export const getTitle = (item: HTMLElement | null): string => {
    const element = item?.querySelector('.picture-comp__img');

    return element?.getAttribute('alt')?.replace(/\s*-\s*season \d*/i, '') || '';
};

export const getPoster = (item: HTMLElement | null): string => {
    const source = item?.querySelector('source[type=image/jpeg]');

    const attribute = source?.getAttribute('srcset') || source?.getAttribute('data-srcset') || '';

    return attribute?.replace(/.*?, (.*?) 2x/, '$1');
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

export const getToday = (string: string): string => {
    const body = parse(string);

    const timeframe = body.querySelector('.timeline__timeframe:first-child');

    return timeframe?.toString() || '';
};

export const getProviders = (string: string): HTMLElement[] => {
    const body = parse(string);

    const providers = body.querySelectorAll('.timeline__provider-block');

    return [...providers] || [];
};

export const getProvider = (element: HTMLElement | null): string => {
    const provider = element?.querySelector('.timeline__provider-block__logo');

    return provider?.getAttribute('alt') || 'No provider found';
};

export const getColor = (string: string): number => ({
    atp: 1,
    dnp: 3_240_685,
    nfx: 13_774_631,
}[string]) || 15_724_527;

export const getProviderShortcode = (element: HTMLElement | null): string => {
    const classes = element?.getAttribute('class');

    return classes?.replace(/.*?--\d{4}-\d{2}-\d{2}--(.*?)/, '$1') || '';
};

export const getProviderColor = (element: HTMLElement | null): number => {
    const provider = getProviderShortcode(element);

    return getColor(provider);
};

export const getProviderLink = (element: HTMLElement | null): string => {
    const provider = getProviderShortcode(element);

    return `https://www.justwatch.com/nl/tv-series/new?providers=${provider}`;
};

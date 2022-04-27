import fetch from 'cross-fetch';

import {
    getTitle,
    getPoster,
    getSeason,
    getEpisode,
    getLink,
} from '@utils/shows';

export type Show = {
    episode: string;
    link: string;
    poster: string;
    season: string;
    title: string;
}

export type Shows = Show[];

export const formatShows = (response: string): Shows => {
    const cleaned = response.replace(/^\s+|\s+$/g, '').replace(/(\r\n|\n|\r)/gm, '');
    const today = (/(<div class="timeline__timeframe.*?)<div class="timeline__timeframe/g).exec(cleaned);

    if (today === null) {
        return [];
    }

    const [, todayMatch] = today;

    const shows = todayMatch.match(/(<div index="\d" class="title-poster">.+?<\/div>)/g) || [];

    return shows.map(show => {
        const title = getTitle(show);

        return {
            episode: getEpisode(show),
            link: getLink(title),
            poster: getPoster(show),
            season: getSeason(show),
            title,
        };
    });
};

export const getShows = async (): Promise<Shows> => {
    const request = await fetch('https://www.justwatch.com/nl/tv-series/new?providers=atp,dnp,nfx');
    const response = await request.text();

    return formatShows(response);
};

import fetch from 'cross-fetch';

import {
    getTitle,
    getPoster,
    getLink,
} from '@utils/movies';

export type Movie = {
    link: string;
    poster: string;
    title: string;
}

export type Movies = Movie[];

export const formatMovies = (response: string): Movies => {
    const cleaned = response.replace(/^\s+|\s+$/g, '').replace(/(\r\n|\n|\r)/gm, '');
    const today = (/(<div class="timeline__timeframe.*?)<div class="timeline__timeframe/g).exec(cleaned);

    if (today === null) {
        return [];
    }

    const [, todayMatch] = today;

    const movies = todayMatch.match(/(<div index="\d" class="title-poster">.+?<\/div>)/g) || [];

    return movies.map(movie => {
        const title = getTitle(movie);

        return {
            link: getLink(title),
            poster: getPoster(movie),
            title,
        };
    });
};

export const getMovies = async (): Promise<Movies> => {
    const request = await fetch('https://www.justwatch.com/nl/movies/new?providers=atp,dnp,nfx');
    const response = await request.text();

    return formatMovies(response);
};

export const getWebhook = async ({ embeds }: { embeds?: { title: string, description: string, image: { url: string } }[] }): Promise<void> => {
    await fetch('https://discord.com/api/webhooks/968600602575773776/kfvwr8h-gM4zcDzoLaz3LRH6r5kvhO-QU9GyStFQYd8atfywzi_cGtVE20xJoERu4neP', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            embeds,
        }),
    });
};

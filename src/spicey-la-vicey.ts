import fetch from 'cross-fetch';

import {
    getTitle,
    getLink,
    getTimestamp,
    getDescription,
} from '@utils/spicey-la-vicey';

export type Mix = {
    description: string;
    link: string;
    timestamp: number;
    title: string;
}

export type Mixes = Mix[];

export const formatMixes = (response: string): Mixes => {
    const cleaned = response.replace(/^\s+|\s+$/g, '').replace(/(\r\n|\n|\r)/gm, '');

    const cards = cleaned.match(/<article.*?class=".*?sc-c-playable-list-card.*?>(.*?)<\/article>/g) || [];

    return cards.map(card => ({
        description: getDescription(card),
        link: getLink(card),
        timestamp: getTimestamp(card),
        title: getTitle(card),
    }));
};

export const getMixes = async (): Promise<Mixes> => {
    const request = await fetch('https://www.bbc.co.uk/sounds/brand/b09c12lj');
    const response = await request.text();

    return formatMixes(response);
};

export const getNewestMix = async (): Promise<Mix> => {
    const mixes = await getMixes();

    const [newestMix] = mixes.sort((a, b): number => b.timestamp - a.timestamp);

    return newestMix;
};

export const getWebhook = async ({ content, embeds }: { content: string, embeds?: { image: { url: string } }[] }): Promise<void> => {
    await fetch('https://discord.com/api/webhooks/964154301582835712/WzolPxY6Ve_vaz2rGwAM5zkINsLpQEwq5tFHiwNLvmc5BTUcIJo8TttzZ3Fwpbmh4g4P', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content,
            embeds,
            username: 'Spicey LaVicey',
        }),
    });
};

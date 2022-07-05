import fetch from 'cross-fetch';

import {
	getDescription,
	getLink,
	getTimestamp,
	getTitle,
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

import phin from 'phin';

import {
	getDescription,
	getLink,
	getTimestamp,
	getTitle,
} from '@/utils/spicey-la-vicey';

export type Episode = {
    description: string;
    link: string;
    timestamp: number;
    title: string;
}

export type Episodes = Episode[];

export type Content = {
	mix: Episode;
	show: Episode;
}

export const formatResponse = (response: string) => {
	const cleaned = response.replace(/^\s+|\s+$/g, '').replace(/(\r\n|\n|\r)/gm, '');

	const cards = cleaned.match(/<article.*?class=".*?sc-c-playable-list-card.*?>(.*?)<\/article>/g) || [];

	return cards.map(card => ({
		description: getDescription(card),
		link: getLink(card),
		timestamp: getTimestamp(card),
		title: getTitle(card),
	}));
};

export const getShows = async () => {
	const { body: response } = await phin({
		parse: 'string',
		url: 'https://www.bbc.co.uk/sounds/brand/b09c12lj',
	});

	return formatResponse(response);
};

export const getMixes = async () => {
	const { body: response } = await phin({
		parse: 'string',
		url: 'https://www.bbc.co.uk/sounds/brand/m0003l3c',
	});

	return formatResponse(response);
};

export const getNewestContent = async () => {
	const shows = await getShows();
	const mixes = await getMixes();

	const [show] = shows.sort((a, b) => b.timestamp - a.timestamp);
	const [mix] = mixes.sort((a, b) => b.timestamp - a.timestamp);

	return {
		mix,
		show,
	};
};

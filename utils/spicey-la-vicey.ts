import { getUnixTime, parse, startOfDay } from 'date-fns';
import { decode } from 'html-entities';

export const getTitle = (string: string) => {
	const primary = (/<.*?class=".*?sc-c-metadata__primary.*?>(.*?)<\/.*>/g).exec(string);
	const secondary = (/<.*?class=".*?sc-c-metadata__secondary.*?>(.*?)<\/.*>/g).exec(string);

	if (secondary !== null) {
		const [
			, value,
		] = secondary;

		return decode(value);
	}

	if (primary === null) {
		return '';
	}

	const [
		, value,
	] = primary;

	return decode(value);
};

export const getDescription = (string: string) => {
	const match = (/<.*?class=".*?sc-c-metadata__synopsis.*?>(.*?)<\/.*>/g).exec(string);

	if (match === null) {
		return '';
	}

	const [
		, value,
	] = match;

	return decode(value);
};

export const getLink = (string: string) => {
	const match = (/<.*?class=".*?sc-c-playable-list-card__link.*? href="(.*?)"/g).exec(string);

	if (match === null) {
		return '';
	}

	const [
		, value,
	] = match;

	return decode(`https://www.bbc.co.uk${value}`);
};

export const getTimestamp = (string: string) => {
	const match = (/<.*?class=".*?sc-c-metadata__release-date.*?>(.*?)<\/.*>/g).exec(string);

	if (match === null) {
		return 0;
	}

	const [
		, value,
	] = match;

	return getUnixTime(startOfDay(parse(value, 'dd LLL yyyy', Date.now())));
};

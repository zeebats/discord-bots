import type { APIEmbedField } from 'discord-api-types/v10';

import { parse } from 'node-html-parser';

import {
	type EntitiesType,
	type EntityType,
	type OdesliResponse,
	Platform,
	schemaAppleMusicGenres,
	schemaOdesliResponse,
} from '../types/odesli';

const platformMap = {
	[Platform.AppleMusic]: {
		emoji: '<:applemusic:1108718819238748210>',
		name: 'Apple Music',
	},
	[Platform.Spotify]: {
		emoji: '<:spotify:1108717659798913065>',
		name: 'Spotify',
	},
};

const getEntities = (json: OdesliResponse) => {
	const entities: EntitiesType<Platform> = new Map();

	for (const platform of Object.values(Platform)) {
		if (platform in json.linksByPlatform) {
			entities.set(platform as Platform, json.linksByPlatform[platform as Platform]);
		}
	}

	return entities;
};

const getGenres = (response: string) => {
	const body = parse(response);
	const jsonLdData = body.querySelector('script#schema\\:song')?.textContent ?? null;

	if (jsonLdData === null) {
		return '';
	}

	const parsed = schemaAppleMusicGenres.safeParse(JSON.parse(jsonLdData));

	if (!parsed.success) {
		return '';
	}

	const genres = parsed.data.audio.genre;

	return genres.filter((genre: string) => !['Muziek'].includes(genre)).join(', ');
};

// eslint-disable-next-line max-statements
const getInfo = async (json: OdesliResponse, entities: EntitiesType<Platform>) => {
	/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
	// @ts-expect-error Object could possible be undefined
	const firstEntity = entities.entries().next().value[1] as EntityType;
	/* eslint-enable @typescript-eslint/no-unnecessary-type-assertion */

	const entityKey = firstEntity?.entityUniqueId ?? '';

	const {
		artistName,
		thumbnailUrl,
		title,
	} = json.entitiesByUniqueId[entityKey];

	const urlAppleMusic = entities.get(Platform.AppleMusic)?.url ?? null;

	let requestAppleMusic: Response | null = null;
	let responseAppleMusic = '';
	let genres = null;

	if (urlAppleMusic !== null) {
		requestAppleMusic = await fetch(urlAppleMusic, { redirect: 'follow' });
		responseAppleMusic = await requestAppleMusic.text();

		genres = getGenres(responseAppleMusic);
	}

	return {
		artistName,
		genres,
		links: Object.values(Platform).map((platform): APIEmbedField => {
			let link = entities.get(platform)?.url ?? null;

			if (platform === Platform.AppleMusic && requestAppleMusic !== null) {
				link = requestAppleMusic.url;
			}

			const field = {
				inline: true,
				name: platformMap[platform].name,
				value: `${platformMap[platform].emoji} No link found`,
			};

			if (link !== null) {
				field.value = `${platformMap[platform].emoji} [Link](${link})`;
			}

			return field;
		}),
		pageUrl: json.pageUrl,
		thumbnail: thumbnailUrl ?? '',
		title,
	};
};

// eslint-disable-next-line max-statements
export const getData = async (url: string) => {
	const fetchURL = new URL('https://api.song.link/v1-alpha.1/links');

	fetchURL.searchParams.append('url', url);
	fetchURL.searchParams.append('userCountry', 'NL');

	const reponse = await fetch(fetchURL);
	const json = schemaOdesliResponse.parse(await reponse.json());

	const entities = getEntities(json);

	if (entities.size === 0) {
		return null;
	}

	return getInfo(json, entities);
};

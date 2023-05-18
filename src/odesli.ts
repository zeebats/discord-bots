import { APIEmbedField } from 'discord-api-types/v10';

import {
	EntitiesType,
	EntityType,
	OdesliResponse,
	Platform,
} from '@/types/odesli';

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

const getInfo = (json: OdesliResponse, entities: EntitiesType<Platform>) => {
	const firstEntity = entities.entries().next().value[1] as EntityType;
	const entityKey = firstEntity?.entityUniqueId ?? '';

	const {
		artistName,
		thumbnailUrl,
		title,
	} = json.entitiesByUniqueId[entityKey];

	const platformLinks: APIEmbedField[] = [];

	for (const platform of Object.values(Platform)) {
		const link = entities.get(platform)?.url;

		if (link) {
			platformLinks.push({
				inline: true,
				name: platformMap[platform].name,
				value: `${platformMap[platform].emoji} [Link](${link})`,
			});
		}
	}

	return {
		artistName,
		links: platformLinks,
		pageUrl: json.pageUrl,
		thumbnail: thumbnailUrl ?? '',
		title,
	};
};

export const getData = async (url: string) => {
	const reponse = await fetch(`https://api.song.link/v1-alpha.1/links?${new URLSearchParams({
		url,
		userCountry: 'NL',
	})}`);
	const json = await reponse.json();
	const entities = getEntities(json);

	if (entities.size === 0) {
		return false;
	}

	return getInfo(json, entities);
};

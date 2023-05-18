export enum Platform {
	AppleMusic = 'appleMusic',
  Spotify = 'spotify',
}

export type OdesliResponse = {
	entitiesByUniqueId: {
		[entityUniqueId: string]: {
			artistName?: string,
			id: string;
			thumbnailUrl?: string,
			title?: string,
		}
	},
	linksByPlatform: {
		[key in Platform]?: {
			entityUniqueId: string;
			url: string;
		}
	}
	pageUrl: string;
}

export type EntityType = OdesliResponse['linksByPlatform'][Platform];

export type EntitiesType<T extends Platform> = Map<T, EntityType>;

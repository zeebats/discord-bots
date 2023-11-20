/* eslint-disable @typescript-eslint/no-type-alias, newline-per-chained-call */

import { z } from 'zod';

/* eslint-disable @typescript-eslint/naming-convention */
export enum Platform {
	AppleMusic = 'appleMusic',
	Spotify = 'spotify',
}
/* eslint-enable @typescript-eslint/naming-convention */

export const schemaAppleMusicGenres = z.array(z.object({ data: z.object({ seoData: z.object({ ogSongs: z.array(z.object({ attributes: z.object({ genreNames: z.array(z.string()) }) })) }) }) }));

export const schemaOdesliResponse = z.object({
	entitiesByUniqueId: z.record(z.object({
		artistName: z.string().optional(),
		id: z.string(),
		thumbnailUrl: z.string().url().optional(),
		title: z.string().optional(),
	})),
	entityUniqueId: z.string(),
	linksByPlatform: z.record(z.object({
		entityUniqueId: z.string(),
		url: z.string().url(),
	}).optional()),
	pageUrl: z.string().url(),
	userCountry: z.string(),
});

export type OdesliResponse = z.infer<typeof schemaOdesliResponse>

export type EntityType = OdesliResponse['linksByPlatform'][Platform];

export type EntitiesType<T extends Platform> = Map<T, EntityType>;

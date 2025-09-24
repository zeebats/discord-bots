import { z } from 'zod';

export enum Platform {
	AppleMusic = 'appleMusic',
	Spotify = 'spotify',
}

export const schemaAppleMusicGenres = z.object({ audio: z.object({ genre: z.array(z.string()) }) });

export const schemaOdesliResponse = z.object({
	entitiesByUniqueId: z.record(
		z.object({
			artistName: z.string().optional(),
			id: z.string(),
			thumbnailUrl: z.string().url().optional(),
			title: z.string().optional(),
		}),
	),
	entityUniqueId: z.string(),
	linksByPlatform: z.record(
		z
			.object({
				entityUniqueId: z.string(),
				url: z.string().url(),
			})
			.optional(),
	),
	pageUrl: z.string().url(),
	userCountry: z.string(),
});

export type OdesliResponse = z.infer<typeof schemaOdesliResponse>;

export type EntityType = OdesliResponse['linksByPlatform'][Platform];

export type EntitiesType<T extends Platform> = Map<T, EntityType>;

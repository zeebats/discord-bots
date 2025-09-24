import type { BaseProvider } from '@/types/justwatch';

export type Show = {
	episode: string;
	link: string;
	season: string;
	thumbnail: string;
	title: string;
};

export type Shows = Show[];

export type Provider = {
	shows: Shows;
} & BaseProvider;

export type Providers = Provider[];

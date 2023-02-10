import type { BaseProvider } from '@/types/justwatch';

export type Show = {
    episode: string;
    link: string;
    thumbnail: string;
    season: string;
    title: string;
}

export type Shows = Show[];

export interface Provider extends BaseProvider {
    shows: Shows;
}

export type Providers = Provider[];

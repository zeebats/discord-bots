import { BaseProvider } from '@ts/justwatch';

export type Show = {
    episode: string;
    link: string;
    poster: string;
    season: string;
    title: string;
}

export type Shows = Show[];

export interface Provider extends BaseProvider {
    shows: Shows;
}

export type Providers = Provider[];

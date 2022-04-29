import { BaseProvider } from '@ts/justwatch';

export type Movie = {
    link: string;
    thumbnail: string;
    title: string;
}

export type Movies = Movie[];

export interface Provider extends BaseProvider {
    movies: Movies;
}

export type Providers = Provider[];

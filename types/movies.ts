import { BaseProvider } from '@ts/justwatch';

export type Movie = {
    link: string;
    poster: string;
    title: string;
}

export type Movies = Movie[];

export interface Provider extends BaseProvider {
    movies: Movies;
}

export type Providers = Provider[];

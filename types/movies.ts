/* eslint-disable @typescript-eslint/no-type-alias */
import type { BaseProvider } from '@/types/justwatch';

export type Movie = {
    link: string;
    thumbnail: string;
    title: string;
}

export type Movies = Movie[];

export type Provider = {
    movies: Movies;
} & BaseProvider

export type Providers = Provider[];

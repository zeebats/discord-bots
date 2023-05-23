import { produceDecimalColor } from '@/utils/color';

export const selectedProviders: { [key: string]: { color: number, name: string, slug: string } } = {
	amp: {
		color: produceDecimalColor('#4CA6DC'),
		name: 'Amazon Prime Video',
		slug: 'amazon-prime-video',
	},
	atp: {
		color: produceDecimalColor('#000000'),
		name: 'Apple TV+',
		slug: 'apple-tv-plus',
	},
	dnp: {
		color: produceDecimalColor('#3172ED'),
		name: 'Disney+',
		slug: 'disney-plus',
	},
	hbm: {
		color: produceDecimalColor('#8E40DE'),
		name: 'HBO Max',
		slug: 'hbo-max',
	},
	hlu: {
		color: produceDecimalColor('#64B97E'),
		name: 'Hulu',
		slug: 'hulu',
	},
	nfx: {
		color: produceDecimalColor('#D22F27'),
		name: 'Netflix',
		slug: 'netflix',
	},
};


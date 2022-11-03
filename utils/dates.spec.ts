
import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vitest';

import { isDST } from './dates';

describe('dates', () => {
	test('tests if DST function works', () => {
		expect(
			isDST(Temporal.ZonedDateTime.from({
				timeZone: 'Europe/Amsterdam',
				year: 2000,
				month: 11, // eslint-disable-line sort-keys
				day: 25, // eslint-disable-line sort-keys
			})),
		).toBeTruthy();

		expect(
			isDST(Temporal.ZonedDateTime.from({
				timeZone: 'Europe/Amsterdam',
				year: 2000,
				month: 10, // eslint-disable-line sort-keys
				day: 30, // eslint-disable-line sort-keys
			})),
		).toBeTruthy();

		expect(
			isDST(Temporal.ZonedDateTime.from({
				timeZone: 'Europe/Amsterdam',
				year: 2000,
				month: 7, // eslint-disable-line sort-keys
				day: 25, // eslint-disable-line sort-keys
			})),
		).toBeFalsy();

		expect(
			isDST(Temporal.ZonedDateTime.from({
				timeZone: 'Europe/Amsterdam',
				year: 2000,
				month: 3, // eslint-disable-line sort-keys
				day: 27, // eslint-disable-line sort-keys
				hour: 3,
			})),
		).toBeFalsy();
	});
});

import { Temporal } from '@js-temporal/polyfill';

import { escapeSummerTime, isSummerTime } from './dates';

// eslint-disable-next-line max-lines-per-function
describe('isSummerTime()', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test('26 March 2023 01:59:59 UTC is wintertime', () => {
		const date = Temporal.ZonedDateTime.from({
			timeZone: 'UTC',
			year: 2023,
			month: 3, // eslint-disable-line sort-keys
			day: 26, // eslint-disable-line sort-keys
			hour: 1,
			minute: 59,
			second: 59,
		});

		vi.setSystemTime(new Date(date.toLocaleString()));

		expect(isSummerTime()).toBeFalsy();
	});

	test('26 March 2023 02:00:00 UTC is summertime', () => {
		const date = Temporal.ZonedDateTime.from({
			timeZone: 'UTC',
			year: 2023,
			month: 3, // eslint-disable-line sort-keys
			day: 26, // eslint-disable-line sort-keys
			hour: 2,
			minute: 0,
			second: 0,
		});

		vi.setSystemTime(new Date(date.toLocaleString()));

		expect(isSummerTime()).toBeTruthy();
	});

	test('29 October 2023 02:59:59 UTC is summertime', () => {
		const date = Temporal.ZonedDateTime.from({
			timeZone: 'UTC',
			year: 2023,
			month: 10, // eslint-disable-line sort-keys
			day: 29, // eslint-disable-line sort-keys
			hour: 2,
			minute: 59,
			second: 59,
		});

		vi.setSystemTime(new Date(date.toLocaleString()));

		expect(isSummerTime()).toBeTruthy();
	});

	test('29 October 2023 03:00:00 UTC is wintertime', () => {
		const date = Temporal.ZonedDateTime.from({
			timeZone: 'UTC',
			year: 2023,
			month: 10, // eslint-disable-line sort-keys
			day: 29, // eslint-disable-line sort-keys
			hour: 3,
			minute: 0,
			second: 0,
		});

		vi.setSystemTime(new Date(date.toLocaleString()));

		expect(isSummerTime()).toBeFalsy();
	});
});

describe('escapeSummerTime() during wintertime', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test('16:00 UTC — doesn\'t post', () => {
		const date = Temporal.ZonedDateTime.from({
			timeZone: 'UTC',
			year: 2023,
			month: 3, // eslint-disable-line sort-keys
			day: 25, // eslint-disable-line sort-keys
			hour: 16,
		});

		vi.setSystemTime(new Date(date.toLocaleString()));

		expect(isSummerTime()).toBeFalsy();
		expect(escapeSummerTime()).toBeTruthy();
	});

	test('17:00 UTC — does post', () => {
		const date = Temporal.ZonedDateTime.from({
			timeZone: 'UTC',
			year: 2023,
			month: 3, // eslint-disable-line sort-keys
			day: 25, // eslint-disable-line sort-keys
			hour: 17,
		});

		vi.setSystemTime(new Date(date.toLocaleString()));

		expect(isSummerTime()).toBeFalsy();
		expect(escapeSummerTime()).toBeFalsy();
	});
});

describe('escapeSummerTime() during summertime', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test('16:00 UTC — does post', () => {
		const date = Temporal.ZonedDateTime.from({
			timeZone: 'UTC',
			year: 2023,
			month: 3, // eslint-disable-line sort-keys
			day: 27, // eslint-disable-line sort-keys
			hour: 16,
		});

		vi.setSystemTime(new Date(date.toLocaleString()));

		expect(isSummerTime()).toBeTruthy();
		expect(escapeSummerTime()).toBeFalsy();
	});

	test('17:00 UTC — doesn\'t post', () => {
		const date = Temporal.ZonedDateTime.from({
			timeZone: 'UTC',
			year: 2023,
			month: 3, // eslint-disable-line sort-keys
			day: 27, // eslint-disable-line sort-keys
			hour: 17,
		});

		vi.setSystemTime(new Date(date.toLocaleString()));

		expect(isSummerTime()).toBeTruthy();
		expect(escapeSummerTime()).toBeTruthy();
	});

});

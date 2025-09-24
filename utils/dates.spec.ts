import { Temporal } from '@js-temporal/polyfill';

import { escapeSummerTime, isSummerTime } from './dates';

describe('isSummerTime()', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test('26 March 2023 01:59:59 UTC is wintertime', () => {
		const date = Temporal.ZonedDateTime.from({
			day: 26,
			hour: 1,
			minute: 59,
			month: 3,
			second: 59,
			timeZone: 'UTC',
			year: 2023,
		});

		vi.setSystemTime(new Date(date.toLocaleString()));

		expect(isSummerTime()).toBeFalsy();
	});

	test('26 March 2023 02:00:00 UTC is summertime', () => {
		const date = Temporal.ZonedDateTime.from({
			day: 26,
			hour: 2,
			minute: 0,
			month: 3,
			second: 0,
			timeZone: 'UTC',
			year: 2023,
		});

		vi.setSystemTime(new Date(date.toLocaleString()));

		expect(isSummerTime()).toBeTruthy();
	});

	test('29 October 2023 02:59:59 UTC is summertime', () => {
		const date = Temporal.ZonedDateTime.from({
			day: 29,
			hour: 2,
			minute: 59,
			month: 10,
			second: 59,
			timeZone: 'UTC',
			year: 2023,
		});

		vi.setSystemTime(new Date(date.toLocaleString()));

		expect(isSummerTime()).toBeTruthy();
	});

	test('29 October 2023 03:00:00 UTC is wintertime', () => {
		const date = Temporal.ZonedDateTime.from({
			day: 29,
			hour: 3,
			minute: 0,
			month: 10,
			second: 0,
			timeZone: 'UTC',
			year: 2023,
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

	test("16:00 UTC — doesn't post", () => {
		const date = Temporal.ZonedDateTime.from({
			day: 25,
			hour: 16,
			month: 3,
			timeZone: 'UTC',
			year: 2023,
		});

		vi.setSystemTime(new Date(date.toLocaleString()));

		expect(isSummerTime()).toBeFalsy();
		expect(escapeSummerTime()).toBeTruthy();
	});

	test('17:00 UTC — does post', () => {
		const date = Temporal.ZonedDateTime.from({
			day: 25,
			hour: 17,
			month: 3,
			timeZone: 'UTC',
			year: 2023,
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
			day: 27,
			hour: 16,
			month: 3,
			timeZone: 'UTC',
			year: 2023,
		});

		vi.setSystemTime(new Date(date.toLocaleString()));

		expect(isSummerTime()).toBeTruthy();
		expect(escapeSummerTime()).toBeFalsy();
	});

	test("17:00 UTC — doesn't post", () => {
		const date = Temporal.ZonedDateTime.from({
			day: 27,
			hour: 17,
			month: 3,
			timeZone: 'UTC',
			year: 2023,
		});

		vi.setSystemTime(new Date(date.toLocaleString()));

		expect(isSummerTime()).toBeTruthy();
		expect(escapeSummerTime()).toBeTruthy();
	});
});

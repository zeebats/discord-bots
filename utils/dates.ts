import { Temporal } from '@js-temporal/polyfill';

export const isSummerTime = (date = Temporal.Now.zonedDateTimeISO('UTC')) => {
	const { year } = date;

	const summertimeApproximate = Temporal.PlainDateTime.from({
		day: 31,
		hour: 2,
		month: 3,
		year,
	});
	const summertimeExact = summertimeApproximate.subtract({
		days: [
			1,
			2,
			3,
			4,
			5,
			6,
			0,
		][summertimeApproximate.dayOfWeek - 1],
	});

	const wintertimeApproximate = Temporal.PlainDateTime.from({
		day: 31,
		hour: 3,
		month: 10,
		year,
	});
	const wintertimeExact = wintertimeApproximate.subtract({
		days: [
			1,
			2,
			3,
			4,
			5,
			6,
			0,
		][wintertimeApproximate.dayOfWeek - 1],
	});

	const summertimeSince = date.since(summertimeExact.toZonedDateTime('UTC'));
	const wintertimeUntil = date.until(wintertimeExact.toZonedDateTime('UTC'));

	return [
		summertimeSince.sign,
		wintertimeUntil.sign,
	].every(sign => sign === 1);
};

export const escapeSummerTime = () => (isSummerTime() && Temporal.Now.zonedDateTimeISO('UTC').hour === 17) || (!isSummerTime() && Temporal.Now.zonedDateTimeISO('UTC').hour === 16);

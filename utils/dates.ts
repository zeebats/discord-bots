import { Temporal } from '@js-temporal/polyfill';

export const isDST = (date: Temporal.ZonedDateTime = Temporal.Now.zonedDateTimeISO()): boolean => date.offsetNanoseconds !== 7_200_000_000_000;

export const escapeDST = (): boolean => (isDST() && Temporal.Now.zonedDateTimeISO().hour === 16) || (!isDST() && Temporal.Now.zonedDateTimeISO().hour === 17);

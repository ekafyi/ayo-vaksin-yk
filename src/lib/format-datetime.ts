/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const SIMPLE_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
	year: "numeric",
	month: "long",
	day: "numeric",
};

const TIME_OPTIONS: Intl.DateTimeFormatOptions = {
	hour12: false,
	hour: "2-digit",
	minute: "2-digit",
};

export const formatSimpleDate = (utcDate: string) =>
	new Date(utcDate).toLocaleDateString("id-ID", SIMPLE_DATE_OPTIONS);

// Using locale id-ID = "06.15", while en-US = "06:15"
export const formatTime = (utcDate: string) =>
	new Date(utcDate).toLocaleTimeString("en-US", TIME_OPTIONS);

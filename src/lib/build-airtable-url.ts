/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const AIRTABLE_API_HOST = `https://api.airtable.com/v0/`;

export const makeFieldsParam = (fields: string[]) =>
	fields.map((item) => `fields${encodeURIComponent("[]")}=${item}`).join("&");

export const makeFilterParam = (str: string) => `filterByFormula=${encodeURIComponent(str)}`;

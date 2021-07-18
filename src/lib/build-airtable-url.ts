/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const AIRTABLE_API_HOST = `https://api.airtable.com/v0/`;

export const makeFieldsParam = (fields: string[]) =>
	fields.map((item) => `fields${encodeURIComponent("[]")}=${item}`).join("&");

export const makeFilterParam = (str: string) => `filterByFormula=${encodeURIComponent(str)}`;

type AirtableSortBy = {
	field: string;
	direction: "asc" | "desc";
};

// starts with "&", add this first before other param types.
export const makeSortParam = (sortArr: AirtableSortBy[]) => {
	let sort = "";
	if (sortArr) {
		let i = 0;
		for (const s of sortArr) {
			const prefix = i == 0 ? "?" : "&";
			const sortParam = `${prefix}sort[${i}][field]=${s.field}&sort[${i}][direction]=${s.direction}`;
			sort = sort + sortParam;
			i++;
		}
	}
	return sort;
};

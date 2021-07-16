/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { RequestHandler } from "@sveltejs/kit";
import dotenv from "dotenv";
import { AIRTABLE_API_HOST, makeFieldsParam, makeFilterParam } from "$lib/build-airtable-url";

dotenv.config();

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env; // must be destructured, else stripped by Vite

const apiUrl = `${AIRTABLE_API_HOST}${AIRTABLE_BASE_ID}/puskesmas`;
const queryFields = ["name", "address"];

// = = = = = = = =
// = = = = = = = =

export const get: RequestHandler = async ({ query }) => {
	const city = query.get("city");

	const url = city
		? `${apiUrl}?${makeFieldsParam(queryFields)}&${makeFilterParam(`city="${city}"`)}`
		: apiUrl;

	return fetch(url, {
		headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
	})
		.then((res) => res.json())
		.then((data) => {
			const clinics: IClinic[] =
				data.records?.map((item) => ({
					id: item.id,
					...item.fields,
				})) || [];
			return {
				body: { payload: clinics },
			};
		})
		.catch((err) => {
			console.log(err);
			return { status: err.status };
		});
	// return { status: 200, body: { payload: [{ name: "foo", address: "bar" }] } }; // leave for checking
};

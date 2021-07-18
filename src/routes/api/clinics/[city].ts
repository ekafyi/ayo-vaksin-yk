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

export const get: RequestHandler = async ({ params }) => {
	const { city } = params;
	if (!city) return { status: 404 };

	const url = `${apiUrl}?${makeFieldsParam(queryFields)}&${makeFilterParam(`city="${city}"`)}`;

	return fetch(url, {
		headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
	})
		.then((res) => res.json())
		.then((data) => ({ body: data }))
		.catch((err) => {
			console.log(err);
			return { status: err.status };
		});
	// return { status: 200, body: [{ name: "foo", address: "bar" }] }; // leave for checking
};

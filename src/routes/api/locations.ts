/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { RequestHandler } from "@sveltejs/kit";
import dotenv from "dotenv";
import { AIRTABLE_API_HOST, makeSortParam } from "$lib/build-airtable-url";

dotenv.config();

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env; // must be destructured, else stripped by Vite

const sortParams = makeSortParam([
	// {
	// 	field: "location_type", // enable to show Puskesmas first
	// 	direction: "desc",
	// },
	{
		field: "updated_at",
		direction: "desc",
	},
]);

const apiUrl = `${AIRTABLE_API_HOST}${AIRTABLE_BASE_ID}/locations${sortParams}`;

// = = = = = = = =
// = = = = = = = =

export const get: RequestHandler = async () => {
	return fetch(apiUrl, {
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

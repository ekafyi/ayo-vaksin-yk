/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { RequestHandler, EndpointOutput } from "@sveltejs/kit";
import dotenv from "dotenv";
import { transformLocationData } from "$lib/transform-pipedream-data";

dotenv.config();

const { PIPEDREAM_API_URL } = process.env; // must be destructured, else stripped by Vite

export const get: RequestHandler = async ({ params }) => {
	const { slug } = params;

	const url = `${PIPEDREAM_API_URL}?slug=${slug}`;
	const res = await fetch(url);
	if (res.ok) {
		const readRes = await res.json();
		if (readRes.payload)
			return {
				body: {
					payload: transformLocationData(readRes.payload)[0],
				},
			};
		return { status: 404 };
	}
	return { status: res.status };
};

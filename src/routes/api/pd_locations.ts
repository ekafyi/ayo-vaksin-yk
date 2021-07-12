/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// import type { RequestHandler, EndpointOutput } from "@sveltejs/kit";
import dotenv from "dotenv";
import { dev } from "$app/env";
import { transformLocationData } from "$lib/transform-pipedream-data";

dotenv.config();

const { PIPEDREAM_API_URL } = process.env; // must be destructured, else stripped by Vite

// LATER improve typing. Let untyped for now.
// see: https://stackoverflow.com/a/67840968

interface IMyOutput {
	status?: number;
	headers?: Partial<Headers>;
	body?: {
		payload: ILocationInList[];
	};
}

export const get = async (): Promise<IMyOutput> => {
	// FIXME ntar balikin
	if (dev)
		return {
			status: 200,
			body: { payload: [] },
		};

	const res = await fetch(PIPEDREAM_API_URL);
	if (res.ok) {
		const readRes = await res.json();
		return {
			status: 200,
			body: {
				payload: transformLocationData(readRes.payload),
			},
		};
	}
	return { status: res.status };
};

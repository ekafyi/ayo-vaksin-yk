/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import slugify from "slugify";
import { SLUGIFY_OPTIONS } from "$lib/slug";

export const getLocationData = (jsonData: { records: IAirtableRowLocation[] }, slug: string) => {
	if (!jsonData?.records || !jsonData?.records?.length) return null;
	const locationData = jsonData.records.filter(
		(row) => slugify(row.fields.name, SLUGIFY_OPTIONS) == slug
	);
	return locationData || null;
};

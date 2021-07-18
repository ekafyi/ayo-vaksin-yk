/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import slugify from "slugify";

export const SLUGIFY_OPTIONS = {
	lower: true,
	strict: true,
};

export const makeSlug = (name: string, type: string = null) => {
	const path = type && type.toLowerCase() == "puskesmas" ? "p" : "di";
	return `/${path}/${slugify(name, SLUGIFY_OPTIONS)}`;
};

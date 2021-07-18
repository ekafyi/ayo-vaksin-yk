/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SEMUA_DOMISILI_TAG_NAMES, AGE_GROUP_KEYS } from "$lib/constants";
import { makePhoneObject, makeWAObject } from "./format-phone";

export const getPhone = (phoneField: IAirtableLocation["scraped_phone"] = null) => {
	if (!phoneField) return undefined;
	if (typeof phoneField == "string") return makePhoneObject(phoneField);
	if (typeof phoneField == "object" && phoneField.length) return makePhoneObject(phoneField[0]); // if multiple relation rows, get the first one
};

export const getAddress = (addressField: IAirtableLocation["scraped_address"] = null) => {
	if (!addressField) return undefined;
	if (typeof addressField == "string") return addressField;
	if (typeof addressField == "object" && addressField.length) return addressField;
};

/**
 * Check for "KTP semua domisili tanpa syarat". (quick hack, tidy up later)
 */
export const getKtpAnyLocation = (
	req50: IAirtableLocation["requirement_50"],
	req18: IAirtableLocation["requirement_18"]
) => {
	return (
		(req18?.length && req18.includes(SEMUA_DOMISILI_TAG_NAMES[0])) ||
		(req50?.length && req50.includes(SEMUA_DOMISILI_TAG_NAMES[1]))
	);
};

export const getAgeGroups = (
	req50: IAirtableLocation["requirement_50"],
	req18: IAirtableLocation["requirement_18"],
	req12: IAirtableLocation["requirement_12"]
) => {
	const ageGroups: AgeGroupKey[] = [];
	[req50, req18, req12].forEach((requirement, i) => {
		if (requirement?.length) ageGroups.push(AGE_GROUP_KEYS[i]);
	});
	return ageGroups;
};

export const getRequirementsByAgeGroups = (
	req50: IAirtableLocation["requirement_50"],
	req18: IAirtableLocation["requirement_18"],
	req12: IAirtableLocation["requirement_12"]
) => {
	return {
		"50_UP": req50 || [],
		"18_TO_49": req18 || [],
		"12_TO_17": req12 || [],
	};
};

export const getCanRegister = (dateCloseField: IAirtableLocation["date_close"]) => {
	return !!(!dateCloseField || new Date() <= new Date(dateCloseField));
};

export const getRegisterLinks = (
	appAndroidField: string = null,
	appIosField: string = null,
	formField: string = null,
	phoneField: string = null,
	whatsappField: string = null
): ILocationFull["registerLinks"] => {
	const registerApp: ILocationFull["registerLinks"]["app"] = [];

	if (appAndroidField) registerApp.push({ url: appAndroidField, text: "Google Play (Android)" });
	if (appIosField) registerApp.push({ url: appIosField, text: "App Store (iOS)" });

	return {
		app: registerApp.length ? registerApp : undefined,
		form: formField || undefined,
		phone: phoneField ? makePhoneObject(phoneField) : undefined,
		whatsapp: whatsappField ? makeWAObject(whatsappField) : undefined,
	};
};

// = = = = = = = =
// = = = = = = = =

const transformAirtableFields = (item: IAirtableLocation) => {
	return {
		updatedAt: item.updated_at,
		name: item.name,
		city: item.city,
		gmapUrl: item.gmap_url || undefined,
		phone: getPhone(item.scraped_phone),
		address: getAddress(item.scraped_address),
		type: item.location_type ? item.location_type[0] : undefined,
		canRegister: getCanRegister(item.date_close),
		registrations: item.register_how_to || [],
		registerNote: item.register_note || undefined,
		registerLinks: getRegisterLinks(
			item.register_url_app_android,
			item.register_url_app_ios,
			item.register_url_form,
			item.register_num_phone,
			item.register_num_whatsapp
		),
		ageGroups: getAgeGroups(item.requirement_50, item.requirement_18, item.requirement_12),
		requirementsByAgeGroup: getRequirementsByAgeGroups(
			item.requirement_50,
			item.requirement_18,
			item.requirement_12
		),
		ktpAnyLocation: getKtpAnyLocation(item.requirement_50, item.requirement_18),
		requirementDetails: {
			ktp: item.requirement_ktp || undefined,
			work: item.requirement_work || undefined,
			note: item.requirement_note || undefined,
		},
		source: {
			url: item.source_url,
			publishDate: item.source_publish_date,
			note: item.source_note || null,
		},
		dailyQuota: item.daily_quota || undefined,
		days: item.days ? item.days.join(", ") : undefined,
		hours: item.hours || undefined,
	};
};

export default transformAirtableFields;

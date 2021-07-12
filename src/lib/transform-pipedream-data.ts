import { SEMUA_DOMISILI_TAG_NAME, AGE_GROUP_KEYS } from "$lib/constants";
import { makePhoneObject, makeWAObject } from "./format-phone";

export const transformLocationData = (items: IAirtableLocation[]): ILocationInList[] => {
	return items.map((item) => {
		// Process scraped place data.
		let phone;
		if (item.scraped_phone) {
			if (typeof item.scraped_phone == "string") phone = makePhoneObject(item.scraped_phone);
			if (typeof item.scraped_phone == "object" && item.scraped_phone.length)
				phone = makePhoneObject(item.scraped_phone[0]); // if multiple relation rows, get the first one
		}
		let address;
		if (item.scraped_address) {
			if (typeof item.scraped_address == "string") address = item.scraped_address;
			if (typeof item.scraped_address == "object" && item.scraped_address.length)
				address = item.scraped_address;
		}

		// Process app links.
		const registerApp: ILocationFull["registerLinks"]["app"] = [];
		if (item.register_url_app_android)
			registerApp.push({ url: item.register_url_app_android, text: "Google Play (Android)" });
		if (item.register_url_app_ios)
			registerApp.push({ url: item.register_url_app_ios, text: "App Store (iOS)" });

		// Process age groups.
		const ageGroups = [];
		[item.requirement_50, item.requirement_18, item.requirement_12].forEach((requirement, i) => {
			if (requirement?.length) ageGroups.push(AGE_GROUP_KEYS[i]);
		});

		// =======

		return {
			id: item.id,
			name: item.name,
			city: item.city,
			gmapUrl: item.gmap_url || undefined,
			phone,
			address,
			canRegister: !!(!item.date_close || new Date() <= new Date(item.date_close)),
			registrations: item.register_how_to || [],
			registerNote: item.register_note || undefined,
			registerLinks: {
				app: registerApp.length ? registerApp : undefined,
				form: item.register_url_form || undefined,
				phone: item.register_num_phone ? makePhoneObject(item.register_num_phone) : undefined,
				whatsapp: item.register_num_whatsapp ? makeWAObject(item.register_num_whatsapp) : undefined,
			},
			ageGroups,
			requirementsByAgeGroup: {
				"12_TO_17": item.requirement_12 || [],
				"18_TO_49": item.requirement_18 || [],
				"50_UP": item.requirement_50 || [],
			},
			// TODO (later) loop through all ages requirement
			ktpAnyLocation:
				item.requirement_18?.length && item.requirement_18.includes(SEMUA_DOMISILI_TAG_NAME),
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
	});
};

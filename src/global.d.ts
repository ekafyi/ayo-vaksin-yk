/// <reference types="@sveltejs/kit" />

/** Airtable data returned via pipedream API */
interface IAirtableLocation {
	city: string;
	created_at: string;
	date_end?: string;
	daily_quota?: number;
	days?: string[];
	gmap_url?: string;
	hours?: string;
	id: string;
	manufacturer?: string[];
	name: string;
	register_how_to?: string[];
	register_note?: string;
	register_num_phone?: string;
	register_num_whatsapp?: string;
	register_url_app_android?: string;
	register_url_app_ios?: string;
	register_url_form?: string;
	requirement_18?: string[];
	requirement_50?: string[];
	requirement_ktp?: string;
	requirement_note?: string;
	requirement_work?: string;
	scraped_address?: string | string[];
	scraped_phone?: string | string[];
	source_note?: string;
	source_publish_date?: string;
	source_url?: string;
	updated_at?: string;
}

// = = = =
// = = = =

type RegistrationOption = "Daftar di lokasi" | "Daftar online atau telepon";

type AgeGroupKey = "18_TO_49" | "50_UP";

interface IContactLink {
	url: string;
	text: string;
}

/** Full location object, used in single-location page */
interface ILocationFull {
	// meta
	id: string;
	createdAt: string;
	updatedAt: string;

	// basic location info
	name: string;
	city: string;
	province: string;
	gmapUrl?: string;
	phone?: IContactLink;
	address?: string;
	// website?: string; // belom bisa scrape

	// registration info
	canRegister: boolean;
	registrations: RegistrationOption[];
	registerNote?: string;
	registerLinks: {
		app?: IContactLink[];
		form?: string;
		phone?: IContactLink;
		whatsapp?: IContactLink;
	};

	// age & requirements
	ageGroups: AgeGroupKey[];
	requirementsByAgeGroup: {
		"18_TO_49": string[];
		"50_UP": string[];
	};
	ktpAnyLocation: boolean;
	requirementDetails: {
		ktp?: string;
		work?: string;
		note?: string;
	};

	// source info
	source: {
		url: string;
		publishDate: string | null;
		note: string | null;
	};

	// basic program info
	manufacturer?: string;
	dailyQuota?: number;
	days?: string;
	hours?: string;
	////
	// [propertyName: string]: any;
}

// prettier-ignore
type PropsInList = | "id" | "name" | "city" | "phone" | "ageGroups" | "requirementsByAgeGroup" | "ktpAnyLocation" | "canRegister" | "days";

type ILocationInList = Pick<ILocationFull, PropsInList>;

// = = = =
// = = = =

type LocFilterProp = "AGE" | "CITY" | "KTP_ANY_LOCATION";

interface ILocFilter {
	AGE: AgeGroupKey | null;
	CITY: string | null;
	KTP_ANY_LOCATION: boolean;

	// add as/when needed, eg. ↓
	// ONE_OFF_EVENT: boolean;
	// REGISTRATION
}

interface Window {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	instgrm?: any; // IG embed script loaded in EmbedInstagram component
}

interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[];
	readonly userChoice: Promise<{
		outcome: "accepted" | "dismissed";
		platform: string;
	}>;
	prompt(): Promise<void>;
}
declare global {
	interface WindowEventMap {
		beforeinstallprompt: BeforeInstallPromptEvent;
	}
}

export const HEADING_TEXT = {
	title: "Ayo Vaksin YK",
	subtitle: "Info vaksin COVID gratis wilayah DI Yogyakarta",
};

// Not imported as we add metadata in HTML shell. Leave for reference.
export const HEAD_META = {
	title: "Ayo Vaksin YK | Info vaksin COVID gratis DIY",
	subtitle: "Cari vaksin COVID dengan info pendaftaran, syarat domisili dan syarat lain di DI Yogyakarta", // prettier-ignore
	ogImageFilename: "icon-512x512.png",
};

export const PROVINCE_NAME = "DI Yogyakarta"; // hardcoded heheheh

export const SEMUA_DOMISILI_TAG_NAME = "18+ semua domisili";

export const OPTION_CITIES = ["Sleman", "Kota Yogyakarta", "Bantul"];

export const AGE_GROUP_KEYS: AgeGroupKey[] = ["50_UP", "18_TO_49", "12_TO_17"];

export const OPTION_AGES = [
	{ key: AGE_GROUP_KEYS[0], text: "50 ke atas" },
	{ key: AGE_GROUP_KEYS[1], text: "18 - 49" },
	{ key: AGE_GROUP_KEYS[2], text: "12 - 17" },
];

export const OPTION_REGISTRATIONS: RegistrationOption[] = [
	"Daftar di lokasi",
	"Daftar online atau telepon",
];

export const SLUGIFY_OPTIONS = {
	lower: true,
	strict: true,
};

export const INITIAL_LOC_FILTERS: ILocFilter = {
	AGE: null,
	CITY: null,
	KTP_ANY_LOCATION: false,
};

export const COPY_TEXT = {
	// copy text macem apa ini? 😅
	PWA_INSTALL_UI_DIALOG:
		"Situs ini siap diakses offline. Kamu juga bisa menginstall situs ini untuk akses cepat tapi tidak makan tempat.",
	// accept response
	PWA_ACTION_INSTALL: "Install",
	// close dialog (choose not to install PWA _or_ not supported)
	PWA_ACTION_CLOSE_DIALOG: "Tutup",
};

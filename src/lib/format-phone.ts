const COUNTRY_CODE = "62";

const trim = (phone: string): string => {
	return phone.replace(/\D/g, "");
};

const replaceLeadingZeroWithCountryCode = (phone: string): string => {
	if (phone.startsWith("0")) return phone.replace("0", COUNTRY_CODE);
	return phone;
};

export const makePhoneObject = (phone: string): IContactLink => {
	const cleanPhone = replaceLeadingZeroWithCountryCode(trim(phone));
	if (!cleanPhone) return null;
	return {
		url: `tel:${cleanPhone}`,
		text: phone,
	};
};

export const makeWAObject = (phone: string): IContactLink => {
	const cleanPhone = replaceLeadingZeroWithCountryCode(trim(phone));
	if (!cleanPhone) return null;
	return {
		url: `https://api.whatsapp.com/send?phone=${cleanPhone}`,
		text: phone,
	};
};

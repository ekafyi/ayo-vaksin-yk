import { writable } from "svelte/store";
import { browser } from "$app/env";

// Customize fallback initial data if no localStorage data.
const DEFAULT_USER_SETTINGS = { offlineNoticeDismissed: false };

// Get the value out of storage on load.
let initialData: IUserSettings = DEFAULT_USER_SETTINGS;
if (browser) {
	initialData = JSON.parse(localStorage.getItem("userSettings")) || DEFAULT_USER_SETTINGS;
}

export const userSettings = writable<IUserSettings>(initialData);

if (browser) {
	userSettings.subscribe((value) => (localStorage.userSettings = JSON.stringify(value)));
}

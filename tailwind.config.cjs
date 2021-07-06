const config = {
	mode: "jit",
	purge: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		// extend: {}
	},
	variants: {
		ringColor: ["focus-visible"],
		ringWidth: ["focus-visible"],
	},
	plugins: [],
};

module.exports = config;

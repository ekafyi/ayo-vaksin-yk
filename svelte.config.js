import preprocess from "svelte-preprocess";
import adapterStatic from "@sveltejs/adapter-static";

// define static paths manually 😭
// also see: https://reecemay.me/articles/tip_sveltekit_static_pages_with_prismic/
const prerenderPages = [
	"/di/hi-lab",
	"/di/poltekkes-kemenkes-yogyakarta",
	"/di/rs-bethesda-lempuyangwangi",
	"/di/rs-bethesda",
	"/di/rs-dkt-dr-soetarto",
	"/di/rs-happy-land",
	"/di/rs-ludira-husada-tama",
	"/di/rs-nur-hidayah",
	"/di/rs-panti-nugroho",
	"/di/rs-panti-rapih",
	"/di/rs-panti-rini",
	"/di/rs-pku-muhammadiyah-gamping",
	"/di/rs-pku-muhammadiyah-yogyakarta",
	"/di/rs-pratama",
	"/di/rs-sakina-idaman",
	"/di/rs-uad",
	"/di/rskia-pku-muhammadiyah-kotagede",
	"/di/rsup-dr-sardjito",
];
// const prerenderPages = [];

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		postcss: true,
	}),
	kit: {
		adapter: adapterStatic(),
		target: "#svelte",
		prerender: {
			crawl: true,
			enabled: true,
			force: false,
			pages: ["*", ...prerenderPages],
		},
	},
};

export default config;

// Workaround until SvelteKit uses Vite 2.3.8 (and it's confirmed to fix the Tailwind JIT problem)
const mode = process.env.NODE_ENV;
const dev = mode === "development";
process.env.TAILWIND_MODE = dev ? "watch" : "build";

import preprocess from "svelte-preprocess";
import adapterStatic from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		postcss: true,
	}),
	kit: {
		adapter: adapterStatic(),
		target: "#svelte",
	},
};

export default config;

// Workaround until SvelteKit uses Vite 2.3.8 (and it's confirmed to fix the Tailwind JIT problem)
const mode = process.env.NODE_ENV;
const dev = mode === "development";
process.env.TAILWIND_MODE = dev ? "watch" : "build";

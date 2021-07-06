<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";

	let storedPayload;

	export const load: Load = async ({ page, fetch, session, context }) => {
		if (storedPayload) return { props: { locations: storedPayload } }; // heheheh

		const res = await fetch(`/api/pd_locations`);
		if (res.ok) {
			const { payload } = await res.json();
			storedPayload = payload; // heheheh lagi
			return {
				props: { locations: payload },
			};
		}
		return {
			error: new Error(`${res.status || ""} Could not load locations data`),
		};
	};

	// ?? persist to store if on browser?
	// https://stackoverflow.com/questions/56488202/how-to-persist-svelte-store
</script>

<script lang="ts">
	import { createMachine } from "xstate";
	import { useMachine } from "@xstate/svelte";
	import { vaxMachineConfig, vaxMachineOptions, vaxModel } from "$lib/machines/vaxMachine";
	import { OPTION_CITIES, OPTION_AGES } from "$lib/constants";
	import { Header, Footer, LocationList } from "../components";

	export let locations: ILocationInList[];

	const vaxMachine = createMachine<typeof vaxModel>(vaxMachineConfig, {
		actions: vaxMachineOptions.actions,
		guards: vaxMachineOptions.guards,
		services: { fetchLocations: () => new Promise((resolve) => resolve(locations)) },
	});

	const { state, send } = useMachine(vaxMachine);

	const canReset = (activeFilters: ILocFilter) => {
		return !!(activeFilters.AGE || activeFilters.CITY || activeFilters.KTP_ANY_LOCATION);
	};

	let ageInput;
	let cityInput;

	const handleSelectAge = () => {
		send("APPLY_FILTER", { query: { AGE: ageInput } });
	};

	const handleSelectCity = () => {
		send("APPLY_FILTER", { query: { CITY: cityInput } });
	};

	const handleSelectTanpaSyarat = () => {
		send("APPLY_FILTER", {
			query: { KTP_ANY_LOCATION: !$state.context.activeFilters.KTP_ANY_LOCATION },
		});
	};

	// $: console.log("🍏", $state.value);
</script>

<Header />
<main class="cv-page-outer">
	<nav class="pb-4 sm:pt-4 border-b" aria-label="Filter lokasi">
		<div class="-mx-4 horizontal-media-scroller">
			<!-- svelte-ignore a11y-no-onchange -->
			<select
				aria-label="kota/kabupaten"
				class="cv-select"
				class:filter-btn--active={$state.context.activeFilters.CITY}
				bind:value={cityInput}
				on:change={handleSelectCity}
			>
				<option selected={$state.context.activeFilters.CITY == null} value={null}>
					Seluruh Kota/Kab
				</option>
				{#each OPTION_CITIES as opt}<option value={opt}>{opt}</option>{/each}
			</select>
			<!-- svelte-ignore a11y-no-onchange -->
			<select
				aria-label="kelompok usia"
				class="cv-select"
				class:filter-btn--active={$state.context.activeFilters.AGE}
				bind:value={ageInput}
				on:change={handleSelectAge}
			>
				<option selected={$state.context.activeFilters.AGE == null} value={null}>
					Seluruh Usia
				</option>
				{#each OPTION_AGES as opt}<option value={opt.key}>{opt.text}</option>{/each}
			</select>

			<!-- prettier-ignore -->
			<button class="filter-btn" class:filter-btn--active={$state.context.activeFilters.KTP_ANY_LOCATION} on:click={handleSelectTanpaSyarat}>
				Semua Domisili Tanpa Syarat
			</button>

			{#if canReset($state.context.activeFilters)}
				<button class="filter-btn filter-btn--reset" on:click={() => send("RESET")}>Reset</button>
			{/if}

			<div class="w-1" aria-hidden="true" />
		</div>
	</nav>

	<div class="my-2 -mx-4">
		{#if $state.context.locations.length}
			<LocationList locations={$state.context.locations} />
		{:else}
			<p class="text-gray-700 text-center text-sm px-4 py-16">
				{$state.value === "loading" ? "Memuat..." : "Data tidak ditemukan"}
			</p>
		{/if}
	</div>
</main>
<Footer />

<style lang="postcss">
	.filter-btn {
		@apply text-xs px-3 py-1 border rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500;
	}
	.filter-btn--active {
		@apply border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50;
	}
	.filter-btn--reset {
		@apply font-medium hover:bg-gray-50;
		border-color: transparent !important;
	}
	/* .filter-btn[disabled] {
		@apply text-gray-400 bg-gray-50 border-transparent cursor-not-allowed;
	} */
</style>

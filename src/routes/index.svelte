<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";
	import transformAirtableFields from "$lib/transform-airtable-fields";

	export const load: Load = async ({ fetch }) => {
		const res = await fetch(`/api/locations`);
		if (res.ok) {
			const data: { records: IAirtableRowLocation[] } = await res.json();
			const rows = data.records.map((row) => ({
				id: row.id,
				...transformAirtableFields(row.fields),
			}));
			return {
				props: { locations: rows },
			};
		}
		// Don't send res.text() client-side as it may contain external API URLs.
		return {
			// Returning any object with no error prop = rendering the HTML shell without props data (ie. location).
			status: res.status, // Default to 500 if not returned, but not seemed to be passed anywhere.
			// Returning object with "error" prop = rendering __error component from the closest dir level.
			error: new Error(`${res.statusText || "Gagal memuat data"}`),
		};
	};
</script>

<script lang="ts">
	import { browser } from "$app/env";
	import { createMachine } from "xstate";
	import { useMachine } from "@xstate/svelte";
	import { vaxMachineConfig, vaxMachineOptions, vaxModel } from "$lib/machines/vaxMachine";
	import { OPTION_CITIES, OPTION_AGES } from "$lib/constants";
	import { makeSlug } from "$lib/slug";
	import { userSettings } from "$lib/stores";
	import { LocationList } from "../components";
	import FilterButton from "../components/FilterButton.svelte";
	import { HEADING_TEXT } from "$lib/constants";

	export let locations: ILocationInList[] = [];

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

	// TODO (low priority) figure out where to run this
	// ?? should be in SW install event instead?
	if (browser && typeof window == "object") {
		let urls = ["/", ...locations.map((loc) => makeSlug(loc.name, loc.type))];
		window.caches
			.open("cv-routes")
			.then((cache) => cache.addAll(urls))
			.then(() => { $userSettings.hasPrefetched = true })
			.catch((err) => { console.error(err) }); // prettier-ignore
	}
	////
	// $: console.log("🍏", $state.value);
</script>

<svelte:head>
	<title>{HEADING_TEXT.title}</title>
</svelte:head>

<main class="cv-page-outer">
	<nav class="pb-4 sm:pt-4 border-b" aria-label="Filter lokasi">
		<div class="-mx-4 horizontal-media-scroller">
			<!-- svelte-ignore a11y-no-onchange -->
			<select
				aria-label="kota/kabupaten"
				class="cv-select"
				class:cv-select--active={$state.context.activeFilters.CITY}
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
				class:cv-select--active={$state.context.activeFilters.AGE}
				bind:value={ageInput}
				on:change={handleSelectAge}
			>
				<option selected={$state.context.activeFilters.AGE == null} value={null}>
					Seluruh Usia
				</option>
				{#each OPTION_AGES as opt}<option value={opt.key}>{opt.text}</option>{/each}
			</select>

			<FilterButton
				classActive={$state.context.activeFilters.KTP_ANY_LOCATION}
				on:click={handleSelectTanpaSyarat}
			>
				Semua Domisili Tanpa Syarat
			</FilterButton>

			{#if canReset($state.context.activeFilters)}
				<FilterButton classReset={true} on:click={() => send("RESET")}>Reset</FilterButton>
			{/if}

			<div class="w-1" aria-hidden="true" />
		</div>
	</nav>

	<div class="my-2 -mx-4">
		{#if browser}
			{#if $state.context.locations.length}
				<LocationList locations={$state.context.locations} />
			{:else}
				<div class:no-content--loading={$state.value === "loading"} class="no-content">
					<p class="text-gray-700 text-center text-sm p-4">
						{$state.value === "loading" ? "Memuat..." : "Tidak ditemukan."}
					</p>
				</div>
			{/if}
		{:else}
			<!-- server-rendered HTML fallback without xstate -->
			<LocationList {locations} />
			<!-- penasaran -->
			<!-- <Foo {locations} /> -->
		{/if}
	</div>
</main>

<style lang="postcss">
	main {
		min-height: calc(100vh - 19rem);
	}
	.no-content {
		@apply flex items-center justify-center;
		min-height: 50vh;
	}
	.no-content--loading {
		/* prevent CLS from footer */
		min-height: calc(100vh - 16rem);
	}
</style>

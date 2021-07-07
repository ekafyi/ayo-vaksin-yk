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
		// Don't send res.text() client-side as it may contain external API URLs.
		return {
			// Returning any object with no error prop = rendering the HTML shell without props data (ie. location).
			status: res.status, // Default to 500 if not returned, but not seemed to be passed anywhere.

			// Returning object with "error" prop = rendering adjacemt __error component.
			error: new Error(`${res.statusText || "Gagal memuat data"}`),
		};
	};
</script>

<script lang="ts">
	import { createMachine } from "xstate";
	import { useMachine } from "@xstate/svelte";
	import { vaxMachineConfig, vaxMachineOptions, vaxModel } from "$lib/machines/vaxMachine";
	import { OPTION_CITIES, OPTION_AGES } from "$lib/constants";
	import { LocationList } from "../components";
	import FilterButton from "../components/FilterButton.svelte";

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

	// $: console.log("🍏", $state.value);
</script>

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
		{#if $state.context.locations.length}
			<LocationList locations={$state.context.locations} />
		{:else}
			<p class="text-gray-700 text-center text-sm px-4 py-16">
				{$state.value === "loading" ? "Memuat..." : "Tidak ditemukan."}
			</p>
		{/if}
	</div>
</main>

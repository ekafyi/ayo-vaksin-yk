<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";
	import { browser } from "$app/env";

	export const router = browser;

	export const load: Load = async ({ page, fetch, session, context }) => {
		const slug = page.params.slug;

		let location;

		return fetch(`/api/pd_location_${slug}`)
			.then((res) => res.json())
			.then((locationData) => {
				location = locationData.payload;
				return locationData.payload.city;
			})
			.then((city) => fetch(`/api/pd_clinics?city=${city}`))
			.then((res) => res.json())
			.then((clinicsData) => ({
				props: {
					location,
					clinics: clinicsData.payload,
				},
			}))
			.catch((err) => {
				console.error(err);
				return {
					status: err.status,
					error: new Error("Gagal memuat data lokasi/puskesmas"),
				};
			});
	};
</script>

<script lang="ts">
	import { onMount } from "svelte";
	import {
		LocDetailSection,
		TagList,
		RequirementList,
		RegistrationList,
		PuskesmasList,
	} from "../../components";
	import { HEADING_TEXT } from "$lib/constants";

	export let location: ILocationFull;
	export let clinics: IClinic[];
</script>

<svelte:head>
	{#if location}<title>{location.name} — {HEADING_TEXT.title}</title>{/if}
	<!-- <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> -->
</svelte:head>

<main class="cv-page-outer">
	{#if location}
		<h1 class="cv-loc-page__title">{location.name}</h1>
		<div class="mb-2" aria-label="kelompok usia">
			<TagList requirements={location.requirementsByAgeGroup} />
		</div>

		{#if location.canRegister && Object.keys(location.requirementDetails).length}
			<LocDetailSection title="Syarat">
				<div class="cv-loc-page__list-container">
					<RequirementList data={location.requirementDetails} />
				</div>
			</LocDetailSection>
		{/if}

		{#if location.canRegister && location.registrations?.length}
			<LocDetailSection title="Pendaftaran">
				<div class="cv-loc-page__list-container">
					<RegistrationList
						registrations={location.registrations}
						registerLinks={location.registerLinks}
						registerNote={location.registerNote}
					/>
				</div>
			</LocDetailSection>
		{/if}

		{#if clinics}
			<LocDetailSection title="Daftar Puskesmas">
				<PuskesmasList {clinics} />
			</LocDetailSection>
		{/if}
	{/if}
</main>

<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";
	import { browser } from "$app/env";
	import transformAirtableFields from "$lib/transform-airtable-fields";
	import { getLocationData } from "$lib/get-row-from-all-locations";

	export const router = browser;

	export const load: Load = async ({ page, fetch }) => {
		const slug = page.params.slug;

		let location;

		return fetch(`/api/locations`)
			.then((res) => res.json())
			.then((allLocationsData) => {
				const locationData = getLocationData(allLocationsData, slug);
				if (!locationData) return { status: 404 };

				location = {
					id: locationData[0].id,
					...transformAirtableFields(locationData[0].fields),
				};
				return location.city;
			})
			.then((city) => fetch(`/api/clinics/${city}`))
			.then((res) => res.json())
			.then((clinicsData) => {
				const clinics: IClinic[] =
					clinicsData.records?.map((item) => ({
						id: item.id,
						...item.fields,
					})) || [];
				return {
					props: {
						location,
						clinics,
					},
				};
			})
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
	import {
		LocDetailSection,
		PuskesmasList,
		RegistrationList,
		RequirementList,
		TagList,
		UpdatedAtText,
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
		{#if location.updatedAt}
			<UpdatedAtText utcDateString={location.updatedAt} spacingCss="-mt-2 mb-4" />
		{/if}
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

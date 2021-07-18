<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";
	import { browser } from "$app/env";
	import transformAirtableFields from "$lib/transform-airtable-fields";
	import { getLocationData } from "$lib/get-row-from-all-locations";

	export const router = browser;

	export const load: Load = async ({ page, fetch }) => {
		const slug = page.params.slug;

		const res = await fetch(`/api/locations`);

		if (res.ok) {
			const data: { records: IAirtableRowLocation[] } = await res.json();

			const locationData = getLocationData(data, slug);
			if (!locationData) return { status: 404 };

			return {
				props: {
					location: {
						id: locationData[0].id,
						...transformAirtableFields(locationData[0].fields),
					},
				},
			};
		}
		return {
			status: res.status,
			error: new Error("Gagal memuat data lokasi"),
		};
	};
</script>

<script lang="ts">
	import { onMount } from "svelte";
	import {
		EmbedInstagram,
		ListItemWithCta,
		LocDetailSection,
		RegistrationList,
		RequirementList,
		TagList,
		UpdatedAtText,
	} from "../../components";
	import { PROVINCE_NAME, HEADING_TEXT } from "$lib/constants";

	export let location: ILocationFull;
	// console.log("location ", location);

	let shouldShowEmbedIg = false;
	let shouldShowEmbedTwitter = false;

	onMount(() => {
		setTimeout(() => {
			shouldShowEmbedIg = true;
			shouldShowEmbedTwitter = true;
		}, 100);
	});
</script>

<svelte:head>
	{#if location}<title>{location.name} — {HEADING_TEXT.title}</title>{/if}
	<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</svelte:head>

<main class="cv-page-outer">
	{#if location}
		<h1 class="cv-loc-page__title">
			{`${location.name} ${location.canRegister ? "" : " ⛔️"}`}
		</h1>
		{#if location.updatedAt}
			<UpdatedAtText utcDateString={location.updatedAt} spacingCss="-mt-2 mb-4" />
		{/if}
		<div class="mb-2" aria-label="kelompok usia">
			<TagList requirements={location.requirementsByAgeGroup} />
		</div>

		{#if !location.canRegister}
			<div
				class="relative px-4 py-3 mt-6 mb-2 text-red-700 bg-red-50 rounded text-sm border-l-4 border-red-500"
				role="alert"
			>
				<p class="ml-1">⚠️&nbsp; {location.registerNote || "Pendaftaran ditutup"}</p>
			</div>
		{/if}

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

		{#if location.canRegister && (location.days || location.hours || location.dailyQuota)}
			<LocDetailSection title="Jadwal">
				<dl class="cv-list-no-cta text-sm">
					{#if location.days}
						<dt aria-label="hari">🗓</dt>
						<dd>{`Setiap hari ${location.days}`}</dd>
					{/if}
					{#if location.hours}
						<dt aria-label="jam">🕐</dt>
						<dd>{`Pukul ${location.hours}`}</dd>
					{/if}
					{#if location.dailyQuota}
						<dt aria-label="kuota">👥</dt>
						<dd>{`Kuota ${location.dailyQuota} orang/hari`}</dd>
					{/if}
				</dl>
			</LocDetailSection>
		{/if}

		{#if location.gmapUrl || location.address || location.phone}
			<LocDetailSection title="Alamat & Kontak">
				<div class="cv-loc-page__list-container">
					{#if location.gmapUrl || location.address}
						<ListItemWithCta
							aria-label="alamat"
							text={location.address || `${location.city}, ${PROVINCE_NAME}`}
							cta={{ href: location.gmapUrl, text: "Maps" }}
						>
							<!-- prettier-ignore -->
							<svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						</ListItemWithCta>
					{/if}
					{#if location.phone}
						<ListItemWithCta
							aria-label="telepon"
							text={location.phone.text}
							cta={{ href: location.phone.url, text: "Panggil" }}
						>
							<!-- prettier-ignore -->
							<svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
							<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
						</svg>
						</ListItemWithCta>
					{/if}
				</div>
			</LocDetailSection>
		{/if}

		{#if location.source?.url}
			<section class="py-4" aria-label="sumber">
				<p class="text-xs text-gray-700">
					Sumber: <a class="cv-inline-link" href={location.source.url} rel="external">
						{location.source.url.replace("https://", "")}
					</a>
				</p>
				{#if location.source?.note}
					<p class="text-xs text-gray-700 leading-normal mt-2 px-4 pb-4">{location.source.note}</p>
				{/if}
				{#if shouldShowEmbedIg && location.source?.url.includes("instagram.com/p/")}
					<div class="-mx-4 sm:mx-0 mt-4">
						<EmbedInstagram url={location.source.url} />
					</div>
				{:else if shouldShowEmbedTwitter && location.source?.url.includes("twitter.com/")}
					<div class="tweet-container pt-2 text-white flex justify-center">
						<blockquote class="twitter-tweet" data-conversation="none">
							<a href={location.source.url}>2021</a>
						</blockquote>
					</div>
				{/if}
			</section>
		{/if}
	{:else}
		<div role="alert" class="text-center py-16">
			<strong class="cv-misc-page__title">404</strong>
			<img
				class="mx-auto my-6"
				loading="lazy"
				width="426"
				height="213"
				src="/not-found.gif"
				alt="adegan film, tokoh yang diperankan John Travolta melihat sekeliling dengan bingung"
			/>
			Lokasi tidak ditemukan.<br />Kembali ke <a class="cv-inline-link" href="/">halaman awal</a>.
		</div>
	{/if}
</main>

<style lang="postcss">
	.tweet-container {
		min-height: 13rem;
	}
</style>

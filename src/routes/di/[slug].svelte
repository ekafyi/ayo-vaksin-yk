<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";

	let storedSinglePayload = {};

	export const load: Load = async ({ page, fetch, session, context }) => {
		const slug = page.params.slug;

		if (storedSinglePayload[slug]) return { props: { location: storedSinglePayload[slug] } }; // heheheh

		const res = await fetch(`/api/pd_location_${slug}`);
		if (res.ok) {
			const { payload } = await res.json();
			if (payload) storedSinglePayload[slug] = payload; // heheheh lagi
			return {
				props: { location: payload },
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
	import { TagList } from "../../components";
	import EmbedInstagram from "../../components/EmbedInstagram.svelte";
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
		<h1 class="font-semibold text-2xl sm:text-3xl leading-tight mb-4">
			{`${location.name} ${location.canRegister ? "" : " ⛔️"}`}
		</h1>
		<div>
			<TagList requirements={location.requirementsByAgeGroup} />
		</div>

		{#if !location.canRegister}
			<div
				class="relative px-4 py-3 mt-4 text-red-700 bg-red-50 rounded text-sm border-l-4 border-red-500"
				role="alert"
			>
				<p class="ml-1">⚠️&nbsp; {location.registerNote || "Pendaftaran ditutup"}</p>
			</div>
		{/if}

		<div class="my-2 -mx-4">
			{#if location.canRegister && Object.keys(location.requirementDetails).length}
				<section class="top-section" aria-labelledby="alabel-syarat">
					<h2 id="alabel-syarat">Syarat</h2>
					<div class="grid gap-3 text-sm">
						{#if location.requirementDetails.ktp}
							<p class="requirement-item" aria-labelledby="alabel-domisili">
								<strong id="alabel-domisili" class="requirement-item__title">Domisili</strong>
								{location.requirementDetails.ktp}
							</p>
						{/if}
						{#if location.requirementDetails.work}
							<p class="requirement-item" aria-labelledby="alabel-kerja">
								<strong id="alabel-kerja" class="requirement-item__title">Pekerjaan/Usaha</strong>
								{location.requirementDetails.work}
							</p>
						{/if}
						{#if location.requirementDetails.note}
							<p class="requirement-item">
								<strong class="requirement-item__title hide-if-only">Lainnya</strong>
								{location.requirementDetails.note}
							</p>
						{/if}
					</div>
				</section>
			{/if}

			{#if location.canRegister && location.registrations?.length}
				<section class="top-section" aria-labelledby="alabel-pendaftaran">
					<h2 id="alabel-pendaftaran">Pendaftaran</h2>
					<div class="grid gap-3 text-sm">
						{#if location.registrations.includes("Daftar di lokasi")}
							<p>{location.registrations.join(", ")}</p>
						{/if}
						{#if location.registerLinks.app}
							<section class="list-no-cta" aria-label="aplikasi">
								<span>📱</span>
								<p>
									Daftar melalui aplikasi. Unduh di
									{#each location.registerLinks.app as appLink, i}
										<a class="cv-inline-link" href={appLink.url}>{appLink.text}</a
										>{#if i < 1 && location.registerLinks.app.length > 1}&nbsp;/&nbsp;{/if}
									{/each}
								</p>
							</section>
						{/if}
						{#if location.registerLinks.form}
							<section class="list-with-cta" aria-label="formulir">
								<span>📱</span>
								<p>{location.registerLinks.form.replace("https://", "").replace("http://", "")}</p>
								<a class="list__item-cta" href={location.registerLinks.form}>Buka</a>
							</section>
						{/if}
						{#if location.registerLinks.phone}
							<section class="list-with-cta" aria-label="telepon">
								<span>📞</span>
								<p>{location.registerLinks.phone.text}</p>
								<a class="list__item-cta" href={location.registerLinks.phone.url}>Panggil</a>
							</section>
						{/if}
						{#if location.registerLinks.whatsapp}
							<section class="list-with-cta" aria-label="whatsapp">
								<span class="pt-0.5">
									<!-- prettier-ignore -->
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 58 58">
										<path style="fill:#2CB742;" d="M0,58l4.988-14.963C2.457,38.78,1,33.812,1,28.5C1,12.76,13.76,0,29.5,0S58,12.76,58,28.5
											S45.24,57,29.5,57c-4.789,0-9.299-1.187-13.26-3.273L0,58z"/>
										<path style="fill:#FFFFFF;" d="M47.683,37.985c-1.316-2.487-6.169-5.331-6.169-5.331c-1.098-0.626-2.423-0.696-3.049,0.42
											c0,0-1.577,1.891-1.978,2.163c-1.832,1.241-3.529,1.193-5.242-0.52l-3.981-3.981l-3.981-3.981c-1.713-1.713-1.761-3.41-0.52-5.242
											c0.272-0.401,2.163-1.978,2.163-1.978c1.116-0.627,1.046-1.951,0.42-3.049c0,0-2.844-4.853-5.331-6.169
											c-1.058-0.56-2.357-0.364-3.203,0.482l-1.758,1.758c-5.577,5.577-2.831,11.873,2.746,17.45l5.097,5.097l5.097,5.097
											c5.577,5.577,11.873,8.323,17.45,2.746l1.758-1.758C48.048,40.341,48.243,39.042,47.683,37.985z"/>
									</svg>
								</span>
								<!-- <span>{`WA ${location.registerLinks.whatsapp.text}`}</span> -->
								<span>{location.registerLinks.whatsapp.text}</span>
								<a class="list__item-cta" href={location.registerLinks.whatsapp.url}>Kirim</a>
							</section>
						{/if}
						{#if location.registerNote}
							<div class="text-gray-700 text-xs whitespace-pre-line mt-1">
								{location.registerNote}
							</div>
						{/if}
					</div>
				</section>
			{/if}

			{#if location.canRegister && (location.days || location.hours || location.dailyQuota)}
				<section class="top-section" aria-labelledby="alabel-jadwal">
					<h2 id="alabel-jadwal">Jadwal</h2>
					<dl class="list-no-cta">
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
				</section>
			{/if}

			{#if location.gmapUrl || location.address || location.phone}
				<section class="top-section" aria-labelledby="alabel-alamat">
					<h2 id="alabel-alamat">Alamat &amp; Kontak</h2>
					{#if location.gmapUrl || location.address}
						<section class="list-with-cta py-2" aria-label="alamat">
							<span>
								<!-- prettier-ignore -->
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
								 </svg>
							</span>
							<span>
								{location.address || `${location.city}, ${PROVINCE_NAME}`}
							</span>
							<a class="list__item-cta" href={location.gmapUrl} rel="external">Maps</a>
						</section>
					{/if}
					{#if location.phone}
						<section class="list-with-cta py-2" aria-label="telepon">
							<!-- prettier-ignore -->
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
								<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
							</svg>
							<span>{location.phone.text}</span>
							<a class="list__item-cta" href={location.phone.url} rel="external">Panggil</a>
						</section>
					{/if}
				</section>
			{/if}

			{#if location.source?.url}
				<section class="p-4" aria-label="sumber">
					<p class="text-xs text-gray-600">
						Sumber: <a class="cv-inline-link" href={location.source.url} rel="external">
							{location.source.url.replace("https://", "")}
						</a>
					</p>
					{#if shouldShowEmbedIg && location.source?.url.includes("instagram.com/p/")}
						<div class="-mx-4 sm:mx-0 mt-4">
							<EmbedInstagram url={location.source.url} />
						</div>
					{:else if shouldShowEmbedTwitter && location.source?.url.includes("twitter.com/")}
						<div class="pt-2 text-white flex justify-center">
							<blockquote class="twitter-tweet" data-conversation="none">
								<a href={location.source.url}>2021</a>
							</blockquote>
						</div>
					{/if}
					{#if location.source?.note}
						<p class="text-xs text-gray-600 mt-2">{location.source.note}</p>
					{/if}
				</section>
			{/if}
		</div>
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
	.top-section {
		@apply p-4 border-b;
	}
	.top-section h2 {
		@apply font-semibold sm:text-lg mb-2;
	}
	.requirement-item {
		@apply whitespace-pre-line;
	}
	.requirement-item__title {
		@apply text-indigo-600 font-semibold;
	}
	.requirement-item__title::after {
		content: " · ";
	}
	.requirement-item:only-child .requirement-item__title.hide-if-only {
		@apply sr-only;
	}
	.list-no-cta {
		@apply grid gap-x-2 gap-y-3 text-sm;
		grid-template-columns: 1rem 1fr;
	}
	.list-with-cta {
		@apply grid gap-x-2 gap-y-2 text-sm relative items-start;
		grid-template-columns: 1rem 1fr auto;
	}
	.list-with-cta > *:nth-child(3) {
		margin-left: 0.25rem;
	}
	.list__item-cta {
		@apply -mt-px py-0.5 px-2 text-center text-indigo-700 border border-indigo-700 hover:bg-indigo-700 focus:bg-indigo-700 hover:text-white focus:text-white rounded text-xs font-medium w-16;
	}
	.list__item-cta::after {
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
</style>

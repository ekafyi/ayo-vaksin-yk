<script lang="ts">
	import { makeSlug } from "$lib/slug";
	import TagList from "./TagList.svelte";
	import UpdatedAtText from "./UpdatedAtText.svelte";

	export let locations: ILocationInList[] = [];

	// = = = = =

	// Re-enable if needed + does not break SW caching

	// import { onMount } from "svelte";
	// import { prefetch } from "$app/navigation";
	// import { userSettings } from "$lib/stores";

	// Running prefetch outside onMount/without timeout fails due to this issue: https://github.com/sveltejs/kit/issues/1605
	// prefetchRoutes does not work(?).
	// onMount(() => {
	// 	let urls = ["/", ...locations.map((loc) => makeSlug(loc.name, loc.type))];
	// 	setTimeout(() => {
	// 		Promise.all(urls.map((url) => prefetch(url)))
	// 			.then((responses) => {
	// 				console.log("prefetched???", responses);
	// 				$userSettings.hasPrefetched = true;
	// 			})
	// 			.catch((err) => { console.error(err) }); // prettier-ignore
	// 	}, 200);
	// });
</script>

{#each locations as loc}
	<article
		class="p-4 relative hover:bg-gray-50 focus-within:bg-gray-50"
		aria-labelledby={`alabel-${loc.id}`}
	>
		<a
			href={makeSlug(loc.name, loc.type)}
			class={`location__name ${loc.type ? `location__name--${loc.type.toLowerCase()}` : ""}`}
			id={`alabel-${loc.id}`}
			sveltekit:prefetch
		>
			{`${loc.name} ${loc.canRegister ? "" : " ⛔️"}`}
		</a>

		<dl class="flex w-full mb-1 location__desc">
			<dt class="sr-only">kota / kabupaten</dt>
			<dd>{loc.city}</dd>
			{#if loc.phone}
				<span class="mx-1" aria-hidden="true">&middot;</span>
				<dt class="sr-only">telepon</dt>
				<dd>{loc.phone.text}</dd>
			{/if}
		</dl>

		<div class="location__tag-list">
			<TagList requirements={loc.requirementsByAgeGroup} />
		</div>

		{#if loc.updatedAt}<UpdatedAtText utcDateString={loc.updatedAt} spacingCss="mt-2" />{/if}
	</article>
{/each}

<style lang="postcss">
	.location__name {
		@apply font-bold pb-1 text-base;
	}
	.location__name::after {
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
	.location__name--puskesmas::before {
		content: "📁";
		margin-right: 0.5em;
	}
	.location__desc {
		@apply text-sm text-gray-600;
	}
	article {
		display: grid;
	}
	@media screen and (min-width: 640px) {
		article {
			@apply gap-x-2;
			grid-template-columns: 2fr 2fr;
			grid-template-rows: auto 1fr;
		}
		.location__tag-list {
			grid-column: 2;
			grid-row: 1/3;
			text-align: right;
		}
	}
</style>

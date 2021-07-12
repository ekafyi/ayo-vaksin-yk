<script lang="ts">
	import slugify from "slugify";
	import { SLUGIFY_OPTIONS } from "$lib/constants";
	import TagList from "./TagList.svelte";

	export let locations: ILocationInList[] = [];

	// $: console.log("loc length?", locations);
</script>

{#each locations as loc}
	<article
		class="p-4 relative hover:bg-gray-50 focus-within:bg-gray-50"
		aria-labelledby={`alabel-${loc.id}`}
	>
		<a
			id={`alabel-${loc.id}`}
			class={`location__name ${loc.type ? `location__name--${loc.type.toLowerCase()}` : ""}`}
			href={`/di/${slugify(loc.name, SLUGIFY_OPTIONS)}`}
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

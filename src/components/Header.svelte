<script lang="ts">
	import { HEADING_TEXT } from "$lib/constants";

	export let mode: "FULL" | "COMPACT" = "FULL";
</script>

{#if mode == "FULL"}
	<header class="cv-page-outer mt-8 mb-4">
		<!-- <nav class="flex justify-between">
		<div><a href="/tentang">tentang</a> / <a href="/tentang">tautan</a></div>
		<button>dark</button>
	</nav> -->
		<h1 class="font-bold text-4xl md:text-5xl">
			<a class="text-indigo-600" href="/">{HEADING_TEXT.title}</a>
			<small class="block mt-2 font-medium text-lg sm:text-xl leading-tight text-gray-500">
				{HEADING_TEXT.subtitle}
			</small>
		</h1>
	</header>
{:else if mode == "COMPACT"}
	<header class="cv-page-outer mt-4 sm:mt-6 mb-2">
		<a
			class="text-sm text-indigo-600 font-semibold border-b hover:border-gray-400"
			href="/"
			aria-label={`Beranda - ${HEADING_TEXT.title}`}
		>
			&larr; {HEADING_TEXT.title}
		</a>
	</header>
{/if}

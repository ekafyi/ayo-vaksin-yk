<script lang="ts">
	import { onMount } from "svelte";
	export let url = "";

	let hasInstagram = false;

	onMount(() => {
		if (url.includes("instagram.com/p/")) {
			// source: https://gist.github.com/whoisryosuke/ce4cb2605c41b55efcd7dbb467b62a32
			if (typeof window.instgrm == "object" || document.getElementById("custom-ig-embed-script")) {
				if (hasInstagram == false) {
					window.instgrm.Embeds.process();
				}
			} else {
				// Create script element with Instagram embed JS lib
				const s = document.createElement("script");
				s.async = s.defer = true;
				s.src = "//www.instagram.com/embed.js";
				s.id = "custom-ig-embed-script";
				const body: HTMLElement | null = document.body;
				if (body) {
					body.appendChild(s);
				}

				// Run Instagram function to show embeds
				if (typeof window.instgrm == "object" && hasInstagram == false) {
					window.instgrm.Embeds.process();
				}

				// Set IG state to true so the process doesn't run again
				hasInstagram = true;
			}
		}
	});
</script>

{#if url.includes("instagram.com/p/")}
	<blockquote
		class="instagram-media"
		data-instgrm-permalink={url}
		data-instgrm-version="13"
		data-instgrm-captioned
	/>
{/if}

<style lang="postcss">
	:global(.instagram-media) {
		@apply max-w-lg w-full;
		margin-left: auto !important;
		margin-right: auto !important;
	}
</style>

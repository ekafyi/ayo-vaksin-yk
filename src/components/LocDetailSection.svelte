<script lang="ts">
	import slugify from "slugify";
	import { SLUGIFY_OPTIONS } from "$lib/constants";

	export let title: string;

	const ariaLabelName = slugify(title, SLUGIFY_OPTIONS);
</script>

<section class="loc-detail-section" aria-labelledby={ariaLabelName}>
	<h2 class="loc-detail-section__h" id={ariaLabelName}>{title}</h2>
	<slot />
</section>

<style lang="postcss">
	.loc-detail-section {
		@apply py-4 border-b;
	}
	.loc-detail-section__h {
		@apply font-semibold sm:text-lg mb-2;
	}
</style>

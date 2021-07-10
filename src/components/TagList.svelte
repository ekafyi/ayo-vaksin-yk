<script lang="ts">
	import { SEMUA_DOMISILI_TAG_NAME } from "$lib/constants";

	export let requirements: ILocationFull["requirementsByAgeGroup"];
</script>

{#each requirements["12_TO_17"] as requirement}
	<span class="tag tag--default">{requirement}</span>
{/each}
{#each requirements["18_TO_49"] as requirement}
	<!-- prettier-ignore -->
	<span class={`tag ${ requirement == SEMUA_DOMISILI_TAG_NAME ? "tag--green capitalize" : "tag--default" }`}>{requirement}</span>
{/each}
{#each requirements["50_UP"] as requirement}
	<span class="tag tag--default">{requirement}</span>
{/each}

<style lang="postcss">
	.tag {
		@apply text-xs font-medium inline-block py-1 px-2 leading-none rounded whitespace-pre-wrap mr-1;
	}
	.tag--default {
		@apply text-gray-500 bg-gray-100;
	}
	.tag--green {
		@apply text-green-900 bg-green-100;
	}
	/* .tag--blue {
		@apply text-blue-900 bg-blue-100;
	}
	.tag--yellow {
		@apply bg-yellow-100;
	} */
	.tag:first-child {
		margin-bottom: 0.125rem;
	}
</style>

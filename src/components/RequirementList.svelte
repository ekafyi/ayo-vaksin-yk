<script lang="ts">
	export let data: ILocationFull["requirementDetails"];
</script>

{#if data.ktp}
	<p class="requirement-item" aria-labelledby="alabel-domisili">
		<strong id="alabel-domisili" class="requirement-item__title">Domisili</strong>
		<span>{data.ktp}</span>
	</p>
{/if}
{#if data.work}
	<p class="requirement-item" aria-labelledby="alabel-kerja">
		<strong id="alabel-kerja" class="requirement-item__title">Pekerjaan/Usaha</strong>
		<span>{data.work}</span>
	</p>
{/if}
{#if data.note}
	<p class="requirement-item">
		<strong class="requirement-item__title hide-if-only">Lainnya</strong>
		<span>{data.note}</span>
	</p>
{/if}

<style lang="postcss">
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
</style>

<script>
	export let classActive = false;
	export let classReset = false;
</script>

<button
	on:click
	type="button"
	class="filter-btn"
	class:filter-btn--reset={classReset}
	class:filter-btn--active={classActive}
	{...$$restProps}
>
	<slot />
</button>

<style lang="postcss">
	.filter-btn {
		@apply text-sm px-3 py-1 border rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-100;
	}
	.filter-btn--active {
		@apply border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50;
	}
	.filter-btn--reset {
		@apply font-medium hover:bg-gray-50;
		border-color: transparent !important;
	}
	.filter-btn[disabled] {
		@apply text-gray-400 bg-gray-50 border-transparent cursor-not-allowed;
	}
</style>

<script lang="ts">
	import { formatSimpleDate, formatTime } from "$lib/format-datetime";

	export let utcDateString: string;
	export let spacingCss = "";
</script>

<p class={`updated-text ${spacingCss}`}>
	{`Diperbarui ${formatSimpleDate(utcDateString)} ${formatTime(utcDateString)}`}
</p>

<style lang="postcss">
	.updated-text {
		@apply text-xs italic font-semibold text-indigo-800;
	}
</style>

<script lang="ts">
	import { formatSimpleDate, formatTime } from "$lib/format-datetime";

	export let utcDateString: string;
	export let spacingCss = "";
</script>

<!-- FIXME return time in EN format, date in ID format -->
<!-- formatTime(utcDateString) -->
<p class={`updated-text ${spacingCss}`}>
	{`Diperbarui ${formatSimpleDate(utcDateString)}`}
</p>

<style lang="postcss">
	.updated-text {
		@apply text-xs italic font-semibold text-indigo-800;
	}
</style>

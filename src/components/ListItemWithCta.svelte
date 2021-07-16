<script lang="ts">
	export let text: string;
	export let cta: {
		href: string;
		text: string;
	};
</script>

<section class="list-item text-sm" {...$$restProps}>
	<slot name="icon" />
	<div>{text}</div>
	<a class="list-item__cta cv-mini-btn" rel="external" href={cta.href}>{cta.text}</a>
</section>

<style lang="postcss">
	.list-item {
		@apply grid gap-x-2 gap-y-2 text-sm relative items-start;
		grid-template-columns: 1rem 1fr auto;
	}
	.list-item > *:nth-child(3) {
		margin-left: 0.25rem;
	}
	.list-item__cta {
		@apply -mt-px w-16;
	}
	.list-item__cta::after {
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
</style>

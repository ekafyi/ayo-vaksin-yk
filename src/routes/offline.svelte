<script context="module">
	import { browser, dev } from "$app/env";

	export const hydrate = dev;
	export const router = browser;
	export const prerender = true;
</script>

<script lang="ts">
	import { Header, Footer } from "../components";
</script>

<Header mode="COMPACT" />
<main class="cv-page-outer">
	<div class="text-center py-16">
		<h1 class="cv-misc-page__title">offline</h1>
		<img class="mx-auto my-6" loading="lazy" src="/wash-hands.png" alt="ilustrasi cuci tangan" />
		<p class="pt-2">Koneksi internet hilang. Silakan coba lagi saat sudah terhubung.</p>
		<p class="pt-4 text-sm">Hubungi hotline 119 untuk kondisi darurat.</p>
	</div>
</main>
<Footer />

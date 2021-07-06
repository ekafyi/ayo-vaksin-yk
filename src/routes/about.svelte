<script context="module">
	import { browser, dev } from "$app/env";

	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	export const hydrate = dev;

	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	export const router = browser;

	// since there's no dynamic data here, we can prerender
	// it so that it gets served as a static asset in prod
	export const prerender = true;
</script>

<script lang="ts">
	import { Header, Footer } from "../components";
	import { HEADING_TEXT } from "$lib/constants";
</script>

<svelte:head>
	<!-- FIXME ?? y u no work on server-rendered -->
	<title>Tentang — {HEADING_TEXT.title}</title>
</svelte:head>

<Header mode="COMPACT" />
<main class="cv-page-outer">
	<h1 class="cv-misc-page__title">Tentang</h1>
	<div class="grid gap-y-3">
		<p>
			<strong>ayo-vaksin-yk</strong> bertujuan mempermudah masyarakat di wilayah Daerah Istimewa Yogyakarta
			untuk mencari lokasi vaksinasi COVID dan melakukan tindak lanjut seperti mendaftar atau menghubungi
			faskes penyelenggara.
		</p>
		<p>
			Situs ini merupakan prakarsa pribadi, tidak terafiliasi dengan lembaga atau kelompok mana pun.
		</p>
		<p>
			Seluruh vaksin di situs ini <em>gratis</em>. Jika diminta membayar atau mengirim data pribadi
			oleh akun/nomor selain yang tertera di sini, harap konfirmasi ke kontak resmi faskes terkait.
		</p>
		<p>
			✉️&nbsp; Koreksi atau tambahan data: <strong class="text-indigo-600"
				>ayovaksinyk@eka.fyi</strong
			>
		</p>
	</div>
</main>
<Footer />

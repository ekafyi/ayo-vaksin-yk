<script context="module">
	export function load({ error, status }) {
		console.log("⚠️ error status:", status);
		return {
			props: {
				message: error.message,
			},
		};
	}
</script>

<script lang="ts">
	export let message = "Terjadi kesalahan";
</script>

<main class="cv-page-outer">
	<div role="alert" class="text-gray-700 text-center text-sm px-4 py-32">
		<p>{message}</p>
		<p class="mt-4">
			Coba <button on:click={() => window.location.reload()} class="cv-inline-link"
				>muat ulang halaman</button
			> atau tunggu beberapa saat
		</p>
	</div>
</main>

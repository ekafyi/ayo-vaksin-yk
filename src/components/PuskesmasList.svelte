<script>
	export let clinics = [
		{ name: "PUSKESMAS DANUREJAN I", address: "Jl. Bausasran, Kec. Danurejan" },
		{ name: "PUSKESMAS DANUREJAN II", address: "Jl. Krasak Timur 34, Kec. Danurejan" },
		{ name: "PUSKESMAS GEDONG TENGEN", address: "Jl. Pringgokusuman 30, Kec. Gedong Tengen" },
		{ name: "PUSKESMAS GONDO KUSUMAN I", address: "Jl. Tunjung Baciro, Kec. Gondokusuman" },
		{
			name: "PUSKESMAS GONDO KUSUMAN II",
			address: "Jl. Prof.Dr.Sardjito No.22, Kec. Gondokusuman",
		},
		{ name: "PUSKESMAS GONDOMANAN", address: "Jl. Gondomanan No.9, Kec. Gondomanan" },
		{ name: "PUSKESMAS JETIS", address: "Jl. Diponegoro 91, Kec. Jetis" },
		{ name: "PUSKESMAS KOTA GEDE I", address: "Jl. Kemasan 12, Kec. Kotagede" },
		{ name: "PUSKESMAS KOTA GEDE II", address: "Jl. Ki Penjawi 4, Kec. Kotagede" },
	];
</script>

<section class="p-4">
	<h2 class="font-semibold sm:text-lg mt-2 mb-6">Daftar Puskesmas</h2>

	<div class="grid gap-y-6 gap-x-11 sm:grid-cols-2 md:grid-cols-3">
		{#each clinics as clinic}
			<article class="pt-3 border-t-2 border-indigo-400">
				<strong class="font-medium text-sm leading-tight inline-block">{clinic.name}</strong>
				<p class="text-gray-600 text-xs mt-1 mb-2">📍&nbsp; {clinic?.address}</p>
				<a
					class="-mt-px py-0.5 px-2 text-center text-indigo-700 border border-indigo-700 hover:bg-indigo-700 focus:bg-indigo-700 hover:text-white focus:text-white rounded text-xs font-medium"
					href={`https://www.google.com/maps/search/${clinic.name}`}>Maps</a
				>
			</article>
		{:else}
			<p>Data puskesmas tidak ditemukan</p>
		{/each}
	</div>
</section>

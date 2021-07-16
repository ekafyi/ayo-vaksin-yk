<script lang="ts">
	export let clinics: IClinic[] = [];

	const makeMapUrl = (name: string) => {
		const baseUrl = `https://www.google.com/maps/search`;
		return name.startsWith("Puskesmas") ? `${baseUrl}/${name}` : `${baseUrl}/Puskesmas ${name}`;
	};
</script>

<div class="grid gap-y-6 gap-x-11 sm:grid-cols-2 md:grid-cols-3 pb-2">
	{#each clinics as clinic}
		<article class="pt-3 border-t-2 border-indigo-400">
			<strong class="font-medium text-sm leading-tight inline-block">{clinic.name}</strong>
			<p class="text-xs text-gray-700 mt-1 mb-2">
				<span aria-hidden="true">📍&nbsp;</span>
				{clinic?.address}
			</p>
			<a class="cv-mini-btn" href={makeMapUrl(clinic.name)}>Maps</a>
		</article>
	{:else}
		<p class="col-span-full text-gray-700 text-center text-sm p-4">
			Data puskesmas tidak ditemukan
		</p>
	{/each}
</div>

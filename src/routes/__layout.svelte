<script lang="ts">
	import "../app.css";
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";
	import { dev, browser } from "$app/env";
	import { Workbox } from "workbox-window";
	import type { WorkboxLifecycleEventMap } from "workbox-window/utils/WorkboxEvent";
	import { Header, Footer } from "../components";
	import { page } from "$app/stores";

	let headerMode: "FULL" | "COMPACT" = "COMPACT";

	let offlineReady = false;
	let offlineNoticeDismissed = false;
	let deferredPrompt: BeforeInstallPromptEvent;

	onMount(() => {
		if (!dev && browser && "serviceWorker" in navigator) {
			// see: https://developers.google.com/web/tools/workbox/modules/workbox-window
			const wb = new Workbox("/service-worker.js", { scope: "/" });
			// not used right now, leave for future stuff eg. push notif
			let registration: ServiceWorkerRegistration | null;

			wb.addEventListener("activated", (event) => {
				console.log("~~~ ✨ WB activated ~~~", event.isUpdate ? "" : "🐥 first time");
				// see: https://developers.google.com/web/tools/workbox/modules/workbox-window#example-first-active
				if (!event.isUpdate) offlineReady = true;
			});

			// Leave for debugging.
			const WB_EVENTS = ["installing", "installed", "waiting", "activating", "controlling", "redundant"]; // prettier-ignore
			WB_EVENTS.forEach((wbEvent) => {
				wb.addEventListener(wbEvent as keyof WorkboxLifecycleEventMap, (event) => {
					console.log(`~~~ 💻  WB ${wbEvent} ~~~`);
				});
			});

			// Register the service worker after event listeners have been added.
			wb.register({ immediate: true }).then((r) => {
				console.log("~~~ 💻  WB registration ~~~", r);
				registration = r;
			});
		}

		// ==============
		// ==============

		window.addEventListener("beforeinstallprompt", (e) => {
			e.preventDefault();
			deferredPrompt = e;
		});
	});

	const handleA2HS = async () => {
		const promptEvent = deferredPrompt;
		if (!promptEvent) return;
		promptEvent.prompt();
		const choice = await promptEvent.userChoice;
		if (choice.outcome == "accepted") offlineNoticeDismissed = true;
		deferredPrompt = null;
	};

	$: if (offlineReady) console.log("offline ready?", offlineReady);

	$: headerMode = $page.path == "/" ? "FULL" : "COMPACT";
</script>

<svelte:head>
	<meta name="apple-mobile-web-app-capable" content="yes" />
</svelte:head>

<Header mode={headerMode} />
<slot />
<Footer />

{#if offlineReady && !offlineNoticeDismissed}
	<div aria-live="polite" class="notif" in:fly={{ y: 80, duration: 1000, delay: 1000 }} out:fade>
		<p class="text-sm">
			Situs ini siap diakses offline dari device ini. Kamu juga bisa menginstall situs ini sebagai
			PWA.
		</p>
		<div class="flex justify-end mt-4 -mb-1">
			<button
				class="notif__btn"
				on:click={() => {
					offlineNoticeDismissed = true;
				}}>Tutup</button
			>
			{#if deferredPrompt}
				<button class="notif__btn" on:click={handleA2HS}>Install</button>
			{/if}
		</div>
	</div>
{/if}

<style lang="postcss">
	.notif {
		@apply fixed bottom-0 sm:bottom-4 w-full sm:max-w-xl px-4 py-5 sm:p-6 sm:rounded shadow-lg bg-black text-white bg-opacity-90 border-t-4 border-indigo-600;
		left: 50%;
		right: 50%;
		transform: translateX(-50%);
	}
	.notif__btn {
		@apply text-sm font-medium py-2 px-3 ml-4  hover:bg-black;
		color: #897cff;
	}
</style>

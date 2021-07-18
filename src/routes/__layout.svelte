<script lang="ts">
	import "../app.css";
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";
	import { dev, browser } from "$app/env";
	import { Workbox } from "workbox-window";
	import type { WorkboxLifecycleEventMap } from "workbox-window/utils/WorkboxEvent";
	import { Header, Footer } from "../components";
	import { page } from "$app/stores";
	import { COPY_TEXT } from "$lib/constants";
	import { userSettings } from "$lib/stores";

	let headerMode: "FULL" | "COMPACT" = "COMPACT";

	let offlineReady = false;
	let deferredPrompt: BeforeInstallPromptEvent;

	onMount(() => {
		if (!dev && browser && "serviceWorker" in navigator) {
			// see: https://developers.google.com/web/tools/workbox/modules/workbox-window
			const wb = new Workbox("/service-worker.js", { scope: "/" });
			// not used right now, leave for future stuff eg. push notif
			let registration: ServiceWorkerRegistration | null;

			wb.addEventListener("activated", async (event) => {
				console.log("~~~ ✨ WB activated ~~~", event.isUpdate ? "" : "🐥 first time");
				// see: https://developers.google.com/web/tools/workbox/modules/workbox-window#example-first-active
				if (!event.isUpdate) offlineReady = true;
			});

			// Leave for debugging.
			// see: https://developers.google.com/web/tools/workbox/modules/workbox-window#the_very_first_time_a_service_worker_is_installed
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

	const updateNoticeDismissed = () => {
		$userSettings.offlineNoticeDismissed = true;
	};

	const handleA2HS = async () => {
		const promptEvent = deferredPrompt;
		if (!promptEvent) return;
		promptEvent.prompt();
		const choice = await promptEvent.userChoice;
		if (choice.outcome == "accepted") updateNoticeDismissed();
		deferredPrompt = null;
	};

	$: if (offlineReady) console.log("offline ready?", offlineReady);

	$: {
		headerMode = $page.path == "/" ? "FULL" : "COMPACT";

		if (browser && $page.path) {
			// console.log($page.path, "🐐", typeof window.goatcounter);
			if (typeof window.goatcounter == "object")
				window.goatcounter.count({
					path: $page.path, // add page.query if using param queries
				});
		}
	}
</script>

<svelte:head>
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<script
		data-goatcounter="https://ayo-vaksin-yk.goatcounter.com/count"
		src="//gc.zgo.at/count.js"
		async>
	</script>
</svelte:head>

<Header mode={headerMode} />
<slot />
<Footer />

{#if offlineReady && !$userSettings.offlineNoticeDismissed}
	<div aria-live="polite" class="notif" in:fly={{ y: 80, duration: 1000, delay: 1000 }} out:fade>
		<p class="text-sm">{COPY_TEXT.PWA_INSTALL_UI_DIALOG}</p>
		<div class="flex justify-end mt-4 -mb-1">
			<button class="notif__btn" on:click={updateNoticeDismissed}>
				{COPY_TEXT.PWA_ACTION_CLOSE_DIALOG}
			</button>
			{#if deferredPrompt}
				<button class="notif__btn" on:click={handleA2HS}>{COPY_TEXT.PWA_ACTION_INSTALL}</button>
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

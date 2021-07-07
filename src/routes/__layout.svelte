<script lang="ts">
	import "../app.css";
	import { dev, browser } from "$app/env";
	import { Workbox } from "workbox-window";
	import type { WorkboxLifecycleEventMap } from "workbox-window/utils/WorkboxEvent";
	import { onMount } from "svelte";

	let offlineReady = false;

	onMount(() => {
		if (browser && "serviceWorker" in navigator) {
			// see: https://developers.google.com/web/tools/workbox/modules/workbox-window
			const wb = new Workbox("/service-worker.js", { scope: "/" });
			// not used right now, leave for future stuff eg. push notif
			let registration: ServiceWorkerRegistration | null;

			wb.addEventListener("activated", (event) => {
				console.log("🐥", "~~~ 💻  WB activated ~~~", event.isUpdate ? "" : "first time");
				// see: https://developers.google.com/web/tools/workbox/modules/workbox-window#example-first-active
				if (!event.isUpdate) offlineReady = true;
			});

			// Leave for debugging.
			const WB_EVENTS = ["installed", "controlling", "activating", "waiting"];
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
	});

	$: if (offlineReady) console.log("offline ready?", offlineReady);
</script>

<svelte:head>
	<meta name="apple-mobile-web-app-capable" content="yes" />
</svelte:head>

<slot />

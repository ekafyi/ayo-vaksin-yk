<script lang="ts">
	import "../app.css";

	// // !! using regular SW file
	// import { dev, browser } from "$app/env";
	// import { Workbox } from "workbox-window";

	// let offlineReady = false;

	// if (!dev && browser && "serviceWorker" in navigator) {
	// 	// see: https://developers.google.com/web/tools/workbox/modules/workbox-window
	// 	const wb = new Workbox("/service-worker.js", { scope: "/" });
	// 	let registration: ServiceWorkerRegistration | null;

	// 	// events - WorkboxLifecycleEventMap
	// 	// "installing" | "installed" | "waiting" | "activating" | "activated" | "controlling" | "redundant"

	// 	wb.addEventListener("activated", (event) => {
	// 		console.log("🐥", "~~~ wb activated ~~~", event.isUpdate ? "" : "first time");
	// 		// see: https://developers.google.com/web/tools/workbox/modules/workbox-window#example-first-active
	// 		if (!event.isUpdate) {
	// 			offlineReady = true;
	// 		}
	// 	});

	// 	// Register the service worker after event listeners have been added.
	// 	wb.register({ immediate: true }).then((r) => {
	// 		console.log("~~~ wb registration ~~~", r);
	// 		registration = r;
	// 	});
	// }

	// $: if (offlineReady) console.log("offline ready???", offlineReady);
</script>

<svelte:head>
	<meta name="apple-mobile-web-app-capable" content="yes" />
</svelte:head>

<slot />

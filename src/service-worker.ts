import { build, timestamp } from "$service-worker";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute } from "workbox-precaching";
import { staticResourceCache, imageCache, warmStrategyCache } from "workbox-recipes";
import { registerRoute, setCatchHandler, setDefaultHandler } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

const START_URL = `/`;
const OFFLINE_URL = `/offline`;

// ==============
// ==============

declare let self: ServiceWorkerGlobalScope;

self.addEventListener("message", (event) => {
	if (event.data) console.log("!!! SW message !!!", event.data);
	// Activate new service worker as soon as it's finished installing.
	// see: https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
	if (event.data && event.data.type === "SKIP_WAITING") {
		self.skipWaiting();
	}
});

self.addEventListener("activate", (event) => {
	console.log("!!! SW activate !!!", event);
	// the first time a service worker is installed it will active but not start controlling the page unless `clients.claim()` is called in the service worker.
	// see: https://github.com/GoogleChrome/workbox/blob/v6/packages/workbox-window/src/Workbox.ts#L232-L234
	self.clients.claim();
});

self.addEventListener("install", () => {
	console.log("!!! SW install !!!");
});

// ==============
// ==============

// warmStrategyCache({
// 	urls: [OFFLINE_URL, "/manifest.json"],
// 	strategy: new StaleWhileRevalidate({
// 		cacheName: "cv-warm-pages",
// 		plugins: [new ExpirationPlugin({ maxAgeSeconds: 1 * 24 * 60 * 60 })],
// 	}),
// });

precacheAndRoute([
	{ url: START_URL, revision: `${timestamp}` },
	{ url: OFFLINE_URL, revision: null },
	{ url: "/manifest.json", revision: `${timestamp}` },
]);

staticResourceCache({
	cacheName: "cv-build-assets",
	warmCache: build,
	plugins: [
		new ExpirationPlugin({
			maxEntries: 50,
		}),
	],
});

imageCache({
	cacheName: "cv-images",
	warmCache: ["/favicon.ico", "/icon-192x192.png"],
	// This module includes ExpirationPlugin by default.
});

registerRoute(
	({ request, url }) =>
		url.pathname == START_URL ||
		url.pathname.startsWith("/api/") ||
		url.pathname.startsWith("/di/") ||
		request.destination == "document",
	new StaleWhileRevalidate({
		cacheName: "cv-routes",
		plugins: [new ExpirationPlugin({ maxAgeSeconds: 1 * 24 * 60 * 60 })],
	})
);

// ==============
// ==============

setDefaultHandler(
	new StaleWhileRevalidate({
		cacheName: "cv-default-handler",
		plugins: [new ExpirationPlugin({ maxAgeSeconds: 7 * 24 * 60 * 60 })],
	})
);

// This runs when any of the other routes fail to generate a response.
setCatchHandler(async ({ event }) => {
	const fetchEvent = event as FetchEvent;
	console.log("catch 🤚🏼", fetchEvent.request);

	// see: https://developers.google.com/web/tools/workbox/guides/advanced-recipes#handle
	if (fetchEvent.request.destination == "document") {
		console.log("aaaaaa ", fetchEvent);
		return caches.match(OFFLINE_URL);
	}

	return Response.error(); // Return error response if we don't have a fallback.
});

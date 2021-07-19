import { build, timestamp } from "$service-worker";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute } from "workbox-precaching";
import { staticResourceCache, imageCache, warmStrategyCache } from "workbox-recipes";
import { registerRoute, setCatchHandler, setDefaultHandler } from "workbox-routing";
import { StaleWhileRevalidate, NetworkOnly } from "workbox-strategies";

const START_URL = `/`;
const OFFLINE_URL = `/offline`;

// ==============
// ==============

declare let self: ServiceWorkerGlobalScope;

self.addEventListener("install", (event) => {
	console.log("!!! SW install !!!");
	// Activate new service worker as soon as it's finished installing.
	// see: https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#skip_the_waiting_phase
	event.waitUntil(self.skipWaiting());
});

self.addEventListener("message", (event) => {
	console.log("!!! SW message !!!", event.data);
	// if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

// ==============
// ==============

precacheAndRoute([
	{ url: START_URL, revision: `${timestamp}` },
	{ url: OFFLINE_URL, revision: null },
	{ url: "/manifest.json", revision: `${timestamp}` },
]);

registerRoute(({ url }) => self.origin != url.origin, new NetworkOnly());

staticResourceCache({
	cacheName: "cv-build-assets",
	warmCache: build,
	matchCallback: ({ request }) =>
		request.destination === "style" ||
		request.destination === "script" ||
		request.destination === "worker",
	plugins: [new ExpirationPlugin({ maxEntries: 50 })],
});

imageCache({
	cacheName: "cv-images",
	warmCache: ["/favicon.ico", "/icon-192x192.png"],
	matchCallback: ({ request }) => request.destination === "image",
	// This module includes ExpirationPlugin by default.
});

warmStrategyCache({
	urls: ["/api/locations"],
	strategy: new StaleWhileRevalidate({
		cacheName: "cv-warm-routes",
		plugins: [new ExpirationPlugin({ maxAgeSeconds: 1 * 24 * 60 * 60 })],
	}),
});

registerRoute(
	({ request, url }) =>
		url.pathname == START_URL ||
		url.pathname.startsWith("/api/") ||
		url.pathname.startsWith("/di/") ||
		url.pathname.startsWith("/p/") ||
		request.destination == "document",
	new StaleWhileRevalidate({
		cacheName: "cv-routes",
		plugins: [new ExpirationPlugin({ maxAgeSeconds: 1 * 24 * 60 * 60 })],
	})
);

// ==============
// ==============

setDefaultHandler(new NetworkOnly());

// This runs when any of the other routes fail to generate a response.
setCatchHandler(async ({ event }) => {
	const fetchEvent = event as FetchEvent;
	console.log("catch 🤚🏼", fetchEvent.request);

	// see: https://developers.google.com/web/tools/workbox/guides/advanced-recipes#handle
	if (fetchEvent.request.destination == "document") {
		return caches.match(OFFLINE_URL);
	}

	return Response.error(); // Return error response if we don't have a fallback.
});

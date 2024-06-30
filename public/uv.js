importScripts('/public/uv/uv.bundle.js');
importScripts('/public/uv/uv.config.js');
importScripts('/public/uv/uv.sw.js');
importScripts('https://arc.io/arc-sw-core.js');

const sw = new UVServiceWorker();

self.addEventListener('fetch', (event) => event.respondWith(sw.fetch(event)));

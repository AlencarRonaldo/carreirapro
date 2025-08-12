const CACHE_VERSION = 'cp-v2';
const STATIC_CACHE = `cp-static-${CACHE_VERSION}`;
const HTML_CACHE = `cp-html-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/',
  '/manifest.webmanifest',
  '/next.svg',
  '/globe.svg',
  '/vercel.svg',
  '/window.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(STATIC_CACHE);
        await cache.addAll(PRECACHE_URLS);
      } catch {}
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => (k.startsWith('cp-static-') || k.startsWith('cp-html-')) && !k.endsWith(CACHE_VERSION))
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

function isHtmlRequest(req) {
  return req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html');
}

function isNextStatic(url) {
  return url.pathname.startsWith('/_next/static');
}

function isStaticAsset(url) {
  return /(\.css|\.js|\.woff2?|\.ttf|\.map)$/.test(url.pathname);
}

function isImage(url) {
  return /(\.png|\.jpg|\.jpeg|\.gif|\.svg|\.webp|\.ico)$/.test(url.pathname);
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Ignore non-http(s) schemes (e.g., chrome-extension://) to avoid Cache API errors
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Network-first for HTML/navigation
  if (isHtmlRequest(req)) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(HTML_CACHE);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match(req);
          return cached || caches.match('/');
        }
      })()
    );
    return;
  }

  // Cache-first for Next static and assets
  if (isNextStatic(url) || isStaticAsset(url)) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        try {
          const res = await fetch(req);
          const cache = await caches.open(STATIC_CACHE);
          cache.put(req, res.clone());
          return res;
        } catch {
          return cached;
        }
      })()
    );
    return;
  }

  // Stale-while-revalidate for images
  if (isImage(url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cached = await cache.match(req);
        const network = fetch(req).then((res) => {
          cache.put(req, res.clone());
          return res;
        }).catch(() => undefined);
        return cached || (await network);
      })()
    );
    return;
  }
});



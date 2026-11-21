// Eski /saklambac adresi /sobe'ye taşındı: bu service worker yalnız kendi eski önbelleğini (sk-) siler ve kendini kaldırır.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x.startsWith('sk-')).map(x => caches.delete(x)))).then(() => self.registration.unregister())); });

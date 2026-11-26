// Fungi! service worker: oyun dosyaları ilk açılışta önbelleğe girer, sonra hızlı ve çevrimdışı açılır.
// Sayfa (index.html) önce ağdan denenir ki yeni sürüm hemen gelsin; varlıklar (adları sürüme göre değişir) önbellekten.
const SURUM = 'fungi-v37-26Kas';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(SURUM).then(c => c.addAll(['./', './manifest.webmanifest', './ikon/ikon-192.png']).catch(() => {}))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x.startsWith('fungi-') && x !== SURUM).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // Firebase vb. dokunma
  const kok = u.pathname.endsWith('/') || u.pathname.endsWith('/index.html');
  if (e.request.mode === 'navigate' || kok || u.pathname.endsWith('.html')) {
    const anahtar = kok ? './' : e.request; // gizlilik.html vb. ana sayfanın önbelleğini ezmesin
    e.respondWith(fetch(e.request).then(r => { const k = r.clone(); caches.open(SURUM).then(c => c.put(anahtar, k)); return r; }).catch(() => caches.match(anahtar)));
    return;
  }
  e.respondWith(caches.match(e.request).then(h => h || fetch(e.request).then(r => { if (r.ok) { const k = r.clone(); caches.open(SURUM).then(c => c.put(e.request, k)); } return r; })));
});

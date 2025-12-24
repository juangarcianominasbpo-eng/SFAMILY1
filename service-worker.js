
const CACHE = 'sfone-supabase-v1';
const ASSETS = [
  '/', '/index.html', '/profile.html', '/chat.html',
  '/css/styles.css',
  '/js/supa.js', '/js/feed.js', '/js/profile.js', '/js/chat.js',
  '/assets/logo.png', '/manifest.json'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

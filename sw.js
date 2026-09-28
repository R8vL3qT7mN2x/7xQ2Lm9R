// Цей файл — лише «прибиральник». Сайт більше НЕ реєструє service worker
// і нічого не кешує. Файл потрібен для тих, у кого в браузері вже стоїть
// стара версія з кешуванням: браузер сам перевірить sw.js, знайде цю
// версію, вона видалить усі кеші, зніме себе і перезавантажить вкладки.
self.addEventListener('install', () => { self.skipWaiting(); });

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.registration.unregister();
    const clientsList = await self.clients.matchAll({ type: 'window' });
    clientsList.forEach((client) => client.navigate(client.url));
  })());
});

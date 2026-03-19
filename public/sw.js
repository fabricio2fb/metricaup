// Service Worker — MetricaUp
// Handles push notifications and caching

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

// Push event — fired when a push notification arrives
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || '📦 MetricaUp';
  const options = {
    body: data.body || 'Novo pedido recebido!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'metricaup-notification',
    renotify: true,
    data: { url: data.url || '/admin' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Click on notification — open admin page
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/admin';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url.includes(url));
      if (existing) return existing.focus();
      return self.clients.openWindow(url);
    })
  );
});

// Service Worker for TTF Companion push notifications.
// Listens for push events and displays notifications.
// Handles notification clicks to navigate to the relevant page.

self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const title = data.title || 'TTF Companion';
  const options = {
    body: data.body || '',
    icon: '/ttf-logo.png',
    badge: '/ttf-logo.png',
    data: { url: data.url || '/' },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});

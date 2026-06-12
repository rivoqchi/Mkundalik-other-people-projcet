self.addEventListener('push', event => {
    let data = {};
    try {
        data = event.data.json();
    } catch (e) {
        console.warn('[Service Worker] Push data is not JSON, using as plain text:', event.data.text());
        data = {
            title: 'Yangi bildirishnoma',
            body: event.data.text(),
            url: '/'
        };
    }

    console.log('[Service Worker] Push received:', data);

    const options = {
        body: data.body || 'Sizda yangi xabar bor',
        icon: '/logo.ico', 
        badge: '/logo.ico',
        data: {
            url: data.url || '/'
        },
        vibrate: [100, 50, 100],
        actions: [
            { action: 'open', title: 'Ko‘rish' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Bildirishnoma', options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    const urlToOpen = event.notification.data.url;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

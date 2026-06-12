import axios from 'axios';
import { API } from '../../config';

const publicVapidKey = 'BAbNusaoI2KTIogWMlnpZ8nL93ne8GSHXTOxlqxG19Py8V9m9bIarlzIN8PErAsy1NUEahfyLdDuPV7OwFdJYYA';

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export async function subscribeToNotifications() {
    if ('serviceWorker' in navigator) {
        try {
            const register = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            const subscription = await register.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            });

            await axios.post(`${API}/notifications/subscribe`, subscription, { withCredentials: true });
            console.log('Push Subscribed...');
            
            alert('Bildirishnomalar muvaffaqiyatli ulandi! ✅');
        } catch (error) {
            console.error('Error subscribing to push notifications:', error);
            alert('Bildirishnoma ulanishida xatolik: ' + error.message);
        }
    }
}

export async function requestNotificationPermission() {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return;
    }

    if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            await subscribeToNotifications();
        }
    } else if (Notification.permission === "granted") {
        await subscribeToNotifications();
    }
}

// Toggle component for enabling/disabling push notifications.
// Shows current subscription state and handles subscribe/unsubscribe flow.
'use client';

import { useState, useEffect, useCallback } from 'react';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function NotificationToggle() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isIosBrowser, setIsIosBrowser] = useState(false);

  useEffect(() => {
    const checkSupport = async () => {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window;
      setIsSupported(supported);

      // Detect iOS in browser (not standalone PWA)
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      if (isIos && !isStandalone) {
        setIsIosBrowser(true);
      }

      if (supported) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      }
      setIsLoading(false);
    };
    checkSupport();
  }, []);

  const handleToggle = useCallback(async () => {
    if (!VAPID_PUBLIC_KEY) return;
    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;

      if (isSubscribed) {
        // Unsubscribe
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await fetch('/api/push/subscribe', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint: subscription.endpoint }),
          });
          await subscription.unsubscribe();
        }
        setIsSubscribed(false);
      } else {
        // Subscribe
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        const subJson = subscription.toJSON();
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            endpoint: subJson.endpoint,
            keys: subJson.keys,
          }),
        });
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Push toggle failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isSubscribed]);

  if (isLoading) {
    return (
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Lade...</span>
        </div>
      </div>
    );
  }

  if (isIosBrowser) {
    return (
      <div className="glass rounded-2xl p-4">
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          Benachrichtigungen
        </p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Füge die App zum Home-Bildschirm hinzu, um Benachrichtigungen zu erhalten.
          Tippe auf das Teilen-Symbol und dann auf &quot;Zum Home-Bildschirm&quot;.
        </p>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="glass rounded-2xl p-4">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Benachrichtigungen werden von diesem Browser nicht unterstützt.
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Benachrichtigungen
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {isSubscribed
              ? 'Du wirst über Änderungen informiert.'
              : 'Erhalte Infos zu Trainingsplan-Änderungen.'}
          </p>
        </div>
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
            isSubscribed ? 'bg-green-500' : 'bg-gray-400'
          }`}
          aria-label={isSubscribed ? 'Benachrichtigungen deaktivieren' : 'Benachrichtigungen aktivieren'}
        >
          <span
            className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
              isSubscribed ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}

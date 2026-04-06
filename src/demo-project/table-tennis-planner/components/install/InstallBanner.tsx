// Smart PWA install banner component.
// Detects the user's platform and shows appropriate installation instructions
// with a dismissable UI that reappears after 7 days.
'use client';

import { useState, useEffect, useCallback } from 'react';
import { detectPlatform, isIosUserAgent, type InstallPlatform } from './detect-platform';
import { isDismissed as checkDismissed, dismiss } from './dismiss-logic';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallBannerProps {
  /** Override platform detection for Storybook/testing */
  platformOverride?: InstallPlatform;
}

export function InstallBanner({ platformOverride }: InstallBannerProps) {
  const [platform, setPlatform] = useState<InstallPlatform | null>(platformOverride ?? null);
  const [dismissed, setDismissed] = useState(!platformOverride);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (platformOverride) return;

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const detected = detectPlatform(navigator.userAgent, isStandalone);
    setPlatform(detected);
    setDismissed(checkDismissed());
    setIsIos(isIosUserAgent(navigator.userAgent));

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, [platformOverride]);

  const handleDismiss = useCallback(() => {
    dismiss();
    setDismissed(true);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setDismissed(true);
    }
    setInstallPrompt(null);
  }, [installPrompt]);

  // Don't render: still loading, dismissed, standalone, or desktop
  if (!platform || dismissed || platform === 'standalone' || platform === 'desktop') {
    return null;
  }

  const explanation = 'Installiere die App, um Benachrichtigungen zu erhalten — z.B. bei Änderungen am Trainingsplan, Anwesenheits-Updates und Chat-Nachrichten. Du kannst Benachrichtigungen jederzeit aktivieren oder deaktivieren.';

  return (
    <div className="glass rounded-2xl p-5 border border-green-200/30 bg-green-500/5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            App installieren
          </h3>
        </div>
      </div>

      <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
        {explanation}
      </p>

      {platform === 'webview' && <WebViewContent isIos={isIos} />}
      {platform === 'ios-other' && <IosOtherContent />}
      {platform === 'ios-safari' && <IosSafariContent />}
      {platform === 'android' && <AndroidContent installPrompt={installPrompt} onInstall={handleInstall} />}

      <button
        onClick={handleDismiss}
        className="mt-3 w-full py-2 rounded-xl text-xs font-medium bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
        style={{ color: 'var(--text-secondary)' }}
        aria-label="Installationshinweis schließen"
      >
        Später
      </button>
    </div>
  );
}

function WebViewContent({ isIos }: { isIos: boolean }) {
  return (
    <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
      {isIos
        ? 'Öffne diese Seite in Safari, um die App zu installieren.'
        : 'Öffne diese Seite in Chrome — tippe auf ⋮ und wähle "In Chrome öffnen".'}
    </p>
  );
}

function IosOtherContent() {
  return (
    <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
      Öffne diese Seite in Safari, um die App zum Home-Bildschirm hinzuzufügen.
    </p>
  );
}

function IosSafariContent() {
  return (
    <ol className="text-xs space-y-1 list-decimal list-inside" style={{ color: 'var(--text-primary)' }}>
      <li>Tippe auf das <strong>Teilen-Symbol</strong> (Quadrat mit Pfeil nach oben)</li>
      <li>Wähle <strong>&quot;Zum Home-Bildschirm&quot;</strong></li>
      <li>Tippe auf <strong>&quot;Hinzufügen&quot;</strong></li>
    </ol>
  );
}

function AndroidContent({ installPrompt, onInstall }: { installPrompt: BeforeInstallPromptEvent | null; onInstall: () => void }) {
  if (!installPrompt) {
    return (
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        Tippe im Browser-Menü auf &quot;App installieren&quot; oder &quot;Zum Startbildschirm hinzufügen&quot;.
      </p>
    );
  }
  return (
    <button
      onClick={onInstall}
      className="w-full py-2.5 rounded-xl text-sm font-semibold bg-green-500/20 border border-green-400/40 text-green-700 hover:bg-green-500/30 transition-all"
    >
      Installieren
    </button>
  );
}

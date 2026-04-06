'use client';

import { useState, useEffect } from 'react';

interface PasswordResetBannerProps {
  playerName: string;
  newPassword: string;
  onDismiss: () => void;
}

export function PasswordResetBanner({ playerName, newPassword, onDismiss }: PasswordResetBannerProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(onDismiss, 30_000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(newPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard nicht verfügbar – kein Fehler anzeigen
    }
  };

  return (
    <div className="mx-4 mb-4 rounded-2xl p-4 bg-green-500/10 border border-green-400/30 backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-green-800 mb-1">
            Passwort für {playerName} zurückgesetzt
          </p>
          <p className="text-xs text-green-700 mb-2">
            Teile dieses Passwort mit dem Spieler:
          </p>

          <div className="flex items-center gap-2 bg-white/30 rounded-xl px-3 py-2 border border-white/40">
            <span className="font-mono text-sm font-bold flex-1 truncate" style={{ color: 'var(--text-primary)' }}>
              {newPassword}
            </span>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-white/30 transition-colors"
              aria-label="Passwort kopieren"
              title={copied ? 'Kopiert!' : 'In Zwischenablage kopieren'}
            >
              {copied ? (
                <svg className="w-4 h-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors"
          aria-label="Schließen"
        >
          <svg className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

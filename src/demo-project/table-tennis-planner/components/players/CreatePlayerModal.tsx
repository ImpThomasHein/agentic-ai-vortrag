'use client';

import { useState, type FormEvent } from 'react';
import type { PlayerListItem } from '@/lib/types';
import { Button } from '@/components/ui';

interface CreatePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPlayer: PlayerListItem) => void;
}

export function CreatePlayerModal({ isOpen, onClose, onSuccess }: CreatePlayerModalProps) {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setUsername('');
    setDisplayName('');
    setPassword('');
    setEmail('');
    setShowPassword(false);
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim().toLowerCase(), displayName: displayName.trim(), password, email: email.trim() || undefined }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'Fehler beim Anlegen des Spielers');
        return;
      }

      onSuccess(data as PlayerListItem);
      handleClose();
    } catch {
      setError('Netzwerkfehler. Bitte versuche es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = username.trim().length > 0 && displayName.trim().length > 0 && password.length >= 6;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="glass rounded-2xl p-6 w-full max-w-sm space-y-4">
        <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
          Neuen Spieler anlegen
        </h2>

        {error && (
          <div className="rounded-xl p-3 bg-red-500/10 border border-red-300/40 text-sm text-red-700 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="new-username" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Loginname
            </label>
            <input
              id="new-username"
              type="text"
              autoComplete="off"
              autoCapitalize="none"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              required
              disabled={isSubmitting}
              placeholder="z.B. anna.mueller"
              className="w-full px-4 py-3 rounded-xl text-sm bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-white/60 backdrop-blur-sm disabled:opacity-60 placeholder:text-gray-400 transition-all"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label htmlFor="new-displayname" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Anzeigename
            </label>
            <input
              id="new-displayname"
              type="text"
              autoComplete="off"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="z.B. Anna Müller"
              className="w-full px-4 py-3 rounded-xl text-sm bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-white/60 backdrop-blur-sm disabled:opacity-60 placeholder:text-gray-400 transition-all"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label htmlFor="new-password" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Initiales Passwort
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                placeholder="Mind. 6 Zeichen"
                className="w-full px-4 py-3 pr-12 rounded-xl text-sm bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-white/60 backdrop-blur-sm disabled:opacity-60 placeholder:text-gray-400 transition-all"
                style={{ color: 'var(--text-primary)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/20 transition-colors"
                aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="new-email" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              E-Mail (optional)
            </label>
            <input
              id="new-email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              placeholder="spieler@email.de"
              className="w-full px-4 py-3 rounded-xl text-sm bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-white/60 backdrop-blur-sm disabled:opacity-60 placeholder:text-gray-400 transition-all"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={handleClose} disabled={isSubmitting} className="flex-1">
              Abbrechen
            </Button>
            <Button type="submit" variant="primary" disabled={!isValid || isSubmitting} className="flex-1">
              {isSubmitting ? 'Erstellen...' : 'Erstellen'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

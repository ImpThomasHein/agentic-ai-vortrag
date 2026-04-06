'use client';

// Modal for trainers to edit a player's display name, username, and email.
// Replaces the former EmailEditModal with a combined edit form.

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { isValidEmail } from './playerUtils';

interface EditPlayerModalProps {
  isOpen: boolean;
  player: { id: string; displayName: string; username: string; email: string | null } | null;
  onClose: () => void;
  onSave: (playerId: string, data: { displayName: string; username: string; email: string | null }) => Promise<{ error?: string }>;
}

export function EditPlayerModal({ isOpen, player, onClose, onSave }: EditPlayerModalProps) {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (player) {
      setDisplayName(player.displayName);
      setUsername(player.username);
      setEmail(player.email ?? '');
      setError(null);
    }
  }, [player]);

  if (!isOpen || !player) return null;

  const handleSave = async () => {
    const trimmedName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Anzeigename darf nicht leer sein');
      return;
    }
    if (!trimmedUsername) {
      setError('Benutzername darf nicht leer sein');
      return;
    }
    if (trimmedEmail && !isValidEmail(trimmedEmail)) {
      setError('Ungültiges E-Mail-Format');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const result = await onSave(player.id, {
        displayName: trimmedName,
        username: trimmedUsername,
        email: trimmedEmail || null,
      });
      if (result.error) {
        setError(result.error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="glass rounded-2xl p-6 w-full max-w-sm space-y-4">
        <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
          Spieler bearbeiten
        </h2>

        {error && (
          <div className="rounded-xl p-3 bg-red-500/10 border border-red-300/40 text-sm text-red-700 font-medium">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="edit-displayname" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            Anzeigename
          </label>
          <input
            id="edit-displayname"
            type="text"
            value={displayName}
            onChange={(e) => { setDisplayName(e.target.value); setError(null); }}
            className="w-full px-4 py-3 rounded-xl text-sm bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-white/60 backdrop-blur-sm placeholder:text-gray-400 transition-all"
            style={{ color: 'var(--text-primary)' }}
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="edit-username" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            Benutzername
          </label>
          <input
            id="edit-username"
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(null); }}
            className="w-full px-4 py-3 rounded-xl text-sm bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-white/60 backdrop-blur-sm placeholder:text-gray-400 transition-all"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        <div>
          <label htmlFor="edit-email" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            E-Mail-Adresse
          </label>
          <input
            id="edit-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            placeholder="spieler@email.de"
            className="w-full px-4 py-3 rounded-xl text-sm bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-white/60 backdrop-blur-sm placeholder:text-gray-400 transition-all"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose} className="flex-1" disabled={isSaving}>
            Abbrechen
          </Button>
          <Button type="button" variant="primary" onClick={handleSave} className="flex-1" disabled={isSaving}>
            {isSaving ? 'Speichern...' : 'Speichern'}
          </Button>
        </div>
      </div>
    </div>
  );
}

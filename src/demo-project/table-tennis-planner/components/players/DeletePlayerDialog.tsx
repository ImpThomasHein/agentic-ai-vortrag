'use client';

// Confirmation dialog before deleting a player account.
// Shows the player's name and warns that the action is irreversible.

import { useState } from 'react';
import { Button } from '@/components/ui';

interface DeletePlayerDialogProps {
  isOpen: boolean;
  playerName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeletePlayerDialog({ isOpen, playerName, onClose, onConfirm }: DeletePlayerDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Löschen');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="glass rounded-2xl p-6 w-full max-w-sm space-y-4">
        <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
          Spieler löschen
        </h2>

        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Möchtest du <strong style={{ color: 'var(--text-primary)' }}>{playerName}</strong> wirklich löschen?
          Diese Aktion kann nicht rückgängig gemacht werden.
        </p>

        {error && (
          <div className="rounded-xl p-3 bg-red-500/10 border border-red-300/40 text-sm text-red-700 font-medium">
            {error}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1" disabled={isDeleting}>
            Abbrechen
          </Button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 px-5 py-2.5 rounded-xl text-base font-semibold min-h-[48px] bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {isDeleting ? 'Löschen...' : 'Löschen'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Modal dialog for creating a new training group.
 * Sends POST /api/groups and calls onSuccess callback with created group data.
 */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (group: { id: string; name: string; description: string | null }) => void;
}

export function CreateGroupModal({ isOpen, onClose, onSuccess }: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || null }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Fehler beim Erstellen');
        return;
      }
      const group = await res.json();
      onSuccess(group);
      setName('');
      setDescription('');
    } catch {
      setError('Netzwerkfehler');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass rounded-2xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Neue Gruppe erstellen
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Jugend"
              className="w-full px-3 py-2 rounded-xl border border-white/20 bg-white/10 text-sm"
              style={{ color: 'var(--text-primary)' }}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              Beschreibung (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kurze Beschreibung der Gruppe"
              className="w-full px-3 py-2 rounded-xl border border-white/20 bg-white/10 text-sm"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={onClose} type="button">
              Abbrechen
            </Button>
            <Button variant="glass-accent" size="sm" type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting ? 'Erstelle...' : 'Erstellen'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Modal dialog for editing an existing training group's name and description.
 * Sends PUT /api/groups/[id] and calls onSuccess callback with updated data.
 */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';

interface EditGroupModalProps {
  isOpen: boolean;
  group: { id: string; name: string; description: string | null } | null;
  onClose: () => void;
  onSuccess: (group: { id: string; name: string; description: string | null }) => void;
}

export function EditGroupModal({ isOpen, group, onClose, onSuccess }: EditGroupModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (group) {
      setName(group.name);
      setDescription(group.description ?? '');
      setError(null);
    }
  }, [group]);

  if (!isOpen || !group) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/groups/${group.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || null }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Fehler beim Speichern');
        return;
      }
      const updated = await res.json();
      onSuccess(updated);
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
          Gruppe bearbeiten
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
              {isSubmitting ? 'Speichere...' : 'Speichern'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

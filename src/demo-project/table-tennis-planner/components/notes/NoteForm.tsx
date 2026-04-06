'use client';

/**
 * Form for creating or editing a trainer note.
 * Shows title and description fields with save/cancel buttons.
 */
import { useState } from 'react';
import { NoteFormData } from '@/lib/types';
import { Button } from '@/components/ui';

interface NoteFormProps {
  initialData?: NoteFormData;
  onSave: (data: NoteFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function NoteForm({ initialData, onSave, onCancel, isLoading }: NoteFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Titel ist erforderlich');
      return;
    }
    if (!description.trim()) {
      setError('Beschreibung ist erforderlich');
      return;
    }

    await onSave({ name: name.trim(), description: description.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
          Titel
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="z.B. Erwärmung, Abschlussspiel..."
          className="w-full px-3 py-2 text-sm rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          style={{ color: 'var(--text-primary)' }}
          maxLength={200}
          autoFocus
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
          Beschreibung
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beschreibe die Notiz..."
          rows={3}
          className="w-full px-3 py-2 text-sm rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
          style={{ color: 'var(--text-primary)' }}
          maxLength={2000}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      )}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit" size="sm" disabled={isLoading}>
          {isLoading ? 'Speichern...' : initialData ? 'Speichern' : 'Erstellen'}
        </Button>
      </div>
    </form>
  );
}

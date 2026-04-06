'use client';

/**
 * Full CRUD list component for trainer notes.
 * Displays all notes with inline create, edit, and delete functionality.
 * Includes an info box explaining the notes feature, a count + create button header,
 * inline NoteForm for create/edit, and NoteCard for each note with menu actions.
 */
import { useState } from 'react';
import { Exercise, NoteFormData } from '@/lib/types';
import { Button } from '@/components/ui';
import NoteCard from './NoteCard';
import NoteForm from './NoteForm';

interface NoteListProps {
  notes: Exercise[];
  isLoading: boolean;
  onCreateNote: (data: NoteFormData) => Promise<Exercise | null>;
  onUpdateNote: (id: string, data: NoteFormData) => Promise<Exercise | null>;
  onDeleteNote: (id: string) => Promise<boolean>;
}

/**
 * Renders the full notes management UI for the trainer.
 */
export default function NoteList({
  notes,
  isLoading,
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
}: NoteListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreate = async (data: NoteFormData) => {
    setIsSaving(true);
    try {
      const result = await onCreateNote(data);
      if (result) {
        setShowCreateForm(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (id: string, data: NoteFormData) => {
    setIsSaving(true);
    try {
      const result = await onUpdateNote(id, data);
      if (result) {
        setEditingId(null);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await onDeleteNote(deletingId);
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Info box */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          Trainer-Notizen
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
          Notizen sind freie Textbausteine, die du wie Übungen Trainingstagen zuordnen kannst –
          z.&nbsp;B. für Erwärmung, Abschlussspiel oder organisatorische Hinweise.
        </p>
      </div>

      {/* Header: count + create button */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
          {notes.length} {notes.length === 1 ? 'Notiz' : 'Notizen'}
        </span>
        {!showCreateForm && (
          <Button
            size="sm"
            variant="glass-accent"
            onClick={() => {
              setShowCreateForm(true);
              setEditingId(null);
            }}
          >
            + Neue Notiz
          </Button>
        )}
      </div>

      {/* Inline create form */}
      {showCreateForm && (
        <div className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm p-4">
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
            Neue Notiz erstellen
          </p>
          <NoteForm
            onSave={handleCreate}
            onCancel={() => setShowCreateForm(false)}
            isLoading={isSaving}
          />
        </div>
      )}

      {/* Loading spinner */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && notes.length === 0 && !showCreateForm && (
        <div className="text-center py-10 rounded-xl border border-white/10 bg-white/5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Noch keine Notizen
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            Erstelle deine erste Notiz mit dem Button oben.
          </p>
        </div>
      )}

      {/* Note list */}
      {!isLoading && notes.length > 0 && (
        <div className="space-y-3">
          {notes.map((note) =>
            editingId === note.id ? (
              <div
                key={note.id}
                className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm p-4"
              >
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Notiz bearbeiten
                </p>
                <NoteForm
                  initialData={{ name: note.name, description: note.description ?? '' }}
                  onSave={(data) => handleUpdate(note.id, data)}
                  onCancel={() => setEditingId(null)}
                  isLoading={isSaving}
                />
              </div>
            ) : (
              <NoteCard
                key={note.id}
                note={note}
                menuButton={
                  <div className="flex gap-1">
                    <button
                      aria-label="Notiz bearbeiten"
                      onClick={() => {
                        setEditingId(note.id);
                        setShowCreateForm(false);
                      }}
                      className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      aria-label="Notiz löschen"
                      onClick={() => setDeletingId(note.id)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                }
              />
            )
          )}
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>
                Notiz wirklich löschen? Zuordnungen zu Trainingstagen werden ebenfalls entfernt.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
              >
                Abbrechen
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="!bg-red-600 hover:!bg-red-700 !text-white"
              >
                {isDeleting ? 'Löschen...' : 'Löschen'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

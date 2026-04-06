'use client';

/**
 * Modal dialog for editing an existing trainer note.
 * Wraps NoteForm in a modal overlay with backdrop.
 */
import { Exercise, NoteFormData } from '@/lib/types';
import NoteForm from './NoteForm';

interface NoteEditModalProps {
  isOpen: boolean;
  note: Exercise;
  onSave: (id: string, data: NoteFormData) => Promise<Exercise | null>;
  onClose: () => void;
  isLoading?: boolean;
}

export default function NoteEditModal({ isOpen, note, onSave, onClose, isLoading }: NoteEditModalProps) {
  if (!isOpen) return null;

  const handleSave = async (data: NoteFormData) => {
    const result = await onSave(note.id, data);
    if (result) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 shadow-xl">
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Notiz bearbeiten
        </p>
        <NoteForm
          initialData={{ name: note.name, description: note.description ?? '' }}
          onSave={handleSave}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

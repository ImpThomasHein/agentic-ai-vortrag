'use client';

/**
 * Confirmation dialog for deleting a trainer note.
 * Warns about cascade deletion of training day assignments.
 */
import { useState } from 'react';
import { Button } from '@/components/ui';

interface NoteDeleteDialogProps {
  isOpen: boolean;
  onConfirm: () => Promise<boolean>;
  onClose: () => void;
}

export default function NoteDeleteDialog({ isOpen, onConfirm, onClose }: NoteDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      const success = await onConfirm();
      if (success) onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
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
          <Button size="sm" variant="ghost" onClick={onClose} disabled={isDeleting}>
            Abbrechen
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="!bg-red-600 hover:!bg-red-700 !text-white"
          >
            {isDeleting ? 'Löschen...' : 'Löschen'}
          </Button>
        </div>
      </div>
    </div>
  );
}

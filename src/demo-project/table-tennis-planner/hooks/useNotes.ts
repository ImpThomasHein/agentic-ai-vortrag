'use client';

/**
 * Hook for managing trainer notes — CRUD operations against the notes API.
 * Notes are stored as Exercise records with type="note".
 */
import { useState, useEffect, useCallback } from 'react';
import { Exercise, NoteFormData } from '@/lib/types';

interface UseNotesReturn {
  notes: Exercise[];
  isLoading: boolean;
  createNote: (data: NoteFormData) => Promise<Exercise | null>;
  updateNote: (id: string, data: NoteFormData) => Promise<Exercise | null>;
  deleteNote: (id: string) => Promise<boolean>;
}

export function useNotes(): UseNotesReturn {
  const [notes, setNotes] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/notes');
      if (res.ok) {
        setNotes(await res.json());
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const createNote = useCallback(async (data: NoteFormData): Promise<Exercise | null> => {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    const note = await res.json();
    setNotes((prev) => [note, ...prev]);
    return note;
  }, []);

  const updateNote = useCallback(async (id: string, data: NoteFormData): Promise<Exercise | null> => {
    const res = await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    const updated = await res.json();
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    return updated;
  }, []);

  const deleteNote = useCallback(async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    if (!res.ok) return false;
    setNotes((prev) => prev.filter((n) => n.id !== id));
    return true;
  }, []);

  return { notes, isLoading, createNote, updateNote, deleteNote };
}

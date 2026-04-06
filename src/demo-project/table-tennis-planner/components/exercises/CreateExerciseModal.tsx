/**
 * Modal dialog for trainers to create a new exercise.
 * Contains a form with all exercise fields (name, description, category,
 * difficulty, TTR range, duration, hints, tags). Calls POST /api/exercises.
 */
'use client';

import { useState, type FormEvent } from 'react';
import { Button, Badge } from '@/components/ui';
import { CATEGORIES, CATEGORY_LABELS, DIFFICULTIES, DIFFICULTY_LABELS, DIFFICULTY_TTR_RANGES } from '@/lib/constants';
import type { DifficultyLevel } from '@/lib/types';
import { validateExerciseForm, buildExercisePayload, type ExerciseFormData } from './createExerciseUtils';

interface CreateExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const INITIAL_FORM: ExerciseFormData = {
  name: '',
  description: '',
  category: 'topspin',
  difficulty: 'beginner',
  ttrMin: DIFFICULTY_TTR_RANGES['beginner'].min,
  ttrMax: DIFFICULTY_TTR_RANGES['beginner'].max,
  durationMinutes: null,
  hints: '',
  tags: '',
};

export function CreateExerciseModal({ isOpen, onClose, onSuccess }: CreateExerciseModalProps) {
  const [form, setForm] = useState<ExerciseFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    const range = DIFFICULTY_TTR_RANGES[difficulty];
    setForm(prev => ({ ...prev, difficulty, ttrMin: range.min, ttrMax: range.max }));
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setServerError(null);
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateExerciseForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setServerError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildExercisePayload(form)),
      });
      if (!res.ok) {
        const data = await res.json();
        setServerError(data.error || 'Fehler beim Erstellen');
        return;
      }
      onSuccess();
      handleClose();
    } catch {
      setServerError('Netzwerkfehler');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="glass rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4">
        <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
          Neue Übung erstellen
        </h2>

        {serverError && (
          <div className="rounded-xl p-3 bg-red-500/10 border border-red-300/40 text-sm text-red-700 font-medium">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="ex-name" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Name *
            </label>
            <input
              id="ex-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="z.B. Topspin aus der Rückhand"
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl text-sm bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 backdrop-blur-sm disabled:opacity-60 placeholder:text-gray-400 transition-all"
              style={{ color: 'var(--text-primary)' }}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="ex-desc" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Beschreibung *
            </label>
            <textarea
              id="ex-desc"
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Beschreibe die Übung..."
              rows={3}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl text-sm bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 backdrop-blur-sm disabled:opacity-60 placeholder:text-gray-400 transition-all resize-none"
              style={{ color: 'var(--text-primary)' }}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Kategorie
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, category: cat }))}
                  disabled={isSubmitting}
                >
                  <Badge
                    size="sm"
                    className={`cursor-pointer transition-all ${
                      form.category === cat
                        ? 'ring-2 ring-blue-500 bg-blue-100 text-blue-700'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Schwierigkeit
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DIFFICULTIES.map(diff => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => handleDifficultyChange(diff)}
                  disabled={isSubmitting}
                >
                  <Badge
                    size="sm"
                    className={`cursor-pointer transition-all ${
                      form.difficulty === diff
                        ? 'ring-2 ring-blue-500 bg-blue-100 text-blue-700'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    {DIFFICULTY_LABELS[diff]}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* TTR Range */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="ex-ttr-min" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                TTR Min
              </label>
              <input
                id="ex-ttr-min"
                type="number"
                value={form.ttrMin}
                onChange={(e) => setForm(prev => ({ ...prev, ttrMin: Number(e.target.value) }))}
                min={0}
                max={3000}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-xl text-sm bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 backdrop-blur-sm disabled:opacity-60 transition-all"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="ex-ttr-max" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                TTR Max
              </label>
              <input
                id="ex-ttr-max"
                type="number"
                value={form.ttrMax}
                onChange={(e) => setForm(prev => ({ ...prev, ttrMax: Number(e.target.value) }))}
                min={0}
                max={3000}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-xl text-sm bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 backdrop-blur-sm disabled:opacity-60 transition-all"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
          </div>
          {errors.ttrRange && <p className="text-xs text-red-500 -mt-2">{errors.ttrRange}</p>}

          {/* Duration */}
          <div>
            <label htmlFor="ex-duration" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Dauer in Minuten (optional)
            </label>
            <input
              id="ex-duration"
              type="number"
              value={form.durationMinutes ?? ''}
              onChange={(e) => setForm(prev => ({ ...prev, durationMinutes: e.target.value ? Number(e.target.value) : null }))}
              min={1}
              max={120}
              disabled={isSubmitting}
              placeholder="z.B. 15"
              className="w-full px-4 py-3 rounded-xl text-sm bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 backdrop-blur-sm disabled:opacity-60 placeholder:text-gray-400 transition-all"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>

          {/* Hints */}
          <div>
            <label htmlFor="ex-hints" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Hinweise (ein Hinweis pro Zeile, optional)
            </label>
            <textarea
              id="ex-hints"
              value={form.hints}
              onChange={(e) => setForm(prev => ({ ...prev, hints: e.target.value }))}
              placeholder={"z.B.\nBall tief anwerfen\nHandgelenk locker"}
              rows={2}
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl text-sm bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 backdrop-blur-sm disabled:opacity-60 placeholder:text-gray-400 transition-all resize-none"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="ex-tags" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Tags (kommagetrennt, optional)
            </label>
            <input
              id="ex-tags"
              type="text"
              value={form.tags}
              onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="z.B. topspin, vorhand, multiball"
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl text-sm bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 backdrop-blur-sm disabled:opacity-60 placeholder:text-gray-400 transition-all"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={handleClose} disabled={isSubmitting} className="flex-1">
              Abbrechen
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Erstelle...' : 'Übung erstellen'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Validation and payload building utilities for the create-exercise form.
 * Keeps business logic separate from the modal component for testability.
 * Note: Uses flat ttrMin/ttrMax fields matching the DB/API schema,
 * not the frontend Exercise type's nested ttrRange object.
 */
import type { ExerciseCategory, DifficultyLevel } from '@/lib/types';

export interface ExerciseFormData {
  name: string;
  description: string;
  category: ExerciseCategory;
  difficulty: DifficultyLevel;
  ttrMin: number;
  ttrMax: number;
  durationMinutes: number | null;
  hints: string;
  tags: string;
}

export type FormErrors = Partial<Record<'name' | 'description' | 'ttrRange', string>>;

export function validateExerciseForm(form: ExerciseFormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = 'Name ist erforderlich';
  if (!form.description.trim()) errors.description = 'Beschreibung ist erforderlich';
  if (form.ttrMin < 0 || form.ttrMax < 0 || form.ttrMin > form.ttrMax) {
    errors.ttrRange = 'TTR-Bereich ungültig (min muss kleiner als max sein)';
  }
  return errors;
}

export function buildExercisePayload(form: ExerciseFormData) {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    category: form.category,
    difficulty: form.difficulty,
    ttrMin: form.ttrMin,
    ttrMax: form.ttrMax,
    durationMinutes: form.durationMinutes ?? null,
    hints: form.hints
      .split('\n')
      .map(h => h.trim())
      .filter(h => h.length > 0),
    tags: form.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0),
    diagram: { trajectories: [] },
  };
}

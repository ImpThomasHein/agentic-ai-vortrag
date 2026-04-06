// components/exercises/createExerciseUtils.test.ts
/**
 * Unit tests for exercise form validation and payload building utilities.
 */
import { describe, it, expect } from 'vitest';
import { validateExerciseForm, buildExercisePayload, type ExerciseFormData } from './createExerciseUtils';

const validForm: ExerciseFormData = {
  name: 'Test Übung',
  description: 'Eine Beschreibung',
  category: 'topspin',
  difficulty: 'beginner',
  ttrMin: 700,
  ttrMax: 1100,
  durationMinutes: 10,
  hints: 'Tipp 1\nTipp 2',
  tags: 'tag1, tag2',
};

describe('validateExerciseForm', () => {
  it('returns no errors for valid form data', () => {
    const errors = validateExerciseForm(validForm);
    expect(errors).toEqual({});
  });

  it('returns error when name is empty', () => {
    const errors = validateExerciseForm({ ...validForm, name: '' });
    expect(errors.name).toBeDefined();
  });

  it('returns error when description is empty', () => {
    const errors = validateExerciseForm({ ...validForm, description: '' });
    expect(errors.description).toBeDefined();
  });

  it('returns error when ttrMin > ttrMax', () => {
    const errors = validateExerciseForm({ ...validForm, ttrMin: 1500, ttrMax: 1000 });
    expect(errors.ttrRange).toBeDefined();
  });

  it('returns error when ttrMin is negative', () => {
    const errors = validateExerciseForm({ ...validForm, ttrMin: -1 });
    expect(errors.ttrRange).toBeDefined();
  });

  it('accepts empty duration', () => {
    const errors = validateExerciseForm({ ...validForm, durationMinutes: null });
    expect(errors).toEqual({});
  });
});

describe('buildExercisePayload', () => {
  it('converts form data to API payload', () => {
    const payload = buildExercisePayload(validForm);
    expect(payload.name).toBe('Test Übung');
    expect(payload.hints).toEqual(['Tipp 1', 'Tipp 2']);
    expect(payload.tags).toEqual(['tag1', 'tag2']);
    expect(payload.durationMinutes).toBe(10);
    expect(payload.diagram).toEqual({ trajectories: [] });
  });

  it('filters empty hints and tags', () => {
    const payload = buildExercisePayload({ ...validForm, hints: 'Tipp 1\n\n  \nTipp 2', tags: 'tag1, , tag2,' });
    expect(payload.hints).toEqual(['Tipp 1', 'Tipp 2']);
    expect(payload.tags).toEqual(['tag1', 'tag2']);
  });

  it('handles empty hints and tags strings', () => {
    const payload = buildExercisePayload({ ...validForm, hints: '', tags: '' });
    expect(payload.hints).toEqual([]);
    expect(payload.tags).toEqual([]);
  });

  it('sets durationMinutes to null when empty', () => {
    const payload = buildExercisePayload({ ...validForm, durationMinutes: null });
    expect(payload.durationMinutes).toBeNull();
  });
});

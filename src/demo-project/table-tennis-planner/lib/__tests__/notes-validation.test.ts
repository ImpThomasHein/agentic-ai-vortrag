/**
 * Unit tests for the notes-validation module.
 * Covers required field validation and max-length constraints for name and description.
 */
import { describe, it, expect } from 'vitest';
import { validateNoteInput } from '../notes-validation';

describe('validateNoteInput', () => {
  it('returns errors for empty data', () => {
    const errors = validateNoteInput({});
    expect(errors).toContain('Name ist erforderlich.');
    expect(errors).toContain('Beschreibung ist erforderlich.');
    expect(errors.length).toBe(2);
  });

  it('returns no errors for valid data', () => {
    const errors = validateNoteInput({
      name: 'Footwork Drill',
      description: 'Focus on lateral movement and weight transfer.',
    });
    expect(errors).toEqual([]);
  });

  it('returns an error when name exceeds 200 characters', () => {
    const errors = validateNoteInput({
      name: 'A'.repeat(201),
      description: 'Valid description.',
    });
    expect(errors).toContain('Name darf maximal 200 Zeichen lang sein.');
    expect(errors.length).toBe(1);
  });

  it('returns an error when description exceeds 2000 characters', () => {
    const errors = validateNoteInput({
      name: 'Valid Name',
      description: 'B'.repeat(2001),
    });
    expect(errors).toContain('Beschreibung darf maximal 2000 Zeichen lang sein.');
    expect(errors.length).toBe(1);
  });
});

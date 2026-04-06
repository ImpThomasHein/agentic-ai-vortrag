import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExerciseActionMenu } from '@/components/exercises';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe('ExerciseActionMenu for notes', () => {
  const noteExercise = {
    id: 'note-1',
    name: 'Test Note',
    description: 'Desc',
    type: 'note' as const,
    category: 'notiz' as const,
    difficulty: 'beginner' as const,
    ttrRange: { min: 0, max: 2500 },
    diagram: { trajectories: [] },
  };

  const regularExercise = {
    ...noteExercise,
    id: 'ex-1',
    type: 'exercise' as const,
    category: 'topspin' as const,
  };

  const defaultProps = {
    upcomingTrainingDays: [],
    onAssignToDay: vi.fn(),
  };

  it('shows "Notiz bearbeiten" and "Notiz löschen" for note type', () => {
    render(
      <ExerciseActionMenu
        exercise={noteExercise}
        {...defaultProps}
        onEditNote={vi.fn()}
        onDeleteNote={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Notiz bearbeiten')).toBeInTheDocument();
    expect(screen.getByText('Notiz löschen')).toBeInTheDocument();
  });

  it('shows "Übung bearbeiten" for regular exercise', () => {
    render(
      <ExerciseActionMenu exercise={regularExercise} {...defaultProps} />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Übung bearbeiten')).toBeInTheDocument();
  });

  it('calls onEditNote when edit note is clicked', () => {
    const onEditNote = vi.fn();
    render(
      <ExerciseActionMenu
        exercise={noteExercise}
        {...defaultProps}
        onEditNote={onEditNote}
        onDeleteNote={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Notiz bearbeiten'));
    expect(onEditNote).toHaveBeenCalledWith('note-1');
  });

  it('calls onDeleteNote when delete note is clicked', () => {
    const onDeleteNote = vi.fn();
    render(
      <ExerciseActionMenu
        exercise={noteExercise}
        {...defaultProps}
        onEditNote={vi.fn()}
        onDeleteNote={onDeleteNote}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Notiz löschen'));
    expect(onDeleteNote).toHaveBeenCalledWith('note-1');
  });
});

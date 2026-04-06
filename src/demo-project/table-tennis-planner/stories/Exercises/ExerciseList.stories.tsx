import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { useState } from 'react';
import ExerciseList from '@/components/exercises/ExerciseList';
import VoteButton from '@/components/exercises/VoteButton';
import { mockExercises, falkenbergExercise, mockVoteCountFn } from '../mocks/mockData';
import type { Exercise } from '@/lib/types';

const meta: Meta<typeof ExerciseList> = {
  title: 'Exercises/ExerciseList',
  component: ExerciseList,
  parameters: { layout: 'padded' },
  args: {
    exercises: mockExercises,
    showVoteCount: false,
    emptyMessage: 'Keine Übungen gefunden',
  },
};
export default meta;
type Story = StoryObj<typeof ExerciseList>;

export const Default: Story = { args: { exercises: mockExercises } };

export const Empty: Story = {
  args: { exercises: [] },
};

export const EmptyCustomMessage: Story = {
  args: { exercises: [], emptyMessage: 'Keine Übungen für diese Kategorie' },
};

export const Single: Story = {
  args: { exercises: [falkenbergExercise] },
};

export const WithVoteCounts: Story = {
  args: {
    exercises: mockExercises,
    voteCount: mockVoteCountFn,
    showVoteCount: true,
  },
};

export const WithVoteButtons: Story = {
  render: () => {
    const [votes, setVotes] = useState<Set<string>>(new Set());
    return (
      <ExerciseList
        exercises={mockExercises}
        voteCount={mockVoteCountFn}
        showVoteCount={true}
        renderAction={(exercise: Exercise) => (
          <VoteButton
            voted={votes.has(exercise.id)}
            onToggle={() => {
              setVotes(prev => {
                const next = new Set(prev);
                if (next.has(exercise.id)) next.delete(exercise.id);
                else next.add(exercise.id);
                return next;
              });
            }}
          />
        )}
      />
    );
  },
};

export const SingleColumn: Story = {
  args: {
    exercises: mockExercises,
    gridClassName: 'grid grid-cols-1 gap-4',
  },
};

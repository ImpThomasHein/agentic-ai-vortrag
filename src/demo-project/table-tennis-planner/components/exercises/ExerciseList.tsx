'use client';

import { Exercise } from '@/lib/types';
import ExerciseCard from './ExerciseCard';
import { ReactNode } from 'react';

interface ExerciseListProps {
  exercises: Exercise[];
  renderAction?: (exercise: Exercise) => ReactNode;
  renderMenu?: (exercise: Exercise) => ReactNode;
  voteCount?: (exerciseId: string) => number;
  showVoteCount?: boolean;
  emptyMessage?: string;
  gridClassName?: string;
}

export default function ExerciseList({
  exercises,
  renderAction,
  renderMenu,
  voteCount,
  showVoteCount = false,
  emptyMessage = 'Keine Übungen gefunden',
  gridClassName = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
}: ExerciseListProps) {
  if (exercises.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-2">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          voteCount={voteCount ? voteCount(exercise.id) : 0}
          showVoteCount={showVoteCount}
          actionButton={renderAction ? renderAction(exercise) : undefined}
          menuButton={renderMenu ? renderMenu(exercise) : undefined}
        />
      ))}
    </div>
  );
}

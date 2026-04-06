'use client';

import { Exercise } from '@/lib/types';
import { CATEGORY_LABELS, CATEGORY_COLORS, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/lib/constants';
import { Card, Badge } from '@/components/ui';
import TableTennisDiagram from '@/components/diagrams/TableTennisDiagram';
import { ReactNode } from 'react';

interface ExerciseCardProps {
  exercise: Exercise;
  voteCount?: number;
  actionButton?: ReactNode;
  menuButton?: ReactNode;
  showVoteCount?: boolean;
}

export default function ExerciseCard({
  exercise,
  voteCount = 0,
  actionButton,
  menuButton,
  showVoteCount = false,
}: ExerciseCardProps) {
  const categoryColor = CATEGORY_COLORS[exercise.category] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  const difficultyColor = DIFFICULTY_COLORS[exercise.difficulty] || { bg: 'bg-gray-100', text: 'text-gray-700' };

  // Early return for note-type exercises: render a simplified card without diagram
  if (exercise.type === 'note') {
    return (
      <Card variant="glass" className="flex gap-4 transition-shadow duration-300 hover:shadow-lg h-full">
        {/* Note icon left */}
        <div className="flex-shrink-0 glass-dark rounded-xl p-2 flex items-start justify-center">
          <svg className="w-16 h-16 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>

        {/* Content right */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Title and votes/menu */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
              {exercise.name}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              {showVoteCount && voteCount > 0 && (
                <span className="flex items-center gap-1 text-xs text-pink-600 font-semibold glass-dark px-2 py-1 rounded-lg bg-pink-500/5">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                  {voteCount}
                </span>
              )}
              {menuButton}
            </div>
          </div>

          {/* Notiz badge */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            <Badge className="bg-amber-100 text-amber-800 backdrop-blur-sm" size="sm">
              Notiz
            </Badge>
          </div>

          {/* Description */}
          <p className="text-xs line-clamp-3 mb-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {exercise.description}
          </p>

          {/* Action button */}
          {actionButton && (
            <div className="mt-auto pt-2">
              {actionButton}
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="flex gap-4 transition-shadow duration-300 hover:shadow-lg h-full">
      {/* Diagramm links */}
      <div className="flex-shrink-0 glass-dark rounded-xl p-2">
        <TableTennisDiagram
          trajectories={exercise.diagram.trajectories}
          size="small"
        />
      </div>

      {/* Inhalt rechts */}
      <div className="flex-1 min-w-0">
        {/* Titel und Votes/Menu */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
            {exercise.name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            {showVoteCount && voteCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-pink-600 font-semibold glass-dark px-2 py-1 rounded-lg bg-pink-500/5">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                {voteCount}
              </span>
            )}
            {menuButton}
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          <Badge className={`${categoryColor.bg} ${categoryColor.text} backdrop-blur-sm`} size="sm">
            {CATEGORY_LABELS[exercise.category]}
          </Badge>
          <Badge className={`${difficultyColor.bg} ${difficultyColor.text} backdrop-blur-sm`} size="sm">
            {DIFFICULTY_LABELS[exercise.difficulty]}
          </Badge>
          <Badge variant="default" size="sm" className="backdrop-blur-sm">
            {exercise.ttrRange.min}-{exercise.ttrRange.max} TTR
          </Badge>
          {exercise.duration && (
            <Badge variant="default" size="sm" className="backdrop-blur-sm">
              {exercise.duration} Min
            </Badge>
          )}
        </div>

        {/* Beschreibung */}
        <p className="text-xs line-clamp-2 mb-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {exercise.description}
        </p>

        {/* Hinweise */}
        {exercise.hints && exercise.hints.length > 0 && (
          <div className="text-xs mb-2 glass-dark rounded-lg px-2.5 py-1.5 inline-block" style={{ color: 'var(--text-secondary)' }}>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Tipp:</span> {exercise.hints[0]}
          </div>
        )}

        {/* Action Button (Vote oder Select) */}
        {actionButton && (
          <div className="mt-auto pt-2">
            {actionButton}
          </div>
        )}
      </div>
    </Card>
  );
}

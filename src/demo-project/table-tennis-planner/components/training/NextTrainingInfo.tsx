'use client';

import Link from 'next/link';
import { WEEKDAY_LABELS } from '@/lib/constants';
import { formatTrainingDateForDisplay, daysUntilNextTraining } from '@/lib/training-schedule';
import { Weekday, Exercise } from '@/lib/types';
import ExerciseCard from '@/components/exercises/ExerciseCard';

interface NextTrainingInfoProps {
  nextTrainingDate: Date | null;
  weekdays: Weekday[];
  variant?: 'default' | 'compact';
  /** Übungen die für das nächste Training geplant sind */
  plannedExercises?: Exercise[];
  /** Vote-Count Funktion (optional) */
  voteCount?: (exerciseId: string) => number;
  /** Zeige Vote-Count an */
  showVoteCount?: boolean;
  /** Callback zum Ändern der Reihenfolge (nur für Trainer) */
  onReorder?: (exerciseId: string, direction: 'up' | 'down') => void;
}

export function NextTrainingInfo({
  nextTrainingDate,
  weekdays,
  variant = 'default',
  plannedExercises = [],
  voteCount,
  showVoteCount = false,
  onReorder,
}: NextTrainingInfoProps) {
  if (!nextTrainingDate) {
    return (
      <div className="glass-dark rounded-2xl p-4 border border-orange-200/30 bg-orange-500/5">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-orange-700 font-medium leading-relaxed">
              Noch keine Trainingstage festgelegt
            </p>
          </div>
        </div>
      </div>
    );
  }

  const displayText = formatTrainingDateForDisplay(nextTrainingDate, WEEKDAY_LABELS);
  const daysUntil = daysUntilNextTraining(weekdays);

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 text-sm">
        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
          {displayText}
        </span>
        {daysUntil !== null && daysUntil > 0 && (
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            (in {daysUntil} {daysUntil === 1 ? 'Tag' : 'Tagen'})
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="glass-dark rounded-2xl p-4 border border-blue-200/30 bg-blue-500/5">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium text-blue-600 mb-1">Nächstes Training</p>
          <p className="text-base font-bold text-blue-900">
            {displayText}
          </p>
          {daysUntil !== null && daysUntil > 0 && (
            <p className="text-xs text-blue-700 mt-1">
              in {daysUntil} {daysUntil === 1 ? 'Tag' : 'Tagen'}
            </p>
          )}
        </div>
      </div>

      {/* Geplante Übungen */}
      {plannedExercises.length > 0 && (
        <div className="mt-3 pt-3 border-t border-blue-200/30">
          <p className="text-xs font-medium text-blue-600 mb-2">
            {plannedExercises.length} Übung{plannedExercises.length !== 1 ? 'en' : ''} geplant
          </p>
          <div className="space-y-2">
            {plannedExercises.map((exercise, index) => (
              <div key={exercise.id} className="flex items-center gap-2">
                {/* Reorder buttons */}
                {onReorder && (
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => onReorder(exercise.id, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded-md hover:bg-white/20 active:bg-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Nach oben"
                    >
                      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onReorder(exercise.id, 'down')}
                      disabled={index === plannedExercises.length - 1}
                      className="p-1 rounded-md hover:bg-white/20 active:bg-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Nach unten"
                    >
                      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
                {/* Exercise card */}
                <div className="flex-1">
                  <ExerciseCard
                    exercise={exercise}
                    voteCount={voteCount ? voteCount(exercise.id) : undefined}
                    showVoteCount={showVoteCount}
                    menuButton={
                      <Link
                        href={`/trainer/editor/${exercise.id}`}
                        className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                        title="Übung bearbeiten"
                      >
                        <svg className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Link>
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

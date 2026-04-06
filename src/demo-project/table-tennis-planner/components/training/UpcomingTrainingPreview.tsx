'use client';

import { useState } from 'react';
import { ComputedTrainingDay, Exercise } from '@/lib/types';
import ExerciseCard from '@/components/exercises/ExerciseCard';

interface UpcomingTrainingPreviewProps {
  upcomingDays: ComputedTrainingDay[];
  allExercises: Exercise[];
  voteCount: (exerciseId: string) => number;
}

export function UpcomingTrainingPreview({
  upcomingDays,
  allExercises,
  voteCount,
}: UpcomingTrainingPreviewProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (upcomingDays.length === 0) {
    return (
      <div className="glass-dark rounded-2xl p-4 border border-orange-200/30 bg-orange-500/5">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-sm text-orange-700 font-medium leading-relaxed">
            Noch keine Trainingstage festgelegt
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-dark rounded-2xl overflow-hidden border border-blue-200/30 bg-blue-500/5">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-blue-200/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-blue-600">Nächste {upcomingDays.length} Trainings</p>
        </div>
      </div>

      {/* Accordion */}
      <div className="divide-y divide-blue-200/20">
        {upcomingDays.map((day, index) => {
          const isOpen = openIndex === index;
          const exercises = day.exerciseIds
            .map(id => allExercises.find(e => e.id === id))
            .filter((e): e is Exercise => e !== undefined);
          const isToday = day.isToday;

          return (
            <div key={day.dateString}>
              {/* Accordion Header */}
              <button
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-500/5 transition-colors text-left"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isToday && (
                    <span className="flex-shrink-0 text-xs font-bold text-white bg-blue-500 px-2 py-0.5 rounded-full">
                      Heute
                    </span>
                  )}
                  <span
                    className="text-sm font-semibold truncate"
                    style={{ color: isToday ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                  >
                    {isToday ? day.displayLabel.replace('Heute', '').trim() || day.weekdayLabel : day.displayLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  {exercises.length > 0 && (
                    <span className="text-xs font-semibold text-blue-600 glass-dark px-2 py-0.5 rounded-full bg-blue-500/10">
                      {exercises.length}
                    </span>
                  )}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--text-secondary)' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div className="px-4 pb-4 space-y-2">
                  {exercises.length > 0 ? (
                    exercises.map(exercise => (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        voteCount={voteCount(exercise.id)}
                        showVoteCount={true}
                      />
                    ))
                  ) : (
                    <p className="text-xs py-2 text-center" style={{ color: 'var(--text-secondary)' }}>
                      Noch keine Übungen geplant
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

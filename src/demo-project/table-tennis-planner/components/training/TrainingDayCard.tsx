'use client';

import { useState } from 'react';
import { Exercise, ComputedTrainingDay, TrainingDayAssignment } from '@/lib/types';
import { Badge, Card } from '../ui';
import { TrainingDayExerciseItem } from './TrainingDayExerciseItem';

interface TrainingDayCardProps {
  trainingDay: ComputedTrainingDay;
  exercises: Exercise[];
  assignments: TrainingDayAssignment[];
  voteCount?: (exerciseId: string) => number;
  onRemoveExercise: (assignmentId: string) => void;
  onCopyExercise: (assignmentId: string) => void;
  onMoveExercise: (assignmentId: string) => void;
}

export function TrainingDayCard({
  trainingDay,
  exercises,
  assignments,
  voteCount,
  onRemoveExercise,
  onCopyExercise,
  onMoveExercise,
}: TrainingDayCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Finde die Übungen für diesen Tag
  const dayAssignments = assignments.filter(a => a.trainingDate === trainingDay.dateString);
  const dayExercises = dayAssignments
    .map(a => ({
      assignment: a,
      exercise: exercises.find(e => e.id === a.exerciseId),
    }))
    .filter((item): item is { assignment: TrainingDayAssignment; exercise: Exercise } =>
      item.exercise !== undefined
    );

  return (
    <Card variant="glass" padding="none" className="overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Datum-Icon */}
          <div className={`
            w-10 h-10 rounded-xl flex flex-col items-center justify-center
            ${trainingDay.isToday ? 'bg-blue-500 text-white' : 'glass-dark'}
          `}>
            <span className="text-[10px] font-semibold uppercase leading-none">
              {trainingDay.weekdayLabel.substring(0, 2)}
            </span>
            <span className="text-sm font-bold leading-none">
              {trainingDay.date.getDate()}
            </span>
          </div>

          {/* Datum Text */}
          <div className="text-left">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              {trainingDay.displayLabel}
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {dayExercises.length === 0
                ? 'Keine Übungen geplant'
                : `${dayExercises.length} Übung${dayExercises.length !== 1 ? 'en' : ''}`
              }
            </p>
          </div>
        </div>

        {/* Badge und Expand Icon */}
        <div className="flex items-center gap-2">
          {dayExercises.length > 0 && (
            <Badge variant="info" size="sm">
              {dayExercises.length}
            </Badge>
          )}
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            style={{ color: 'var(--text-secondary)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Übungsliste */}
      {isExpanded && dayExercises.length > 0 && (
        <div className="px-4 pb-4 space-y-2">
          {dayExercises.map(({ assignment, exercise }) => (
            <TrainingDayExerciseItem
              key={assignment.id}
              exercise={exercise}
              assignment={assignment}
              voteCount={voteCount?.(exercise.id)}
              onRemove={() => onRemoveExercise(assignment.id)}
              onCopyToNext={() => onCopyExercise(assignment.id)}
              onMove={() => onMoveExercise(assignment.id)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {isExpanded && dayExercises.length === 0 && (
        <div className="px-4 pb-4">
          <div className="glass-dark rounded-xl p-4 text-center">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Füge Übungen über die Trainer-Ansicht hinzu
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}

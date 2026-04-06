/** 3-dot action menu for exercises: assign to training days, edit, delete. Includes vote count badge and optional group name in header. */
'use client';

import { useRouter } from 'next/navigation';
import { Exercise, ComputedTrainingDay } from '@/lib/types';
import { DropdownMenu, MenuTriggerButton, DropdownMenuItem } from '../ui/DropdownMenu';
import { Badge } from '../ui';
import { buildMenuHeaderLabel } from './exerciseActionMenuUtils';

interface ExerciseActionMenuProps {
  exercise: Exercise;
  upcomingTrainingDays: ComputedTrainingDay[];
  onAssignToDay: (exerciseId: string, dateString: string) => void;
  voteCount?: number;
  isAssignedToDate?: (exerciseId: string, dateString: string) => boolean;
  onEditNote?: (noteId: string) => void;
  onDeleteNote?: (noteId: string) => void;
  groupName?: string;
}

export function ExerciseActionMenu({
  exercise,
  upcomingTrainingDays,
  onAssignToDay,
  voteCount,
  isAssignedToDate,
  onEditNote,
  onDeleteNote,
  groupName,
}: ExerciseActionMenuProps) {
  const router = useRouter();

  // Erstelle Menü-Items für jeden kommenden Trainingstag
  const trainingDayItems: DropdownMenuItem[] = upcomingTrainingDays.slice(0, 6).map(day => {
    const isAlreadyAssigned = isAssignedToDate?.(exercise.id, day.dateString) ?? false;

    return {
      label: day.displayLabel,
      icon: (
        <svg
          className={`w-4 h-4 ${isAlreadyAssigned ? 'text-green-500' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isAlreadyAssigned ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          )}
        </svg>
      ),
      onClick: () => onAssignToDay(exercise.id, day.dateString),
    };
  });

  // For notes: edit + delete actions; for exercises: editor link
  const actionItems: DropdownMenuItem[] = exercise.type === 'note'
    ? [
        {
          label: 'Notiz bearbeiten',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          ),
          onClick: () => onEditNote?.(exercise.id),
        },
        {
          label: 'Notiz löschen',
          icon: (
            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          ),
          onClick: () => onDeleteNote?.(exercise.id),
        },
      ]
    : [
        {
          label: 'Übung bearbeiten',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          ),
          onClick: () => router.push(`/trainer/editor/${exercise.id}`),
        },
      ];

  // Menü-Items zusammenstellen
  const menuItems: DropdownMenuItem[] = trainingDayItems.length > 0
    ? [...trainingDayItems, { type: 'separator' }, ...actionItems]
    : [...actionItems];

  // Header mit Vote-Count (nur wenn Trainingstage existieren)
  const header = trainingDayItems.length > 0 ? (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
        {buildMenuHeaderLabel(groupName)}
      </span>
      {voteCount !== undefined && voteCount > 0 && (
        <Badge variant="info" size="sm">
          {voteCount} Vote{voteCount !== 1 ? 's' : ''}
        </Badge>
      )}
    </div>
  ) : undefined;

  return (
    <DropdownMenu
      trigger={<MenuTriggerButton />}
      items={menuItems}
      header={header}
      align="right"
    />
  );
}

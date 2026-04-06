/**
 * Tab content for "Übungen" — pure exercise library.
 * Shows filters, exercise list, and action buttons.
 * Used by both trainer (with create/assign actions) and player (with voting).
 */
'use client';

import { useState, ReactNode } from 'react';
import { ExerciseFilters as FilterType, Exercise, Group } from '@/lib/types';
import ExerciseFilters from './ExerciseFilters';
import ExerciseList from './ExerciseList';
import { Button } from '@/components/ui';
import { GruppenChips } from '@/components/training/GruppenChips';

interface UebungenTabProps {
  exercises: Exercise[];
  isFiltered: boolean;
  editable?: boolean;
  onCreateExercise?: () => void;
  onCreateNote?: () => void;
  renderAction?: (exercise: Exercise) => ReactNode;
  renderMenu?: (exercise: Exercise) => ReactNode;
  voteCount?: (exerciseId: string) => number;
  showVoteCount?: boolean;
  infoBox?: ReactNode;
  showDifficulty?: boolean;
  groups?: Group[];
  selectedGroupId?: string | null;
  onSelectGroup?: (id: string) => void;
}

export function UebungenTab({
  exercises,
  isFiltered,
  editable = false,
  onCreateExercise,
  onCreateNote,
  renderAction,
  renderMenu,
  voteCount,
  showVoteCount = false,
  infoBox,
  showDifficulty = true,
  groups,
  selectedGroupId,
  onSelectGroup,
}: UebungenTabProps) {
  const [filters, setFilters] = useState<FilterType>({
    categories: [],
    difficulty: null,
  });

  const filtered = exercises.filter((ex) => {
    if (filters.categories.length > 0 && !filters.categories.includes(ex.category)) return false;
    if (filters.difficulty && ex.difficulty !== filters.difficulty) return false;
    return true;
  });

  const hasActiveFilters = filters.categories.length > 0 || filters.difficulty !== null;

  return (
    <div className="px-4 space-y-4">
      {infoBox}

      <div className="glass rounded-2xl p-4">
        <ExerciseFilters
          filters={filters}
          onFiltersChange={setFilters}
          showDifficulty={showDifficulty}
        />
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({ categories: [], difficulty: null })}
            className="mt-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            Filter zurücksetzen
          </Button>
        )}
      </div>

      {editable && (
        <div className="flex gap-3">
          {onCreateExercise && (
            <Button variant="primary" onClick={onCreateExercise} className="flex-1">
              + Neue Übung
            </Button>
          )}
          {onCreateNote && (
            <Button
              variant="glass"
              onClick={onCreateNote}
              className="flex-1"
              style={{ borderColor: 'rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.08)' }}
            >
              ✏️ Neue Notiz
            </Button>
          )}
        </div>
      )}

      {groups && onSelectGroup && (
        <GruppenChips
          groups={groups}
          selectedGroupId={selectedGroupId ?? null}
          onSelectGroup={onSelectGroup}
          accentColor="blue"
        />
      )}

      <ExerciseList
        exercises={filtered}
        renderAction={renderAction}
        renderMenu={renderMenu}
        voteCount={voteCount}
        showVoteCount={showVoteCount}
        emptyMessage="Keine Übungen für diese Filter gefunden"
        gridClassName="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      />
    </div>
  );
}

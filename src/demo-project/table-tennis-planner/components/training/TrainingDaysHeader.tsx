'use client';

import { useState, useEffect } from 'react';
import { Weekday } from '@/lib/types';
import { WEEKDAY_LABELS_SHORT } from '@/lib/constants';
import { Button } from '../ui';

interface TrainingDaysHeaderProps {
  weekdays: Weekday[];
  hasSchedule: boolean;
  onSave: (weekdays: Weekday[]) => void;
}

const WEEKDAYS_ORDERED: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

export function TrainingDaysHeader({
  weekdays,
  hasSchedule,
  onSave,
}: TrainingDaysHeaderProps) {
  const [isEditing, setIsEditing] = useState(!hasSchedule);
  const [localSelection, setLocalSelection] = useState<Weekday[]>(weekdays);

  useEffect(() => {
    setLocalSelection(weekdays);
  }, [weekdays]);

  useEffect(() => {
    if (!hasSchedule) setIsEditing(true);
  }, [hasSchedule]);

  const toggleWeekday = (weekday: Weekday) => {
    setLocalSelection(prev =>
      prev.includes(weekday)
        ? prev.filter(wd => wd !== weekday)
        : [...prev, weekday]
    );
  };

  const handleSave = async () => {
    await onSave(localSelection);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalSelection(weekdays);
    setIsEditing(false);
  };

  const hasChanges = JSON.stringify([...localSelection].sort()) !== JSON.stringify([...weekdays].sort());

  return (
    <div className="glass rounded-2xl p-4 mb-4 w-full border border-white/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Trainingstage
          </h3>
        </div>
        {hasSchedule && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700
                       px-2.5 py-1.5 rounded-lg hover:bg-blue-500/10 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Ändern
          </button>
        )}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAYS_ORDERED.map((weekday) => {
          const isSelected = isEditing
            ? localSelection.includes(weekday)
            : weekdays.includes(weekday);

          return (
            <button
              key={weekday}
              onClick={() => isEditing && toggleWeekday(weekday)}
              disabled={!isEditing}
              className={`
                h-10 rounded-xl text-xs font-bold transition-all duration-200
                ${isEditing ? 'cursor-pointer' : 'cursor-default'}
                ${
                  isSelected
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
                    : isEditing
                      ? 'glass-dark hover:bg-white/15 border border-white/10'
                      : 'opacity-30'
                }
              `}
              style={!isSelected ? { color: 'var(--text-secondary)' } : undefined}
            >
              {WEEKDAY_LABELS_SHORT[weekday]}
            </button>
          );
        })}
      </div>

      {isEditing && (
        <div className="flex gap-2 mt-3">
          <Button
            onClick={handleSave}
            disabled={localSelection.length === 0}
            variant="primary"
            size="sm"
            className="flex-1"
          >
            {hasChanges ? 'Speichern' : 'Gespeichert'}
          </Button>
          {hasSchedule && (
            <Button
              onClick={handleCancel}
              variant="ghost"
              size="sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Abbrechen
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

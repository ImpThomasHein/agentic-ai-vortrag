'use client';

import { useState, useEffect } from 'react';
import { Weekday } from '@/lib/types';
import { WEEKDAY_LABELS_SHORT } from '@/lib/constants';
import { Button } from '../ui';

interface TrainingScheduleSelectorProps {
  selectedWeekdays: Weekday[];
  onSave: (weekdays: Weekday[]) => void;
}

// Alle Wochentage in der richtigen Reihenfolge (Mo-So)
const WEEKDAYS_ORDERED: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

export function TrainingScheduleSelector({
  selectedWeekdays,
  onSave,
}: TrainingScheduleSelectorProps) {
  const [localSelection, setLocalSelection] = useState<Weekday[]>(selectedWeekdays);

  // Sync when prop changes (e.g. existing schedule loads after mount)
  useEffect(() => {
    setLocalSelection(selectedWeekdays);
  }, [selectedWeekdays]);

  const toggleWeekday = (weekday: Weekday) => {
    const newSelection = localSelection.includes(weekday)
      ? localSelection.filter((wd) => wd !== weekday)
      : [...localSelection, weekday];

    setLocalSelection(newSelection);
  };

  const handleSave = () => {
    onSave(localSelection);
  };

  const hasChanges = JSON.stringify([...localSelection].sort()) !== JSON.stringify([...selectedWeekdays].sort());

  return (
    <div className="glass rounded-2xl p-4">
      <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        Trainingstage festlegen
      </h3>

      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
        Wähle die Wochentage, an denen Training stattfindet:
      </p>

      {/* Wochentag-Auswahl */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {WEEKDAYS_ORDERED.map((weekday) => {
          const isSelected = localSelection.includes(weekday);

          return (
            <button
              key={weekday}
              onClick={() => toggleWeekday(weekday)}
              className={`
                h-12 rounded-xl font-semibold text-sm transition-all duration-200
                ${
                  isSelected
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'glass-dark hover:bg-white/10'
                }
              `}
              style={!isSelected ? { color: 'var(--text-secondary)' } : undefined}
            >
              {WEEKDAY_LABELS_SHORT[weekday]}
            </button>
          );
        })}
      </div>

      {/* Info-Text */}
      {localSelection.length > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-200/30">
          <p className="text-sm text-blue-700 font-medium">
            {localSelection.length === 1 ? '1 Trainingstag' : `${localSelection.length} Trainingstage`} ausgewählt
          </p>
        </div>
      )}

      {/* Speichern Button */}
      <Button
        onClick={handleSave}
        disabled={localSelection.length === 0}
        variant={hasChanges ? 'primary' : 'secondary'}
        className="w-full"
      >
        {hasChanges ? 'Änderungen speichern' : 'Gespeichert'}
      </Button>
    </div>
  );
}

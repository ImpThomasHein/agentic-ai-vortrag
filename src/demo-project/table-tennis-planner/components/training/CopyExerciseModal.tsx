'use client';

import { useEffect } from 'react';
import { Exercise, ComputedTrainingDay } from '@/lib/types';
import { Button, Card } from '../ui';

interface CopyExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
  currentDateString: string;
  availableDays: ComputedTrainingDay[];
  onCopy: (targetDateString: string) => void;
}

export function CopyExerciseModal({
  isOpen,
  onClose,
  exercise,
  currentDateString,
  availableDays,
  onCopy,
}: CopyExerciseModalProps) {
  // Escape-Taste zum Schließen
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Body-Scroll blockieren wenn Modal offen
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!isOpen || !exercise) return null;

  const handleCopy = (dateString: string) => {
    onCopy(dateString);
    onClose();
  };

  // Prüfen ob Übung bereits an einem Tag existiert
  const isAlreadyAssigned = (day: ComputedTrainingDay) => {
    return day.exerciseIds.includes(exercise.id);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        <Card variant="glass" padding="none" className="overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Übung kopieren
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {exercise.name}
            </p>
          </div>

          {/* Trainingstage */}
          <div className="p-4 max-h-[50vh] overflow-y-auto">
            <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
              Wähle einen Trainingstag zum Kopieren:
            </p>
            <div className="space-y-2">
              {availableDays.map((day) => {
                const isCurrent = day.dateString === currentDateString;
                const alreadyAssigned = isAlreadyAssigned(day);
                const isDisabled = isCurrent || alreadyAssigned;

                return (
                  <button
                    key={day.dateString}
                    onClick={() => !isDisabled && handleCopy(day.dateString)}
                    disabled={isDisabled}
                    className={`
                      w-full p-3 rounded-xl text-left
                      flex items-center gap-3
                      transition-colors duration-150
                      ${isDisabled
                        ? 'opacity-50 cursor-not-allowed glass-dark'
                        : 'glass-dark hover:bg-white/10 cursor-pointer'
                      }
                    `}
                  >
                    {/* Datum-Icon */}
                    <div className={`
                      w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0
                      ${day.isToday ? 'bg-blue-500 text-white' : 'bg-white/10'}
                    `}>
                      <span className="text-[10px] font-semibold uppercase leading-none">
                        {day.weekdayLabel.substring(0, 2)}
                      </span>
                      <span className="text-sm font-bold leading-none">
                        {day.date.getDate()}
                      </span>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                        {day.displayLabel}
                      </span>
                      {isCurrent && (
                        <span className="text-xs ml-2" style={{ color: 'var(--text-secondary)' }}>
                          (Quelle)
                        </span>
                      )}
                      {alreadyAssigned && !isCurrent && (
                        <span className="text-xs ml-2" style={{ color: 'var(--text-secondary)' }}>
                          (bereits vorhanden)
                        </span>
                      )}
                      {day.exerciseIds.length > 0 && !isDisabled && (
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {day.exerciseIds.length} Übung{day.exerciseIds.length !== 1 ? 'en' : ''} geplant
                        </p>
                      )}
                    </div>

                    {/* Arrow */}
                    {!isDisabled && (
                      <svg className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/10">
            <Button variant="ghost" className="w-full" onClick={onClose}>
              Abbrechen
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

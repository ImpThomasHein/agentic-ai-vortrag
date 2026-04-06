/**
 * Modal for choosing existing exercises and notes to assign to a training session.
 * Shows a searchable, filterable list with toggle buttons.
 * Footer offers "create new" shortcuts for exercises and notes.
 * Uses the app's glass-morphism design system.
 */
'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Exercise } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/constants';

interface ExercisePickerModalProps {
  isOpen: boolean;
  exercises: Exercise[];
  assignedExerciseIds: string[];
  onToggle: (exerciseId: string) => void;
  onCreateExercise: () => void;
  onCreateNote: () => void;
  onClose: () => void;
}

export function ExercisePickerModal({
  isOpen,
  exercises,
  assignedExerciseIds,
  onToggle,
  onCreateExercise,
  onCreateNote,
  onClose,
}: ExercisePickerModalProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'exercises' | 'notes'>('all');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setFilter('all');
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    let list = exercises;
    if (filter === 'exercises') list = list.filter(e => e.type !== 'note');
    if (filter === 'notes') list = list.filter(e => e.type === 'note');
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q) || e.category?.toLowerCase().includes(q));
    }
    return list;
  }, [exercises, filter, search]);

  const assignedCount = assignedExerciseIds.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
        onClick={onClose}
        style={{ animation: 'fadeIn 200ms ease-out' }}
      />

      {/* Modal panel */}
      <div
        className="relative w-full max-w-lg max-h-[85vh] glass-dark rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden"
        style={{
          animation: 'slideUp 300ms cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 -4px 40px rgba(31, 38, 135, 0.18), 0 24px 80px rgba(0, 0, 0, 0.12)',
        }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-[15px]" style={{ color: 'var(--text-primary)' }}>
                Übung hinzufügen
              </h3>
              {assignedCount > 0 && (
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {assignedCount} ausgewählt
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full glass flex items-center justify-center text-sm transition-all hover:scale-105 active:scale-95"
              style={{ color: 'var(--text-secondary)' }}
            >
              ✕
            </button>
          </div>

          {/* Search field */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Übung suchen..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl glass text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-shadow"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>

          {/* Filter chips */}
          <div className="flex gap-1.5 mt-3">
            {([['all', 'Alle'], ['exercises', 'Übungen'], ['notes', 'Notizen']] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide uppercase transition-all ${
                  filter === key
                    ? 'bg-[#2563eb]/12 text-[#2563eb] shadow-sm'
                    : 'hover:bg-black/4'
                }`}
                style={filter !== key ? { color: 'var(--text-secondary)' } : undefined}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-black/8 to-transparent mx-4" />

        {/* Exercise list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-2xl bg-black/4 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-black/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Keine Übungen gefunden
              </p>
            </div>
          ) : (
            filtered.map((ex) => {
              const isAssigned = assignedExerciseIds.includes(ex.id);
              const isNote = ex.type === 'note';
              return (
                <button
                  key={ex.id}
                  onClick={() => onToggle(ex.id)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all active:scale-[0.98] ${
                    isAssigned
                      ? 'glass border-blue-300/30'
                      : 'hover:bg-white/40 border border-transparent'
                  }`}
                  style={isAssigned ? {
                    background: 'rgba(37, 99, 235, 0.06)',
                    borderColor: 'rgba(37, 99, 235, 0.15)',
                  } : undefined}
                >
                  {/* Checkbox */}
                  <span
                    className={`w-[22px] h-[22px] rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                      isAssigned
                        ? 'bg-[#2563eb] text-white shadow-sm shadow-blue-500/25'
                        : 'bg-white/60 border border-black/12'
                    }`}
                  >
                    {isAssigned && (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {isNote ? `📝 ${ex.name}` : ex.name}
                    </div>
                    {ex.category && (
                      <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {isNote ? 'Notiz' : CATEGORY_LABELS[ex.category] || ex.category}
                      </div>
                    )}
                  </div>

                  {/* Difficulty badge */}
                  {!isNote && ex.difficulty && (
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
                      ex.difficulty === 'advanced' ? 'bg-red-500/8 text-red-600' :
                      ex.difficulty === 'intermediate' ? 'bg-amber-500/8 text-amber-600' :
                      'bg-green-500/8 text-green-600'
                    }`}>
                      {ex.difficulty === 'advanced' ? 'Fortg.' : ex.difficulty === 'intermediate' ? 'Mittel' : 'Einfach'}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer with create actions */}
        <div className="h-px bg-gradient-to-r from-transparent via-black/8 to-transparent mx-4" />
        <div className="px-4 py-3 flex gap-2">
          <button
            onClick={onCreateExercise}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold glass-button text-[#2563eb] flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Neue Übung
          </button>
          <button
            onClick={onCreateNote}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold glass-button text-amber-600 flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Neue Notiz
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

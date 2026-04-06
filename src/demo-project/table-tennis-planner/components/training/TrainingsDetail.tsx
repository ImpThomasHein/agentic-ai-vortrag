/**
 * Detail view for a single training session.
 * Lazy-loads attendance data when opened.
 * Shows attendance toggle (player), attendance list, planned exercises
 * with expandable content (description, hints, difficulty, duration).
 * Rendered inline below the selected TrainingsKarte.
 */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise, AttendanceEntry, AttendanceStatus } from '@/lib/types';
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from '@/lib/constants';
import TableTennisDiagram from '@/components/diagrams/TableTennisDiagram';
import { useAuth } from '@/contexts/AuthContext';
import { useGroup } from '@/contexts/GroupContext';

interface DbAttendanceEntry {
  id: string;
  userId: string;
  sessionId: string;
  status: string;
  user: { username: string; displayName: string; groupRole: string };
}

function dbToEntry(e: DbAttendanceEntry): AttendanceEntry {
  return {
    username: e.user.username,
    displayName: e.user.displayName,
    role: e.user.groupRole === 'trainer' ? 'trainer' : 'player',
    status: e.status as AttendanceStatus,
    updatedAt: 0,
  };
}

interface TrainingsDetailProps {
  sessionId: string;
  date: Date;
  exercises: Exercise[];
  editable: boolean;
  voteCount?: (exerciseId: string) => number;
  onReorder?: (exerciseId: string, direction: 'up' | 'down') => void;
  onAddExercise?: () => void;
  onEditExercise?: (exerciseId: string) => void;
  onEditNote?: (noteId: string) => void;
  onClose: () => void;
}

export function TrainingsDetail({
  sessionId,
  date,
  exercises,
  editable,
  voteCount,
  onReorder,
  onAddExercise,
  onEditExercise,
  onEditNote,
  onClose,
}: TrainingsDetailProps) {
  const { user } = useAuth();
  const { groupId } = useGroup();
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(true);
  const [collapsedExerciseIds, setCollapsedExerciseIds] = useState<Set<string>>(new Set());

  // Lazy-load attendance for this session
  useEffect(() => {
    if (!sessionId) return;
    setIsLoadingAttendance(true);
    fetch(`/api/sessions/${sessionId}/attendance`)
      .then(res => res.ok ? res.json() : [])
      .then((data: DbAttendanceEntry[]) => {
        setAttendance(Array.isArray(data) ? data.map(dbToEntry) : []);
      })
      .catch(() => setAttendance([]))
      .finally(() => setIsLoadingAttendance(false));
  }, [sessionId]);

  const myStatus = user
    ? (attendance.find(e => e.username === user.username)?.status ?? null)
    : null;

  const yesCount = attendance.filter(a => a.status === 'yes').length;
  const noCount = attendance.filter(a => a.status === 'no').length;

  const handleSetAttendance = useCallback((status: AttendanceStatus) => {
    if (!sessionId || !user) return;
    const myGroupRole = user.groups.find(g => g.id === groupId)?.myRole ?? 'player';

    setAttendance(prev => [
      ...prev.filter(e => e.username !== user.username),
      { username: user.username, displayName: user.displayName, role: myGroupRole, status, updatedAt: Date.now() },
    ]);

    fetch(`/api/sessions/${sessionId}/attendance`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {
      fetch(`/api/sessions/${sessionId}/attendance`)
        .then(r => r.json())
        .then((data: DbAttendanceEntry[]) => setAttendance(Array.isArray(data) ? data.map(dbToEntry) : []))
        .catch(() => {});
    });
  }, [sessionId, user, groupId]);

  const toggleExpand = (exId: string) => {
    setCollapsedExerciseIds(prev => {
      const next = new Set(prev);
      if (next.has(exId)) next.delete(exId);
      else next.add(exId);
      return next;
    });
  };

  // Reorder animation state
  const [swappingIds, setSwappingIds] = useState<{ movingUp: string; movingDown: string } | null>(null);
  const exerciseRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const handleReorder = useCallback((exerciseId: string, direction: 'up' | 'down') => {
    if (!onReorder || swappingIds) return;
    const idx = exercises.findIndex(e => e.id === exerciseId);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= exercises.length) return;

    const neighbor = exercises[swapIdx];
    setSwappingIds({
      movingUp: direction === 'up' ? exerciseId : neighbor.id,
      movingDown: direction === 'up' ? neighbor.id : exerciseId,
    });

    // Animate, then execute the real reorder
    setTimeout(() => {
      onReorder(exerciseId, direction);
      setSwappingIds(null);
    }, 250);
  }, [exercises, onReorder, swappingIds]);

  return (
    <div className="glass rounded-xl overflow-hidden" style={{ animation: 'detailSlideIn 250ms ease-out' }}>
      {/* Header bar */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-white/15">
        <h3 className="font-bold text-[13px] tracking-wide" style={{ color: 'var(--text-primary)' }}>
          Trainingsdetails
        </h3>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs hover:bg-black/5 transition-all active:scale-90"
          style={{ color: 'var(--text-secondary)' }}
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-3.5">
        {/* Player: attendance toggle */}
        {!editable && (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
              Deine Anwesenheit
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSetAttendance('yes')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.97] ${
                  myStatus === 'yes'
                    ? 'bg-green-500/15 text-green-700 shadow-sm shadow-green-500/10 border border-green-400/30'
                    : 'glass hover:bg-green-500/8'
                }`}
              >
                <span className="mr-1.5">{myStatus === 'yes' ? '✓' : '○'}</span>
                Dabei
              </button>
              <button
                onClick={() => handleSetAttendance('no')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.97] ${
                  myStatus === 'no'
                    ? 'bg-red-500/15 text-red-600 shadow-sm shadow-red-500/10 border border-red-400/30'
                    : 'glass hover:bg-red-500/8'
                }`}
              >
                <span className="mr-1.5">{myStatus === 'no' ? '✗' : '○'}</span>
                Nicht dabei
              </button>
            </div>
          </div>
        )}

        {/* Attendance list */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Anwesenheit
            </div>
            {!isLoadingAttendance && attendance.length > 0 && (
              <div className="flex gap-1.5">
                {yesCount > 0 && (
                  <span className="text-[10px] font-semibold bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded-md">
                    {yesCount} ✓
                  </span>
                )}
                {noCount > 0 && (
                  <span className="text-[10px] font-semibold bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-md">
                    {noCount} ✗
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="glass rounded-xl p-2.5">
            {isLoadingAttendance ? (
              <div className="flex justify-center py-3">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : attendance.length === 0 ? (
              <p className="text-xs py-1 px-1" style={{ color: 'var(--text-secondary)' }}>
                Noch keine Anmeldungen
              </p>
            ) : (
              <div className="space-y-0.5">
                {attendance.map((entry) => (
                  <div key={entry.username} className="flex items-center gap-2.5 py-1.5 px-1 rounded-lg">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                      entry.role === 'trainer'
                        ? 'bg-blue-500/15 text-blue-600'
                        : 'bg-green-500/15 text-green-600'
                    }`}>
                      {entry.displayName[0]}
                    </span>
                    <span className="flex-1 text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                      {entry.displayName}
                    </span>
                    <span className={`text-sm font-semibold ${
                      entry.status === 'yes' ? 'text-green-500' :
                      entry.status === 'no' ? 'text-red-400' :
                      'text-black/20'
                    }`}>
                      {entry.status === 'yes' ? '✓' : entry.status === 'no' ? '✗' : '—'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Planned exercises */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Geplante Übungen ({exercises.length})
            </div>
            {editable && onAddExercise && (
              <button
                onClick={onAddExercise}
                className="text-[11px] font-semibold text-[#2563eb] hover:text-blue-800 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Hinzufügen
              </button>
            )}
          </div>
          <div className="glass rounded-xl p-2.5">
            {exercises.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Noch keine Übungen geplant
                </p>
                {editable && onAddExercise && (
                  <button
                    onClick={onAddExercise}
                    className="mt-2 text-xs font-semibold text-[#2563eb] hover:underline"
                  >
                    + Übung hinzufügen
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                {exercises.map((ex, idx) => {
                  const isNote = ex.type === 'note';
                  const isExpanded = !collapsedExerciseIds.has(ex.id);
                  const hasDiagram = !isNote && ex.diagram?.trajectories?.length > 0;
                  const hasContent = ex.description || (ex.hints && ex.hints.length > 0) || ex.duration || hasDiagram;

                  const isMovingUp = swappingIds?.movingUp === ex.id;
                  const isMovingDown = swappingIds?.movingDown === ex.id;
                  const swapAnimClass = isMovingUp ? 'reorder-move-up' : isMovingDown ? 'reorder-move-down' : '';

                  return (
                    <div
                      key={ex.id}
                      ref={(el) => { if (el) exerciseRefs.current.set(ex.id, el); else exerciseRefs.current.delete(ex.id); }}
                      className={`rounded-lg transition-all overflow-hidden ${swapAnimClass} ${
                        isNote
                          ? 'bg-amber-500/5 border border-amber-200/25'
                          : 'bg-blue-500/4 border border-blue-200/20'
                      }`}
                    >
                      {/* Exercise header row */}
                      <div className="flex items-center gap-2 px-2.5 py-2">
                        {/* Reorder handle */}
                        {editable && onReorder && (
                          <div className="flex flex-col gap-0.5 flex-shrink-0">
                            <button
                              onClick={() => handleReorder(ex.id, 'up')}
                              disabled={idx === 0 || !!swappingIds}
                              className={`text-[9px] leading-none px-1 py-0.5 rounded transition-all ${
                                idx === 0 ? 'text-black/10' : 'text-black/30 hover:text-black/60 hover:bg-black/5'
                              }`}
                            >
                              ▲
                            </button>
                            <button
                              onClick={() => handleReorder(ex.id, 'down')}
                              disabled={idx === exercises.length - 1 || !!swappingIds}
                              className={`text-[9px] leading-none px-1 py-0.5 rounded transition-all ${
                                idx === exercises.length - 1 ? 'text-black/10' : 'text-black/30 hover:text-black/60 hover:bg-black/5'
                              }`}
                            >
                              ▼
                            </button>
                          </div>
                        )}

                        {/* Clickable area for expand */}
                        <button
                          onClick={() => hasContent && toggleExpand(ex.id)}
                          className="flex-1 min-w-0 flex items-center gap-2 text-left"
                          disabled={!hasContent}
                        >
                          <span className="flex-1 text-[13px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                            {isNote ? `📝 ${ex.name}` : ex.name}
                          </span>
                          {hasContent && (
                            <svg
                              className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                              style={{ color: 'var(--text-secondary)' }}
                              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </button>

                        {/* Category badge */}
                        {ex.category && (
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md flex-shrink-0 ${
                            isNote
                              ? 'bg-amber-500/10 text-amber-600'
                              : 'bg-blue-500/8 text-[#2563eb]'
                          }`}>
                            {isNote ? 'Notiz' : CATEGORY_LABELS[ex.category] || ex.category}
                          </span>
                        )}

                        {/* Edit button */}
                        {editable && (isNote ? onEditNote : onEditExercise) && (
                          <button
                            onClick={() => isNote ? onEditNote?.(ex.id) : onEditExercise?.(ex.id)}
                            className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-black/30 hover:text-black/60 hover:bg-black/5 transition-all"
                            title={isNote ? 'Notiz bearbeiten' : 'Übung bearbeiten'}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        )}

                        {/* Vote count */}
                        {voteCount && voteCount(ex.id) > 0 && (
                          <span className="text-[11px] font-medium text-pink-500 flex-shrink-0">
                            ♥ {voteCount(ex.id)}
                          </span>
                        )}
                      </div>

                      {/* Expanded content */}
                      {isExpanded && hasContent && (
                        <div className="px-3 pb-3 pt-0.5 space-y-2 border-t border-black/5">
                          {/* Meta badges row */}
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {!isNote && ex.difficulty && (
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
                                ex.difficulty === 'advanced' || ex.difficulty === 'expert'
                                  ? 'bg-red-500/8 text-red-600'
                                  : ex.difficulty === 'intermediate'
                                  ? 'bg-amber-500/8 text-amber-600'
                                  : 'bg-green-500/8 text-green-600'
                              }`}>
                                {DIFFICULTY_LABELS[ex.difficulty]}
                              </span>
                            )}
                            {ex.duration && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-black/4" style={{ color: 'var(--text-secondary)' }}>
                                ⏱ {ex.duration} Min.
                              </span>
                            )}
                            {!isNote && ex.ttrRange && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-black/4" style={{ color: 'var(--text-secondary)' }}>
                                TTR {ex.ttrRange.min}–{ex.ttrRange.max}
                              </span>
                            )}
                          </div>

                          {/* Diagram */}
                          {hasDiagram && (
                            <div className="flex justify-center py-1">
                              <div className="glass-dark rounded-xl p-2">
                                <TableTennisDiagram trajectories={ex.diagram.trajectories} size="medium" />
                              </div>
                            </div>
                          )}

                          {/* Description */}
                          {ex.description && (
                            <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                              {ex.description}
                            </p>
                          )}

                          {/* Hints */}
                          {ex.hints && ex.hints.length > 0 && (
                            <div>
                              <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>
                                Tipps
                              </div>
                              <ul className="space-y-0.5">
                                {ex.hints.map((hint, i) => (
                                  <li key={i} className="text-[12px] flex gap-1.5" style={{ color: 'var(--text-primary)' }}>
                                    <span className="text-blue-400 flex-shrink-0">•</span>
                                    {hint}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Tags */}
                          {ex.tags && ex.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {ex.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/4"
                                  style={{ color: 'var(--text-secondary)' }}
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes detailSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes reorderUp {
          0% { transform: translateY(0); opacity: 1; }
          40% { transform: translateY(-100%); opacity: 0.7; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes reorderDown {
          0% { transform: translateY(0); opacity: 1; }
          40% { transform: translateY(100%); opacity: 0.7; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .reorder-move-up {
          animation: reorderUp 250ms ease-in-out;
          z-index: 1;
        }
        .reorder-move-down {
          animation: reorderDown 250ms ease-in-out;
          z-index: 1;
        }
      `}</style>
    </div>
  );
}

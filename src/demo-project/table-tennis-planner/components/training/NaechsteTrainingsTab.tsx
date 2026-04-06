/**
 * Tab content for "Nächste Trainings" — shows 2-week training overview.
 * Composes GruppenChips, TrainingsKarte list, TrainingsDetail, and TrainingDaysHeader.
 * Used by both trainer and player pages with role-specific behavior via props.
 */
'use client';

import { useState } from 'react';
import { Group, Exercise, Weekday } from '@/lib/types';
import { GruppenChips } from './GruppenChips';
import { TrainingsKarte } from './TrainingsKarte';
import { TrainingsDetail } from './TrainingsDetail';
import { TrainingDaysHeader } from './TrainingDaysHeader';

export interface SessionData {
  sessionId: string;
  date: Date;
  exercises: Exercise[];
}

interface NaechsteTrainingsTabProps {
  groups: Group[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string) => void;
  sessions: SessionData[];
  weekdays: Weekday[];
  hasSchedule: boolean;
  editable: boolean;
  accentColor: 'blue' | 'green';
  voteCount?: (exerciseId: string) => number;
  onReorder?: (sessionId: string, exerciseId: string, direction: 'up' | 'down') => void;
  onAddExercise?: (sessionId: string) => void;
  onEditExercise?: (exerciseId: string) => void;
  onEditNote?: (noteId: string) => void;
  onSaveSchedule?: (weekdays: Weekday[]) => void;
}

export function NaechsteTrainingsTab({
  groups,
  selectedGroupId,
  onSelectGroup,
  sessions,
  weekdays,
  hasSchedule,
  editable,
  accentColor,
  voteCount,
  onReorder,
  onAddExercise,
  onEditExercise,
  onEditNote,
  onSaveSchedule,
}: NaechsteTrainingsTabProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const selectedSession = sessions.find(s => s.sessionId === selectedSessionId);

  return (
    <div className="space-y-3">
      <GruppenChips
        groups={groups}
        selectedGroupId={selectedGroupId}
        onSelectGroup={onSelectGroup}
        accentColor={accentColor}
      />

      <div className="px-4 space-y-2.5">
        {sessions.length === 0 ? (
          <div className="glass rounded-xl p-6 text-center">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Keine Trainings in den nächsten 2 Wochen geplant.
            </p>
          </div>
        ) : (
          sessions.map((session, index) => (
            <div key={session.sessionId}>
              <TrainingsKarte
                sessionId={session.sessionId}
                date={session.date}
                exerciseCount={session.exercises.length}
                isNext={index === 0}
                accentColor={accentColor}
                onClick={(id) => setSelectedSessionId(selectedSessionId === id ? null : id)}
              />
              {selectedSessionId === session.sessionId && selectedSession && (
                <div className="mt-2">
                  <TrainingsDetail
                    sessionId={session.sessionId}
                    date={session.date}
                    exercises={session.exercises}
                    editable={editable}
                    voteCount={voteCount}
                    onReorder={onReorder ? (exId, dir) => onReorder(session.sessionId, exId, dir) : undefined}
                    onAddExercise={onAddExercise ? () => onAddExercise(session.sessionId) : undefined}
                    onEditExercise={onEditExercise}
                    onEditNote={onEditNote}
                    onClose={() => setSelectedSessionId(null)}
                  />
                </div>
              )}
            </div>
          ))
        )}

        {/* Training days config — only editable for trainer */}
        {editable && onSaveSchedule ? (
          <TrainingDaysHeader
            weekdays={weekdays}
            hasSchedule={hasSchedule}
            onSave={onSaveSchedule}
          />
        ) : hasSchedule ? (
          <div className="glass rounded-xl p-3.5">
            <div className="text-xs font-semibold mb-2.5" style={{ color: 'var(--text-primary)' }}>
              Trainingstage
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
                const isActive = weekdays.includes(d as Weekday);
                return (
                  <span
                    key={d}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs ${
                      isActive
                        ? 'bg-[#16a34a] text-white font-semibold'
                        : 'bg-black/4 text-black/40'
                    }`}
                  >
                    {dayNames[d]}
                  </span>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

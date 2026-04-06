'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Exercise, TrainingDayAssignment } from '@/lib/types';
import { useExercises } from '@/hooks/useExercises';
import { useVotes } from '@/hooks/useVotes';
import { useTrainingSchedule } from '@/hooks/useTrainingSchedule';
import { useTrainingPlan } from '@/hooks/useTrainingPlan';
import { useNotes } from '@/hooks/useNotes';
import { TrainingDayCard, MoveExerciseModal, CopyExerciseModal } from '@/components/training';
import { UserProfileWidget } from '@/components/auth';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Button } from '@/components/ui';

// Disable static rendering for this page (uses localStorage)
export const dynamic = 'force-dynamic';

export default function TrainingsplanPage() {
  const { isLoading: authLoading, isAuthorized } = useRequireAuth({ allowedRoles: ['trainer'] });
  const [moveModalData, setMoveModalData] = useState<{
    isOpen: boolean;
    assignment: TrainingDayAssignment | null;
    exercise: Exercise | null;
  }>({
    isOpen: false,
    assignment: null,
    exercise: null,
  });

  const [copyModalData, setCopyModalData] = useState<{
    isOpen: boolean;
    assignment: TrainingDayAssignment | null;
    exercise: Exercise | null;
  }>({
    isOpen: false,
    assignment: null,
    exercise: null,
  });

  const { notes } = useNotes();
  const { allExercises } = useExercises({ additionalExercises: notes });
  const { voteCount } = useVotes();
  const { hasSchedule } = useTrainingSchedule();
  const {
    upcomingDays,
    assignments,
    isLoading,
    removeAssignment,
    moveAssignment,
    copyAssignment,
  } = useTrainingPlan();

  if (authLoading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleMoveExercise = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (!assignment) return;

    const exercise = allExercises.find(e => e.id === assignment.exerciseId);
    if (!exercise) return;

    setMoveModalData({
      isOpen: true,
      assignment,
      exercise,
    });
  };

  const handleConfirmMove = (newDateString: string) => {
    if (moveModalData.assignment) {
      moveAssignment(moveModalData.assignment.id, newDateString);
    }
  };

  const closeMoveModal = () => {
    setMoveModalData({
      isOpen: false,
      assignment: null,
      exercise: null,
    });
  };

  const handleCopyExercise = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (!assignment) return;

    const exercise = allExercises.find(e => e.id === assignment.exerciseId);
    if (!exercise) return;

    setCopyModalData({
      isOpen: true,
      assignment,
      exercise,
    });
  };

  const handleConfirmCopy = (targetDateString: string) => {
    if (copyModalData.assignment) {
      copyAssignment(copyModalData.assignment.id, targetDateString);
    }
  };

  const closeCopyModal = () => {
    setCopyModalData({
      isOpen: false,
      assignment: null,
      exercise: null,
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated floating orbs */}
      <div className="floating-orb w-96 h-96 bg-indigo-400 top-[-10%] left-[-5%]" style={{ animationDelay: '0s' }} />
      <div className="floating-orb w-80 h-80 bg-cyan-400 bottom-[10%] right-[-8%]" style={{ animationDelay: '5s' }} />

      {/* Header */}
      <header className="glass-dark border-b border-white/20 sticky top-0 z-20 backdrop-blur-xl">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/trainer"
              className="p-2 -ml-2 hover:bg-white/30 rounded-xl transition-all"
              aria-label="Zurück zur Trainer-Ansicht"
            >
              <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Trainingsplan</h1>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {upcomingDays.length} kommende Trainingstage
              </p>
            </div>
            <UserProfileWidget />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-4 relative z-10">
        {/* Kein Schedule Warning */}
        {!hasSchedule && !isLoading && (
          <div className="mb-4 glass-dark rounded-2xl p-4 border border-yellow-200/30 bg-yellow-500/5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-yellow-700 font-medium leading-relaxed">
                  <strong>Noch keine Trainingstage!</strong> Definiere zuerst Trainingstage in der Trainer-Ansicht.
                </p>
                <Link href="/trainer">
                  <Button variant="ghost" size="sm" className="mt-2">
                    Zu den Trainingstagen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Info-Box */}
        {hasSchedule && (
          <div className="mb-4 glass-dark rounded-2xl p-4 border border-indigo-200/30 bg-indigo-500/5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm text-indigo-700 font-medium leading-relaxed">
                Hier siehst du alle kommenden Trainingstage mit den zugeordneten Übungen.
                Übungen kannst du über die <Link href="/trainer" className="underline">Trainer-Ansicht</Link> hinzufügen.
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Lade Trainingsplan...</p>
          </div>
        )}

        {/* Trainingstage */}
        {!isLoading && hasSchedule && (
          <div className="space-y-4">
            {upcomingDays.map((day) => (
              <TrainingDayCard
                key={day.dateString}
                trainingDay={day}
                exercises={allExercises}
                assignments={assignments}
                voteCount={voteCount}
                onRemoveExercise={removeAssignment}
                onCopyExercise={handleCopyExercise}
                onMoveExercise={handleMoveExercise}
              />
            ))}
          </div>
        )}

        {/* Empty State - wenn Schedule da aber keine Trainingstage berechnet */}
        {!isLoading && hasSchedule && upcomingDays.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">Keine Trainingstage gefunden</p>
          </div>
        )}
      </main>

      {/* Move Modal */}
      <MoveExerciseModal
        isOpen={moveModalData.isOpen}
        onClose={closeMoveModal}
        exercise={moveModalData.exercise}
        currentDateString={moveModalData.assignment?.trainingDate || ''}
        availableDays={upcomingDays}
        onMove={handleConfirmMove}
      />

      {/* Copy Modal */}
      <CopyExerciseModal
        isOpen={copyModalData.isOpen}
        onClose={closeCopyModal}
        exercise={copyModalData.exercise}
        currentDateString={copyModalData.assignment?.trainingDate || ''}
        availableDays={upcomingDays}
        onCopy={handleConfirmCopy}
      />
    </div>
  );
}

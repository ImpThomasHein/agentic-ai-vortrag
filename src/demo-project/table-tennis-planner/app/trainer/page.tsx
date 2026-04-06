/**
 * Trainer dashboard page with 4-tab layout:
 * - Nächste Trainings: 2-week training overview with group selection
 * - Übungen: exercise library with filters and create buttons
 * - Trainingsgruppen: group management with player assignment
 * - Mannschaften: team management with league data
 */
'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Exercise, NoteFormData } from '@/lib/types';

export const dynamic = 'force-dynamic';

import { useExercises } from '@/hooks/useExercises';
import { useVotes } from '@/hooks/useVotes';
import { useTrainingSchedule } from '@/hooks/useTrainingSchedule';
import { useTrainingPlan } from '@/hooks/useTrainingPlan';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { ExerciseActionMenu, CreateExerciseModal, ExercisePickerModal } from '@/components/exercises';
import { toLocalDateString } from '@/lib/training-schedule';
import { UserProfileWidget } from '@/components/auth';
import { MannschaftTab } from '@/components/team';
import { TrainingsGruppenTab } from '@/components/groups/TrainingsGruppenTab';
import { NaechsteTrainingsTab, SessionData } from '@/components/training/NaechsteTrainingsTab';
import { UebungenTab } from '@/components/exercises/UebungenTab';
import { useGroup } from '@/contexts/GroupContext';
import { useNotes } from '@/hooks/useNotes';
import { NoteEditModal, NoteDeleteDialog } from '@/components/notes';
import NoteForm from '@/components/notes/NoteForm';

type TrainerTab = 'training' | 'uebungen' | 'trainingsgruppen' | 'mannschaft';

const TAB_LABELS: Record<TrainerTab, string> = {
  training: 'Nächste Trainings',
  uebungen: 'Übungen',
  trainingsgruppen: 'Trainingsgruppen',
  mannschaft: 'Mannschaften',
};

export default function TrainerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TrainerPageContent />
    </Suspense>
  );
}

function TrainerPageContent() {
  const { isLoading: authLoading, isAuthorized } = useRequireAuth({ allowedRoles: ['trainer'] });
  const { groups, groupId, group, setGroupId, upcomingSessions } = useGroup();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TrainerTab>('training');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'mannschaft') setActiveTab('mannschaft');
    else if (tab === 'uebungen') setActiveTab('uebungen');
    else if (tab === 'trainingsgruppen') setActiveTab('trainingsgruppen');
    else if (tab === 'training') setActiveTab('training');
  }, [searchParams]);

  const { notes, createNote, updateNote, deleteNote } = useNotes();
  const { exercises, allExercises, isFiltered, refetch } = useExercises({ filters: { categories: [], difficulty: null }, additionalExercises: notes });
  const [showCreateExercise, setShowCreateExercise] = useState(false);
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [pickerSessionId, setPickerSessionId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Exercise | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [isNoteSaving, setIsNoteSaving] = useState(false);
  const { voteCount } = useVotes();
  const { weekdays, updateSchedule, hasSchedule } = useTrainingSchedule();
  const { upcomingDays, toggleExercise, isExerciseAssigned, reorderAssignment } = useTrainingPlan();

  if (authLoading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Build SessionData matching upcomingDays with real DB session IDs from upcomingSessions
  const sessions: SessionData[] = upcomingDays.map((day) => {
    const dbSession = upcomingSessions.find(s => toLocalDateString(s.sessionDate) === day.dateString);
    return {
      sessionId: dbSession?.id ?? day.dateString,
      date: day.date,
      exercises: day.exerciseIds
        .map(id => allExercises.find(e => e.id === id))
        .filter((e): e is Exercise => e !== undefined),
    };
  });

  /** Find the dateString for a given sessionId (needed for toggleExercise) */
  function dateStringForSession(sessionId: string): string | null {
    const session = sessions.find(s => s.sessionId === sessionId);
    if (!session) return null;
    const d = session.date;
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
  }

  const pickerDateString = pickerSessionId ? dateStringForSession(pickerSessionId) : null;
  const pickerAssignedIds = pickerDateString
    ? allExercises.filter(e => isExerciseAssigned(e.id, pickerDateString)).map(e => e.id)
    : [];

  const sortedExercises = [...allExercises].sort((a, b) => voteCount(b.id) - voteCount(a.id));

  const handleCreateNote = async (data: NoteFormData) => {
    setIsNoteSaving(true);
    try {
      const result = await createNote(data);
      if (result) setShowCreateNote(false);
    } finally {
      setIsNoteSaving(false);
    }
  };

  const handleEditNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) setEditingNote(note);
  };

  const handleDeleteNote = (noteId: string) => {
    setDeletingNoteId(noteId);
  };

  const handleDeleteNoteConfirm = async () => {
    if (!deletingNoteId) return false;
    return deleteNote(deletingNoteId);
  };

  const renderMenu = (exercise: Exercise) => (
    <ExerciseActionMenu
      exercise={exercise}
      upcomingTrainingDays={upcomingDays}
      onAssignToDay={toggleExercise}
      voteCount={voteCount(exercise.id)}
      isAssignedToDate={isExerciseAssigned}
      onEditNote={handleEditNote}
      onDeleteNote={handleDeleteNote}
      groupName={group?.name}
    />
  );

  return (
    <div className="min-h-screen relative">
      {/* Floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="floating-orb w-96 h-96 bg-blue-400 top-[-10%] left-[-5%]" style={{ animationDelay: '0s' }} />
        <div className="floating-orb w-80 h-80 bg-purple-400 bottom-[10%] right-[-8%]" style={{ animationDelay: '7s' }} />
      </div>

      {/* Header */}
      <header className="glass-dark border-b border-white/20 sticky top-0 z-20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="-ml-1 hover:opacity-80 transition-opacity"
              aria-label="Startseite"
            >
              <Image src="/ttf-logo.png" alt="TTF Bötzow" width={36} height={36} className="rounded-lg" />
            </Link>
            <div className="flex-1">
              <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                Companion
              </span>
            </div>
            <Link
              href="/trainer/spieler"
              className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-sm border border-white/30 hover:bg-blue-500/20 transition-all"
              title="Spielerverwaltung"
            >
              ⚙️
            </Link>
            <UserProfileWidget />
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div className="sticky top-[57px] z-15 glass-dark border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {(Object.keys(TAB_LABELS) as TrainerTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2.5 text-xs font-medium transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent hover:border-white/20'
              }`}
              style={activeTab !== tab ? { color: 'var(--text-secondary)' } : undefined}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 relative z-10">
        {activeTab === 'training' && (
          <NaechsteTrainingsTab
            groups={groups}
            selectedGroupId={groupId}
            onSelectGroup={setGroupId}
            sessions={sessions}
            weekdays={weekdays}
            hasSchedule={hasSchedule}
            editable={true}
            accentColor="blue"
            voteCount={voteCount}
            onReorder={(sessionId, exerciseId, direction) => {
              const ds = dateStringForSession(sessionId);
              if (ds) reorderAssignment(exerciseId, ds, direction);
            }}
            onAddExercise={(sessionId) => setPickerSessionId(sessionId)}
            onEditExercise={(exerciseId) => router.push(`/trainer/editor/${exerciseId}`)}
            onEditNote={handleEditNote}
            onSaveSchedule={updateSchedule}
          />
        )}

        {activeTab === 'uebungen' && (
          <>
            <UebungenTab
              exercises={sortedExercises}
              isFiltered={isFiltered}
              editable={true}
              onCreateExercise={() => setShowCreateExercise(true)}
              onCreateNote={() => setShowCreateNote(true)}
              renderMenu={renderMenu}
              voteCount={voteCount}
              showVoteCount={true}
              showDifficulty={true}
              groups={groups}
              selectedGroupId={groupId}
              onSelectGroup={setGroupId}
            />

            {/* Inline note creation */}
            {showCreateNote && (
              <div className="mx-4 mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm p-4">
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Neue Notiz erstellen
                </p>
                <NoteForm
                  onSave={handleCreateNote}
                  onCancel={() => setShowCreateNote(false)}
                  isLoading={isNoteSaving}
                />
              </div>
            )}

            {/* Trainingsplan Link */}
            {hasSchedule && (
              <Link href="/trainingsplan" className="block mx-4 mt-4">
                <div className="glass rounded-2xl p-4 hover:scale-[1.01] transition-transform duration-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        Trainingsplan anzeigen
                      </h3>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Geplante Übungen für kommende Trainings
                      </p>
                    </div>
                  </div>
                  <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )}
          </>
        )}

        {activeTab === 'trainingsgruppen' && <TrainingsGruppenTab />}

        {activeTab === 'mannschaft' && (
          <div className="px-4">
            <MannschaftTab />
          </div>
        )}
      </main>

      {/* Modals */}
      <ExercisePickerModal
        isOpen={!!pickerSessionId}
        exercises={allExercises}
        assignedExerciseIds={pickerAssignedIds}
        onToggle={(exerciseId) => {
          if (pickerDateString) toggleExercise(exerciseId, pickerDateString);
        }}
        onCreateExercise={() => {
          setPickerSessionId(null);
          setShowCreateExercise(true);
        }}
        onCreateNote={() => {
          setPickerSessionId(null);
          setShowCreateNote(true);
        }}
        onClose={() => setPickerSessionId(null)}
      />
      <CreateExerciseModal
        isOpen={showCreateExercise}
        onClose={() => setShowCreateExercise(false)}
        onSuccess={() => refetch()}
      />
      {editingNote && (
        <NoteEditModal
          isOpen={!!editingNote}
          note={editingNote}
          onSave={updateNote}
          onClose={() => setEditingNote(null)}
        />
      )}
      <NoteDeleteDialog
        isOpen={!!deletingNoteId}
        onConfirm={handleDeleteNoteConfirm}
        onClose={() => setDeletingNoteId(null)}
      />
    </div>
  );
}

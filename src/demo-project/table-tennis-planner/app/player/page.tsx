/**
 * Player dashboard page with 3-tab layout:
 * - Nächste Trainings: 2-week training overview with attendance
 * - Übungen: exercise library with voting
 * - Mannschaften: team info with league data
 */
'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Exercise } from '@/lib/types';

export const dynamic = 'force-dynamic';

import { useExercises } from '@/hooks/useExercises';
import { useVotes } from '@/hooks/useVotes';
import { useTrainingSchedule } from '@/hooks/useTrainingSchedule';
import { useTrainingPlan } from '@/hooks/useTrainingPlan';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { VoteButton } from '@/components/exercises';
import { UserProfileWidget } from '@/components/auth';
import { MannschaftTab } from '@/components/team';
import { NaechsteTrainingsTab, SessionData } from '@/components/training/NaechsteTrainingsTab';
import { UebungenTab } from '@/components/exercises/UebungenTab';
import { useGroup } from '@/contexts/GroupContext';
import { useNotes } from '@/hooks/useNotes';
import { toLocalDateString } from '@/lib/training-schedule';

type PlayerTab = 'training' | 'uebungen' | 'mannschaft';

const TAB_LABELS: Record<PlayerTab, string> = {
  training: 'Nächste Trainings',
  uebungen: 'Übungen',
  mannschaft: 'Mannschaften',
};

export default function PlayerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PlayerPageContent />
    </Suspense>
  );
}

function PlayerPageContent() {
  const { isLoading: authLoading, isAuthorized } = useRequireAuth({ allowedRoles: ['trainer', 'player'] });
  const { groups, groupId, group, setGroupId, upcomingSessions } = useGroup();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<PlayerTab>('training');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'mannschaft') setActiveTab('mannschaft');
    else if (tab === 'uebungen') setActiveTab('uebungen');
    else if (tab === 'training') setActiveTab('training');
  }, [searchParams]);

  const { notes } = useNotes();
  const { exercises: allFilteredExercises, allExercises, isFiltered } = useExercises({ filters: { categories: [], difficulty: null }, additionalExercises: notes });
  const exercises = allFilteredExercises.filter(e => e.type !== 'note');
  const { hasVoted, toggleVote, voteCount, isLoading, canVote } = useVotes();
  const { weekdays, hasSchedule } = useTrainingSchedule();
  const { upcomingDays } = useTrainingPlan();

  if (authLoading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
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

  const renderVoteAction = (exercise: Exercise) => (
    <VoteButton
      voted={hasVoted(exercise.id)}
      onToggle={() => toggleVote(exercise.id)}
      disabled={isLoading || !canVote}
    />
  );

  return (
    <div className="min-h-screen relative">
      {/* Floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="floating-orb w-96 h-96 bg-green-400 top-[-10%] right-[-5%]" style={{ animationDelay: '0s' }} />
        <div className="floating-orb w-80 h-80 bg-pink-400 bottom-[10%] left-[-8%]" style={{ animationDelay: '6s' }} />
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
            <UserProfileWidget />
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div className="sticky top-[57px] z-15 glass-dark border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          {(Object.keys(TAB_LABELS) as PlayerTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2.5 text-xs font-medium transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'border-green-500 text-green-600'
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
            editable={false}
            accentColor="green"
            voteCount={voteCount}
          />
        )}

        {activeTab === 'uebungen' && (
          <UebungenTab
            exercises={exercises}
            isFiltered={isFiltered}
            editable={false}
            showDifficulty={false}
            renderAction={renderVoteAction}
            voteCount={voteCount}
            showVoteCount={false}
            infoBox={
              <div className="glass-dark rounded-2xl p-4 border border-green-200/30 bg-green-500/5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 fill-current" viewBox="0 0 20 20">
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                  </div>
                  <p className="text-sm text-green-700 font-medium leading-relaxed">
                    <span className="font-semibold">Wähle deine Favoriten!</span> Tippe auf das Herz, um für Übungen zu stimmen.
                    {canVote && <span> Deine Votes gelten für das <strong>nächste Training</strong>.</span>}
                  </p>
                </div>
              </div>
            }
          />
        )}

        {activeTab === 'mannschaft' && (
          <div className="px-4">
            <MannschaftTab />
          </div>
        )}
      </main>
    </div>
  );
}

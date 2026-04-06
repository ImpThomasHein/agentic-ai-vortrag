/**
 * Homepage with role-aware Quick-Dashboard.
 * Shows info cards for next training, teams, and exercises.
 * Redirects to login if not authenticated.
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useGroup } from '@/contexts/GroupContext';
import { QuickDashboard } from '@/components/dashboard/QuickDashboard';
import { TrainingSessionSummary } from '@/lib/types';

/** Format a session date for display (e.g. "Mittwoch, 25. März · 19:00") */
function formatSessionDate(session: TrainingSessionSummary): string {
  const d = new Date(session.sessionDate);
  const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const months = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'];
  const time = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  return `${days[d.getDay()]}, ${d.getDate()}. ${months[d.getMonth()]} · ${time}`;
}

/** Calculate relative day label ("heute", "morgen", "in X Tagen") */
function daysUntilLabel(session: TrainingSessionSummary): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(session.sessionDate);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'heute';
  if (diff === 1) return 'morgen';
  return `in ${diff} Tagen`;
}

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();
  const { upcomingSessions } = useGroup();
  const router = useRouter();
  const [teamCount, setTeamCount] = useState(0);
  const [exerciseCount, setExerciseCount] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  // Fetch team count and exercise count for dashboard cards
  useEffect(() => {
    if (!user) return;
    fetch('/api/teams')
      .then(r => r.ok ? r.json() : [])
      .then(teams => setTeamCount(Array.isArray(teams) ? teams.length : 0))
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user) return;
    // Use static exercise data length
    import('@/data/exercises.json')
      .then(mod => {
        const data = mod.default || mod;
        setExerciseCount(Array.isArray(data) ? data.length : 0);
      })
      .catch(() => {});
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const isTrainer = user.role === 'trainer';
  const nextSession = upcomingSessions[0];

  return (
    <QuickDashboard
      displayName={user.displayName}
      role={isTrainer ? 'trainer' : 'player'}
      nextTraining={nextSession ? {
        date: formatSessionDate(nextSession),
        detail: daysUntilLabel(nextSession),
        exerciseCount: nextSession._count.assignments,
        attendanceLabel: `${nextSession._count.attendance} Anmeldungen`,
      } : undefined}
      mannschaften={teamCount > 0 ? { count: teamCount } : undefined}
      uebungen={{ exerciseCount, noteCount: 0 }}
    />
  );
}

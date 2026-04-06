/**
 * Quick-Dashboard homepage component.
 * Shows role-specific info cards and primary action button.
 * Replaces the old generic "Willkommen zurück" homepage.
 */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { DashboardKarte } from './DashboardKarte';
import { UserProfileWidget } from '@/components/auth';

interface QuickDashboardProps {
  displayName: string;
  role: 'trainer' | 'player';
  nextTraining?: {
    date: string;
    detail: string;
    exerciseCount: number;
    attendanceLabel: string;
  };
  mannschaften?: {
    count: number;
    nextGame?: string;
  };
  uebungen?: {
    exerciseCount: number;
    noteCount: number;
    newVotes?: number;
  };
}

export function QuickDashboard({
  displayName,
  role,
  nextTraining,
  mannschaften,
  uebungen,
}: QuickDashboardProps) {
  const isTrainer = role === 'trainer';
  const accentColor = isTrainer ? 'blue' : 'green';
  const dashboardPath = isTrainer ? '/trainer' : '/player';

  return (
    <div className="min-h-screen relative">
      {/* Floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`floating-orb w-96 h-96 ${isTrainer ? 'bg-blue-400' : 'bg-green-400'} top-[-10%] left-[-5%]`} style={{ animationDelay: '0s' }} />
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
            {isTrainer && (
              <Link
                href="/trainer/spieler"
                className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-sm border border-white/30 hover:bg-blue-500/20 transition-all"
                title="Spielerverwaltung"
              >
                ⚙️
              </Link>
            )}
            <UserProfileWidget />
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6">

        {/* Greeting */}
        <h1 className="text-[22px] font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
          Hallo {displayName}
        </h1>

        {/* Cards */}
        <div className="space-y-3 mb-6">
          {nextTraining && (
            <DashboardKarte
              title="Nächstes Training"
              subtitle={nextTraining.date}
              detail={nextTraining.detail}
              href={`${dashboardPath}?tab=training`}
              accent
              accentColor={accentColor as 'blue' | 'green'}
              stats={[
                { label: `📋 ${nextTraining.exerciseCount} Übung${nextTraining.exerciseCount !== 1 ? 'en' : ''} geplant`, variant: 'blue' },
                { label: `✓ ${nextTraining.attendanceLabel}`, variant: 'green' },
              ]}
            />
          )}

          {mannschaften && (
            <DashboardKarte
              title="Mannschaften"
              subtitle={`${mannschaften.count} aktive Mannschaft${mannschaften.count !== 1 ? 'en' : ''}`}
              detail={mannschaften.nextGame}
              href={`${dashboardPath}?tab=mannschaft`}
            />
          )}

          {uebungen && (
            <DashboardKarte
              title="Übungen"
              subtitle={`${uebungen.exerciseCount} Übungen · ${uebungen.noteCount} Notizen`}
              detail={uebungen.newVotes ? `${uebungen.newVotes} neue Votes seit letzter Woche` : undefined}
              href={`${dashboardPath}?tab=uebungen`}
            />
          )}
        </div>

        {/* Primary action */}
        <div className="text-center">
          <Link
            href={`${dashboardPath}?tab=training`}
            className={`inline-block px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all hover:translate-y-[-2px] ${
              isTrainer ? 'bg-[#2563eb] hover:bg-blue-700' : 'bg-[#16a34a] hover:bg-green-700'
            }`}
          >
            {isTrainer ? '+ Training vorbereiten' : 'Übungen ansehen'}
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Spielerverwaltung page for trainers.
 * Accessible via the settings icon on the trainer dashboard.
 * Shows player management (create, edit, delete, import, password reset).
 */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { UserProfileWidget } from '@/components/auth';
import { SpielerTab } from '@/components/players';

export default function SpielerVerwaltungPage() {
  const { isLoading, isAuthorized } = useRequireAuth({ allowedRoles: ['trainer'] });

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="floating-orb w-96 h-96 bg-blue-400 top-[-10%] left-[-5%]" style={{ animationDelay: '0s' }} />
        <div className="floating-orb w-80 h-80 bg-purple-400 bottom-[10%] right-[-8%]" style={{ animationDelay: '7s' }} />
      </div>

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
              href="/trainer"
              className="p-2 hover:bg-white/20 rounded-xl transition-all"
              aria-label="Zurück zum Dashboard"
            >
              <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <UserProfileWidget />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4 relative z-10">
        <SpielerTab />
      </main>
    </div>
  );
}

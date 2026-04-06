'use client';

import Link from 'next/link';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileWidget } from '@/components/auth';
import { EmailForm } from '@/components/profile';
import { NotificationToggle } from '@/components/notifications';

export default function ProfilPage() {
  const { isLoading: authLoading, isAuthorized } = useRequireAuth({ allowedRoles: ['trainer', 'player'] });
  const { user } = useAuth();

  const handleSaveEmail = async (email: string | null) => {
    try {
      const res = await fetch('/api/users/me/email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        return { ok: true };
      }
      const { error } = await res.json();
      return { ok: false, error: error ?? 'Fehler beim Speichern.' };
    } catch {
      return { ok: false, error: 'Netzwerkfehler. Bitte erneut versuchen.' };
    }
  };

  if (authLoading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Animated floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="floating-orb w-96 h-96 bg-green-400 top-[-10%] right-[-5%]" style={{ animationDelay: '0s' }} />
        <div className="floating-orb w-80 h-80 bg-blue-400 bottom-[10%] left-[-8%]" style={{ animationDelay: '7s' }} />
      </div>

      {/* Header */}
      <header className="glass-dark border-b border-white/20 sticky top-0 z-20 backdrop-blur-xl">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href={user?.role === 'trainer' ? '/trainer' : '/player'}
              className="p-2 -ml-2 hover:bg-white/30 rounded-xl transition-all"
              aria-label="Zurück"
            >
              <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Mein Profil</h1>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {user?.displayName}
              </p>
            </div>
            <UserProfileWidget />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 relative z-10 space-y-6">
        {/* User Info Card */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center">
              <span className="text-xl font-bold text-green-700">
                {user?.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                {user?.displayName}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                @{user?.username}
              </p>
            </div>
          </div>

          <EmailForm
            initialEmail={user?.email ?? ''}
            onSave={handleSaveEmail}
          />
        </div>

        {/* Notification Settings */}
        <NotificationToggle />
      </main>
    </div>
  );
}

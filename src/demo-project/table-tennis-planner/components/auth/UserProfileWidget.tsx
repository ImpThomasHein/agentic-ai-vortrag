'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function UserProfileWidget() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const avatarColors = {
    trainer: 'bg-blue-500/20 text-blue-700 border-blue-300/40',
    player: 'bg-green-500/20 text-green-700 border-green-300/40',
  };

  return (
    <div className="flex items-center gap-2 ml-auto">
      <Link
        href="/player/profil"
        className={`w-9 h-9 rounded-full flex items-center justify-center border font-semibold text-sm backdrop-blur-sm hover:scale-110 transition-transform ${avatarColors[user.role]}`}
        title={`Profil von ${user.displayName}`}
        aria-label={`Profil von ${user.displayName}`}
      >
        {user.displayName.charAt(0).toUpperCase() || 'U'}
      </Link>
      <button
        onClick={logout}
        className="px-3 py-1.5 rounded-xl text-xs font-semibold glass-button hover:bg-red-500/10 transition-all"
        style={{ color: 'var(--text-secondary)' }}
        aria-label="Abmelden"
      >
        Abmelden
      </button>
    </div>
  );
}
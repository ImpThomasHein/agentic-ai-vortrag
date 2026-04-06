'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth, getRoleHomePath } from '@/contexts/AuthContext';
import { InstallBanner } from '@/components/install';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(getRoleHomePath(user.role));
    }
  }, [isLoading, user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const result = await login(username.trim(), password);
    if (!result.success) {
      setError(result.error ?? 'Anmeldung fehlgeschlagen');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="floating-orb w-96 h-96 bg-blue-400 top-[-10%] left-[-5%]" style={{ animationDelay: '0s' }} />
      <div className="floating-orb w-80 h-80 bg-green-400 bottom-[5%] right-[-5%]" style={{ animationDelay: '5s' }} />
      <div className="floating-orb w-72 h-72 bg-purple-400 top-[40%] right-[10%]" style={{ animationDelay: '10s' }} />

      <div className="max-w-sm w-full space-y-6 relative z-10">
        <InstallBanner />
        <div className="glass rounded-3xl p-8 text-center">
          <div className="mb-4">
            <Image
              src="/ttf-logo.png"
              alt="TTF Bötzow Logo"
              width={120}
              height={120}
              className="mx-auto"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            TTF Companion
          </h1>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Melde dich an, um fortzufahren
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
          {error && (
            <div className="rounded-xl p-3 bg-red-500/10 border border-red-300/40 text-sm text-red-700 font-medium">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-xs font-semibold mb-1.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              Loginname
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="trainer oder spieler"
              className="w-full px-4 py-3 rounded-xl text-sm bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-white/60 backdrop-blur-sm disabled:opacity-60 placeholder:text-gray-400 transition-all"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold mb-1.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              Passwort
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl text-sm bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-white/60 backdrop-blur-sm disabled:opacity-60 transition-all"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !username || !password}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-blue-500/20 border border-blue-400/40 text-blue-700 hover:bg-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[48px]"
          >
            {isSubmitting ? 'Anmelden...' : 'Anmelden'}
          </button>
        </form>

        <p className="text-center text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          Tischtennisfreunde Bötzow
        </p>
      </div>
    </div>
  );
}

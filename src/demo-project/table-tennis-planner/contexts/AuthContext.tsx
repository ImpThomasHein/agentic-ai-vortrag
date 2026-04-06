'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { Group } from '@/lib/types';

export type UserRole = 'trainer' | 'player';

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
  displayName: string;
  email: string | null;
  groups: Group[];
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then(({ user }) => setUser(user ?? null))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        return { success: false, error: error ?? 'Ungültiger Loginname oder Passwort' };
      }

      // Login-Response hat noch keine groups – /api/auth/me aufrufen
      const meRes = await fetch('/api/auth/me');
      const { user: fullUser } = await meRes.json();
      setUser(fullUser);
      router.replace(fullUser.role === 'trainer' ? '/trainer' : '/player');
      return { success: true };
    },
    [router]
  );

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.replace('/login');
  }, [router]);

  const hasRole = useCallback(
    (role: UserRole | UserRole[]): boolean => {
      if (!user) return false;
      return Array.isArray(role) ? role.includes(user.role) : user.role === role;
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: user !== null, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function getRoleHomePath(role: UserRole): string {
  return role === 'trainer' ? '/trainer' : '/player';
}

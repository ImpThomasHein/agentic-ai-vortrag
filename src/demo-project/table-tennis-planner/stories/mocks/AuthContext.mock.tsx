'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AuthUser, UserRole } from '@/lib/auth';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface MockAuthProviderProps {
  children: ReactNode;
  user?: AuthUser | null;
  isLoading?: boolean;
}

export function AuthProvider({ children, user: initialUser = null, isLoading: initialLoading = false }: MockAuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);

  const login = async (username: string, _password: string) => {
    const mockUser: AuthUser = {
      username,
      role: username === 'trainer' ? 'trainer' : 'player',
      displayName: username === 'trainer' ? 'Trainer' : 'Spieler',
      displayInitial: username === 'trainer' ? 'T' : 'S',
    };
    setUser(mockUser);
    return { success: true };
  };

  const logout = () => setUser(null);

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    return Array.isArray(role) ? role.includes(user.role) : user.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: initialLoading,
        isAuthenticated: user !== null,
        login,
        logout,
        hasRole,
      }}
    >
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

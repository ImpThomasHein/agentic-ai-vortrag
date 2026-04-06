export type UserRole = 'trainer' | 'player';

export interface AuthUser {
  username: string;
  role: UserRole;
  displayInitial: string;
  displayName: string;
}

interface AuthSession {
  user: AuthUser;
  loginTime: number;
}

const SESSION_KEY = 'tt-auth-session';

const CREDENTIALS: Record<string, { password: string; role: UserRole }> = {
  trainer: { password: 'trainer', role: 'trainer' },
  player: { password: 'player', role: 'player' },
};

const ROLE_META: Record<UserRole, { displayName: string; displayInitial: string }> = {
  trainer: { displayName: 'Trainer', displayInitial: 'T' },
  player: { displayName: 'Spieler', displayInitial: 'S' },
};

export function validateCredentials(username: string, password: string): AuthUser | null {
  const entry = CREDENTIALS[username.toLowerCase()];
  if (!entry || entry.password !== password) return null;
  return {
    username: username.toLowerCase(),
    role: entry.role,
    ...ROLE_META[entry.role],
  };
}

export function saveSession(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  const session: AuthSession = { user, loginTime: Date.now() };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadSession(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as AuthSession;
    return session.user;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function getRoleHomePath(role: UserRole): string {
  return role === 'trainer' ? '/trainer' : '/player';
}

import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  userId: string;
  username: string;
  role: string;       // "trainer" | "player"
  displayName: string;
}

if (!process.env.SESSION_SECRET) {
  console.error('[session] SESSION_SECRET is not set! Authentication will fail.');
}

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'tt-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function requireSession(): Promise<SessionData> {
  const session = await getSession();
  if (!session.userId) {
    throw new Error('Nicht angemeldet');
  }
  return session as SessionData;
}

export async function requireTrainer(): Promise<SessionData> {
  const session = await requireSession();
  if (session.role !== 'trainer') {
    throw new Error('Nur für Trainer');
  }
  return session;
}

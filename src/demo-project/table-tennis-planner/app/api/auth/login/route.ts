import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const prisma = await getPrisma();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Loginname und Passwort erforderlich' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      include: { roles: { include: { userRole: true } } },
    });

    if (!user) {
      console.warn('[auth/login] Login failed: user not found', { username });
      return NextResponse.json({ error: 'Ungültige Anmeldedaten' }, { status: 401 });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      console.warn('[auth/login] Login failed: wrong password', { username });
      return NextResponse.json({ error: 'Ungültige Anmeldedaten' }, { status: 401 });
    }

    const role = user.roles[0]?.userRole.name ?? 'player';

    const session = await getSession();
    session.userId = user.id;
    session.username = user.username;
    session.role = role;
    session.displayName = user.displayName;
    await session.save();

    console.log('[auth/login] Login successful', { username, role });
    return NextResponse.json({
      id: user.id,
      username: user.username,
      role,
      displayName: user.displayName,
    });
  } catch (error) {
    console.error('[auth/login] Unhandled error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

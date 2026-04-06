import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getPrisma } from '@/lib/db';

export async function GET() {
  try {
    const prisma = await getPrisma();
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json({ user: null });
    }

    // User + Gruppen aus DB laden – prüft gleichzeitig ob Session noch gültig ist
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        groupMembers: {
          include: { group: true },
        },
      },
    });

    // Session ungültig wenn User nicht mehr in DB (z.B. nach DB-Reset)
    if (!user) {
      console.warn('[auth/me] Session user not found in DB, destroying session', { userId: session.userId });
      session.destroy();
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        role: session.role,
        displayName: user.displayName,
        email: user.email ?? null,
        groups: user.groupMembers.map((m) => ({
          id: m.group.id,
          name: m.group.name,
          description: m.group.description,
          myRole: m.role as 'trainer' | 'player',
        })),
      },
    });
  } catch (error) {
    console.error('[auth/me] Unhandled error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

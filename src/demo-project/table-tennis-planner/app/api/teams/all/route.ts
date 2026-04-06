import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const teams = await prisma.team.findMany({
    include: { _count: { select: { members: true } } },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(
    teams.map((t) => ({
      id: t.id,
      name: t.name,
      clickTtUrl: t.clickTtUrl,
      lastSync: t.lastSync,
      memberCount: t._count.members,
    }))
  );
}

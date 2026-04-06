import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }

  const memberships = await prisma.teamMember.findMany({
    where: { userId: session.userId },
    include: {
      team: {
        include: { _count: { select: { members: true } } },
      },
    },
  });

  return NextResponse.json(
    memberships.map((m) => ({
      id: m.team.id,
      name: m.team.name,
      clickTtUrl: m.team.clickTtUrl,
      lastSync: m.team.lastSync,
      memberCount: m.team._count.members,
    }))
  );
}

export async function POST(request: NextRequest) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  try {
    const { name } = await request.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name ist erforderlich' }, { status: 400 });
    }

    const team = await prisma.team.create({
      data: {
        name: name.trim(),
        members: {
          create: { userId: session.userId },
        },
      },
    });

    return NextResponse.json(team, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Mannschaft existiert bereits oder Serverfehler' }, { status: 400 });
  }
}

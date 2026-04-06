import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
    }

    const { id: sessionId } = await params;

    // Alle Votes der Session + eigene Votes des Users
    const [allVotes, myVotes] = await Promise.all([
      prisma.vote.groupBy({
        by: ['exerciseId'],
        where: { sessionId },
        _count: { exerciseId: true },
      }),
      prisma.vote.findMany({
        where: { sessionId, userId: session.userId },
        select: { exerciseId: true },
      }),
    ]);

    return NextResponse.json({
      voteCounts: Object.fromEntries(allVotes.map((v) => [v.exerciseId, v._count.exerciseId])),
      myVotes: myVotes.map((v) => v.exerciseId),
    });
  } catch (error) {
    console.error('GET /api/sessions/[id]/votes error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
    }

    const { id: sessionId } = await params;
    const { exerciseId } = await request.json();

    const existing = await prisma.vote.findUnique({
      where: { userId_exerciseId_sessionId: { userId: session.userId, exerciseId, sessionId } },
    });

    if (existing) {
      await prisma.vote.delete({ where: { id: existing.id } });
      return NextResponse.json({ voted: false });
    }

    await prisma.vote.create({ data: { userId: session.userId, exerciseId, sessionId } });
    return NextResponse.json({ voted: true });
  } catch (error) {
    console.error('POST /api/sessions/[id]/votes error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

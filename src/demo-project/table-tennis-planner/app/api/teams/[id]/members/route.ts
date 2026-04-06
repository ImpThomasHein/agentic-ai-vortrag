/**
 * API route handler for team members collection.
 * GET: List all members of a team (authenticated users only).
 * POST: Add a member to a team. Trainers can add anyone; captains of the team can add anyone;
 *       players can only add themselves (self-join).
 */
import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }

  const { id } = await params;

  const members = await prisma.teamMember.findMany({
    where: { teamId: id },
    select: {
      id: true,
      teamId: true,
      role: true,
      user: { select: { id: true, username: true, displayName: true } },
    },
  });

  return NextResponse.json(
    members.map((m) => ({
      id: m.id,
      teamId: m.teamId,
      userId: m.user.id,
      username: m.user.username,
      displayName: m.user.displayName,
      role: m.role,
    }))
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }

  const { id } = await params;
  const { userId } = await request.json();

  // Authorization: trainer > captain of this team > player self-join
  if (session.role !== 'trainer') {
    // Check if user is captain of this team
    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId: id, userId: session.userId as string } },
    });
    if (membership?.role === 'captain') {
      // Captain: can add anyone to their team — fall through to add
    } else if (userId === session.userId) {
      // Player: can only add themselves (self-join) — fall through to add
    } else {
      return NextResponse.json({ error: 'Spieler können nur sich selbst zuordnen' }, { status: 403 });
    }
  }

  try {
    const member = await prisma.teamMember.create({
      data: { teamId: id, userId },
      include: { user: { select: { id: true, username: true, displayName: true } } },
    });

    return NextResponse.json({
      id: member.id,
      teamId: member.teamId,
      userId: member.user.id,
      username: member.user.username,
      displayName: member.user.displayName,
      role: member.role,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Spieler bereits zugeordnet oder nicht gefunden' }, { status: 400 });
  }
}

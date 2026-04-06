/**
 * API route handler for a specific team member.
 * DELETE: Remove a member from a team. Trainers can remove anyone; captains of the team can
 *         remove anyone; players can only remove themselves (self-leave).
 */
import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; uid: string }> }
) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }

  const { id, uid } = await params;

  // Authorization: trainer > captain of this team > player self-leave
  if (session.role !== 'trainer') {
    // Check if user is captain of this team
    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId: id, userId: session.userId as string } },
    });
    if (membership?.role === 'captain') {
      // Captain: can remove anyone from their team — fall through to delete
    } else if (uid === session.userId) {
      // Player: can only remove themselves (self-leave) — fall through to delete
    } else {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
    }
  }

  try {
    await prisma.teamMember.delete({
      where: { teamId_userId: { teamId: id, userId: uid } },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Mitgliedschaft nicht gefunden' }, { status: 404 });
  }
}

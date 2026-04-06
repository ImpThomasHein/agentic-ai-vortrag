import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';
import { hasUserAccessToTeam } from '@/lib/auth-utils';

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

  const team = await prisma.team.findUnique({ where: { id } });
  if (!team) {
    return NextResponse.json({ error: 'Mannschaft nicht gefunden' }, { status: 404 });
  }

  if (!(await hasUserAccessToTeam(id, session))) {
    return NextResponse.json({ error: 'Kein Zugriff' }, { status: 403 });
  }

  return NextResponse.json(team);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const { id } = await params;
  const { name, clickTtUrl } = await request.json();

  try {
    const team = await prisma.team.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(clickTtUrl !== undefined && { clickTtUrl }),
      },
    });

    return NextResponse.json(team);
  } catch {
    return NextResponse.json({ error: 'Mannschaft nicht gefunden oder Name existiert bereits' }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const { id } = await params;

  try {
    await prisma.team.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Mannschaft nicht gefunden' }, { status: 404 });
  }
}

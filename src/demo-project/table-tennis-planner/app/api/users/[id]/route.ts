// Handles editing (PUT) and deleting (DELETE) individual user accounts.
// Trainer-only endpoints for the player management tab.
import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
  }

  const body = await request.json();
  const data: Record<string, string | null> = {};

  // Validate displayName
  if (body.displayName !== undefined) {
    const displayName = String(body.displayName).trim();
    if (!displayName) {
      return NextResponse.json({ error: 'Anzeigename darf nicht leer sein' }, { status: 400 });
    }
    data.displayName = displayName;
  }

  // Validate username
  if (body.username !== undefined) {
    const username = String(body.username).toLowerCase().trim();
    if (!username) {
      return NextResponse.json({ error: 'Benutzername darf nicht leer sein' }, { status: 400 });
    }
    if (username !== user.username) {
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing) {
        return NextResponse.json({ error: 'Benutzername bereits vergeben' }, { status: 409 });
      }
      data.username = username;
    }
  }

  // Validate email
  if (body.email !== undefined) {
    const email = body.email === null ? null : String(body.email).trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Ungültiges E-Mail-Format' }, { status: 400 });
    }
    data.email = email || null;
  }

  try {
    const updated = await prisma.user.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      id: updated.id,
      displayName: updated.displayName,
      username: updated.username,
      email: updated.email ?? null,
    });
  } catch {
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const { id } = await params;

  if (session.userId === id) {
    return NextResponse.json({ error: 'Du kannst dich nicht selbst löschen' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
  }

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: 'Benutzer gelöscht' });
  } catch {
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

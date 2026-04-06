/** DELETE/PUT /api/teams/[id]/chat/[messageId] — Delete or edit a chat message */
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getPrisma } from '@/lib/db';
import { buildChatResponse, canDeleteMessage } from '../chat-helpers';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; messageId: string }> }
) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }

  const { id: teamId, messageId } = await params;
  const prisma = await getPrisma();

  const membership = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId: session.userId } },
  });
  if (!membership && session.role !== 'trainer') {
    return NextResponse.json({ error: 'Kein Teammitglied' }, { status: 403 });
  }

  const message = await prisma.chatMessage.findUnique({ where: { id: messageId } });
  if (!message || message.teamId !== teamId) {
    return NextResponse.json({ error: 'Nachricht nicht gefunden' }, { status: 404 });
  }

  const isTrainer = session.role === 'trainer';
  if (!canDeleteMessage(session.userId, message.userId, isTrainer)) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const imageId = message.imageId;
  await prisma.chatMessage.delete({ where: { id: messageId } });

  // Clean up orphaned image if this message had one
  if (imageId) {
    const otherReferences = await prisma.chatMessage.count({ where: { imageId } });
    if (otherReferences === 0) {
      await prisma.chatImage.delete({ where: { id: imageId } }).catch(() => {});
    }
  }

  return new NextResponse(null, { status: 204 });
}

/** PUT — Edit the text content of a chat message (only own messages) */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; messageId: string }> }
) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }

  const { id: teamId, messageId } = await params;
  const prisma = await getPrisma();

  const membership = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId: session.userId } },
  });
  if (!membership && session.role !== 'trainer') {
    return NextResponse.json({ error: 'Kein Teammitglied' }, { status: 403 });
  }

  const message = await prisma.chatMessage.findUnique({ where: { id: messageId } });
  if (!message || message.teamId !== teamId) {
    return NextResponse.json({ error: 'Nachricht nicht gefunden' }, { status: 404 });
  }

  // Only the original sender can edit
  if (message.userId !== session.userId) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const body = await request.json();
  const { content } = body as { content?: string };

  if (!content || content.trim().length === 0) {
    return NextResponse.json({ error: 'Inhalt darf nicht leer sein' }, { status: 400 });
  }

  if (content.length > 2000) {
    return NextResponse.json({ error: 'Nachricht darf maximal 2000 Zeichen lang sein' }, { status: 400 });
  }

  const updated = await prisma.chatMessage.update({
    where: { id: messageId },
    data: { content: content.trim() },
    include: { user: { select: { username: true, displayName: true } } },
  });

  return NextResponse.json(buildChatResponse(updated));
}

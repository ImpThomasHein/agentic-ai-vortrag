/** GET/POST /api/teams/[id]/chat — List and send team chat messages */
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getPrisma } from '@/lib/db';
import { buildChatResponse } from './chat-helpers';
import { notifyTeamAboutNewMessage } from '@/lib/push';

/** GET — Load chat messages for a team (paginated, oldest first) */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }

  const { id: teamId } = await params;
  const prisma = await getPrisma();

  const membership = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId: session.userId } },
  });
  if (!membership && session.role !== 'trainer') {
    return NextResponse.json({ error: 'Kein Teammitglied' }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const before = searchParams.get('before');
  const after = searchParams.get('after');
  const limit = Math.min(Number(searchParams.get('limit') ?? 50), 100);

  const createdAtFilter: Record<string, Date> = {};
  if (before) createdAtFilter.lt = new Date(before);
  if (after) createdAtFilter.gt = new Date(after);

  const messages = await prisma.chatMessage.findMany({
    where: {
      teamId,
      ...(Object.keys(createdAtFilter).length > 0 ? { createdAt: createdAtFilter } : {}),
    },
    include: { user: { select: { username: true, displayName: true } } },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  // Return in ascending order (oldest first)
  return NextResponse.json(messages.reverse().map(buildChatResponse));
}

/** POST — Send a new chat message (text, image, or both) */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }

  const { id: teamId } = await params;
  const prisma = await getPrisma();

  const membership = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId: session.userId } },
  });
  if (!membership && session.role !== 'trainer') {
    return NextResponse.json({ error: 'Kein Teammitglied' }, { status: 403 });
  }

  const body = await request.json();
  const { content, imageId } = body as { content?: string; imageId?: string };

  if (!content && !imageId) {
    return NextResponse.json(
      { error: 'Nachricht muss Text oder Bild enthalten' },
      { status: 400 }
    );
  }

  if (content && content.length > 2000) {
    return NextResponse.json(
      { error: 'Nachricht darf maximal 2000 Zeichen lang sein' },
      { status: 400 }
    );
  }

  const [message, team] = await Promise.all([
    prisma.chatMessage.create({
      data: {
        teamId,
        userId: session.userId,
        content: content ?? null,
        imageId: imageId ?? null,
      },
      include: { user: { select: { username: true, displayName: true } } },
    }),
    prisma.team.findUnique({ where: { id: teamId }, select: { name: true } }),
  ]);

  notifyTeamAboutNewMessage(
    teamId,
    session.userId,
    team?.name ?? 'Team-Chat',
    (session.displayName as string) ?? session.username ?? 'Unbekannt',
    content ?? null
  );

  return NextResponse.json(buildChatResponse(message), { status: 201 });
}

/** GET /api/chat-images/[id] — Serve a stored chat image with caching and team membership check */
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getPrisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }

  const { id } = await params;
  const prisma = await getPrisma();
  const image = await prisma.chatImage.findUnique({
    where: { id },
    include: { messages: { select: { teamId: true }, take: 1 } },
  });

  if (!image) {
    return NextResponse.json({ error: 'Bild nicht gefunden' }, { status: 404 });
  }

  // Verify user has access: must be trainer or member of a team that uses this image
  if (session.role !== 'trainer' && image.messages.length > 0) {
    const teamId = image.messages[0].teamId;
    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: session.userId } },
    });
    if (!membership) {
      return NextResponse.json({ error: 'Kein Zugriff' }, { status: 403 });
    }
  }

  const etag = `"${image.id}"`;
  if (request.headers.get('if-none-match') === etag) {
    return new NextResponse(null, { status: 304 });
  }

  return new NextResponse(image.data, {
    headers: {
      'Content-Type': image.mimeType,
      'Cache-Control': 'private, max-age=86400, immutable',
      ETag: etag,
    },
  });
}

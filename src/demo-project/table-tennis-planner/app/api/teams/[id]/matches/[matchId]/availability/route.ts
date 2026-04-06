/**
 * API route handler for match availability reports.
 * GET: Returns all availability reports for a specific match in a team.
 * PUT: Creates or updates the authenticated user's availability report for a match.
 * Only team members can access these endpoints.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';
import { hasUserAccessToTeam } from '@/lib/auth-utils';
import type { LeagueData } from '@/lib/types';

const VALID_STATUSES = ['yes', 'no', 'maybe'];

type RouteParams = { params: Promise<{ id: string; matchId: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }

  const { id: teamId, matchId } = await params;
  const prisma = await getPrisma();

  // Check that the requesting user is a team member or trainer
  if (!(await hasUserAccessToTeam(teamId, session))) {
    return NextResponse.json({ error: 'Kein Zugriff' }, { status: 403 });
  }

  const entries = await prisma.matchAvailability.findMany({
    where: { teamId, matchId },
    include: { user: { select: { displayName: true } } },
  });

  return NextResponse.json(
    entries.map((e) => ({
      userId: e.userId,
      displayName: e.user.displayName,
      status: e.status,
      canDrive: e.canDrive,
    }))
  );
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }

  const { id: teamId, matchId } = await params;
  const prisma = await getPrisma();

  // Check that the requesting user is a team member or trainer
  if (!(await hasUserAccessToTeam(teamId, session))) {
    return NextResponse.json({ error: 'Kein Zugriff' }, { status: 403 });
  }

  const body = await request.json();
  const { status, canDrive = false } = body;

  // Validate status
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `Ungültiger Status. Erlaubt: ${VALID_STATUSES.join(', ')}` },
      { status: 400 }
    );
  }

  // Check match is not completed by looking at team's leagueData
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (team?.leagueData) {
    try {
      const leagueData = JSON.parse(team.leagueData as string) as LeagueData;
      const match = leagueData.matches?.find((m) => m.matchId === matchId);
      if (match?.isCompleted) {
        return NextResponse.json(
          { error: 'Verfügbarkeit für abgeschlossene Spiele kann nicht geändert werden' },
          { status: 400 }
        );
      }
    } catch {
      // If parsing fails, allow the operation
    }
  }

  // Upsert availability entry
  const entry = await prisma.matchAvailability.upsert({
    where: { teamId_matchId_userId: { teamId, matchId, userId: session.userId as string } },
    update: { status, canDrive },
    create: { teamId, matchId, userId: session.userId as string, status, canDrive },
    include: { user: { select: { displayName: true } } },
  });

  return NextResponse.json({
    userId: entry.userId,
    displayName: entry.user.displayName,
    status: entry.status,
    canDrive: entry.canDrive,
  });
}

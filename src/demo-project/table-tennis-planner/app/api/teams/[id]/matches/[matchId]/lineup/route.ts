/**
 * API route handler for match lineup management.
 * GET: Returns the current lineup for a specific match in a team, including driver info.
 * PUT: Replaces the entire lineup (captain or trainer only); validates all players are team members.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';
import { hasUserAccessToTeam } from '@/lib/auth-utils';
import type { LeagueData } from '@/lib/types';

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

  const entries = await prisma.matchLineup.findMany({
    where: { teamId, matchId },
    include: { user: { select: { displayName: true } } },
  });

  return NextResponse.json({
    lineup: entries.map((e) => ({
      userId: e.userId,
      displayName: e.user.displayName,
      isDriver: e.isDriver,
    })),
  });
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

  // Only captain (team role) or trainer (session role) can set lineup
  const isTrainer = session.role === 'trainer';
  const callerMembership = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId: session.userId as string } },
  });
  const isCaptain = callerMembership?.role === 'captain';
  if (!isCaptain && !isTrainer) {
    return NextResponse.json({ error: 'Nur Kapitäne und Trainer können die Aufstellung setzen' }, { status: 403 });
  }

  const body = await request.json();
  const { players = [], driverUserId = null } = body as { players: string[]; driverUserId: string | null };

  // Validate all player userIds are current team members
  if (players.length > 0) {
    const memberRecords = await prisma.teamMember.findMany({
      where: { teamId, userId: { in: players } },
      select: { userId: true },
    });
    const memberUserIds = new Set(memberRecords.map((m) => m.userId));
    const nonMembers = players.filter((uid) => !memberUserIds.has(uid));
    if (nonMembers.length > 0) {
      return NextResponse.json(
        { error: 'Einige Spieler sind kein Teammitglied', nonMembers },
        { status: 400 }
      );
    }
  }

  // Check match is not completed by looking at team's leagueData
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (team?.leagueData) {
    try {
      const leagueData = JSON.parse(team.leagueData as string) as LeagueData;
      const match = leagueData.matches?.find((m) => m.matchId === matchId);
      if (match?.isCompleted) {
        return NextResponse.json(
          { error: 'Aufstellung für abgeschlossene Spiele kann nicht geändert werden' },
          { status: 400 }
        );
      }
    } catch {
      // If parsing fails, allow the operation
    }
  }

  // Atomically replace the lineup: delete existing, create new entries
  await prisma.$transaction([
    prisma.matchLineup.deleteMany({ where: { teamId, matchId } }),
    prisma.matchLineup.createMany({
      data: players.map((userId) => ({
        teamId,
        matchId,
        userId,
        isDriver: userId === driverUserId,
      })),
    }),
  ]);

  // Fetch the newly created lineup to return it
  const entries = await prisma.matchLineup.findMany({
    where: { teamId, matchId },
    include: { user: { select: { displayName: true } } },
  });

  return NextResponse.json({
    lineup: entries.map((e) => ({
      userId: e.userId,
      displayName: e.user.displayName,
      isDriver: e.isDriver,
    })),
  });
}

/**
 * POST /api/users/import-players — Import players from click-TT bilanzen page.
 * Scrapes player names grouped by team, creates user accounts for new players,
 * and optionally assigns them to their respective teams (when assignToTeams=true).
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getPrisma } from '@/lib/db';
import { scrapeClubPlayers } from '@/import/click-tt';
import bcrypt from 'bcryptjs';

function generateUsername(firstName: string, lastName: string): string {
  return `${firstName}.${lastName}`
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9.]/g, '');
}

export async function POST(request: NextRequest) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  let body: { url: string; assignToTeams?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 });
  }

  const { url, assignToTeams = false } = body;

  // SSRF-Schutz: nur mytischtennis.de URLs erlauben
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'www.mytischtennis.de' && parsed.hostname !== 'mytischtennis.de') {
      return NextResponse.json({ error: 'Nur mytischtennis.de URLs erlaubt' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Ungültige URL' }, { status: 400 });
  }

  try {
    const clubPlayers = await scrapeClubPlayers(url);
    if (clubPlayers.length === 0) {
      return NextResponse.json({ error: 'Keine Spieler gefunden' }, { status: 404 });
    }

    // Unique players by displayName
    const uniquePlayersMap = new Map<string, { firstName: string; lastName: string; teamNames: string[] }>();
    for (const p of clubPlayers) {
      const displayName = `${p.firstName} ${p.lastName}`;
      const existing = uniquePlayersMap.get(displayName);
      if (existing) {
        if (!existing.teamNames.includes(p.teamName)) {
          existing.teamNames.push(p.teamName);
        }
      } else {
        uniquePlayersMap.set(displayName, {
          firstName: p.firstName,
          lastName: p.lastName,
          teamNames: [p.teamName],
        });
      }
    }

    // Load existing users to skip them — existing players are NEVER modified or overwritten.
    // Matching is done by displayName (case-insensitive) to detect duplicates.
    const existingUsers = await prisma.user.findMany({
      select: { id: true, displayName: true },
    });
    const existingDisplayNames = new Map(
      existingUsers.map((u) => [u.displayName.toLowerCase(), u.id])
    );

    // Get player role ID
    const playerRole = await prisma.userRole.upsert({
      where: { name: 'player' },
      update: {},
      create: { name: 'player', description: 'Spieler' },
    });

    const results: Array<{
      displayName: string;
      username: string;
      status: 'created' | 'skipped';
      password?: string;
      teamNames: string[];
    }> = [];

    let created = 0;
    let skipped = 0;

    for (const [displayName, player] of uniquePlayersMap) {
      const existingUserId = existingDisplayNames.get(displayName.toLowerCase());

      if (existingUserId) {
        skipped++;
        results.push({
          displayName,
          username: '',
          status: 'skipped',
          teamNames: player.teamNames,
        });
      } else {
        // Generate unique username
        const baseUsername = generateUsername(player.firstName, player.lastName);
        let username = baseUsername;
        let suffix = 2;

        // Check for existing usernames
        const existingUsernames = await prisma.user.findMany({
          where: { username: { startsWith: baseUsername } },
          select: { username: true },
        });
        const usernameSet = new Set(existingUsernames.map((u) => u.username));
        while (usernameSet.has(username)) {
          username = `${baseUsername}${suffix}`;
          suffix++;
        }

        // Password = username (vorname.nachname)
        const password = username;
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
          data: {
            username,
            passwordHash,
            displayName,
            roles: {
              create: { userRoleId: playerRole.id },
            },
          },
        });

        existingDisplayNames.set(displayName.toLowerCase(), newUser.id);
        created++;
        results.push({
          displayName,
          username,
          status: 'created',
          password,
          teamNames: player.teamNames,
        });
      }
    }

    // Assign to teams if requested
    let teamAssignments = 0;
    if (assignToTeams) {
      const allTeams = await prisma.team.findMany({
        select: { id: true, name: true },
      });
      const teamsByName = new Map(allTeams.map((t) => [t.name, t.id]));

      for (const result of results) {
        const userId = existingDisplayNames.get(result.displayName.toLowerCase());
        if (!userId) continue;

        for (const teamName of result.teamNames) {
          const teamId = teamsByName.get(teamName);
          if (!teamId) continue;

          await prisma.teamMember.upsert({
            where: { teamId_userId: { teamId, userId } },
            update: {},
            create: { teamId, userId },
          });
          teamAssignments++;
        }
      }
    }

    return NextResponse.json({
      created,
      skipped,
      teamAssignments,
      players: results,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Import fehlgeschlagen';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

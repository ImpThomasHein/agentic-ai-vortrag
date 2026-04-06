/** Syncs league data from click-TT for a team. Accepts optional clickTtTeamName in body. */
import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';
import { scrapeClickTT } from '@/import/click-tt';
import { resolveClickTtTeamName } from '@/lib/resolveClickTtTeamName';
import { LeagueData } from '@/lib/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const { id } = await params;

  const team = await prisma.team.findUnique({ where: { id } });
  if (!team) {
    return NextResponse.json({ error: 'Mannschaft nicht gefunden' }, { status: 404 });
  }

  if (!team.clickTtUrl) {
    return NextResponse.json({ error: 'Keine click-TT URL hinterlegt' }, { status: 400 });
  }

  const body = await parseBody(request);
  const existingLeagueData = parseLeagueData(team.leagueData);

  try {
    const scraped = await scrapeClickTT(team.clickTtUrl);
    const teamLeagueNames = scraped.standings.map(s => s.teamName);

    const clickTtTeamName = resolveClickTtTeamName(
      body?.clickTtTeamName ?? null,
      existingLeagueData,
      teamLeagueNames
    );

    // isHome-Flag setzen basierend auf clickTtTeamName
    for (const match of scraped.matches) {
      match.isHome = clickTtTeamName ? match.homeTeam === clickTtTeamName : false;
    }

    const leagueData: LeagueData = {
      standings: scraped.standings,
      matches: scraped.matches,
      clickTtTeamName,
    };

    const updated = await prisma.team.update({
      where: { id },
      data: {
        leagueData: JSON.stringify(leagueData),
        lastSync: new Date(),
      },
    });

    return NextResponse.json({
      lastSync: updated.lastSync,
      matchesCount: leagueData.matches.length,
      clickTtTeamName,
      leagueTeamNames: teamLeagueNames,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
    return NextResponse.json({ error: `click-TT Sync fehlgeschlagen: ${message}` }, { status: 500 });
  }
}

/** Safely parses the JSON body, returning null if empty or invalid. */
async function parseBody(request: NextRequest): Promise<{ clickTtTeamName?: string } | null> {
  try {
    const text = await request.text();
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

/** Parses stored leagueData JSON string into LeagueData, returning null if invalid. */
function parseLeagueData(raw: unknown): LeagueData | null {
  if (typeof raw !== 'string' || !raw) return null;
  try {
    return JSON.parse(raw) as LeagueData;
  } catch {
    return null;
  }
}

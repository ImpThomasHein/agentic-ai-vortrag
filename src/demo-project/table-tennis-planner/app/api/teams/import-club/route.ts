import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';
import { scrapeClubTeams, scrapeClickTT } from '@/import/click-tt';

export async function POST(request: NextRequest) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const { clubUrl } = await request.json();
  if (!clubUrl?.trim()) {
    return NextResponse.json({ error: 'clubUrl ist erforderlich' }, { status: 400 });
  }

  // SSRF-Schutz: Nur mytischtennis.de URLs erlauben
  try {
    const parsed = new URL(clubUrl);
    if (parsed.hostname !== 'www.mytischtennis.de' && parsed.hostname !== 'mytischtennis.de') {
      return NextResponse.json({ error: 'Nur mytischtennis.de URLs erlaubt' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Ungültige URL' }, { status: 400 });
  }

  try {
    const clubTeams = await scrapeClubTeams(clubUrl);

    if (clubTeams.length === 0) {
      return NextResponse.json({ error: 'Keine Mannschaften gefunden' }, { status: 404 });
    }

    const results: { id: string; name: string; synced: boolean }[] = [];

    for (const ct of clubTeams) {
      const team = await prisma.team.upsert({
        where: { name: ct.teamName },
        update: { clickTtUrl: ct.leagueUrl },
        create: {
          name: ct.teamName,
          clickTtUrl: ct.leagueUrl,
        },
      });

      // Liga-Daten synchronisieren
      let synced = false;
      try {
        const leagueData = await scrapeClickTT(ct.leagueUrl);
        // isHome-Flag setzen
        for (const match of leagueData.matches) {
          match.isHome = match.homeTeam.includes(ct.teamName) || ct.teamName.includes(match.homeTeam);
        }
        await prisma.team.update({
          where: { id: team.id },
          data: {
            leagueData: JSON.stringify(leagueData),
            lastSync: new Date(),
          },
        });
        synced = true;
      } catch {
        // Sync-Fehler ignorieren — Team wurde trotzdem angelegt
      }

      results.push({ id: team.id, name: team.name, synced });
    }

    return NextResponse.json({
      imported: results.length,
      teams: results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
    return NextResponse.json({ error: `Import fehlgeschlagen: ${message}` }, { status: 500 });
  }
}

import { describe, it, expect } from 'vitest';
import { parseClickTTHtml, parseClubTeamsHtml, createTeamImportUrl, mergeMatches } from '../click-tt';
import type { LeagueMatch } from '@/lib/types';

// Minimales HTML mit eingebettetem __remixContext
function buildFixture(loaderData: Record<string, unknown>): string {
  const remixContext = {
    state: { loaderData },
  };
  return `
    <html><head>
    <script>window.__remixContext = ${JSON.stringify(remixContext)};</script>
    </head><body></body></html>
  `;
}

describe('parseClickTTHtml', () => {
  it('parst Ligatabelle aus remixContext', () => {
    const html = buildFixture({
      'routes/tabelle.$filter': {
        data: {
          league_table: [
            { table_rank: 1, team_name: 'Team A', meetings_won: 10, meetings_tie: 1, meetings_lost: 2, meetings_count: 13, matches_won: 80, matches_lost: 40, games_won: 500, games_lost: 300, points_won: 21, points_lost: 5 },
            { table_rank: 2, team_name: 'Team B', meetings_won: 8, meetings_tie: 0, meetings_lost: 5, meetings_count: 13, matches_won: 60, matches_lost: 55, games_won: 400, games_lost: 350, points_won: 16, points_lost: 10 },
          ],
        },
      },
    });

    const result = parseClickTTHtml(html);

    expect(result.standings).toHaveLength(2);
    expect(result.standings[0]).toEqual({
      rank: 1,
      teamName: 'Team A',
      matchesPlayed: 13,
      wins: 10,
      draws: 1,
      losses: 2,
      games: '80:40',
      difference: 40,
      points: '21:5',
    });
    expect(result.standings[1].teamName).toBe('Team B');
    expect(result.standings[1].matchesPlayed).toBe(13);
    expect(result.standings[1].games).toBe('60:55');
  });

  it('parst Spielplan aus remixContext', () => {
    const html = buildFixture({
      'routes/tabelle.$filter': {
        data: {
          meetings_excerpt: {
            meetings: [
              {
                date: '2026-03-15T18:00:00.000+00:00',
                state: 'scheduled',
                is_meeting_complete: false,
                team_home: 'Team A',
                team_away: 'Team B',
              },
              {
                date: '2026-02-28T11:00:00.000+00:00',
                state: 'done',
                is_meeting_complete: true,
                team_home: 'Team C',
                team_away: 'Team A',
                matches_won: 2,
                matches_lost: 8,
              },
            ],
          },
        },
      },
    });

    const result = parseClickTTHtml(html);

    expect(result.matches).toHaveLength(2);
    // Sortiert nach Datum
    expect(result.matches[0].date).toBe('2026-02-28');
    expect(result.matches[0].homeTeam).toBe('Team C');
    expect(result.matches[0].isCompleted).toBe(true);
    expect(result.matches[0].score).toBe('2:8');

    expect(result.matches[1].date).toBe('2026-03-15');
    expect(result.matches[1].isCompleted).toBe(false);
    expect(result.matches[1].score).toBeNull();
  });

  it('gibt leere Arrays bei fehlenden Daten', () => {
    const html = buildFixture({
      'routes/other': { data: {} },
    });

    const result = parseClickTTHtml(html);
    expect(result.standings).toEqual([]);
    expect(result.matches).toEqual([]);
  });

  it('wirft Fehler bei fehlendem remixContext', () => {
    const html = '<html><body>Keine Daten</body></html>';
    expect(() => parseClickTTHtml(html)).toThrow('click-TT Daten konnten nicht extrahiert werden');
  });
});

// --- parseClubTeamsHtml Tests ---

function buildClubTeamsFixture(clubTeams: Record<string, unknown>[]): string {
  const remixContext = {
    state: {
      loaderData: {
        'routes/click-tt+/$association+/$season+/verein.$clubid.$clubname+/mannschaften': {
          data: {
            teams_list: {
              club_teams: clubTeams,
            },
          },
        },
      },
    },
  };
  return `
    <html><head>
    <script>window.__remixContext = ${JSON.stringify(remixContext)};</script>
    </head><body></body></html>
  `;
}

describe('parseClubTeamsHtml', () => {
  it('parst Mannschaften aus Vereinsseite', () => {
    const html = buildClubTeamsFixture([
      {
        season: '25/26',
        team_id: 2955366,
        group_id: 493628,
        team_name: 'Erwachsene',
        league_name: 'Landesliga Erwachsene',
        team_organisation_short: 'TTVB',
        table_rank: 2,
        points_won: 20,
        points_lost: 4,
      },
      {
        season: '25/26',
        team_id: 2955367,
        group_id: 493636,
        team_name: 'Damen',
        league_name: 'Verbandsliga Damen',
        team_organisation_short: 'TTVB',
        table_rank: 1,
        points_won: 24,
        points_lost: 0,
      },
    ]);

    const result = parseClubTeamsHtml(html);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      teamName: 'Erwachsene',
      leagueName: 'Landesliga Erwachsene',
      leagueUrl: 'https://www.mytischtennis.de/click-tt/TTVB/25--26/ligen/Landesliga_Erwachsene/gruppe/493628/tabelle/gesamt',
      rank: 2,
      points: '20:4',
    });
    expect(result[1].teamName).toBe('Damen');
    expect(result[1].leagueUrl).toContain('/Verbandsliga_Damen/');
  });

  it('ignoriert Pokal-Mannschaften (season mit P)', () => {
    const html = buildClubTeamsFixture([
      {
        season: '25/26',
        team_id: 1,
        group_id: 100,
        team_name: 'Erwachsene',
        league_name: 'Landesliga',
        team_organisation_short: 'TTVB',
        table_rank: 1,
        points_won: 10,
        points_lost: 0,
      },
      {
        season: 'P 25/26',
        team_id: 2,
        group_id: 200,
        team_name: 'Erwachsene II',
        league_name: 'LBO-Pokal',
        team_organisation_short: 'TTVB',
        table_rank: null,
        points_won: null,
        points_lost: null,
      },
    ]);

    const result = parseClubTeamsHtml(html);
    expect(result).toHaveLength(1);
    expect(result[0].teamName).toBe('Erwachsene');
  });

  it('gibt leeres Array bei fehlenden Daten', () => {
    const html = buildClubTeamsFixture([]);
    const result = parseClubTeamsHtml(html);
    expect(result).toEqual([]);
  });

  it('wirft Fehler bei fehlendem remixContext', () => {
    const html = '<html><body>Keine Daten</body></html>';
    expect(() => parseClubTeamsHtml(html)).toThrow();
  });

  it('konstruiert korrekte Liga-URL mit Sonderzeichen', () => {
    const html = buildClubTeamsFixture([
      {
        season: '25/26',
        team_id: 3,
        group_id: 300,
        team_name: 'Erwachsene III',
        league_name: '2. Landesklasse Erwachsene Gruppe 3',
        team_organisation_short: 'TTVB',
        table_rank: 5,
        points_won: 8,
        points_lost: 16,
      },
    ]);

    const result = parseClubTeamsHtml(html);
    expect(result[0].leagueUrl).toBe(
      'https://www.mytischtennis.de/click-tt/TTVB/25--26/ligen/2._Landesklasse_Erwachsene_Gruppe_3/gruppe/300/tabelle/gesamt'
    );
  });
});

// --- createTeamImportUrl Tests ---

describe('createTeamImportUrl', () => {
  it('ersetzt /gesamt durch gewünschte Runde', () => {
    const base = 'https://www.mytischtennis.de/click-tt/TTVB/25--26/ligen/Landesliga_Erwachsene/gruppe/493628/tabelle/gesamt';
    expect(createTeamImportUrl(base, 'vr')).toBe(
      'https://www.mytischtennis.de/click-tt/TTVB/25--26/ligen/Landesliga_Erwachsene/gruppe/493628/tabelle/vr'
    );
    expect(createTeamImportUrl(base, 'rr')).toBe(
      'https://www.mytischtennis.de/click-tt/TTVB/25--26/ligen/Landesliga_Erwachsene/gruppe/493628/tabelle/rr'
    );
  });

  it('ersetzt /vr durch andere Runde', () => {
    const base = 'https://www.mytischtennis.de/click-tt/TTVB/25--26/ligen/Kreisliga/gruppe/493601/tabelle/vr';
    expect(createTeamImportUrl(base, 'rr')).toBe(
      'https://www.mytischtennis.de/click-tt/TTVB/25--26/ligen/Kreisliga/gruppe/493601/tabelle/rr'
    );
    expect(createTeamImportUrl(base, 'gesamt')).toBe(
      'https://www.mytischtennis.de/click-tt/TTVB/25--26/ligen/Kreisliga/gruppe/493601/tabelle/gesamt'
    );
  });

  it('ist idempotent — gleiche Eingabe ergibt gleiches Ergebnis', () => {
    const base = 'https://www.mytischtennis.de/click-tt/TTVB/25--26/ligen/Landesliga_Erwachsene/gruppe/493628/tabelle/gesamt';
    const first = createTeamImportUrl(base, 'vr');
    const second = createTeamImportUrl(first, 'vr');
    expect(first).toBe(second);
  });

  it('funktioniert mit /rr als Ausgangs-URL', () => {
    const base = 'https://www.mytischtennis.de/click-tt/TTVB/25--26/ligen/Landesliga_Erwachsene/gruppe/493628/tabelle/rr';
    expect(createTeamImportUrl(base, 'vr')).toBe(
      'https://www.mytischtennis.de/click-tt/TTVB/25--26/ligen/Landesliga_Erwachsene/gruppe/493628/tabelle/vr'
    );
  });
});

// --- mergeMatches Tests ---

function makeMatch(date: string, homeTeam: string, awayTeam: string, overrides?: Partial<LeagueMatch>): LeagueMatch {
  return {
    matchId: `${date}_${homeTeam}_${awayTeam}`,
    date,
    time: '18:00',
    homeTeam,
    awayTeam,
    score: null,
    isHome: false,
    isCompleted: false,
    ...overrides,
  };
}

describe('mergeMatches', () => {
  it('fügt Spiele aus beiden Runden zusammen', () => {
    const vr = [makeMatch('2025-09-15', 'A', 'B')];
    const rr = [makeMatch('2026-02-10', 'B', 'A')];
    const result = mergeMatches(vr, rr);
    expect(result).toHaveLength(2);
    expect(result[0].date).toBe('2025-09-15');
    expect(result[1].date).toBe('2026-02-10');
  });

  it('dedupliziert Spiele per matchId', () => {
    const same = makeMatch('2025-10-01', 'A', 'B');
    const result = mergeMatches([same], [same]);
    expect(result).toHaveLength(1);
  });

  it('bevorzugt completetes Spiel bei Duplikat', () => {
    const pending = makeMatch('2025-10-01', 'A', 'B');
    const done = makeMatch('2025-10-01', 'A', 'B', { score: '6:4', isCompleted: true });
    const result = mergeMatches([pending], [done]);
    expect(result).toHaveLength(1);
    expect(result[0].isCompleted).toBe(true);
    expect(result[0].score).toBe('6:4');
  });

  it('sortiert chronologisch', () => {
    const late = makeMatch('2026-03-01', 'X', 'Y');
    const early = makeMatch('2025-09-01', 'Y', 'X');
    const result = mergeMatches([late], [early]);
    expect(result[0].date).toBe('2025-09-01');
    expect(result[1].date).toBe('2026-03-01');
  });

  it('gibt leeres Array bei leeren Eingaben', () => {
    expect(mergeMatches([], [])).toEqual([]);
  });
});

import * as cheerio from 'cheerio';
import type { LeagueData, LeagueStanding, LeagueMatch, ClubTeamInfo, ClubPlayerInfo } from '@/lib/types';
import { slugify } from '@/components/team/slugify';

/** Derives a click-TT league URL for a specific round (vr, rr, gesamt) from any tabelle URL. */
export function createTeamImportUrl(baseUrl: string, round: 'vr' | 'rr' | 'gesamt'): string {
  return baseUrl.replace(/\/tabelle\/[^/]+$/, `/tabelle/${round}`);
}

/** Merges matches from two rounds, deduplicates by matchId, prefers completed matches. */
export function mergeMatches(matchesVr: LeagueMatch[], matchesRr: LeagueMatch[]): LeagueMatch[] {
  const byId = new Map<string, LeagueMatch>();

  for (const match of [...matchesVr, ...matchesRr]) {
    const id = match.matchId ?? '';
    const existing = byId.get(id);
    if (!existing || (match.isCompleted && !existing.isCompleted)) {
      byId.set(id, match);
    }
  }

  return [...byId.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export function generateMatchId(date: string, homeTeam: string, awayTeam: string): string {
  return slugify(`${date}_${homeTeam}_${awayTeam}`);
}

/** Fetches and parses a single click-TT page. */
async function fetchAndParse(url: string): Promise<LeagueData> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TTPlanner/1.0)' },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`click-TT Seite nicht erreichbar: ${response.status}`);
  }

  const html = await response.text();
  return parseClickTTHtml(html);
}

/**
 * Scrapt click-TT Ligatabelle und Spielplan aus einer myTischtennis.de URL.
 * Holt /gesamt fuer Standings, /vr + /rr fuer alle Spiele der Saison.
 */
export async function scrapeClickTT(url: string): Promise<LeagueData> {
  const gesamtUrl = createTeamImportUrl(url, 'gesamt');
  const vrUrl = createTeamImportUrl(url, 'vr');
  const rrUrl = createTeamImportUrl(url, 'rr');

  const [gesamtData, vrData, rrData] = await Promise.all([
    fetchAndParse(gesamtUrl),
    fetchAndParse(vrUrl),
    fetchAndParse(rrUrl),
  ]);

  return {
    standings: gesamtData.standings,
    matches: mergeMatches(vrData.matches, rrData.matches),
    clickTtTeamName: null,
  };
}

/**
 * Parst das HTML einer click-TT Seite und extrahiert Ligadaten aus dem
 * eingebetteten window.__remixContext JSON.
 */
export function parseClickTTHtml(html: string): LeagueData {
  const $ = cheerio.load(html);

  // JSON aus <script> Tag mit window.__remixContext extrahieren
  let remixData: Record<string, unknown> | null = null;

  $('script').each((_, el) => {
    const content = $(el).html();
    if (content && content.includes('window.__remixContext')) {
      const match = content.match(/window\.__remixContext\s*=\s*({[\s\S]*?});?\s*$/m);
      if (match) {
        try {
          remixData = JSON.parse(match[1]);
        } catch {
          // Fallback: versuche mit anderem Pattern
        }
      }
    }
  });

  if (!remixData) {
    throw new Error('click-TT Daten konnten nicht extrahiert werden');
  }

  const loaderData = getNestedValue(remixData, ['state', 'loaderData']) as Record<string, unknown>;
  if (!loaderData) {
    throw new Error('Keine loaderData in click-TT Antwort gefunden');
  }

  // Tabelle finden - Schlüssel enthält "tabelle"
  const standings = parseStandings(loaderData);
  const matches = parseMatches(loaderData);

  return { standings, matches, clickTtTeamName: null };
}

function parseStandings(loaderData: Record<string, unknown>): LeagueStanding[] {
  const tableKey = Object.keys(loaderData).find((k) => k.includes('tabelle'));
  if (!tableKey) return [];

  const tableData = loaderData[tableKey] as Record<string, unknown>;
  const leagueTable = getNestedValue(tableData, ['data', 'league_table']) as Array<Record<string, unknown>>;
  if (!Array.isArray(leagueTable)) return [];

  return leagueTable.map((entry) => ({
    rank: Number(entry.table_rank) || 0,
    teamName: String(entry.team_name || '').trim(),
    matchesPlayed: Number(entry.meetings_count) || ((Number(entry.meetings_won) || 0) + (Number(entry.meetings_tie) || 0) + (Number(entry.meetings_lost) || 0)),
    wins: Number(entry.meetings_won) || 0,
    draws: Number(entry.meetings_tie) || 0,
    losses: Number(entry.meetings_lost) || 0,
    games: `${entry.matches_won || 0}:${entry.matches_lost || 0}`,
    difference: (Number(entry.matches_won) || 0) - (Number(entry.matches_lost) || 0),
    points: `${entry.points_won || 0}:${entry.points_lost || 0}`,
  }));
}

/** Parses matches from the tabelle key's meetings_excerpt (flat array of meeting objects). */
function parseMatches(loaderData: Record<string, unknown>): LeagueMatch[] {
  const tableKey = Object.keys(loaderData).find((k) => k.includes('tabelle'));
  if (!tableKey) return [];

  const tableData = loaderData[tableKey] as Record<string, unknown>;
  const meetingsExcerpt = getNestedValue(tableData, ['data', 'meetings_excerpt']) as Record<string, unknown>;
  if (!meetingsExcerpt) return [];

  const meetingsArray = meetingsExcerpt.meetings;
  if (!Array.isArray(meetingsArray)) return [];

  const matches: LeagueMatch[] = [];

  for (const m of meetingsArray) {
    if (!m || typeof m !== 'object') continue;

    const meeting = m as Record<string, unknown>;
    const dateStr = String(meeting.date || '');
    const date = dateStr.split('T')[0];
    const time = dateStr.includes('T') ? dateStr.split('T')[1]?.substring(0, 5) || '' : '';
    const isCompleted = meeting.is_meeting_complete === true || String(meeting.state || '') === 'done';

    const homeTeam = String(meeting.team_home || '').trim();
    const awayTeam = String(meeting.team_away || '').trim();
    matches.push({
      matchId: generateMatchId(date, homeTeam, awayTeam),
      date,
      time,
      homeTeam,
      awayTeam,
      score: isCompleted ? formatScore(meeting) : null,
      isHome: false,
      isCompleted,
    });
  }

  return matches.sort((a, b) => a.date.localeCompare(b.date));
}

function formatScore(meeting: Record<string, unknown>): string | null {
  // click-TT verwendet matches_won/matches_lost für den Spielstand
  const won = meeting.matches_won ?? meeting.games_home;
  const lost = meeting.matches_lost ?? meeting.games_away;
  if (won !== undefined && lost !== undefined) {
    return `${won}:${lost}`;
  }
  return null;
}

// --- Vereins-Import: Alle Mannschaften eines Vereins ---

// Re-export for consumers that import from click-tt
export type { ClubTeamInfo, ClubPlayerInfo } from '@/lib/types';

/**
 * Scrapt die Vereins-Mannschaften-Seite und gibt alle Teams mit Liga-URLs zurück.
 */
export async function scrapeClubTeams(url: string): Promise<ClubTeamInfo[]> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TTPlanner/1.0)' },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`click-TT Vereinsseite nicht erreichbar: ${response.status}`);
  }

  const html = await response.text();
  return parseClubTeamsHtml(html);
}

/**
 * Parst das HTML einer Vereins-Mannschaften-Seite und extrahiert alle Teams.
 */
export function parseClubTeamsHtml(html: string): ClubTeamInfo[] {
  const $ = cheerio.load(html);

  let remixData: Record<string, unknown> | null = null;
  $('script').each((_, el) => {
    const content = $(el).html();
    if (content && content.includes('window.__remixContext')) {
      const match = content.match(/window\.__remixContext\s*=\s*({[\s\S]*?});?\s*$/m);
      if (match) {
        try {
          remixData = JSON.parse(match[1]);
        } catch { /* ignore */ }
      }
    }
  });

  if (!remixData) {
    throw new Error('click-TT Daten konnten nicht extrahiert werden');
  }

  const loaderData = getNestedValue(remixData, ['state', 'loaderData']) as Record<string, unknown>;
  if (!loaderData) {
    throw new Error('Keine loaderData in click-TT Antwort gefunden');
  }

  // Key enthält "mannschaften"
  const mannschaftenKey = Object.keys(loaderData).find((k) => k.includes('mannschaften'));
  if (!mannschaftenKey) return [];

  const mannschaftenData = loaderData[mannschaftenKey] as Record<string, unknown>;
  const clubTeams = getNestedValue(mannschaftenData, ['data', 'teams_list', 'club_teams']) as Array<Record<string, unknown>>;
  if (!Array.isArray(clubTeams)) return [];

  return clubTeams
    .filter((t) => {
      const season = String(t.season || '');
      return !season.startsWith('P '); // Pokal-Mannschaften ignorieren
    })
    .map((t) => {
      const association = String(t.team_organisation_short || 'TTVB');
      const groupId = String(t.group_id || '');
      const leagueName = String(t.league_name || '');
      const leagueSlug = leagueName.replace(/ /g, '_');
      // Season "25/26" → "25--26"
      const season = String(t.season || '').replace('/', '--');

      return {
        teamName: String(t.team_name || ''),
        leagueName,
        leagueUrl: `https://www.mytischtennis.de/click-tt/${association}/${season}/ligen/${leagueSlug}/gruppe/${groupId}/tabelle/gesamt`,
        rank: t.table_rank != null ? Number(t.table_rank) : null,
        points: `${t.points_won ?? 0}:${t.points_lost ?? 0}`,
      };
    });
}

// --- Spieler-Import: Alle Spieler eines Vereins ---

/**
 * Scrapt die Bilanzen-Seite eines Vereins und gibt alle Spieler mit Mannschaftszuordnung zurück.
 */
export async function scrapeClubPlayers(url: string): Promise<ClubPlayerInfo[]> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TTPlanner/1.0)' },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`click-TT Bilanzen-Seite nicht erreichbar: ${response.status}`);
  }

  const html = await response.text();
  return parseClubPlayersHtml(html);
}

/**
 * Parst das HTML einer Bilanzen-Seite und extrahiert alle Spieler mit Mannschaftszuordnung.
 */
export function parseClubPlayersHtml(html: string): ClubPlayerInfo[] {
  const $ = cheerio.load(html);

  let remixData: Record<string, unknown> | null = null;
  $('script').each((_, el) => {
    const content = $(el).html();
    if (content && content.includes('window.__remixContext')) {
      const match = content.match(/window\.__remixContext\s*=\s*({[\s\S]*?});?\s*$/m);
      if (match) {
        try {
          remixData = JSON.parse(match[1]);
        } catch { /* ignore */ }
      }
    }
  });

  if (!remixData) {
    throw new Error('click-TT Daten konnten nicht extrahiert werden');
  }

  const loaderData = getNestedValue(remixData, ['state', 'loaderData']) as Record<string, unknown>;
  if (!loaderData) {
    throw new Error('Keine loaderData in click-TT Antwort gefunden');
  }

  // Key enthält "bilanzen"
  const bilanzenKey = Object.keys(loaderData).find((k) => k.includes('bilanzen'));
  if (!bilanzenKey) return [];

  const bilanzenData = loaderData[bilanzenKey] as Record<string, unknown>;
  const teams = getNestedValue(bilanzenData, ['data', 'teams']) as Array<Record<string, unknown>>;
  if (!Array.isArray(teams)) return [];

  const players: ClubPlayerInfo[] = [];

  for (const team of teams) {
    const teamName = String(team.team_name || '');
    if (!teamName) continue;

    const balanceSheets = team.team_balancesheet as Array<Record<string, unknown>> | undefined;
    if (!Array.isArray(balanceSheets)) continue;

    for (const sheet of balanceSheets) {
      const playerStats = sheet.single_player_statistics as Array<Record<string, unknown>> | undefined;
      if (!Array.isArray(playerStats)) continue;

      for (const p of playerStats) {
        const firstName = String(p.player_firstname || '').trim();
        const lastName = String(p.player_lastname || '').trim();
        if (firstName && lastName) {
          players.push({ firstName, lastName, teamName });
        }
      }
    }
  }

  return players;
}

function getNestedValue(obj: unknown, path: string[]): unknown {
  let current = obj;
  for (const key of path) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return current;
}

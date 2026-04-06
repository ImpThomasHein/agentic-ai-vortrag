// Unit tests for MatchCardAccordion helper functions.
import { describe, it, expect } from 'vitest';
import {
  getOpponentName,
  getIsHome,
  countYesResponses,
  getAvailabilityBadgeColor,
} from '../matchCardAccordionUtils';
import type { LeagueMatch, MatchAvailabilityEntry } from '@/lib/types';

const makeMatch = (overrides: Partial<LeagueMatch> = {}): LeagueMatch => ({
  date: '2026-04-10',
  time: '19:00',
  homeTeam: 'TTF Bötzow',
  awayTeam: 'TSV Oranienburg',
  score: null,
  isHome: true,
  isCompleted: false,
  ...overrides,
});

describe('getOpponentName', () => {
  it('returns away team when own team is home', () => {
    const match = makeMatch({ homeTeam: 'TTF Bötzow', awayTeam: 'TSV Oranienburg' });
    expect(getOpponentName(match, 'TTF Bötzow')).toBe('TSV Oranienburg');
  });

  it('returns home team when own team is away', () => {
    const match = makeMatch({ homeTeam: 'TSV Oranienburg', awayTeam: 'TTF Bötzow', isHome: false });
    expect(getOpponentName(match, 'TTF Bötzow')).toBe('TSV Oranienburg');
  });

  it('falls back to isHome flag when teamName not found in match', () => {
    const match = makeMatch({ homeTeam: 'Team A', awayTeam: 'Team B', isHome: true });
    // teamName not matching either team — fallback: isHome=true => opponent is awayTeam
    expect(getOpponentName(match, 'Unknown Team')).toBe('Team B');
  });

  it('falls back to isHome=false when teamName not found', () => {
    const match = makeMatch({ homeTeam: 'Team A', awayTeam: 'Team B', isHome: false });
    expect(getOpponentName(match, 'Unknown Team')).toBe('Team A');
  });

  it('handles partial team name match (team name contained in match team)', () => {
    const match = makeMatch({ homeTeam: 'TTF Bötzow Erwachsene I', awayTeam: 'TSV Oranienburg' });
    expect(getOpponentName(match, 'TTF Bötzow')).toBe('TSV Oranienburg');
  });
});

describe('getIsHome', () => {
  it('returns true when team is home team', () => {
    const match = makeMatch({ homeTeam: 'TTF Bötzow', awayTeam: 'TSV Oranienburg' });
    expect(getIsHome(match, 'TTF Bötzow')).toBe(true);
  });

  it('returns false when team is away team', () => {
    const match = makeMatch({ homeTeam: 'TSV Oranienburg', awayTeam: 'TTF Bötzow' });
    expect(getIsHome(match, 'TTF Bötzow')).toBe(false);
  });

  it('falls back to isHome flag when team name not found', () => {
    const match = makeMatch({ homeTeam: 'Team A', awayTeam: 'Team B', isHome: false });
    expect(getIsHome(match, 'Unknown')).toBe(false);
  });
});

describe('countYesResponses', () => {
  const makeEntry = (status: 'yes' | 'no' | 'maybe', userId = 'u1'): MatchAvailabilityEntry => ({
    userId,
    displayName: 'Player',
    status,
    canDrive: false,
  });

  it('returns 0 for empty list', () => {
    expect(countYesResponses([])).toBe(0);
  });

  it('counts only yes responses', () => {
    const entries: MatchAvailabilityEntry[] = [
      makeEntry('yes', 'u1'),
      makeEntry('no', 'u2'),
      makeEntry('maybe', 'u3'),
      makeEntry('yes', 'u4'),
    ];
    expect(countYesResponses(entries)).toBe(2);
  });

  it('returns 0 when no yes responses', () => {
    const entries: MatchAvailabilityEntry[] = [
      makeEntry('no', 'u1'),
      makeEntry('maybe', 'u2'),
    ];
    expect(countYesResponses(entries)).toBe(0);
  });

  it('counts all when all are yes', () => {
    const entries: MatchAvailabilityEntry[] = [
      makeEntry('yes', 'u1'),
      makeEntry('yes', 'u2'),
      makeEntry('yes', 'u3'),
      makeEntry('yes', 'u4'),
      makeEntry('yes', 'u5'),
    ];
    expect(countYesResponses(entries)).toBe(5);
  });
});

describe('getAvailabilityBadgeColor', () => {
  it('returns grey for 0', () => {
    expect(getAvailabilityBadgeColor(0)).toContain('gray');
  });

  it('returns yellow for 1-3', () => {
    expect(getAvailabilityBadgeColor(1)).toContain('yellow');
    expect(getAvailabilityBadgeColor(3)).toContain('yellow');
  });

  it('returns green for 4 or more', () => {
    expect(getAvailabilityBadgeColor(4)).toContain('green');
    expect(getAvailabilityBadgeColor(10)).toContain('green');
  });
});

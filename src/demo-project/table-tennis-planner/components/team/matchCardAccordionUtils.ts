/**
 * Pure helper functions for the MatchCardAccordion component.
 * Extracted here to be unit-testable without React overhead.
 */

import type { LeagueMatch, MatchAvailabilityEntry } from '@/lib/types';

/**
 * Returns the name of the opponent team.
 * Uses isHome flag if teamName is not provided or doesn't match.
 */
export function getOpponentName(match: LeagueMatch, teamName: string): string {
  const homeMatches =
    match.homeTeam === teamName || match.homeTeam.includes(teamName) || teamName.includes(match.homeTeam);
  if (homeMatches) return match.awayTeam;
  const awayMatches =
    match.awayTeam === teamName || match.awayTeam.includes(teamName) || teamName.includes(match.awayTeam);
  if (awayMatches) return match.homeTeam;
  // Fallback: use isHome flag
  return match.isHome ? match.awayTeam : match.homeTeam;
}

/**
 * Returns true if the given team is the home team.
 */
export function getIsHome(match: LeagueMatch, teamName: string): boolean {
  if (match.homeTeam === teamName || match.homeTeam.includes(teamName) || teamName.includes(match.homeTeam)) {
    return true;
  }
  if (match.awayTeam === teamName || match.awayTeam.includes(teamName) || teamName.includes(match.awayTeam)) {
    return false;
  }
  return match.isHome;
}

/**
 * Counts the number of "yes" responses in the availability list.
 */
export function countYesResponses(availabilities: MatchAvailabilityEntry[]): number {
  return availabilities.filter((a) => a.status === 'yes').length;
}

/**
 * Returns the badge color class based on the number of yes responses.
 * Green >= 4, yellow 1-3, grey 0.
 */
export function getAvailabilityBadgeColor(yesCount: number): string {
  if (yesCount === 0) return 'bg-gray-400/20 text-gray-600';
  if (yesCount < 4) return 'bg-yellow-400/20 text-yellow-700';
  return 'bg-green-400/20 text-green-700';
}

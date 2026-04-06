/**
 * Determines the click-TT team name for a team's league data.
 * Priority: 1) explicit request, 2) existing name if still in standings, 3) null
 */
import { LeagueData } from './types';

export function resolveClickTtTeamName(
  requestedName: string | null,
  existingLeagueData: LeagueData | null,
  teamLeagueNames: string[]
): string | null {
  if (requestedName && teamLeagueNames.includes(requestedName)) {
    return requestedName;
  }

  const existing = existingLeagueData?.clickTtTeamName;
  if (existing && teamLeagueNames.includes(existing)) {
    return existing;
  }

  return null;
}

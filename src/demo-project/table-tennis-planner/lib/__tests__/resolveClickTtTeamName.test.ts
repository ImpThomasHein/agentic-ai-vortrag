import { describe, it, expect } from 'vitest';
import { resolveClickTtTeamName } from '../resolveClickTtTeamName';
import { LeagueData } from '../types';

const teamLeagueNames = [
  'TTC Rotation Leegebruch',
  'TT-Freunde Bötzow',
  'SG Empor Oranienburg',
];

function makeLeagueData(clickTtTeamName: string | null): LeagueData {
  return { standings: [], matches: [], clickTtTeamName };
}

describe('resolveClickTtTeamName', () => {
  it('returns requested name if it exists in standings', () => {
    const result = resolveClickTtTeamName('TT-Freunde Bötzow', null, teamLeagueNames);
    expect(result).toBe('TT-Freunde Bötzow');
  });

  it('returns existing name if still in standings', () => {
    const existing = makeLeagueData('SG Empor Oranienburg');
    const result = resolveClickTtTeamName(null, existing, teamLeagueNames);
    expect(result).toBe('SG Empor Oranienburg');
  });

  it('returns null if no match found', () => {
    const result = resolveClickTtTeamName(null, null, teamLeagueNames);
    expect(result).toBeNull();
  });

  it('ignores requested name not in standings', () => {
    const result = resolveClickTtTeamName('Nicht Existierender Verein', null, teamLeagueNames);
    expect(result).toBeNull();
  });

  it('prefers requested name over existing name', () => {
    const existing = makeLeagueData('SG Empor Oranienburg');
    const result = resolveClickTtTeamName('TT-Freunde Bötzow', existing, teamLeagueNames);
    expect(result).toBe('TT-Freunde Bötzow');
  });

  it('returns null if existing name is no longer in standings', () => {
    const existing = makeLeagueData('Abgestiegener Verein');
    const result = resolveClickTtTeamName(null, existing, teamLeagueNames);
    expect(result).toBeNull();
  });
});

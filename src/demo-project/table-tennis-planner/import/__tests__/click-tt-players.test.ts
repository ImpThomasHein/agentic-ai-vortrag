import { describe, it, expect } from 'vitest';
import { parseClubPlayersHtml } from '../click-tt';

// Minimal HTML simulating the bilanzen page Remix context
function buildBilanzenHtml(teams: Array<{ team_name: string; players: Array<{ player_firstname: string; player_lastname: string }> }>) {
  const teamsData = teams.map((t) => ({
    team_name: t.team_name,
    team_balancesheet: [{
      single_player_statistics: t.players.map((p, i) => ({
        player_firstname: p.player_firstname,
        player_lastname: p.player_lastname,
        player_rank: String(i + 1),
        points_won: '10',
        points_lost: '5',
        meeting_count: '3',
      })),
    }],
  }));

  const remixContext = {
    state: {
      loaderData: {
        'routes/click-tt+/$association+/$season+/verein.$clubid.$clubname+/bilanzen.$filter': {
          data: { teams: teamsData },
        },
      },
    },
  };

  return `<html><head><script>window.__remixContext = ${JSON.stringify(remixContext)};</script></head><body></body></html>`;
}

describe('parseClubPlayersHtml', () => {
  it('extracts players with team names', () => {
    const html = buildBilanzenHtml([
      {
        team_name: 'Erwachsene I',
        players: [
          { player_firstname: 'Max', player_lastname: 'Mustermann' },
          { player_firstname: 'Lisa', player_lastname: 'Schmidt' },
        ],
      },
      {
        team_name: 'Erwachsene II',
        players: [
          { player_firstname: 'Tom', player_lastname: 'Müller' },
        ],
      },
    ]);

    const result = parseClubPlayersHtml(html);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ firstName: 'Max', lastName: 'Mustermann', teamName: 'Erwachsene I' });
    expect(result[1]).toEqual({ firstName: 'Lisa', lastName: 'Schmidt', teamName: 'Erwachsene I' });
    expect(result[2]).toEqual({ firstName: 'Tom', lastName: 'Müller', teamName: 'Erwachsene II' });
  });

  it('keeps separate entries for players in multiple teams', () => {
    const html = buildBilanzenHtml([
      {
        team_name: 'Erwachsene I',
        players: [{ player_firstname: 'Max', player_lastname: 'Mustermann' }],
      },
      {
        team_name: 'Erwachsene II',
        players: [{ player_firstname: 'Max', player_lastname: 'Mustermann' }],
      },
    ]);

    const result = parseClubPlayersHtml(html);

    // Player appears in both teams — separate entries needed for team assignment
    expect(result).toHaveLength(2);
    expect(result[0].teamName).toBe('Erwachsene I');
    expect(result[1].teamName).toBe('Erwachsene II');
  });

  it('throws on invalid HTML without remix context', () => {
    expect(() => parseClubPlayersHtml('<html><body></body></html>')).toThrow(
      'click-TT Daten konnten nicht extrahiert werden'
    );
  });

  it('returns empty array when no teams found', () => {
    const remixContext = {
      state: {
        loaderData: {
          'routes/click-tt+/$association+/$season+/verein.$clubid.$clubname+/bilanzen.$filter': {
            data: { teams: [] },
          },
        },
      },
    };
    const html = `<html><head><script>window.__remixContext = ${JSON.stringify(remixContext)};</script></head><body></body></html>`;

    const result = parseClubPlayersHtml(html);
    expect(result).toEqual([]);
  });
});

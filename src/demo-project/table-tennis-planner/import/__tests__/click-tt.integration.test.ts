import { describe, it, expect } from 'vitest';
import { scrapeClickTT } from '../click-tt';

const CLICK_TT_URL = 'https://www.mytischtennis.de/click-tt/TTVB/25--26/ligen/Kreisliga/gruppe/493601/tabelle/gesamt';

describe('click-TT Integration (live)', () => {
  it('scrapt Ligatabelle von mytischtennis.de', async () => {
    const data = await scrapeClickTT(CLICK_TT_URL);

    // Standings vorhanden
    expect(data.standings.length).toBeGreaterThan(0);

    // Erster Eintrag hat alle Felder
    const first = data.standings[0];
    expect(first.rank).toBe(1);
    expect(first.teamName).toBeTruthy();
    expect(first.matchesPlayed).toBeGreaterThan(0);
    expect(typeof first.wins).toBe('number');
    expect(typeof first.draws).toBe('number');
    expect(typeof first.losses).toBe('number');
    expect(first.games).toMatch(/^\d+:\d+$/);
    expect(typeof first.difference).toBe('number');
    expect(first.points).toMatch(/^\d+:\d+$/);

    // matchesPlayed = wins + draws + losses
    expect(first.matchesPlayed).toBe(first.wins + first.draws + first.losses);
  }, 15000);

  it('scrapt Spielplan mit kommenden und/oder vergangenen Spielen', async () => {
    const data = await scrapeClickTT(CLICK_TT_URL);

    // Mindestens ein Spiel vorhanden
    expect(data.matches.length).toBeGreaterThan(0);

    // Jedes Spiel hat die erwarteten Felder
    for (const match of data.matches) {
      expect(match.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(match.homeTeam).toBeTruthy();
      expect(match.awayTeam).toBeTruthy();
      expect(typeof match.isCompleted).toBe('boolean');

      if (match.isCompleted) {
        expect(match.score).toMatch(/^\d+:\d+$/);
      }
    }
  }, 15000);

  it('Spiele sind chronologisch sortiert', async () => {
    const data = await scrapeClickTT(CLICK_TT_URL);

    for (let i = 1; i < data.matches.length; i++) {
      expect(data.matches[i].date >= data.matches[i - 1].date).toBe(true);
    }
  }, 15000);

  it('wirft Fehler bei ungültiger URL', async () => {
    await expect(scrapeClickTT('https://www.mytischtennis.de/nicht-vorhanden'))
      .rejects.toThrow();
  }, 15000);
});

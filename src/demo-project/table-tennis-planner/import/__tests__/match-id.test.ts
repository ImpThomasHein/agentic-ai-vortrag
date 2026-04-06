// Tests that match IDs are generated correctly during click-TT data parsing.
import { describe, it, expect } from 'vitest';
import { generateMatchId } from '../click-tt';

describe('generateMatchId', () => {
  it('generates slug from date, home and away team', () => {
    expect(generateMatchId('2026-04-12', 'TSV Oranienburg', 'TTF Bötzow'))
      .toBe('2026-04-12-tsv-oranienburg-ttf-boetzow');
  });

  it('handles teams with special characters', () => {
    expect(generateMatchId('2026-03-15', 'SG Grün-Weiß', 'TTC Ärger'))
      .toBe('2026-03-15-sg-gruen-weiss-ttc-aerger');
  });
});

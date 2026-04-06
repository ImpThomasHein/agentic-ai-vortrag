// Unit tests for slugify utility used to generate stable match IDs.
import { describe, it, expect } from 'vitest';
import { slugify } from '../slugify';

describe('slugify', () => {
  it('converts to lowercase and replaces spaces with dashes', () => {
    expect(slugify('TSV Oranienburg')).toBe('tsv-oranienburg');
  });

  it('replaces German umlauts', () => {
    expect(slugify('TTF Bötzow')).toBe('ttf-boetzow');
    expect(slugify('Ärger über Größe')).toBe('aerger-ueber-groesse');
  });

  it('replaces ß with ss', () => {
    expect(slugify('Straße')).toBe('strasse');
  });

  it('removes special characters', () => {
    expect(slugify('Team (A) / B')).toBe('team-a-b');
  });

  it('collapses consecutive dashes', () => {
    expect(slugify('a  -  b')).toBe('a-b');
  });

  it('trims trailing and leading dashes', () => {
    expect(slugify('-hello-')).toBe('hello');
  });

  it('generates match ID from date and teams', () => {
    expect(slugify('2026-04-12_TSV Oranienburg_TTF Bötzow'))
      .toBe('2026-04-12-tsv-oranienburg-ttf-boetzow');
  });
});

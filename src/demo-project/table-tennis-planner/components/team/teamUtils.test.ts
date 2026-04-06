import { describe, it, expect } from 'vitest';
import { isScoreWin, formatMatchDate, formatSyncDate } from './teamUtils';

describe('isScoreWin', () => {
  it('Heimsieg erkennen', () => {
    expect(isScoreWin('9:1', true)).toBe(true);
  });

  it('Heimniederlage erkennen', () => {
    expect(isScoreWin('3:9', true)).toBe(false);
  });

  it('Auswärtssieg erkennen', () => {
    expect(isScoreWin('3:9', false)).toBe(true);
  });

  it('Auswärtsniederlage erkennen', () => {
    expect(isScoreWin('9:1', false)).toBe(false);
  });

  it('Unentschieden gibt null', () => {
    expect(isScoreWin('5:5', true)).toBe(null);
    expect(isScoreWin('5:5', false)).toBe(null);
  });

  it('Ungültiger Score gibt null', () => {
    expect(isScoreWin('abc', true)).toBe(null);
    expect(isScoreWin('', true)).toBe(null);
    expect(isScoreWin('9', true)).toBe(null);
  });

  it('Knapper Sieg', () => {
    expect(isScoreWin('5:4', true)).toBe(true);
    expect(isScoreWin('5:4', false)).toBe(false);
  });
});

describe('formatMatchDate', () => {
  it('formatiert Datum mit Wochentag', () => {
    const result = formatMatchDate('2026-03-15');
    // Sonntag, 15.03.26
    expect(result).toMatch(/So/);
    expect(result).toMatch(/15/);
    expect(result).toMatch(/03/);
  });

  it('formatiert verschiedene Wochentage korrekt', () => {
    // 2026-03-09 ist ein Montag
    const monday = formatMatchDate('2026-03-09');
    expect(monday).toMatch(/Mo/);
  });
});

describe('formatSyncDate', () => {
  it('gibt "Nie" für null', () => {
    expect(formatSyncDate(null)).toBe('Nie');
  });

  it('formatiert ISO-Datum', () => {
    const result = formatSyncDate('2026-03-08T14:30:00.000Z');
    expect(result).toMatch(/08/);
    expect(result).toMatch(/03/);
    expect(result).toMatch(/2026/);
  });
});

import { describe, it, expect } from 'vitest';
import { generatePassword, getAvailableGroups, isPlayerInGroup, isValidEmail } from './playerUtils';
import type { PlayerListItem, GroupSummary } from '@/lib/types';

const makePlayer = (groupIds: string[]): PlayerListItem => ({
  id: 'user-1',
  username: 'testuser',
  displayName: 'Test User',
  email: null,
  roles: ['player'],
  groups: groupIds.map((id) => ({ groupId: id, groupName: `Gruppe ${id}`, memberRole: 'player' })),
  teams: [],
});

const allGroups: GroupSummary[] = [
  { id: 'g1', name: 'Jugend', description: null },
  { id: 'g2', name: 'Herren 1', description: 'Erste Herrenmannschaft' },
  { id: 'g3', name: 'Damen', description: null },
];

describe('generatePassword', () => {
  it('generates a 10-character string', () => {
    expect(generatePassword()).toHaveLength(10);
  });

  it('generates different passwords on subsequent calls', () => {
    const passwords = new Set(Array.from({ length: 10 }, () => generatePassword()));
    expect(passwords.size).toBeGreaterThan(1);
  });

  it('contains only alphanumeric characters', () => {
    const password = generatePassword();
    expect(password).toMatch(/^[a-zA-Z0-9]+$/);
  });
});

describe('getAvailableGroups', () => {
  it('returns all groups when player has no memberships', () => {
    const player = makePlayer([]);
    expect(getAvailableGroups(player, allGroups)).toEqual(allGroups);
  });

  it('excludes groups the player already belongs to', () => {
    const player = makePlayer(['g1']);
    const available = getAvailableGroups(player, allGroups);
    expect(available).toHaveLength(2);
    expect(available.map((g) => g.id)).not.toContain('g1');
  });

  it('returns empty array when player is in all groups', () => {
    const player = makePlayer(['g1', 'g2', 'g3']);
    expect(getAvailableGroups(player, allGroups)).toEqual([]);
  });
});

describe('isPlayerInGroup', () => {
  it('returns true when player is a member', () => {
    const player = makePlayer(['g1', 'g2']);
    expect(isPlayerInGroup(player, 'g1')).toBe(true);
  });

  it('returns false when player is not a member', () => {
    const player = makePlayer(['g1']);
    expect(isPlayerInGroup(player, 'g3')).toBe(false);
  });

  it('returns false for empty groups list', () => {
    const player = makePlayer([]);
    expect(isPlayerInGroup(player, 'g1')).toBe(false);
  });
});

describe('isValidEmail', () => {
  it('accepts valid email addresses', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('max.mustermann@gmail.com')).toBe(true);
    expect(isValidEmail('test+tag@domain.co.uk')).toBe(true);
  });

  it('rejects invalid email addresses', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('notanemail')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('user @domain.com')).toBe(false);
    expect(isValidEmail('user@domain')).toBe(false);
  });
});

import type { PlayerListItem, GroupSummary } from '@/lib/types';

/**
 * Generiert ein zufälliges alphanumerisches Passwort mit 10 Zeichen.
 */
export function generatePassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Gibt alle Gruppen zurück, in denen der Spieler noch kein Mitglied ist.
 */
export function getAvailableGroups(player: PlayerListItem, allGroups: GroupSummary[]): GroupSummary[] {
  const memberGroupIds = new Set(player.groups.map((g) => g.groupId));
  return allGroups.filter((g) => !memberGroupIds.has(g.id));
}

/**
 * Prüft ob ein Spieler bereits Mitglied einer bestimmten Gruppe ist.
 */
export function isPlayerInGroup(player: PlayerListItem, groupId: string): boolean {
  return player.groups.some((g) => g.groupId === groupId);
}

/**
 * Prüft ob eine E-Mail-Adresse ein gültiges Format hat.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Prüft ob ein Ergebnis ein Sieg für das eigene Team ist.
 * @returns true = Sieg, false = Niederlage, null = Unentschieden oder ungültig
 */
export function isScoreWin(score: string, isHome: boolean): boolean | null {
  const parts = score.split(':');
  if (parts.length !== 2) return null;
  const home = parseInt(parts[0]);
  const away = parseInt(parts[1]);
  if (isNaN(home) || isNaN(away)) return null;
  if (home === away) return null;
  return isHome ? home > away : away > home;
}

/**
 * Formatiert ein ISO-Datum für die Anzeige.
 */
export function formatMatchDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: '2-digit' });
}

/**
 * Formatiert ein Sync-Datum für die Anzeige.
 */
export function formatSyncDate(dateStr: string | null): string {
  if (!dateStr) return 'Nie';
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

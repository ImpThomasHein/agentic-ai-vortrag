/**
 * PlayerImportDialog — Reusable dialog for importing players from click-TT bilanzen page.
 * Used in SpielerTab (player creation only) and MannschaftContent (player creation + team assignment).
 * Displays import results including generated credentials for newly created players.
 */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';

interface ImportResult {
  created: number;
  skipped: number;
  teamAssignments?: number;
  players: Array<{
    displayName: string;
    username: string;
    status: 'created' | 'skipped';
    password?: string;
    teamNames: string[];
  }>;
}

interface PlayerImportDialogProps {
  assignToTeams: boolean;
  isImporting: boolean;
  onImport: (url: string) => Promise<ImportResult>;
}

export function PlayerImportDialog({ assignToTeams, isImporting, onImport }: PlayerImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    setError(null);
    setResult(null);
    try {
      const data = await onImport(url);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import fehlgeschlagen');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setUrl('');
    setResult(null);
    setError(null);
  };

  if (!isOpen) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Spieler importieren
      </Button>
    );
  }

  return (
    <div className="glass rounded-2xl p-4 space-y-3">
      <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
        Spieler aus click-TT importieren
      </h3>
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        Füge die URL der Bilanzen-Seite deines Vereins von mytischtennis.de ein.
        {assignToTeams
          ? ' Spieler werden angelegt und den entsprechenden Mannschaften zugeordnet.'
          : ' Neue Spieler-Accounts werden automatisch erstellt.'}
      </p>

      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.mytischtennis.de/click-tt/.../bilanzen/gesamt"
        className="w-full px-3 py-2 rounded-xl text-sm border border-white/20 bg-white/5 backdrop-blur-sm"
        style={{ color: 'var(--text-primary)' }}
        disabled={isImporting}
      />

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {result && (
        <div className="text-xs space-y-2" style={{ color: 'var(--text-primary)' }}>
          <div className="flex gap-3">
            {result.created > 0 && (
              <span className="text-green-500 font-medium">
                {result.created} neu erstellt
              </span>
            )}
            {result.skipped > 0 && (
              <span style={{ color: 'var(--text-secondary)' }}>
                {result.skipped} bereits vorhanden
              </span>
            )}
            {assignToTeams && result.teamAssignments != null && result.teamAssignments > 0 && (
              <span className="text-blue-500 font-medium">
                {result.teamAssignments} Mannschafts-Zuordnungen
              </span>
            )}
          </div>

          {/* Show created players with passwords */}
          {result.players.filter((p) => p.status === 'created').length > 0 && (
            <div className="space-y-1">
              <p className="font-medium text-green-500">Neue Spieler:</p>
              <ul className="space-y-0.5 ml-2">
                {result.players
                  .filter((p) => p.status === 'created')
                  .map((p) => (
                    <li key={p.username} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {p.displayName}
                      <span className="font-mono text-[10px] px-1 py-0.5 rounded bg-white/10">
                        {p.username} / {p.password}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handleImport}
          disabled={!url.trim() || isImporting}
        >
          {isImporting ? (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Importiere...
            </span>
          ) : (
            'Importieren'
          )}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleClose} disabled={isImporting}>
          {result ? 'Schließen' : 'Abbrechen'}
        </Button>
      </div>
    </div>
  );
}

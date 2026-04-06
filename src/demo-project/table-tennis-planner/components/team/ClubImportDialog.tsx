'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';

interface ClubImportDialogProps {
  onImport: (clubUrl: string) => Promise<{ imported: number; teams: { id: string; name: string; synced: boolean }[] }>;
  isImporting: boolean;
}

export function ClubImportDialog({ onImport, isImporting }: ClubImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<{ imported: number; teams: { id: string; name: string; synced: boolean }[] } | null>(null);
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
        Verein importieren
      </Button>
    );
  }

  return (
    <div className="glass rounded-2xl p-4 space-y-3">
      <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
        Mannschaften aus Verein importieren
      </h3>
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        Füge die URL der Vereins-Mannschaften-Seite von mytischtennis.de ein.
        Alle Mannschaften werden automatisch angelegt und die Ligadaten synchronisiert.
      </p>

      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.mytischtennis.de/click-tt/.../mannschaften"
        className="w-full px-3 py-2 rounded-xl text-sm border border-white/20 bg-white/5 backdrop-blur-sm"
        style={{ color: 'var(--text-primary)' }}
        disabled={isImporting}
      />

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {result && (
        <div className="text-xs space-y-1" style={{ color: 'var(--text-primary)' }}>
          <p className="font-medium text-green-500">
            {result.imported} Mannschaft{result.imported !== 1 ? 'en' : ''} importiert
          </p>
          <ul className="space-y-0.5">
            {result.teams.map((t) => (
              <li key={t.id} className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${t.synced ? 'bg-green-500' : 'bg-yellow-500'}`} />
                {t.name}
                {!t.synced && <span className="text-yellow-500">(Sync ausstehend)</span>}
              </li>
            ))}
          </ul>
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

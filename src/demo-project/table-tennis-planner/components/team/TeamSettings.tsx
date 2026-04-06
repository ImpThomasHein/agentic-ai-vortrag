/** Team settings panel for trainers: click-TT URL, sync, team name selector, and delete. */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { formatSyncDate } from './teamUtils';
import { ClickTtOwnTeamSelector } from './ClickTtOwnTeamSelector';

interface TeamSettingsProps {
  teamName: string;
  clickTtUrl: string | null;
  lastSync: string | null;
  isSyncing: boolean;
  onUpdateTeam: (data: { name?: string; clickTtUrl?: string }) => Promise<void>;
  onSync: () => Promise<void>;
  onDelete: () => Promise<void>;
  pendingLeagueTeamNames?: string[] | null;
  onConfirmClickTtOwnTeamName?: (name: string) => void;
  clickTtTeamName?: string | null;
}

export function TeamSettings({
  teamName,
  clickTtUrl,
  lastSync,
  isSyncing,
  onUpdateTeam,
  onSync,
  onDelete,
  pendingLeagueTeamNames,
  onConfirmClickTtOwnTeamName,
  clickTtTeamName,
}: TeamSettingsProps) {
  const [url, setUrl] = useState(clickTtUrl ?? '');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveUrl = async () => {
    await onUpdateTeam({ clickTtUrl: url });
    setIsEditing(false);
  };

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
          Einstellungen
        </h3>
      </div>
      <div className="p-4 space-y-3">
        {/* click-TT URL */}
        <div>
          <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>
            click-TT URL
          </label>
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.mytischtennis.de/click-tt/..."
                className="flex-1 px-3 py-2 rounded-xl text-sm border border-white/20 bg-white/5 backdrop-blur-sm"
                style={{ color: 'var(--text-primary)' }}
              />
              <Button variant="primary" size="sm" onClick={handleSaveUrl}>
                OK
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                Abb.
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm truncate flex-1" style={{ color: clickTtUrl ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {clickTtUrl || 'Nicht hinterlegt'}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                Bearbeiten
              </Button>
            </div>
          )}
        </div>

        {/* Sync */}
        {clickTtUrl && (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Letzter Sync: {formatSyncDate(lastSync)}
              </span>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={onSync}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sync...
                </span>
              ) : (
                'Jetzt synchronisieren'
              )}
            </Button>
          </div>
        )}

        {/* Teamauswahl nach Sync */}
        {pendingLeagueTeamNames && onConfirmClickTtOwnTeamName && (
          <ClickTtOwnTeamSelector
            leagueTeamNames={pendingLeagueTeamNames}
            onSelect={onConfirmClickTtOwnTeamName}
          />
        )}

        {/* Aktueller click-TT Teamname */}
        {clickTtTeamName && !pendingLeagueTeamNames && (
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Liga-Name: {clickTtTeamName}
          </span>
        )}

        {/* Delete */}
        <div className="pt-2 border-t border-white/10">
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-600 flex-1">
                &quot;{teamName}&quot; wirklich löschen?
              </span>
              <Button variant="ghost" size="sm" onClick={() => { onDelete(); setShowDeleteConfirm(false); }}>
                <span className="text-red-600">Ja, löschen</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                Abbrechen
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-500"
            >
              Mannschaft löschen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

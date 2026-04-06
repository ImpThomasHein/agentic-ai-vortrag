/** Main content component for the Mannschaften tab: team selection, members, league table, and match list. */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTeam } from '@/hooks/useTeam';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui';
import { LeagueTable } from './LeagueTable';
import { MatchList } from './MatchList';
import { TeamMemberList } from './TeamMemberList';
import { TeamSettings } from './TeamSettings';
import { ClubImportDialog } from './ClubImportDialog';
import { PlayerImportDialog } from '@/components/players';
import { TeamChat } from '@/components/chat/TeamChat';

interface PlayerInfo {
  id: string;
  username: string;
  displayName: string;
}

interface MannschaftContentProps {
  mode: 'my' | 'all';
}

export function MannschaftContent({ mode }: MannschaftContentProps) {
  const { user } = useAuth();
  const {
    teams,
    selectedTeam,
    setSelectedTeamId,
    members,
    leagueData,
    createTeam,
    updateTeam,
    deleteTeam,
    addMember,
    removeMember,
    syncClickTT,
    importClubTeams,
    pendingLeagueTeamNames,
    confirmClickTtOwnTeamName,
    isLoading,
    isLoadingTeamData,
    isSyncing,
    isImporting,
    isCaptain,
    setMemberRole,
  } = useTeam({ mode });

  const isTrainer = user?.role === 'trainer';

  const handleSetRole = useCallback(async (userId: string, role: 'player' | 'captain') => {
    await setMemberRole(userId, role);
  }, [setMemberRole]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [allPlayers, setAllPlayers] = useState<PlayerInfo[]>([]);
  const [isImportingPlayers, setIsImportingPlayers] = useState(false);

  // Alle Spieler laden für Spieler-Dropdown (Trainer only)
  useEffect(() => {
    if (!isTrainer) return;
    fetch('/api/users')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setAllPlayers(
          data.map((u: { id: string; username: string; displayName: string }) => ({
            id: u.id,
            username: u.username,
            displayName: u.displayName,
          }))
        );
      })
      .catch(() => setAllPlayers([]));
  }, [isTrainer]);

  const handleCreate = useCallback(async () => {
    const name = newTeamName.trim();
    if (!name) return;
    setIsCreating(true);
    try {
      await createTeam(name);
      setNewTeamName('');
      setShowCreateForm(false);
    } finally {
      setIsCreating(false);
    }
  }, [newTeamName, createTeam]);

  const handleImportPlayers = async (url: string) => {
    setIsImportingPlayers(true);
    try {
      const response = await fetch('/api/users/import-players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, assignToTeams: true }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Import fehlgeschlagen');
      }
      const data = await response.json();
      // Reload players list for team member dropdown
      const playersRes = await fetch('/api/users');
      if (playersRes.ok) {
        const playersData = await playersRes.json();
        setAllPlayers(
          playersData.map((u: { id: string; username: string; displayName: string }) => ({
            id: u.id, username: u.username, displayName: u.displayName,
          }))
        );
      }
      return data;
    } finally {
      setIsImportingPlayers(false);
    }
  };

  // Verfügbare Spieler = alle Spieler minus aktuelle Team-Mitglieder
  const availablePlayers = allPlayers.filter(
    (p) => !members.some((m) => m.userId === p.id)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Empty State mit Create-Formular für Trainer
  if (teams.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 text-center">
        <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
          {mode === 'all' ? 'Keine Mannschaften vorhanden' : 'Keine Mannschaft zugeordnet'}
        </p>
        {isTrainer && (
          <div className="mt-4 space-y-3">
            {mode === 'all' && (
              <ClubImportDialog
                onImport={importClubTeams}
                isImporting={isImporting}
              />
            )}
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Name der Mannschaft"
              className="w-full px-3 py-2 rounded-xl text-sm border border-white/20 bg-white/5 backdrop-blur-sm"
              style={{ color: 'var(--text-primary)' }}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreate}
              disabled={!newTeamName.trim() || isCreating}
              className="w-full"
            >
              {isCreating ? 'Erstelle...' : 'Mannschaft erstellen'}
            </Button>
          </div>
        )}
      </div>
    );
  }

  const handleUpdateTeam = async (data: { name?: string; clickTtUrl?: string }) => {
    await updateTeam(data);
  };

  const handleDeleteTeam = async () => {
    await deleteTeam();
  };

  const handleJoin = async () => {
    if (user) await addMember(user.id);
  };

  const handleLeave = async () => {
    if (user) await removeMember(user.id);
  };

  return (
    <div className="space-y-4">
      {/* Team-Auswahl + Erstellen-Button */}
      <div className="flex gap-2">
        <select
          value={selectedTeam?.id ?? ''}
          onChange={(e) => setSelectedTeamId(e.target.value)}
          className="flex-1 text-sm rounded-xl px-3 py-2 border border-white/20 bg-white/10 backdrop-blur-sm"
          style={{ color: 'var(--text-primary)' }}
          aria-label="Mannschaft auswählen"
        >
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        {isTrainer && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="p-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Neue Mannschaft erstellen"
            style={{ color: 'var(--text-primary)' }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>

      {/* Inline Create Form */}
      {showCreateForm && isTrainer && (
        <div className="glass rounded-2xl p-4 space-y-2">
          <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            Neue Mannschaft
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Name der Mannschaft"
              className="flex-1 px-3 py-2 rounded-xl text-sm border border-white/20 bg-white/5 backdrop-blur-sm"
              style={{ color: 'var(--text-primary)' }}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
            <Button variant="primary" size="sm" onClick={handleCreate} disabled={!newTeamName.trim() || isCreating}>
              {isCreating ? '...' : 'Erstellen'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setShowCreateForm(false); setNewTeamName(''); }}>
              Abb.
            </Button>
          </div>
        </div>
      )}

      {/* Vereins-Import (nur Trainer, nur im All-Tab) */}
      {isTrainer && mode === 'all' && (
        <ClubImportDialog
          onImport={importClubTeams}
          isImporting={isImporting}
        />
      )}

      {/* Spieler-Import mit Mannschafts-Zuordnung (nur Trainer, nur im All-Tab) */}
      {isTrainer && mode === 'all' && (
        <PlayerImportDialog
          assignToTeams={true}
          isImporting={isImportingPlayers}
          onImport={handleImportPlayers}
        />
      )}

      {selectedTeam && isLoadingTeamData && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {selectedTeam && !isLoadingTeamData && (
        <>
          {/* Trainer: Einstellungen */}
          {isTrainer && (
            <TeamSettings
              teamName={selectedTeam.name}
              clickTtUrl={selectedTeam.clickTtUrl}
              lastSync={selectedTeam.lastSync}
              isSyncing={isSyncing}
              onUpdateTeam={handleUpdateTeam}
              onSync={syncClickTT}
              onDelete={handleDeleteTeam}
              pendingLeagueTeamNames={pendingLeagueTeamNames}
              onConfirmClickTtOwnTeamName={confirmClickTtOwnTeamName}
              clickTtTeamName={leagueData?.clickTtTeamName ?? null}
            />
          )}

          {/* Spielerliste */}
          <TeamMemberList
            members={members}
            currentUserId={user?.id}
            isTrainer={isTrainer}
            isCaptain={isCaptain}
            availablePlayers={isTrainer ? availablePlayers : undefined}
            onAdd={isTrainer ? addMember : undefined}
            onRemove={isTrainer ? removeMember : undefined}
            onJoin={!isTrainer ? handleJoin : undefined}
            onLeave={!isTrainer ? handleLeave : undefined}
            onSetRole={handleSetRole}
          />

          {/* Team-Chat */}
          <TeamChat
            teamId={selectedTeam.id}
            currentUserId={user?.id ?? ''}
            isTrainer={isTrainer}
          />

          {/* Ligatabelle */}
          {leagueData && leagueData.standings.length > 0 && (
            <LeagueTable
              standings={leagueData.standings}
              highlightTeam={leagueData.clickTtTeamName || selectedTeam.name}
            />
          )}

          {/* Spielplan */}
          {leagueData && leagueData.matches.length > 0 && (
            <MatchList
              matches={leagueData.matches}
              teamName={leagueData.clickTtTeamName || selectedTeam.name}
              teamId={selectedTeam.id}
              members={members}
              currentUserId={user?.id}
              isCaptain={isCaptain}
              isTrainer={isTrainer}
            />
          )}

          {/* Keine Ligadaten */}
          {!leagueData && (
            <div className="glass rounded-2xl p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
              <p className="text-sm">Keine Ligadaten vorhanden</p>
              {isTrainer && (
                <p className="text-xs mt-1">Hinterlege eine click-TT URL und synchronisiere die Daten</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

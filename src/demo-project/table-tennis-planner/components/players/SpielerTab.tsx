'use client';

// Main tab component for trainer player management.
// Provides create, import, edit, delete, password reset, and group assignment.

import { useState, useEffect, useCallback } from 'react';
import type { PlayerListItem, GroupSummary } from '@/lib/types';
import { Button } from '@/components/ui';
import { PlayerList, CreatePlayerModal, PasswordResetBanner, PlayerImportDialog } from '@/components/players';
import { EditPlayerModal } from '@/components/players/EditPlayerModal';
import { DeletePlayerDialog } from '@/components/players/DeletePlayerDialog';
import { generatePassword } from '@/components/players/playerUtils';

export function SpielerTab() {
  const [players, setPlayers] = useState<PlayerListItem[]>([]);
  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [passwordReset, setPasswordReset] = useState<{ playerName: string; newPassword: string } | null>(null);
  const [editPlayer, setEditPlayer] = useState<PlayerListItem | null>(null);
  const [deletePlayer, setDeletePlayer] = useState<{ id: string; name: string } | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const [playersRes, groupsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/groups'),
      ]);
      if (!playersRes.ok || !groupsRes.ok) {
        const details: string[] = [];
        if (!playersRes.ok) details.push(`Spieler: ${playersRes.status}`);
        if (!groupsRes.ok) details.push(`Gruppen: ${groupsRes.status}`);
        setFetchError(`Daten konnten nicht geladen werden (${details.join(', ')})`);
        return;
      }
      const [playersData, groupsData] = await Promise.all([
        playersRes.json(),
        groupsRes.json(),
      ]);
      setPlayers(playersData);
      setGroups(groupsData);
    } catch {
      setFetchError('Netzwerkfehler. Bitte Seite neu laden.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleResetPassword = async (playerId: string, playerDisplayName: string) => {
    const newPassword = generatePassword();
    try {
      const response = await fetch(`/api/users/${playerId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });
      if (response.ok) {
        setPasswordReset({ playerName: playerDisplayName, newPassword });
      }
    } catch {
      // Stille Fehlerbehandlung
    }
  };

  const handleAddToGroup = async (playerId: string, groupId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: playerId, role: 'player' }),
      });
      if (response.ok) {
        const group = groups.find((g) => g.id === groupId);
        if (group) {
          setPlayers((prev) =>
            prev.map((p) =>
              p.id === playerId
                ? { ...p, groups: [...p.groups, { groupId, groupName: group.name, memberRole: 'player' }] }
                : p
            )
          );
        }
      }
    } catch {
      // Stille Fehlerbehandlung
    }
  };

  const handleRemoveFromGroup = async (playerId: string, groupId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/members/${playerId}`, { method: 'DELETE' });
      if (response.ok) {
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === playerId
              ? { ...p, groups: p.groups.filter((g) => g.groupId !== groupId) }
              : p
          )
        );
      }
    } catch {
      // Stille Fehlerbehandlung
    }
  };

  const handleEditPlayer = (player: PlayerListItem) => {
    setEditPlayer(player);
  };

  const handleSavePlayer = async (playerId: string, data: { displayName: string; username: string; email: string | null }): Promise<{ error?: string }> => {
    try {
      const response = await fetch(`/api/users/${playerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.error || 'Fehler beim Speichern' };
      }
      const updated = await response.json();
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === playerId
            ? { ...p, displayName: updated.displayName, username: updated.username, email: updated.email }
            : p
        )
      );
      setEditPlayer(null);
      return {};
    } catch {
      return { error: 'Netzwerkfehler' };
    }
  };

  const handleDeletePlayer = (playerId: string, playerDisplayName: string) => {
    setDeletePlayer({ id: playerId, name: playerDisplayName });
  };

  const handleConfirmDelete = async () => {
    if (!deletePlayer) return;
    const response = await fetch(`/api/users/${deletePlayer.id}`, { method: 'DELETE' });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Fehler beim Löschen');
    }
    setPlayers((prev) => prev.filter((p) => p.id !== deletePlayer.id));
    setDeletePlayer(null);
  };

  const handleImportPlayers = async (url: string) => {
    setIsImporting(true);
    try {
      const response = await fetch('/api/users/import-players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, assignToTeams: false }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Import fehlgeschlagen');
      }
      const data = await response.json();
      await loadData();
      return data;
    } finally {
      setIsImporting(false);
    }
  };

  const handleCreateSuccess = (newPlayer: PlayerListItem) => {
    setPlayers((prev) => [...prev, newPlayer].sort((a, b) => a.displayName.localeCompare(b.displayName)));
    setShowCreateModal(false);
  };

  return (
    <>
      {passwordReset && (
        <div className="mb-4">
          <PasswordResetBanner
            playerName={passwordReset.playerName}
            newPassword={passwordReset.newPassword}
            onDismiss={() => setPasswordReset(null)}
          />
        </div>
      )}

      <Button
        variant="glass-accent"
        onClick={() => setShowCreateModal(true)}
        className="w-full mb-4"
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        Neuen Spieler anlegen
      </Button>

      <div className="mb-4">
        <PlayerImportDialog
          assignToTeams={false}
          isImporting={isImporting}
          onImport={handleImportPlayers}
        />
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && fetchError && (
        <div className="glass rounded-2xl p-4 bg-red-500/5 border border-red-300/30">
          <p className="text-sm text-red-700 font-medium">{fetchError}</p>
          <Button variant="ghost" size="sm" onClick={loadData} className="mt-2">
            Erneut versuchen
          </Button>
        </div>
      )}

      {!isLoading && !fetchError && (
        <PlayerList
          players={players.filter((p) => p.roles.includes('player'))}
          groups={groups}
          onResetPassword={handleResetPassword}
          onAddToGroup={handleAddToGroup}
          onRemoveFromGroup={handleRemoveFromGroup}
          onEditPlayer={handleEditPlayer}
          onDeletePlayer={handleDeletePlayer}
        />
      )}

      <CreatePlayerModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      <EditPlayerModal
        isOpen={editPlayer !== null}
        player={editPlayer}
        onClose={() => setEditPlayer(null)}
        onSave={handleSavePlayer}
      />

      <DeletePlayerDialog
        isOpen={deletePlayer !== null}
        playerName={deletePlayer?.name ?? ''}
        onClose={() => setDeletePlayer(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

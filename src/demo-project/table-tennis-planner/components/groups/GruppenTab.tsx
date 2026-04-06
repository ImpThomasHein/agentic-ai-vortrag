/**
 * Main tab component for training group management.
 * Loads all groups with their members, provides CRUD operations via modals,
 * and allows adding/removing players from groups.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui';
import { GroupCard } from './GroupCard';
import { CreateGroupModal } from './CreateGroupModal';
import { EditGroupModal } from './EditGroupModal';
import type { PlayerListItem, GroupMemberItem } from '@/lib/types';

interface GroupWithMembers {
  id: string;
  name: string;
  description: string | null;
  members: GroupMemberItem[];
}

export function GruppenTab() {
  const [groups, setGroups] = useState<GroupWithMembers[]>([]);
  const [allPlayers, setAllPlayers] = useState<PlayerListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editGroup, setEditGroup] = useState<GroupWithMembers | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const [groupsRes, playersRes] = await Promise.all([
        fetch('/api/groups'),
        fetch('/api/users'),
      ]);
      if (!groupsRes.ok || !playersRes.ok) {
        setFetchError('Daten konnten nicht geladen werden.');
        return;
      }
      const [groupsData, playersData]: [Array<{ id: string; name: string; description: string | null }>, PlayerListItem[]] =
        await Promise.all([groupsRes.json(), playersRes.json()]);

      // Load members for each group
      const groupsWithMembers = await Promise.all(
        groupsData.map(async (g) => {
          const membersRes = await fetch(`/api/groups/${g.id}/members`);
          const members = membersRes.ok ? await membersRes.json() : [];
          return { ...g, members };
        })
      );

      setGroups(groupsWithMembers);
      setAllPlayers(playersData);
    } catch {
      setFetchError('Netzwerkfehler. Bitte Seite neu laden.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateSuccess = async (group: { id: string; name: string; description: string | null }) => {
    setGroups((prev) => [...prev, { ...group, members: [] }]);
    setShowCreateModal(false);
    // Reload to get accurate member data (creator is auto-added as trainer)
    await loadData();
  };

  const handleEditSuccess = (updated: { id: string; name: string; description: string | null }) => {
    setGroups((prev) => prev.map((g) => (g.id === updated.id ? { ...g, ...updated } : g)));
    setEditGroup(null);
  };

  const handleDelete = async (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;
    const confirmed = window.confirm(`Gruppe "${group.name}" wirklich löschen? Alle Trainingsdaten dieser Gruppe gehen verloren.`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/groups/${groupId}`, { method: 'DELETE' });
      if (res.ok) {
        setGroups((prev) => prev.filter((g) => g.id !== groupId));
      }
    } catch {
      // Silent error handling
    }
  };

  const handleAddMember = async (groupId: string, userId: string) => {
    try {
      const res = await fetch(`/api/groups/${groupId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: 'player' }),
      });
      if (res.ok) {
        const member = await res.json();
        const player = allPlayers.find((p) => p.id === userId);
        setGroups((prev) =>
          prev.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  members: [
                    ...g.members,
                    {
                      ...member,
                      user: { id: userId, username: player?.username ?? '', displayName: player?.displayName ?? '' },
                    },
                  ],
                }
              : g
          )
        );
      }
    } catch {
      // Silent error handling
    }
  };

  const handleRemoveMember = async (groupId: string, userId: string) => {
    try {
      const res = await fetch(`/api/groups/${groupId}/members/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setGroups((prev) =>
          prev.map((g) =>
            g.id === groupId
              ? { ...g, members: g.members.filter((m) => m.user.id !== userId) }
              : g
          )
        );
      }
    } catch {
      // Silent error handling
    }
  };

  return (
    <>
      {/* Create group button */}
      <Button
        variant="glass-accent"
        onClick={() => setShowCreateModal(true)}
        className="w-full mb-4"
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Neue Gruppe erstellen
      </Button>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {!isLoading && fetchError && (
        <div className="glass rounded-2xl p-4 bg-red-500/5 border border-red-300/30">
          <p className="text-sm text-red-700 font-medium">{fetchError}</p>
          <Button variant="ghost" size="sm" onClick={loadData} className="mt-2">
            Erneut versuchen
          </Button>
        </div>
      )}

      {/* Group list */}
      {!isLoading && !fetchError && (
        <div className="space-y-4">
          {groups.length === 0 ? (
            <div className="glass rounded-2xl p-6 text-center">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Noch keine Gruppen vorhanden. Erstelle eine neue Gruppe!
              </p>
            </div>
          ) : (
            groups.map((g) => (
              <GroupCard
                key={g.id}
                group={g}
                members={g.members}
                allPlayers={allPlayers}
                onEdit={() => setEditGroup(g)}
                onDelete={() => handleDelete(g.id)}
                onAddMember={(userId) => handleAddMember(g.id, userId)}
                onRemoveMember={(userId) => handleRemoveMember(g.id, userId)}
              />
            ))
          )}
        </div>
      )}

      {/* Modals */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
      <EditGroupModal
        isOpen={editGroup !== null}
        group={editGroup}
        onClose={() => setEditGroup(null)}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}

/**
 * Displays a single training group as a card with member list, edit and delete actions.
 * Shows member count, allows adding players via dropdown, and removing members inline.
 */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { GroupMemberList } from './GroupMemberList';
import type { PlayerListItem, GroupMemberItem } from '@/lib/types';

interface GroupCardProps {
  group: { id: string; name: string; description: string | null };
  members: GroupMemberItem[];
  allPlayers: PlayerListItem[];
  onEdit: () => void;
  onDelete: () => void;
  onAddMember: (userId: string) => void;
  onRemoveMember: (userId: string) => void;
}

export function GroupCard({ group, members, allPlayers, onEdit, onDelete, onAddMember, onRemoveMember }: GroupCardProps) {
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const memberUserIds = new Set(members.map((m) => m.user.id));
  const availablePlayers = allPlayers.filter(
    (p) => !memberUserIds.has(p.id) && p.roles.includes('player')
  );

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
            {group.name}
          </h3>
          {group.description && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {group.description}
            </p>
          )}
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            {members.length} Mitglied{members.length !== 1 ? 'er' : ''}
          </p>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={onEdit} aria-label="Gruppe bearbeiten">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500 hover:text-red-700" aria-label="Gruppe löschen">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Member list */}
      <div className="border-t border-white/10 pt-3">
        <GroupMemberList members={members} onRemoveMember={onRemoveMember} />
      </div>

      {/* Add player */}
      <div className="mt-3 border-t border-white/10 pt-3">
        {showAddPlayer ? (
          <div className="space-y-2">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  onAddMember(e.target.value);
                  e.target.value = '';
                }
              }}
              className="w-full px-3 py-2 rounded-xl border border-white/20 bg-white/10 text-sm"
              style={{ color: 'var(--text-primary)' }}
              defaultValue=""
            >
              <option value="" disabled>Spieler auswählen...</option>
              {availablePlayers.map((p) => (
                <option key={p.id} value={p.id}>{p.displayName}</option>
              ))}
            </select>
            <Button variant="ghost" size="sm" onClick={() => setShowAddPlayer(false)}>
              Fertig
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddPlayer(true)}
            className="w-full"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Spieler hinzufügen
          </Button>
        )}
      </div>
    </div>
  );
}

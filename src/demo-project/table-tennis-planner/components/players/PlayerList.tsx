'use client';

// Renders a list of PlayerCard components or an empty-state message.
// Passes edit, delete, group, and password-reset callbacks to each card.

import type { PlayerListItem, GroupSummary } from '@/lib/types';
import { PlayerCard } from './PlayerCard';

interface PlayerListProps {
  players: PlayerListItem[];
  groups: GroupSummary[];
  onResetPassword: (playerId: string, playerDisplayName: string) => void;
  onAddToGroup: (playerId: string, groupId: string) => void;
  onRemoveFromGroup: (playerId: string, groupId: string) => void;
  onEditPlayer: (player: PlayerListItem) => void;
  onDeletePlayer: (playerId: string, playerDisplayName: string) => void;
}

export function PlayerList({ players, groups, onResetPassword, onAddToGroup, onRemoveFromGroup, onEditPlayer, onDeletePlayer }: PlayerListProps) {
  if (players.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Noch keine Spieler angelegt
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          groups={groups}
          onResetPassword={onResetPassword}
          onAddToGroup={onAddToGroup}
          onRemoveFromGroup={onRemoveFromGroup}
          onEditPlayer={onEditPlayer}
          onDeletePlayer={onDeletePlayer}
        />
      ))}
    </div>
  );
}

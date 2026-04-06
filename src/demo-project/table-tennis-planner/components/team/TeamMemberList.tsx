'use client';

import { useState } from 'react';
import type { TeamMember } from '@/lib/types';

interface TeamMemberListProps {
  members: TeamMember[];
  currentUserId?: string;
  isTrainer: boolean;
  isCaptain?: boolean;
  availablePlayers?: { id: string; username: string; displayName: string }[];
  onAdd?: (userId: string) => void;
  onRemove?: (userId: string) => void;
  onJoin?: () => void;
  onLeave?: () => void;
  onSetRole?: (userId: string, role: 'player' | 'captain') => void;
}

export function TeamMemberList({
  members,
  currentUserId,
  isTrainer,
  isCaptain: _isCaptain,
  availablePlayers,
  onAdd,
  onRemove,
  onJoin,
  onLeave,
  onSetRole,
}: TeamMemberListProps) {
  const isMember = members.some((m) => m.userId === currentUserId);
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  const handleAdd = (userId: string) => {
    onAdd?.(userId);
  };

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
          Spieler
          <span className="ml-2 text-xs font-normal" style={{ color: 'var(--text-secondary)' }}>
            ({members.length})
          </span>
        </h3>
        <div className="flex items-center gap-2">
          {isTrainer && onAdd && availablePlayers && availablePlayers.length > 0 && (
            <button
              onClick={() => setShowAddDropdown(!showAddDropdown)}
              className="p-1.5 rounded-lg hover:bg-blue-500/15 transition-colors text-blue-600"
              aria-label="Spieler hinzufügen"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
          {!isTrainer && !isMember && onJoin && (
            <button
              onClick={onJoin}
              className="text-xs font-medium px-3 py-1.5 rounded-xl bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 transition-colors"
            >
              Beitreten
            </button>
          )}
          {!isTrainer && isMember && onLeave && (
            <button
              onClick={onLeave}
              className="text-xs font-medium px-3 py-1.5 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
            >
              Verlassen
            </button>
          )}
        </div>
      </div>

      {/* Add Player Dropdown */}
      {showAddDropdown && availablePlayers && availablePlayers.length > 0 && (
        <div className="px-4 py-2 border-b border-white/10 bg-blue-500/5 flex gap-2">
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) handleAdd(e.target.value);
            }}
            className="flex-1 text-sm rounded-xl px-3 py-2 border border-white/20 bg-white/10 backdrop-blur-sm"
            style={{ color: 'var(--text-primary)' }}
            aria-label="Spieler auswählen"
          >
            <option value="" disabled>Spieler auswählen...</option>
            {availablePlayers.map((p) => (
              <option key={p.id} value={p.id}>{p.displayName} (@{p.username})</option>
            ))}
          </select>
          <button
            onClick={() => setShowAddDropdown(false)}
            className="p-2 rounded-xl text-sm hover:bg-white/10 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            Fertig
          </button>
        </div>
      )}

      <div className="divide-y divide-white/5">
        {members.map((member) => (
          <div key={member.id} className="px-4 py-2.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center text-sm font-semibold text-blue-700 border border-blue-300/30">
              {member.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                  {member.displayName}
                </div>
                {member.role === 'captain' && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-semibold bg-amber-500/15 text-amber-700 border border-amber-400/30 backdrop-blur-sm">
                    ML
                  </span>
                )}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                @{member.username}
              </div>
            </div>
            {isTrainer && onSetRole && (
              <button
                onClick={() => onSetRole(member.userId, member.role === 'captain' ? 'player' : 'captain')}
                className={`p-1.5 rounded-lg transition-colors text-xs font-medium ${
                  member.role === 'captain'
                    ? 'bg-amber-500/15 text-amber-700 hover:bg-amber-500/25'
                    : 'text-amber-600/60 hover:bg-amber-500/10 hover:text-amber-700'
                }`}
                aria-label={member.role === 'captain' ? `${member.displayName} als Mannschaftsleiter entfernen` : `${member.displayName} zum Mannschaftsleiter ernennen`}
                title={member.role === 'captain' ? 'Mannschaftsleiter entfernen' : 'Zum Mannschaftsleiter ernennen'}
              >
                ML
              </button>
            )}
            {isTrainer && onRemove && (
              <button
                onClick={() => onRemove(member.userId)}
                className="p-1.5 rounded-lg hover:bg-red-500/15 transition-colors text-red-500"
                aria-label={`${member.displayName} entfernen`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
        {members.length === 0 && (
          <div className="px-4 py-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            Noch keine Spieler zugeordnet
          </div>
        )}
      </div>
    </div>
  );
}

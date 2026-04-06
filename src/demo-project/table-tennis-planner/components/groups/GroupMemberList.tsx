/**
 * Displays the list of members in a group with option to remove each member.
 * Used inside GroupCard to show who belongs to a training group.
 */
'use client';

import { Button } from '@/components/ui';
import type { GroupMemberItem } from '@/lib/types';

interface GroupMemberListProps {
  members: GroupMemberItem[];
  onRemoveMember: (userId: string) => void;
}

export function GroupMemberList({ members, onRemoveMember }: GroupMemberListProps) {
  if (members.length === 0) {
    return (
      <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
        Keine Mitglieder in dieser Gruppe.
      </p>
    );
  }

  const trainers = members.filter((m) => m.role === 'trainer');
  const players = members.filter((m) => m.role === 'player');

  return (
    <div className="space-y-1">
      {trainers.map((m) => (
        <div key={m.user.id} className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {m.user.displayName}
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-700">Trainer</span>
          </div>
        </div>
      ))}
      {players.map((m) => (
        <div key={m.user.id} className="flex items-center justify-between py-1">
          <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
            {m.user.displayName}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveMember(m.user.id)}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            Entfernen
          </Button>
        </div>
      ))}
    </div>
  );
}

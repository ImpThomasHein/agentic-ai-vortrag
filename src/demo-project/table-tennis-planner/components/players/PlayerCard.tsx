'use client';

// Displays a single player row with avatar, name, groups/teams, and an action menu.
// Actions include editing the player, resetting passwords, group management, and deletion.

import type { PlayerListItem, GroupSummary } from '@/lib/types';
import Badge from '@/components/ui/Badge';
import { DropdownMenu, MenuTriggerButton, type DropdownMenuItem } from '@/components/ui/DropdownMenu';
import { getAvailableGroups } from './playerUtils';

interface PlayerCardProps {
  player: PlayerListItem;
  groups: GroupSummary[];
  onResetPassword: (playerId: string, playerDisplayName: string) => void;
  onAddToGroup: (playerId: string, groupId: string) => void;
  onRemoveFromGroup: (playerId: string, groupId: string) => void;
  onEditPlayer: (player: PlayerListItem) => void;
  onDeletePlayer: (playerId: string, playerDisplayName: string) => void;
}

export function PlayerCard({ player, groups, onResetPassword, onAddToGroup, onRemoveFromGroup, onEditPlayer, onDeletePlayer }: PlayerCardProps) {
  const availableGroups = getAvailableGroups(player, groups);
  const initial = player.displayName.charAt(0).toUpperCase();

  const menuItems: DropdownMenuItem[] = [
    {
      label: 'Spieler bearbeiten',
      onClick: () => onEditPlayer(player),
    },
    {
      label: 'Passwort zurücksetzen',
      onClick: () => onResetPassword(player.id, player.displayName),
    },
  ];

  if (availableGroups.length > 0) {
    menuItems.push({ type: 'separator' });
    availableGroups.forEach((group) => {
      menuItems.push({
        label: `Zur Gruppe "${group.name}" hinzufügen`,
        onClick: () => onAddToGroup(player.id, group.id),
      });
    });
  }

  if (player.groups.length > 0) {
    menuItems.push({ type: 'separator' });
    player.groups.forEach((membership) => {
      menuItems.push({
        label: `Aus Gruppe "${membership.groupName}" entfernen`,
        variant: 'danger',
        onClick: () => onRemoveFromGroup(player.id, membership.groupId),
      });
    });
  }

  menuItems.push({ type: 'separator' });
  menuItems.push({
    label: 'Spieler löschen',
    variant: 'danger',
    onClick: () => onDeletePlayer(player.id, player.displayName),
  });

  return (
    <div className="glass rounded-2xl p-4 flex items-center gap-3">
      {/* Avatar */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center">
        <span className="text-sm font-bold text-green-700">{initial}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
          {player.displayName}
        </p>
        <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
          @{player.username}
        </p>
        {player.email && (
          <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
            {player.email}
          </p>
        )}
        {(player.groups.length > 0 || (player.teams && player.teams.length > 0)) && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {player.groups.map((membership) => (
              <Badge key={membership.groupId} variant="info" size="sm">
                {membership.groupName}
              </Badge>
            ))}
            {player.teams?.map((tm) => (
              <Badge key={tm.teamId} variant="warning" size="sm">
                {tm.teamName}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <DropdownMenu trigger={<MenuTriggerButton />} items={menuItems} align="right" />
    </div>
  );
}

/**
 * Group selector displayed as chip buttons below the tab bar.
 * Allows switching between training groups. Used on both trainer and player pages.
 */
'use client';

import { Group } from '@/lib/types';

interface GruppenChipsProps {
  groups: Group[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string) => void;
  accentColor?: 'blue' | 'green';
}

export function GruppenChips({ groups, selectedGroupId, onSelectGroup, accentColor = 'blue' }: GruppenChipsProps) {
  if (groups.length <= 1) return null;

  const activeClass = accentColor === 'blue'
    ? 'bg-[#2563eb] text-white'
    : 'bg-[#16a34a] text-white';

  return (
    <div className="px-4 py-3 bg-white/30">
      <div className="flex gap-2 items-center">
        <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Gruppe:
        </span>
        <div className="flex gap-1.5">
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => onSelectGroup(g.id)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                selectedGroupId === g.id
                  ? activeClass
                  : 'glass text-black/70 hover:bg-white/50'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

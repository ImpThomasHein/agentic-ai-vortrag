/** Dropdown for trainer to select which team in the league belongs to them. */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';

interface ClickTtOwnTeamSelectorProps {
  leagueTeamNames: string[];
  onSelect: (name: string) => void;
}

export function ClickTtOwnTeamSelector({ leagueTeamNames, onSelect }: ClickTtOwnTeamSelectorProps) {
  const [selected, setSelected] = useState('');

  return (
    <div className="glass rounded-2xl p-4 space-y-3">
      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
        Welche Mannschaft in dieser Liga ist deine?
      </p>
      <select
        value={selected}
        onChange={e => setSelected(e.target.value)}
        className="w-full px-3 py-2 rounded-xl text-sm border border-white/20 bg-white/5"
        style={{ color: 'var(--text-primary)' }}
      >
        <option value="">Bitte wählen...</option>
        {leagueTeamNames.map(name => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>
      <Button
        variant="primary"
        size="sm"
        onClick={() => onSelect(selected)}
        disabled={!selected}
      >
        Übernehmen
      </Button>
    </div>
  );
}

'use client';

import type { LeagueStanding } from '@/lib/types';

interface LeagueTableProps {
  standings: LeagueStanding[];
  highlightTeam?: string;
}

export function LeagueTable({ standings, highlightTeam }: LeagueTableProps) {
  if (standings.length === 0) {
    return (
      <div className="glass rounded-2xl p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
        Keine Tabellendaten vorhanden
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
          Tabelle
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10" style={{ color: 'var(--text-secondary)' }}>
              <th className="text-left py-2 px-3 font-medium w-8">#</th>
              <th className="text-left py-2 px-2 font-medium">Mannschaft</th>
              <th className="text-center py-2 px-1 font-medium w-8">Beg.</th>
              <th className="text-center py-2 px-1 font-medium w-6">S</th>
              <th className="text-center py-2 px-1 font-medium w-6">U</th>
              <th className="text-center py-2 px-1 font-medium w-6">N</th>
              <th className="text-center py-2 px-1 font-medium w-14">Spiele</th>
              <th className="text-center py-2 px-1 font-medium w-10">+/-</th>
              <th className="text-center py-2 px-2 font-medium w-12">Pkt.</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row) => {
              const isHighlighted = highlightTeam && row.teamName === highlightTeam;
              return (
                <tr
                  key={row.rank}
                  className={`border-b border-white/5 transition-colors ${
                    isHighlighted ? 'bg-blue-500/10 font-semibold' : ''
                  }`}
                  style={{ color: isHighlighted ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                >
                  <td className="py-2 px-3">{row.rank}</td>
                  <td className="py-2 px-2 truncate max-w-[160px]">{row.teamName}</td>
                  <td className="text-center py-2 px-1">{row.matchesPlayed}</td>
                  <td className="text-center py-2 px-1">{row.wins}</td>
                  <td className="text-center py-2 px-1">{row.draws}</td>
                  <td className="text-center py-2 px-1">{row.losses}</td>
                  <td className="text-center py-2 px-1">{row.games}</td>
                  <td className="text-center py-2 px-1">
                    {row.difference > 0 ? `+${row.difference}` : row.difference}
                  </td>
                  <td className="text-center py-2 px-2 font-semibold">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

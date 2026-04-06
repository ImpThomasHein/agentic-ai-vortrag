'use client';

import type { LeagueMatch } from '@/lib/types';
import { isScoreWin, formatMatchDate } from './teamUtils';

interface MatchCardProps {
  match: LeagueMatch;
  teamName?: string;
}

export function MatchCard({ match, teamName }: MatchCardProps) {
  const isOwnHome = teamName ? match.homeTeam.includes(teamName) || teamName.includes(match.homeTeam) : match.isHome;
  const isWin = match.isCompleted && match.score ? isScoreWin(match.score, isOwnHome) : null;

  return (
    <div className={`glass-dark rounded-xl p-3 border ${
      match.isCompleted
        ? isWin ? 'border-green-300/30 bg-green-500/5' : isWin === false ? 'border-red-300/30 bg-red-500/5' : 'border-white/10'
        : 'border-blue-300/20 bg-blue-500/5'
    }`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {formatMatchDate(match.date)}{match.time ? `, ${match.time}` : ''}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
              isOwnHome
                ? 'bg-blue-500/15 text-blue-700'
                : 'bg-orange-500/15 text-orange-700'
            }`}>
              {isOwnHome ? 'Heim' : 'Ausw.'}
            </span>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
            <span className={isOwnHome ? 'font-semibold' : ''}>{match.homeTeam}</span>
            <span className="mx-1" style={{ color: 'var(--text-secondary)' }}>vs</span>
            <span className={!isOwnHome ? 'font-semibold' : ''}>{match.awayTeam}</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          {match.isCompleted && match.score ? (
            <span className={`text-lg font-bold ${
              isWin ? 'text-green-600' : isWin === false ? 'text-red-600' : ''
            }`} style={isWin === null ? { color: 'var(--text-primary)' } : undefined}>
              {match.score}
            </span>
          ) : (
            <span className="text-xs font-medium px-2 py-1 rounded-lg bg-blue-500/10 text-blue-600">
              Ausstehend
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


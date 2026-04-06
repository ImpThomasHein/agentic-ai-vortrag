'use client';

/**
 * Displays a list of league matches separated into upcoming and completed sections.
 * For upcoming matches with a teamId, renders accordion-style MatchCardAccordion components
 * that allow availability and lineup management. Otherwise uses MatchCard.
 * Completed matches always use MatchCard.
 */

import type { LeagueMatch, TeamMember } from '@/lib/types';
import { MatchCard } from './MatchCard';
import { MatchCardAccordion } from './MatchCardAccordion';

interface MatchListProps {
  matches: LeagueMatch[];
  teamName?: string;
  teamId?: string;
  members?: TeamMember[];
  currentUserId?: string;
  isCaptain?: boolean;
  isTrainer?: boolean;
}

export function MatchList({
  matches,
  teamName,
  teamId,
  members,
  currentUserId,
  isCaptain,
  isTrainer,
}: MatchListProps) {
  const teamMatches = teamName
    ? matches.filter((m) => m.homeTeam === teamName || m.awayTeam === teamName)
    : matches;
  const upcoming = teamMatches.filter((m) => !m.isCompleted);
  const past = teamMatches.filter((m) => m.isCompleted).reverse(); // neueste zuerst

  if (teamMatches.length === 0) {
    return (
      <div className="glass rounded-2xl p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
        Keine Spiele vorhanden
      </div>
    );
  }

  const useAccordion = !!teamId;

  return (
    <div className="space-y-4">
      {upcoming.length > 0 && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Kommende Spiele
              <span className="ml-2 text-xs font-normal" style={{ color: 'var(--text-secondary)' }}>
                ({upcoming.length})
              </span>
            </h3>
          </div>
          <div className="p-3 space-y-2">
            {upcoming.map((match, i) =>
              useAccordion && members && currentUserId ? (
                <MatchCardAccordion
                  key={`upcoming-${i}`}
                  match={match}
                  teamId={teamId}
                  teamName={teamName || ''}
                  members={members}
                  currentUserId={currentUserId}
                  isCaptain={isCaptain || false}
                  isTrainer={isTrainer || false}
                />
              ) : (
                <MatchCard key={`upcoming-${i}`} match={match} teamName={teamName} />
              )
            )}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Ergebnisse
              <span className="ml-2 text-xs font-normal" style={{ color: 'var(--text-secondary)' }}>
                ({past.length})
              </span>
            </h3>
          </div>
          <div className="p-3 space-y-2">
            {past.map((match, i) => (
              <MatchCard key={`past-${i}`} match={match} teamName={teamName} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

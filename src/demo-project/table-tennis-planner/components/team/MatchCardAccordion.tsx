'use client';

/**
 * Accordion-style match card component that shows match info in collapsed state
 * and expands to reveal availability management and lineup editing.
 * Players can set their availability and driving offer; captains/trainers can
 * additionally manage the lineup and designate the driver.
 */

import { useState, useCallback } from 'react';
import type { LeagueMatch, TeamMember } from '@/lib/types';
import { useMatchAvailability } from '@/hooks/useMatchAvailability';
import { formatMatchDate } from './teamUtils';
import {
  getOpponentName,
  getIsHome,
  countYesResponses,
  getAvailabilityBadgeColor,
} from './matchCardAccordionUtils';

// ─── Props ────────────────────────────────────────────────────────────────────

interface MatchCardAccordionProps {
  match: LeagueMatch;
  teamId: string;
  teamName: string;
  members: TeamMember[];
  currentUserId: string;
  isCaptain: boolean;
  isTrainer: boolean;
}

// ─── Availability status helpers ──────────────────────────────────────────────

const STATUS_CONFIG = {
  yes: {
    label: 'Ja',
    icon: '✓',
    activeBg: 'bg-green-500/20 border-green-400/50 text-green-700',
    rowBg: 'bg-green-500/10',
    rowText: 'text-green-700',
    display: '✓ Ja',
  },
  no: {
    label: 'Nein',
    icon: '✗',
    activeBg: 'bg-red-500/20 border-red-400/50 text-red-700',
    rowBg: 'bg-red-500/10',
    rowText: 'text-red-600',
    display: '✗ Nein',
  },
  maybe: {
    label: 'Unsicher',
    icon: '?',
    activeBg: 'bg-yellow-400/20 border-yellow-400/50 text-yellow-700',
    rowBg: 'bg-yellow-400/10',
    rowText: 'text-yellow-700',
    display: '? Unsicher',
  },
} as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function AvailabilityButton({
  status,
  active,
  onClick,
}: {
  status: 'yes' | 'no' | 'maybe';
  active: boolean;
  onClick: () => void;
}) {
  const cfg = STATUS_CONFIG[status];
  return (
    <button
      onClick={onClick}
      className={`min-h-[44px] flex-1 py-2 px-1 rounded-xl text-sm font-semibold border transition-all ${
        active ? cfg.activeBg : 'border-white/20 bg-white/5'
      }`}
      style={active ? undefined : { color: 'var(--text-secondary)' }}
      aria-pressed={active}
    >
      <span className="mr-1">{cfg.icon}</span>
      {cfg.label}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function MatchCardAccordion({
  match,
  teamId,
  teamName,
  members,
  currentUserId,
  isCaptain,
  isTrainer,
}: MatchCardAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Derive matchId from match data — use matchId if available, else build a stable key
  const matchId = match.matchId ?? `${match.date}_${match.homeTeam}_${match.awayTeam}`;

  const { availabilities, lineup, myStatus, myCanDrive, setAvailability, setLineup, isLoading } =
    useMatchAvailability({ teamId, matchId });

  // Lineup editor state (captain/trainer only)
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>(() =>
    lineup.map((l) => l.userId)
  );
  const [driverUserId, setDriverUserId] = useState<string | null>(() =>
    lineup.find((l) => l.isDriver)?.userId ?? null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [canDrive, setCanDrive] = useState(myCanDrive);

  const isAuthorized = isCaptain || isTrainer;
  const opponentName = getOpponentName(match, teamName);
  const isHome = getIsHome(match, teamName);
  const yesCount = countYesResponses(availabilities);
  const badgeColor = getAvailabilityBadgeColor(yesCount);

  // Keep local lineup state in sync when lineup data loads
  const syncLineupState = useCallback(() => {
    setSelectedPlayers(lineup.map((l) => l.userId));
    setDriverUserId(lineup.find((l) => l.isDriver)?.userId ?? null);
  }, [lineup]);

  const handleToggle = () => {
    if (!isOpen) {
      syncLineupState();
      setCanDrive(myCanDrive);
    }
    setIsOpen((prev) => !prev);
  };

  const handleAvailability = async (status: 'yes' | 'no' | 'maybe') => {
    // Toggle: clicking same status clears it by keeping it as-is (API decides)
    await setAvailability(status, canDrive);
  };

  const handleCanDriveChange = async (checked: boolean) => {
    setCanDrive(checked);
    if (myStatus) {
      await setAvailability(myStatus, checked);
    }
  };

  const handlePlayerToggle = (userId: string) => {
    setSelectedPlayers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleDriverToggle = (userId: string) => {
    setDriverUserId((prev) => (prev === userId ? null : userId));
  };

  const handleSaveLineup = async () => {
    setIsSaving(true);
    try {
      await setLineup(selectedPlayers, driverUserId);
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Collapsed Header ───────────────────────────────────────────────────────

  const header = (
    <button
      onClick={handleToggle}
      aria-expanded={isOpen}
      className="w-full flex items-center gap-2 px-3 py-3 hover:bg-white/5 transition-all text-left min-h-[52px]"
    >
      {/* Date + home/away badge */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {formatMatchDate(match.date)}
            {match.time ? `, ${match.time}` : ''}
          </span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
              isHome ? 'bg-blue-500/15 text-blue-700' : 'bg-orange-500/15 text-orange-700'
            }`}
          >
            {isHome ? 'Heim' : 'Ausw.'}
          </span>
        </div>
        <span className="text-sm font-semibold truncate block" style={{ color: 'var(--text-primary)' }}>
          {opponentName}
        </span>
      </div>

      {/* Availability summary badge */}
      <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${badgeColor}`}>
        {yesCount} ✓
      </span>

      {/* Chevron */}
      <svg
        className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        style={{ color: 'var(--text-secondary)' }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  // ─── Expanded Body ──────────────────────────────────────────────────────────

  const expandedBody = isOpen && (
    <div className="border-t border-white/10 px-3 pb-4 pt-3 space-y-4">
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* 1. Own availability buttons */}
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Meine Verfügbarkeit
            </p>
            <div className="grid grid-cols-3 gap-2">
              <AvailabilityButton
                status="yes"
                active={myStatus === 'yes'}
                onClick={() => handleAvailability('yes')}
              />
              <AvailabilityButton
                status="no"
                active={myStatus === 'no'}
                onClick={() => handleAvailability('no')}
              />
              <AvailabilityButton
                status="maybe"
                active={myStatus === 'maybe'}
                onClick={() => handleAvailability('maybe')}
              />
            </div>
          </div>

          {/* 2. Driving checkbox */}
          <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={canDrive}
              onChange={(e) => handleCanDriveChange(e.target.checked)}
              className="w-4 h-4 rounded accent-blue-600"
            />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
              🚗 Ich kann fahren
            </span>
          </label>

          {/* 3. Player view: all reports OR Captain/Trainer: lineup editor */}
          {isAuthorized ? (
            <CaptainLineupEditor
              members={members}
              availabilities={availabilities}
              selectedPlayers={selectedPlayers}
              driverUserId={driverUserId}
              onPlayerToggle={handlePlayerToggle}
              onDriverToggle={handleDriverToggle}
              onSave={handleSaveLineup}
              isSaving={isSaving}
            />
          ) : (
            <PlayerReportList members={members} availabilities={availabilities} lineup={lineup} />
          )}
        </>
      )}
    </div>
  );

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="glass-dark rounded-xl border border-blue-300/20 bg-blue-500/5 overflow-hidden">
      {header}
      {expandedBody}
    </div>
  );
}

// ─── PlayerReportList ─────────────────────────────────────────────────────────

import type { MatchAvailabilityEntry, MatchLineupEntry } from '@/lib/types';

function PlayerReportList({
  members,
  availabilities,
  lineup,
}: {
  members: TeamMember[];
  availabilities: MatchAvailabilityEntry[];
  lineup: MatchLineupEntry[];
}) {
  const lineupSet = new Set(lineup.map((l) => l.userId));
  const driverEntry = lineup.find((l) => l.isDriver);

  return (
    <div className="space-y-2">
      {/* Availability list */}
      <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
        Rückmeldungen
      </p>
      <div className="space-y-1">
        {members.map((member) => {
          const entry = availabilities.find((a) => a.userId === member.userId);
          const status = entry?.status ?? null;
          const cfg = status ? STATUS_CONFIG[status] : null;

          return (
            <div
              key={member.userId}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg min-h-[44px] ${cfg ? cfg.rowBg : 'bg-white/5'}`}
            >
              <span className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>
                {member.displayName}
              </span>
              {entry?.canDrive && <span className="text-sm">🚗</span>}
              <span className={`text-xs font-semibold ${cfg ? cfg.rowText : ''}`} style={!cfg ? { color: 'var(--text-secondary)' } : undefined}>
                {cfg ? cfg.display : '— Offen'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Lineup (if set) */}
      {lineup.length > 0 && (
        <div className="border-t border-white/10 pt-3 mt-3">
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            Aufstellung
          </p>
          <ol className="space-y-1">
            {lineup.map((entry, idx) => (
              <li
                key={entry.userId}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${lineupSet.has(entry.userId) ? 'bg-white/5' : ''}`}
                style={{ color: 'var(--text-primary)' }}
              >
                <span className="text-xs w-4 text-right flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
                  {idx + 1}.
                </span>
                <span className="flex-1">{entry.displayName}</span>
                {entry.isDriver && <span className="text-sm">🚗</span>}
                {driverEntry?.userId === entry.userId && !entry.isDriver && null}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// ─── CaptainLineupEditor ──────────────────────────────────────────────────────

function CaptainLineupEditor({
  members,
  availabilities,
  selectedPlayers,
  driverUserId,
  onPlayerToggle,
  onDriverToggle,
  onSave,
  isSaving,
}: {
  members: TeamMember[];
  availabilities: MatchAvailabilityEntry[];
  selectedPlayers: string[];
  driverUserId: string | null;
  onPlayerToggle: (userId: string) => void;
  onDriverToggle: (userId: string) => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
        Aufstellungs-Editor
      </p>
      <div className="space-y-1">
        {members.map((member) => {
          const avail = availabilities.find((a) => a.userId === member.userId);
          const status = avail?.status ?? null;
          const cfg = status ? STATUS_CONFIG[status] : null;
          const isSelected = selectedPlayers.includes(member.userId);
          const isDriver = driverUserId === member.userId;

          return (
            <div
              key={member.userId}
              className="flex items-center gap-2 px-2 py-2 rounded-lg min-h-[44px] bg-white/5"
            >
              {/* Lineup checkbox */}
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onPlayerToggle(member.userId)}
                className="w-4 h-4 rounded accent-blue-600 flex-shrink-0"
                aria-label={`${member.displayName} in Aufstellung`}
              />

              {/* Name */}
              <span className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>
                {member.displayName}
              </span>

              {/* Availability status icon */}
              {cfg ? (
                <span className={`text-xs font-semibold ${cfg.rowText}`}>{cfg.icon}</span>
              ) : (
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>—</span>
              )}

              {/* Drive offer icon */}
              {avail?.canDrive && <span className="text-sm">🚗</span>}

              {/* Driver designation button */}
              <button
                onClick={() => onDriverToggle(member.userId)}
                className={`text-xs px-2 py-1 rounded-lg border transition-all min-h-[32px] ${
                  isDriver
                    ? 'bg-blue-500/20 border-blue-400/50 text-blue-700 font-semibold'
                    : 'border-white/20 bg-white/5'
                }`}
                style={isDriver ? undefined : { color: 'var(--text-secondary)' }}
                aria-pressed={isDriver}
              >
                Fahrer
              </button>
            </div>
          );
        })}
      </div>

      {/* Save button */}
      <button
        onClick={onSave}
        disabled={isSaving}
        className="w-full min-h-[44px] mt-2 rounded-xl text-sm font-semibold bg-blue-600/80 hover:bg-blue-600 text-white border border-blue-400/30 transition-all disabled:opacity-50"
      >
        {isSaving ? 'Speichere…' : 'Aufstellung speichern'}
      </button>
    </div>
  );
}

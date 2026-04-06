'use client';

import { useState } from 'react';
import { useGroup } from '@/contexts/GroupContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAttendance } from '@/hooks/useAttendance';
import { AttendanceStatus, AttendanceEntry, TrainingSessionSummary } from '@/lib/types';
import { formatTrainingDateForDisplay } from '@/lib/training-schedule';
import { WEEKDAY_LABELS } from '@/lib/constants';
import { Weekday } from '@/lib/types';

// ─── StatusButton ─────────────────────────────────────────────────────────────

function StatusButton({
  status,
  active,
  onClick,
}: {
  status: AttendanceStatus;
  active: boolean;
  onClick: () => void;
}) {
  const config = {
    yes: { label: 'Ja', icon: '✓', activeClass: 'bg-green-500/20 border-green-400/50 text-green-700' },
    no: { label: 'Nein', icon: '✗', activeClass: 'bg-red-500/20 border-red-400/50 text-red-700' },
  }[status];

  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold border transition-all ${
        active ? config.activeClass : 'glass-button border-transparent'
      }`}
      style={active ? undefined : { color: 'var(--text-secondary)' }}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </button>
  );
}

// ─── EntryRow ─────────────────────────────────────────────────────────────────

function EntryRow({ entry }: { entry: AttendanceEntry }) {
  const avatarColors = {
    trainer: 'bg-blue-500/20 text-blue-700 border-blue-300/40',
    player: 'bg-green-500/20 text-green-700 border-green-300/40',
  };
  const statusConfig = {
    yes: { icon: '✓', color: 'text-green-600', label: 'Ja' },
    no: { icon: '✗', color: 'text-red-600', label: 'Nein' },
  }[entry.status];

  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center border text-xs font-semibold flex-shrink-0 ${avatarColors[entry.role]}`}>
        {entry.displayName[0]}
      </div>
      <span className="text-sm font-medium flex-1" style={{ color: 'var(--text-primary)' }}>
        {entry.displayName}
      </span>
      <span className={`text-sm font-semibold ${statusConfig.color}`}>
        {statusConfig.icon} {statusConfig.label}
      </span>
    </div>
  );
}

// ─── SessionAttendanceItem ────────────────────────────────────────────────────

function SessionAttendanceItem({
  session,
  isOpen,
  onToggle,
}: {
  session: TrainingSessionSummary;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { myStatus, setStatus, entries } = useAttendance(session.id);
  const { user } = useAuth();

  const sessionDate = new Date(session.sessionDate);
  const dateLabel = formatTrainingDateForDisplay(sessionDate, WEEKDAY_LABELS);
  const shortLabel = (() => {
    const d = sessionDate;
    const wd = WEEKDAY_LABELS[d.getDay() as Weekday];
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${wd.slice(0, 2)} ${day}.${month}`;
  })();

  const yesCount = entries.filter((e) => e.status === 'yes').length;
  const noCount = entries.filter((e) => e.status === 'no').length;
  const myEntry = user ? entries.find((e) => e.username === user.username) : null;

  return (
    <div className="border-b border-white/10 last:border-b-0">
      {/* Header Row */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all text-left"
      >
        <svg
          className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          style={{ color: 'var(--text-secondary)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-sm font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>
          {shortLabel}
        </span>
        <div className="flex items-center gap-2 text-xs font-medium">
          {myEntry ? (
            <span className={myEntry.status === 'yes' ? 'text-green-600' : 'text-red-600'}>
              {myEntry.status === 'yes' ? '✓ Ja' : '✗ Nein'}
            </span>
          ) : (
            <span style={{ color: 'var(--text-secondary)' }}>?</span>
          )}
          {entries.length > 0 && (
            <span className="glass-dark px-2 py-0.5 rounded-full" style={{ color: 'var(--text-secondary)' }}>
              {yesCount}✓ {noCount}✗
            </span>
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isOpen && (
        <div className="px-4 pb-4">
          <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
            {dateLabel}
          </p>
          {/* Status Buttons */}
          <div className="flex gap-2 mb-3">
            <StatusButton status="yes" active={myStatus === 'yes'} onClick={() => setStatus('yes')} />
            <StatusButton status="no" active={myStatus === 'no'} onClick={() => setStatus('no')} />
          </div>
          {/* Attendee List */}
          {entries.length > 0 ? (
            <div className="border-t border-white/20 pt-3 space-y-0.5">
              {entries
                .sort((a, b) => a.updatedAt - b.updatedAt)
                .map((entry) => (
                  <EntryRow key={entry.username} entry={entry} />
                ))}
            </div>
          ) : (
            <p className="text-center text-xs py-2 border-t border-white/20 pt-3" style={{ color: 'var(--text-secondary)' }}>
              Noch keine Anmeldungen
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── AttendanceCard ───────────────────────────────────────────────────────────

export function AttendanceCard() {
  const { upcomingSessions } = useGroup();
  const sessions = upcomingSessions.slice(0, 4);
  // null = not yet initialized (auto-open first); '__closed__' = user explicitly closed all
  const [openSessionId, setOpenSessionId] = useState<string | null>(null);

  if (sessions.length === 0) return null;

  // Auto-open the first session on initial render; respect '__closed__' as explicit user intent
  const effectiveOpen =
    openSessionId === null
      ? (sessions[0]?.id ?? null)
      : openSessionId === '__closed__'
      ? null
      : openSessionId;

  return (
    <div className="glass-dark rounded-2xl border border-white/20 overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <svg className="w-4 h-4 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Anwesenheit
        </h3>
      </div>

      {/* Accordion Items */}
      {sessions.map((session) => (
        <SessionAttendanceItem
          key={session.id}
          session={session}
          isOpen={effectiveOpen === session.id}
          onToggle={() =>
            setOpenSessionId((prev) => {
              const currentOpen =
                prev === null
                  ? (sessions[0]?.id ?? null)
                  : prev === '__closed__'
                  ? null
                  : prev;
              return currentOpen === session.id ? '__closed__' : session.id;
            })
          }
        />
      ))}
    </div>
  );
}

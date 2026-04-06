/**
 * Card showing a single training session in the 2-week overview.
 * Displays date, exercise count, attendance summary.
 * Used by both trainer and player pages in the "Nächste Trainings" tab.
 */
'use client';

interface AttendanceSummary {
  yes: number;
  no: number;
  open: number;
}

interface TrainingsKarteProps {
  sessionId: string;
  date: Date;
  exerciseCount: number;
  attendance?: AttendanceSummary;
  isNext: boolean;
  accentColor?: 'blue' | 'green';
  onClick: (sessionId: string) => void;
}

function formatDate(date: Date): string {
  const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const months = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'];
  return `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]}`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function daysUntil(date: Date): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'heute';
  if (diff === 1) return 'morgen';
  return `in ${diff} Tagen`;
}

export function TrainingsKarte({
  sessionId,
  date,
  exerciseCount,
  attendance,
  isNext,
  accentColor = 'blue',
  onClick,
}: TrainingsKarteProps) {
  const borderClass = isNext
    ? accentColor === 'blue' ? 'border-l-[3px] border-l-[#2563eb]' : 'border-l-[3px] border-l-[#16a34a]'
    : '';
  const labelColor = accentColor === 'blue' ? 'text-[#2563eb]' : 'text-[#16a34a]';

  return (
    <button
      onClick={() => onClick(sessionId)}
      className={`w-full text-left glass rounded-xl p-3.5 transition-all hover:translate-y-[-1px] hover:shadow-lg ${borderClass}`}
    >
      <div className="flex justify-between items-start mb-2.5">
        <div>
          {isNext && (
            <div className={`text-[11px] uppercase tracking-wider font-semibold mb-1 ${labelColor}`}>
              Nächstes Training
            </div>
          )}
          <div className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            {formatDate(date)} · {formatTime(date)}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {daysUntil(date)}
          </div>
        </div>
        <div className="text-lg" style={{ color: isNext ? undefined : 'var(--text-secondary)' }}>
          <span className={isNext ? labelColor : ''}>→</span>
        </div>
      </div>
      <div className="flex gap-2 text-xs flex-wrap">
        {exerciseCount > 0 ? (
          <span className="bg-blue-500/8 text-blue-700 px-2 py-0.5 rounded border border-blue-200/30">
            📋 {exerciseCount} Übung{exerciseCount !== 1 ? 'en' : ''}
          </span>
        ) : (
          <span className="bg-black/4 px-2 py-0.5 rounded" style={{ color: 'var(--text-secondary)' }}>
            Noch keine Übungen geplant
          </span>
        )}
        {attendance && attendance.yes > 0 && (
          <span className="bg-green-500/8 text-green-700 px-2 py-0.5 rounded border border-green-500/20">
            ✓ {attendance.yes} zugesagt
          </span>
        )}
        {attendance && attendance.no > 0 && (
          <span className="bg-red-500/8 text-red-600 px-2 py-0.5 rounded border border-red-500/15">
            ✗ {attendance.no} abgesagt
          </span>
        )}
        {attendance && attendance.open > 0 && (
          <span className="bg-black/4 px-2 py-0.5 rounded" style={{ color: 'var(--text-secondary)' }}>
            ? {attendance.open} offen
          </span>
        )}
      </div>
    </button>
  );
}

/** Displays a date separator line between chat messages of different days */
'use client';

interface DateSeparatorProps {
  date: string; // ISO date string
}

/** Formats a date as "Heute", "Gestern", or "03. April" */
function formatDateLabel(isoDate: string): string {
  const date = new Date(isoDate);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Heute';
  if (date.toDateString() === yesterday.toDateString()) return 'Gestern';

  return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long' });
}

export function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 h-px bg-white/20" />
      <span className="text-xs text-gray-400 font-medium">{formatDateLabel(date)}</span>
      <div className="flex-1 h-px bg-white/20" />
    </div>
  );
}

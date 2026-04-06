'use client';

import { Exercise, TrainingDayAssignment } from '@/lib/types';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/constants';
import { Badge } from '../ui';

interface TrainingDayExerciseItemProps {
  exercise: Exercise;
  assignment: TrainingDayAssignment;
  voteCount?: number;
  onRemove: () => void;
  onCopyToNext: () => void;
  onMove: () => void;
}

export function TrainingDayExerciseItem({
  exercise,
  assignment,
  voteCount,
  onRemove,
  onCopyToNext,
  onMove,
}: TrainingDayExerciseItemProps) {
  const categoryColor = CATEGORY_COLORS[exercise.category] || { bg: 'bg-gray-100', text: 'text-gray-700' };

  return (
    <div className="glass-dark rounded-xl p-3 flex items-center gap-3">
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
            {exercise.name}
          </h4>
          {voteCount !== undefined && voteCount > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-pink-600 font-semibold">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
              {voteCount}
            </span>
          )}
        </div>
        <Badge className={`${categoryColor.bg} ${categoryColor.text}`} size="sm">
          {CATEGORY_LABELS[exercise.category]}
        </Badge>
      </div>

      {/* Aktionen */}
      <div className="flex items-center gap-1">
        {/* Zu anderem Tag kopieren */}
        <button
          onClick={onCopyToNext}
          className="p-2 rounded-lg hover:bg-white/20 active:bg-white/30 transition-colors"
          title="Zu anderem Tag kopieren"
        >
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>

        {/* Verschieben */}
        <button
          onClick={onMove}
          className="p-2 rounded-lg hover:bg-white/20 active:bg-white/30 transition-colors"
          title="Zu anderem Tag verschieben"
        >
          <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        {/* Entfernen */}
        <button
          onClick={onRemove}
          className="p-2 rounded-lg hover:bg-red-500/20 active:bg-red-500/30 transition-colors"
          title="Aus Training entfernen"
        >
          <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

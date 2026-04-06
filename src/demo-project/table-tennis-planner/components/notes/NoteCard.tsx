'use client';

/**
 * Displays a single trainer note as a compact card.
 * Simpler than ExerciseCard — no diagram, no category/difficulty badges.
 */
import { Exercise } from '@/lib/types';
import { Card } from '@/components/ui';
import { ReactNode } from 'react';

interface NoteCardProps {
  note: Exercise;
  menuButton?: ReactNode;
}

export default function NoteCard({ note, menuButton }: NoteCardProps) {
  return (
    <Card variant="glass" className="transition-shadow duration-300 hover:shadow-lg">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="font-semibold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
            {note.name}
          </h3>
        </div>
        {menuButton && <div className="flex-shrink-0">{menuButton}</div>}
      </div>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {note.description}
      </p>
    </Card>
  );
}

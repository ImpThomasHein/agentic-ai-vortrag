/**
 * Merged "Trainingsgruppen" tab combining group management and player assignment.
 * Wraps the existing GruppenTab which already handles group CRUD and member management.
 * Trainer only — shows groups with their members, allows CRUD and assignment.
 */
'use client';

import { GruppenTab } from './GruppenTab';

export function TrainingsGruppenTab() {
  return (
    <div className="px-4">
      <GruppenTab />
    </div>
  );
}

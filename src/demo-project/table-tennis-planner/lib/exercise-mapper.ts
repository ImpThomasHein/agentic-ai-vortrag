/**
 * Maps a Prisma Exercise DB record to the frontend Exercise type.
 * DB uses flat fields (ttrMin, ttrMax, durationMinutes),
 * frontend expects nested ttrRange and duration.
 */
import { Exercise } from '@/lib/types';

export function mapDbExerciseToFrontend(dbExercise: any): Exercise {
  const { ttrMin, ttrMax, durationMinutes, ...rest } = dbExercise;
  return {
    ...rest,
    type: rest.type ?? 'exercise',
    ttrRange: { min: ttrMin, max: ttrMax },
    duration: durationMinutes ?? undefined,
  };
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Weekday } from '@/lib/types';
import { useGroup } from '@/contexts/GroupContext';
import { getNextTrainingDate } from '@/lib/training-schedule';

interface UseTrainingScheduleReturn {
  weekdays: Weekday[];
  nextTrainingDate: Date | null;
  isLoading: boolean;
  updateSchedule: (weekdays: Weekday[]) => Promise<void>;
  hasSchedule: boolean;
}

export function useTrainingSchedule(): UseTrainingScheduleReturn {
  const { groupId, refreshSessions } = useGroup();
  const [weekdays, setWeekdays] = useState<Weekday[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!groupId) {
      setWeekdays([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    (async () => {
      try {
        const res = await fetch(`/api/groups/${groupId}/schedule`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setWeekdays((data.weekdays ?? []) as Weekday[]);
        // Generate missing sessions for the next 4 weeks on initial load
        await fetch(`/api/groups/${groupId}/sessions/generate`, { method: 'POST' });
        await refreshSessions();
      } catch {
        setWeekdays([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [groupId]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateSchedule = useCallback(
    async (newWeekdays: Weekday[]) => {
      if (!groupId) return;

      const res = await fetch(`/api/groups/${groupId}/schedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekdays: newWeekdays }),
      });

      if (res.ok) {
        const data = await res.json();
        setWeekdays((data.weekdays ?? []) as Weekday[]);
        // Generate sessions for the updated schedule
        await fetch(`/api/groups/${groupId}/sessions/generate`, { method: 'POST' });
        await refreshSessions();
      }
    },
    [groupId, refreshSessions]
  );

  const nextTrainingDate = weekdays.length > 0 ? getNextTrainingDate(weekdays) : null;

  return {
    weekdays,
    nextTrainingDate,
    isLoading,
    updateSchedule,
    hasSchedule: weekdays.length > 0,
  };
}

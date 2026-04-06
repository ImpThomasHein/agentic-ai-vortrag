'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrainingDayAssignment, ComputedTrainingDay, Weekday } from '@/lib/types';
import { useGroup } from '@/contexts/GroupContext';
import { WEEKDAY_LABELS } from '@/lib/constants';
import { formatTrainingDateForDisplay, isSameDay, toLocalDateString } from '@/lib/training-schedule';
import { computeNewSortOrders } from '@/components/training/reorderExercises';

interface DbAssignment {
  id: string;
  sessionId: string;
  exerciseId: string;
  sortOrder: number;
}

interface UseTrainingPlanReturn {
  assignments: TrainingDayAssignment[];
  upcomingDays: ComputedTrainingDay[];
  isLoading: boolean;
  assignExercise: (exerciseId: string, dateString: string) => Promise<void>;
  toggleExercise: (exerciseId: string, dateString: string) => Promise<void>;
  removeAssignment: (assignmentId: string) => Promise<void>;
  moveAssignment: (assignmentId: string, newDateString: string) => Promise<void>;
  copyAssignment: (assignmentId: string, targetDateString: string) => Promise<void>;
  reorderAssignment: (exerciseId: string, dateString: string, direction: 'up' | 'down') => Promise<void>;
  copyToNextWeekday: (assignmentId: string) => Promise<void>;
  getAssignmentsForDate: (dateString: string) => TrainingDayAssignment[];
  isExerciseAssigned: (exerciseId: string, dateString: string) => boolean;
  refreshData: () => Promise<void>;
}

export function useTrainingPlan(): UseTrainingPlanReturn {
  const { upcomingSessions } = useGroup();
  const [sessionAssignmentsMap, setSessionAssignmentsMap] = useState<Record<string, DbAssignment[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Stable key to detect when sessions actually change
  const sessionIdsKey = upcomingSessions.map((s) => s.id).join(',');

  const loadAllAssignments = useCallback(async () => {
    if (upcomingSessions.length === 0) {
      setSessionAssignmentsMap({});
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const entries = await Promise.all(
        upcomingSessions.map(async (s) => {
          const res = await fetch(`/api/sessions/${s.id}/assignments`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          return [s.id, Array.isArray(data) ? data : []] as [string, DbAssignment[]];
        })
      );
      setSessionAssignmentsMap(Object.fromEntries(entries));
    } catch {
      setSessionAssignmentsMap({});
    } finally {
      setIsLoading(false);
    }
  }, [sessionIdsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadAllAssignments();
  }, [loadAllAssignments]);

  // Derived: flat TrainingDayAssignment[] in the legacy format the UI expects
  const assignments: TrainingDayAssignment[] = upcomingSessions.flatMap((session) => {
    const dateString = toLocalDateString(session.sessionDate);
    const weekday = new Date(session.sessionDate).getDay() as Weekday;
    return (sessionAssignmentsMap[session.id] ?? []).map((a) => ({
      id: a.id,
      exerciseId: a.exerciseId,
      trainingDate: dateString,
      weekday,
      createdAt: 0,
    }));
  });

  // Derived: ComputedTrainingDay[] for the UI
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingDays: ComputedTrainingDay[] = upcomingSessions.map((session) => {
    const date = new Date(session.sessionDate);
    const dateString = toLocalDateString(session.sessionDate);
    const weekday = date.getDay() as Weekday;
    return {
      date,
      dateString,
      weekday,
      weekdayLabel: WEEKDAY_LABELS[weekday],
      displayLabel: formatTrainingDateForDisplay(date, WEEKDAY_LABELS),
      exerciseIds: [...(sessionAssignmentsMap[session.id] ?? [])]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((a) => a.exerciseId),
      isToday: isSameDay(date, today),
      isPast: date < today,
    };
  });

  // Helper: find session by local dateString
  const findSessionByDate = useCallback(
    (dateString: string) =>
      upcomingSessions.find((s) => toLocalDateString(s.sessionDate) === dateString) ?? null,
    [upcomingSessions]
  );

  const assignExercise = useCallback(
    async (exerciseId: string, dateString: string) => {
      const session = findSessionByDate(dateString);
      if (!session) return;
      const res = await fetch(`/api/sessions/${session.id}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId }),
      });
      if (res.ok) {
        const newA: DbAssignment = await res.json();
        setSessionAssignmentsMap((prev) => ({
          ...prev,
          [session.id]: [...(prev[session.id] ?? []), newA],
        }));
      }
    },
    [findSessionByDate]
  );

  const toggleExercise = useCallback(
    async (exerciseId: string, dateString: string) => {
      const session = findSessionByDate(dateString);
      if (!session) return;
      const existing = (sessionAssignmentsMap[session.id] ?? []).find(
        (a) => a.exerciseId === exerciseId
      );
      if (existing) {
        await fetch(`/api/sessions/${session.id}/assignments/${existing.id}`, { method: 'DELETE' });
        setSessionAssignmentsMap((prev) => ({
          ...prev,
          [session.id]: (prev[session.id] ?? []).filter((a) => a.id !== existing.id),
        }));
      } else {
        const res = await fetch(`/api/sessions/${session.id}/assignments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ exerciseId }),
        });
        if (res.ok) {
          const newA: DbAssignment = await res.json();
          setSessionAssignmentsMap((prev) => ({
            ...prev,
            [session.id]: [...(prev[session.id] ?? []), newA],
          }));
        }
      }
    },
    [findSessionByDate, sessionAssignmentsMap]
  );

  const removeAssignment = useCallback(
    async (assignmentId: string) => {
      const sessionId = Object.keys(sessionAssignmentsMap).find((sid) =>
        (sessionAssignmentsMap[sid] ?? []).some((a) => a.id === assignmentId)
      );
      if (!sessionId) return;
      await fetch(`/api/sessions/${sessionId}/assignments/${assignmentId}`, { method: 'DELETE' });
      setSessionAssignmentsMap((prev) => ({
        ...prev,
        [sessionId]: (prev[sessionId] ?? []).filter((a) => a.id !== assignmentId),
      }));
    },
    [sessionAssignmentsMap]
  );

  const moveAssignment = useCallback(
    async (assignmentId: string, newDateString: string) => {
      let currentSessionId: string | null = null;
      let currentAssignment: DbAssignment | null = null;
      for (const [sid, list] of Object.entries(sessionAssignmentsMap)) {
        const found = list.find((a) => a.id === assignmentId);
        if (found) { currentSessionId = sid; currentAssignment = found; break; }
      }
      if (!currentSessionId || !currentAssignment) return;

      const targetSession = findSessionByDate(newDateString);
      if (!targetSession) return;

      await fetch(`/api/sessions/${currentSessionId}/assignments/${assignmentId}`, { method: 'DELETE' });

      const res = await fetch(`/api/sessions/${targetSession.id}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId: currentAssignment.exerciseId }),
      });

      if (res.ok) {
        const newA: DbAssignment = await res.json();
        setSessionAssignmentsMap((prev) => {
          const updated = { ...prev };
          updated[currentSessionId!] = (updated[currentSessionId!] ?? []).filter(
            (a) => a.id !== assignmentId
          );
          updated[targetSession.id] = [...(updated[targetSession.id] ?? []), newA];
          return updated;
        });
      }
    },
    [findSessionByDate, sessionAssignmentsMap]
  );

  const copyAssignment = useCallback(
    async (assignmentId: string, targetDateString: string) => {
      let currentAssignment: DbAssignment | null = null;
      for (const list of Object.values(sessionAssignmentsMap)) {
        const found = list.find((a) => a.id === assignmentId);
        if (found) { currentAssignment = found; break; }
      }
      if (!currentAssignment) return;

      const targetSession = findSessionByDate(targetDateString);
      if (!targetSession) return;

      const res = await fetch(`/api/sessions/${targetSession.id}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId: currentAssignment.exerciseId }),
      });

      if (res.ok) {
        const newA: DbAssignment = await res.json();
        setSessionAssignmentsMap((prev) => ({
          ...prev,
          [targetSession.id]: [...(prev[targetSession.id] ?? []), newA],
        }));
      }
    },
    [findSessionByDate, sessionAssignmentsMap]
  );

  const reorderAssignment = useCallback(
    async (exerciseId: string, dateString: string, direction: 'up' | 'down') => {
      const session = findSessionByDate(dateString);
      if (!session) return;

      // Read current state and compute updates inside setState to avoid stale closures
      let updates: { id: string; sortOrder: number }[] = [];
      setSessionAssignmentsMap((prev) => {
        const assignments = prev[session.id] ?? [];
        const sorted = [...assignments].sort((a, b) => a.sortOrder - b.sortOrder);
        const item = sorted.find((a) => a.exerciseId === exerciseId);
        if (!item) return prev;

        updates = computeNewSortOrders(sorted, item.id, direction);
        if (updates.length === 0) return prev;

        const updated = [...assignments];
        for (const u of updates) {
          const idx = updated.findIndex((a) => a.id === u.id);
          if (idx !== -1) updated[idx] = { ...updated[idx], sortOrder: u.sortOrder };
        }
        return { ...prev, [session.id]: updated };
      });

      // Persist to API
      if (updates.length > 0) {
        await Promise.all(
          updates.map((u) =>
            fetch(`/api/sessions/${session.id}/assignments/${u.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sortOrder: u.sortOrder }),
            })
          )
        );
      }
    },
    [findSessionByDate]
  );

  // Not implemented for DB (would need current weekdays); no-op for now
  const copyToNextWeekday = useCallback(async (_assignmentId: string) => {}, []);

  const getAssignmentsForDate = useCallback(
    (dateString: string): TrainingDayAssignment[] =>
      assignments.filter((a) => a.trainingDate === dateString),
    [assignments]
  );

  const isExerciseAssigned = useCallback(
    (exerciseId: string, dateString: string): boolean => {
      const session = findSessionByDate(dateString);
      if (!session) return false;
      return (sessionAssignmentsMap[session.id] ?? []).some((a) => a.exerciseId === exerciseId);
    },
    [findSessionByDate, sessionAssignmentsMap]
  );

  return {
    assignments,
    upcomingDays,
    isLoading,
    assignExercise,
    toggleExercise,
    removeAssignment,
    moveAssignment,
    copyAssignment,
    reorderAssignment,
    copyToNextWeekday,
    getAssignmentsForDate,
    isExerciseAssigned,
    refreshData: loadAllAssignments,
  };
}

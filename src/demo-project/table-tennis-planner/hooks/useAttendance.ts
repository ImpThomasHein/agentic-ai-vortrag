'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGroup } from '@/contexts/GroupContext';
import { AttendanceEntry, AttendanceStatus } from '@/lib/types';

interface DbAttendanceEntry {
  id: string;
  userId: string;
  sessionId: string;
  status: string;
  user: { username: string; displayName: string; groupRole: string };
}

function dbToEntry(e: DbAttendanceEntry): AttendanceEntry {
  return {
    username: e.user.username,
    displayName: e.user.displayName,
    role: e.user.groupRole === 'trainer' ? 'trainer' : 'player',
    status: e.status as AttendanceStatus,
    updatedAt: 0,
  };
}

interface UseAttendanceReturn {
  myStatus: AttendanceStatus | null;
  setStatus: (status: AttendanceStatus) => void;
  entries: AttendanceEntry[];
}

export function useAttendance(sessionId: string | null): UseAttendanceReturn {
  const { user } = useAuth();
  const { groupId } = useGroup();
  const [entries, setEntries] = useState<AttendanceEntry[]>([]);

  useEffect(() => {
    if (!sessionId) {
      setEntries([]);
      return;
    }
    fetch(`/api/sessions/${sessionId}/attendance`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: DbAttendanceEntry[]) => {
        setEntries(Array.isArray(data) ? data.map(dbToEntry) : []);
      })
      .catch(() => setEntries([]));
  }, [sessionId]);

  const setStatus = useCallback(
    (status: AttendanceStatus) => {
      if (!sessionId || !user) return;
      const myGroupRole = user.groups.find((g) => g.id === groupId)?.myRole ?? 'player';
      setEntries((prev) => [
        ...prev.filter((e) => e.username !== user.username),
        {
          username: user.username,
          displayName: user.displayName,
          role: myGroupRole,
          status,
          updatedAt: Date.now(),
        },
      ]);
      fetch(`/api/sessions/${sessionId}/attendance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }).catch(() => {
        fetch(`/api/sessions/${sessionId}/attendance`)
          .then((r) => r.json())
          .then((data: DbAttendanceEntry[]) => {
            setEntries(Array.isArray(data) ? data.map(dbToEntry) : []);
          })
          .catch(() => {});
      });
    },
    [sessionId, user, groupId]
  );

  const myStatus = user
    ? (entries.find((e) => e.username === user.username)?.status ?? null)
    : null;

  return { myStatus, setStatus, entries };
}

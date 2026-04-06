'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { Group, TrainingSessionSummary } from '@/lib/types';


interface GroupContextValue {
  groups: Group[];
  groupId: string | null;
  group: Group | null;
  setGroupId: (id: string) => void;
  isLoading: boolean;
  upcomingSessions: TrainingSessionSummary[];
  refreshSessions: () => Promise<void>;
}

export const GroupContext = createContext<GroupContextValue | null>(null);

export function GroupProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [groupId, setGroupId] = useState<string | null>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<TrainingSessionSummary[]>([]);

  const groups: Group[] = user?.groups ?? [];

  useEffect(() => {
    if (groups.length > 0 && !groupId) {
      setGroupId(groups[0].id);
    }
    if (!user) {
      setGroupId(null);
      setUpcomingSessions([]);
    }
  }, [user, groups.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshSessions = useCallback(async () => {
    if (!groupId) {
      setUpcomingSessions([]);
      return;
    }
    try {
      const res = await fetch(`/api/groups/${groupId}/sessions`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUpcomingSessions(Array.isArray(data) ? data : []);
    } catch {
      setUpcomingSessions([]);
    }
  }, [groupId]);

  // Fetch sessions whenever groupId changes
  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  const group = groups.find((g) => g.id === groupId) ?? null;

  return (
    <GroupContext.Provider value={{ groups, groupId, group, setGroupId, isLoading: authLoading, upcomingSessions, refreshSessions }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroup(): GroupContextValue {
  const ctx = useContext(GroupContext);
  if (!ctx) throw new Error('useGroup must be used inside GroupProvider');
  return ctx;
}

'use client';

// Hook for managing match availability and lineup data for a team's matches.
import { useState, useEffect, useCallback } from 'react';
import type { MatchAvailabilityEntry, MatchLineupEntry } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

interface UseMatchAvailabilityOptions {
  teamId: string;
  matchId: string;
}

interface UseMatchAvailabilityReturn {
  availabilities: MatchAvailabilityEntry[];
  lineup: MatchLineupEntry[];
  myStatus: 'yes' | 'no' | 'maybe' | null;
  myCanDrive: boolean;
  setAvailability: (status: 'yes' | 'no' | 'maybe', canDrive: boolean) => Promise<void>;
  setLineup: (players: string[], driverUserId: string | null) => Promise<void>;
  isLoading: boolean;
}

export function useMatchAvailability({ teamId, matchId }: UseMatchAvailabilityOptions): UseMatchAvailabilityReturn {
  const { user } = useAuth();
  const [availabilities, setAvailabilities] = useState<MatchAvailabilityEntry[]>([]);
  const [lineup, setLineupState] = useState<MatchLineupEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAvailability = useCallback(async () => {
    try {
      const res = await fetch(`/api/teams/${teamId}/matches/${matchId}/availability`);
      if (!res.ok) throw new Error();
      const data: MatchAvailabilityEntry[] = await res.json();
      setAvailabilities(data);
    } catch {
      setAvailabilities([]);
    }
  }, [teamId, matchId]);

  const fetchLineup = useCallback(async () => {
    try {
      const res = await fetch(`/api/teams/${teamId}/matches/${matchId}/lineup`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLineupState(data.lineup ?? []);
    } catch {
      setLineupState([]);
    }
  }, [teamId, matchId]);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchAvailability(), fetchLineup()]).finally(() => setIsLoading(false));
  }, [fetchAvailability, fetchLineup]);

  const myEntry = user ? availabilities.find((a) => a.userId === user.id) ?? null : null;
  const myStatus = myEntry?.status ?? null;
  const myCanDrive = myEntry?.canDrive ?? false;

  const setAvailability = useCallback(
    async (status: 'yes' | 'no' | 'maybe', canDrive: boolean) => {
      const res = await fetch(`/api/teams/${teamId}/matches/${matchId}/availability`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, canDrive }),
      });
      if (res.ok) {
        await fetchAvailability();
      }
    },
    [teamId, matchId, fetchAvailability]
  );

  const setLineup = useCallback(
    async (players: string[], driverUserId: string | null) => {
      const res = await fetch(`/api/teams/${teamId}/matches/${matchId}/lineup`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ players, driverUserId }),
      });
      if (res.ok) {
        await fetchLineup();
      }
    },
    [teamId, matchId, fetchLineup]
  );

  return {
    availabilities,
    lineup,
    myStatus,
    myCanDrive,
    setAvailability,
    setLineup,
    isLoading,
  };
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGroup } from '@/contexts/GroupContext';

interface UseVotesReturn {
  votes: string[];
  toggleVote: (exerciseId: string) => Promise<void>;
  hasVoted: (exerciseId: string) => boolean;
  voteCount: (exerciseId: string) => number;
  isLoading: boolean;
  canVote: boolean;
}

export function useVotes(): UseVotesReturn {
  const { upcomingSessions } = useGroup();
  const sessionId = upcomingSessions[0]?.id ?? null;

  const [myVotes, setMyVotes] = useState<string[]>([]);
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setMyVotes([]);
      setVoteCounts({});
      return;
    }

    setIsLoading(true);
    fetch(`/api/sessions/${sessionId}/votes`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setMyVotes(data.myVotes ?? []);
        setVoteCounts(data.voteCounts ?? {});
      })
      .catch(() => {
        setMyVotes([]);
        setVoteCounts({});
      })
      .finally(() => setIsLoading(false));
  }, [sessionId]);

  const toggleVote = useCallback(
    async (exerciseId: string) => {
      if (!sessionId) return;

      // Optimistic update
      const wasVoted = myVotes.includes(exerciseId);
      setMyVotes((prev) =>
        wasVoted ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId]
      );
      setVoteCounts((prev) => ({
        ...prev,
        [exerciseId]: Math.max(0, (prev[exerciseId] ?? 0) + (wasVoted ? -1 : 1)),
      }));

      try {
        await fetch(`/api/sessions/${sessionId}/votes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ exerciseId }),
        });
      } catch {
        // Revert optimistic update on error
        setMyVotes((prev) =>
          wasVoted ? [...prev, exerciseId] : prev.filter((id) => id !== exerciseId)
        );
        setVoteCounts((prev) => ({
          ...prev,
          [exerciseId]: Math.max(0, (prev[exerciseId] ?? 0) + (wasVoted ? 1 : -1)),
        }));
      }
    },
    [sessionId, myVotes]
  );

  const hasVoted = useCallback(
    (exerciseId: string): boolean => myVotes.includes(exerciseId),
    [myVotes]
  );

  const voteCount = useCallback(
    (exerciseId: string): number => voteCounts[exerciseId] ?? 0,
    [voteCounts]
  );

  return {
    votes: myVotes,
    toggleVote,
    hasVoted,
    voteCount,
    isLoading,
    canVote: sessionId !== null,
  };
}

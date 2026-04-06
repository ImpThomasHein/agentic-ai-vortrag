/** Hook for team management: CRUD, member management, click-TT sync, and league data with team name selection. */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { Team, TeamMember, LeagueData } from '@/lib/types';

interface UseTeamReturn {
  teams: Team[];
  selectedTeam: Team | null;
  setSelectedTeamId: (id: string) => void;
  members: TeamMember[];
  leagueData: LeagueData | null;
  createTeam: (name: string) => Promise<void>;
  updateTeam: (data: { name?: string; clickTtUrl?: string }) => Promise<void>;
  deleteTeam: () => Promise<void>;
  addMember: (userId: string) => Promise<void>;
  removeMember: (userId: string) => Promise<void>;
  setMemberRole: (userId: string, role: 'player' | 'captain') => Promise<void>;
  syncClickTT: () => Promise<void>;
  importClubTeams: (clubUrl: string) => Promise<{ imported: number; teams: { id: string; name: string; synced: boolean }[] }>;
  pendingLeagueTeamNames: string[] | null;
  confirmClickTtOwnTeamName: (name: string) => Promise<void>;
  isCaptain: boolean;
  isLoading: boolean;
  isLoadingTeamData: boolean;
  isSyncing: boolean;
  isImporting: boolean;
}

export interface UseTeamOptions {
  mode?: 'my' | 'all';
}

export function useTeam(options: UseTeamOptions = {}): UseTeamReturn {
  const { mode = 'my' } = options;
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [leagueData, setLeagueData] = useState<LeagueData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTeamData, setIsLoadingTeamData] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [pendingLeagueTeamNames, setPendingLeagueTeamNames] = useState<string[] | null>(null);

  // Teams laden
  useEffect(() => {
    setIsLoading(true);
    const url = mode === 'all' ? '/api/teams/all' : '/api/teams';
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: Team[]) => {
        setTeams(data);
        if (data.length > 0 && !selectedTeamId) {
          setSelectedTeamId(data[0].id);
        }
      })
      .catch(() => setTeams([]))
      .finally(() => setIsLoading(false));
  }, [mode]);  // eslint-disable-line react-hooks/exhaustive-deps

  const selectedTeam = teams.find((t) => t.id === selectedTeamId) ?? null;

  const fetchLeagueData = useCallback(async (teamId: string) => {
    try {
      const res = await fetch(`/api/teams/${teamId}`);
      if (!res.ok) { setLeagueData(null); setPendingLeagueTeamNames(null); return; }
      const data = await res.json();
      if (data?.leagueData) {
        const parsed: LeagueData = typeof data.leagueData === 'string' ? JSON.parse(data.leagueData) : data.leagueData;
        setLeagueData(parsed);
        if (!parsed.clickTtTeamName && parsed.standings?.length > 0) {
          setPendingLeagueTeamNames(parsed.standings.map(s => s.teamName));
        } else {
          setPendingLeagueTeamNames(null);
        }
      } else {
        setLeagueData(null);
        setPendingLeagueTeamNames(null);
      }
    } catch {
      setLeagueData(null);
      setPendingLeagueTeamNames(null);
    }
  }, []);

  // Mitglieder + Ligadaten laden wenn Team gewechselt wird
  useEffect(() => {
    if (!selectedTeamId) {
      setMembers([]);
      setLeagueData(null);
      return;
    }

    setIsLoadingTeamData(true);
    Promise.all([
      fetch(`/api/teams/${selectedTeamId}/members`)
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((data: TeamMember[]) => setMembers(data))
        .catch(() => setMembers([])),
      fetchLeagueData(selectedTeamId),
    ]).finally(() => setIsLoadingTeamData(false));
  }, [selectedTeamId, fetchLeagueData]);

  const createTeam = useCallback(async (name: string) => {
    const res = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const newTeam = await res.json();
      const team: Team = { id: newTeam.id, name: newTeam.name, clickTtUrl: null, lastSync: null };
      setTeams((prev) => [...prev, team]);
      setSelectedTeamId(newTeam.id);
    }
  }, []);

  const updateTeam = useCallback(async (data: { name?: string; clickTtUrl?: string }) => {
    if (!selectedTeamId) return;

    const res = await fetch(`/api/teams/${selectedTeamId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const updated = await res.json();
      setTeams((prev) =>
        prev.map((t) => (t.id === selectedTeamId ? { ...t, name: updated.name, clickTtUrl: updated.clickTtUrl } : t))
      );
    }
  }, [selectedTeamId]);

  const deleteTeam = useCallback(async () => {
    if (!selectedTeamId) return;

    const res = await fetch(`/api/teams/${selectedTeamId}`, { method: 'DELETE' });
    if (res.ok) {
      const remaining = teams.filter((t) => t.id !== selectedTeamId);
      setTeams(remaining);
      setSelectedTeamId(remaining.length > 0 ? remaining[0].id : null);
      setMembers([]);
      setLeagueData(null);
    }
  }, [selectedTeamId, teams]);

  const addMember = useCallback(async (userId: string) => {
    if (!selectedTeamId) return;

    const res = await fetch(`/api/teams/${selectedTeamId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (res.ok) {
      const newMember: TeamMember = await res.json();
      setMembers((prev) => [...prev, newMember]);
    }
  }, [selectedTeamId]);

  const removeMember = useCallback(async (userId: string) => {
    if (!selectedTeamId) return;

    const res = await fetch(`/api/teams/${selectedTeamId}/members/${userId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    }
  }, [selectedTeamId]);

  const setMemberRole = useCallback(async (userId: string, role: 'player' | 'captain') => {
    if (!selectedTeamId) return;
    const res = await fetch(`/api/teams/${selectedTeamId}/members/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      // Reload members to reflect the role change
      const membersRes = await fetch(`/api/teams/${selectedTeamId}/members`);
      if (membersRes.ok) {
        const updatedMembers: TeamMember[] = await membersRes.json();
        setMembers(updatedMembers);
      }
    }
  }, [selectedTeamId]);

  const importClubTeams = useCallback(async (clubUrl: string) => {
    setIsImporting(true);
    try {
      const res = await fetch('/api/teams/import-club', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clubUrl }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Import fehlgeschlagen');
      }
      const data = await res.json();
      // Teams neu laden
      const teamsRes = await fetch(mode === 'all' ? '/api/teams/all' : '/api/teams');
      if (teamsRes.ok) {
        const freshTeams = await teamsRes.json();
        setTeams(freshTeams);
      }
      return data;
    } finally {
      setIsImporting(false);
    }
  }, [mode]);

  const syncClickTT = useCallback(async () => {
    if (!selectedTeamId) return;

    setIsSyncing(true);
    try {
      const res = await fetch(`/api/teams/${selectedTeamId}/sync`, { method: 'POST' });
      if (!res.ok) return;
      const syncResult = await res.json();

      setTeams((prev) =>
        prev.map((t) => (t.id === selectedTeamId ? { ...t, lastSync: syncResult.lastSync } : t))
      );

      if (syncResult.clickTtTeamName) {
        setPendingLeagueTeamNames(null);
        await fetchLeagueData(selectedTeamId);
      } else {
        setPendingLeagueTeamNames(syncResult.leagueTeamNames);
      }
    } finally {
      setIsSyncing(false);
    }
  }, [selectedTeamId, fetchLeagueData]);

  const confirmClickTtOwnTeamName = useCallback(async (name: string) => {
    if (!selectedTeamId) return;
    const res = await fetch(`/api/teams/${selectedTeamId}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clickTtTeamName: name }),
    });
    if (!res.ok) return;
    setPendingLeagueTeamNames(null);
    await fetchLeagueData(selectedTeamId);
  }, [selectedTeamId, fetchLeagueData]);

  const isCaptain = user ? members.some((m) => m.userId === user.id && m.role === 'captain') : false;

  return {
    teams,
    selectedTeam,
    setSelectedTeamId,
    members,
    leagueData,
    createTeam,
    updateTeam,
    deleteTeam,
    addMember,
    removeMember,
    setMemberRole,
    syncClickTT,
    importClubTeams,
    pendingLeagueTeamNames,
    confirmClickTtOwnTeamName,
    isCaptain,
    isLoading,
    isLoadingTeamData,
    isSyncing,
    isImporting,
  };
}

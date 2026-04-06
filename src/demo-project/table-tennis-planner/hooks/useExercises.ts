// hooks/useExercises.ts
/**
 * Hook for loading and filtering exercises from the API.
 * Fetches exercises from GET /api/exercises on mount and provides
 * filtering, lookup, and refetch capabilities.
 * Accepts optional additionalExercises (e.g., notes) that are merged
 * with fetched exercises, deduplicating by id.
 */
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Exercise, ExerciseFilters } from '@/lib/types';

interface UseExercisesOptions {
  filters?: ExerciseFilters;
  additionalExercises?: Exercise[];
}

interface UseExercisesReturn {
  exercises: Exercise[];
  allExercises: Exercise[];
  isFiltered: boolean;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export function useExercises(options: UseExercisesOptions = {}): UseExercisesReturn {
  const { filters, additionalExercises = [] } = options;
  const [staticExercises, setStaticExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExercises = useCallback(async () => {
    try {
      const res = await fetch('/api/exercises');
      if (res.ok) {
        const data = await res.json();
        setStaticExercises(data);
      }
    } catch {
      // Silently handle fetch errors – exercises stay empty
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const allExercises = useMemo(() => {
    const merged = [...staticExercises];
    for (const ex of additionalExercises) {
      if (!merged.some((m) => m.id === ex.id)) {
        merged.push(ex);
      }
    }
    return merged;
  }, [additionalExercises, staticExercises]);

  const filteredExercises = useMemo(() => {
    if (!filters) return allExercises;

    return allExercises.filter((exercise) => {
      // Notes: only apply search query filter, hide when category/difficulty filters active
      if (exercise.type === 'note') {
        if ((filters.categories && filters.categories.length > 0) || filters.difficulty) {
          return false;
        }
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          return exercise.name.toLowerCase().includes(query) ||
            exercise.description.toLowerCase().includes(query);
        }
        return true;
      }

      if (filters.categories && filters.categories.length > 0) {
        if (!filters.categories.includes(exercise.category)) return false;
      }
      if (filters.difficulty) {
        if (exercise.difficulty !== filters.difficulty) return false;
      }
      if (filters.ttrPoints !== undefined) {
        if (exercise.ttrRange.min > filters.ttrPoints || exercise.ttrRange.max < filters.ttrPoints) return false;
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = exercise.name.toLowerCase().includes(query);
        const matchesDescription = exercise.description.toLowerCase().includes(query);
        const matchesTags = exercise.tags?.some(tag => tag.toLowerCase().includes(query));
        if (!matchesName && !matchesDescription && !matchesTags) return false;
      }
      return true;
    });
  }, [filters, allExercises]);

  const isFiltered = useMemo((): boolean => {
    if (!filters) return false;
    return Boolean(
      (filters.categories && filters.categories.length > 0) ||
      filters.difficulty !== null ||
      filters.ttrPoints !== undefined ||
      (filters.searchQuery && filters.searchQuery.length > 0)
    );
  }, [filters]);

  return {
    exercises: filteredExercises,
    allExercises,
    isFiltered,
    isLoading,
    refetch: fetchExercises,
  };
}

// Single exercise lookup by ID from a provided list
export function findExerciseById(exercises: Exercise[], id: string): Exercise | undefined {
  return exercises.find((exercise) => exercise.id === id);
}

// Multiple exercises lookup by IDs from a provided list
export function findExercisesByIds(exercises: Exercise[], ids: string[]): Exercise[] {
  return exercises.filter((exercise) => ids.includes(exercise.id));
}

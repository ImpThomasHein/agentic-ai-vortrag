'use client';

import { ExerciseCategory, DifficultyLevel, ExerciseFilters as FilterType } from '@/lib/types';
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_COLORS, DIFFICULTIES, DIFFICULTY_LABELS } from '@/lib/constants';
import { FilterChip } from '@/components/ui';

interface ExerciseFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  showDifficulty?: boolean;
}

export default function ExerciseFilters({
  filters,
  onFiltersChange,
  showDifficulty = true,
}: ExerciseFiltersProps) {
  const toggleCategory = (category: ExerciseCategory) => {
    const currentCategories = filters.categories || [];
    let newCategories: ExerciseCategory[];

    if (currentCategories.includes(category)) {
      newCategories = currentCategories.filter((c) => c !== category);
    } else {
      newCategories = [...currentCategories, category];
    }

    onFiltersChange({
      ...filters,
      categories: newCategories,
    });
  };

  const setDifficulty = (difficulty: DifficultyLevel | null) => {
    onFiltersChange({
      ...filters,
      difficulty: filters.difficulty === difficulty ? null : difficulty,
    });
  };

  return (
    <div className="space-y-3">
      {/* Suchfeld */}
      <div>
        <input
          type="text"
          value={filters.searchQuery ?? ''}
          onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
          placeholder="Übung suchen..."
          className="w-full px-3 py-2 text-sm rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          style={{ color: 'var(--text-primary)' }}
        />
      </div>

      {/* Kategorie-Filter */}
      <div>
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Kategorie
        </h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => {
            const isSelected = filters.categories?.includes(category) || false;
            const color = CATEGORY_COLORS[category];

            return (
              <FilterChip
                key={category}
                selected={isSelected}
                colorScheme={isSelected ? color : undefined}
                onClick={() => toggleCategory(category)}
              >
                {CATEGORY_LABELS[category]}
              </FilterChip>
            );
          })}
        </div>
      </div>

      {/* Schwierigkeits-Filter */}
      {showDifficulty && (
        <div>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Schwierigkeit
          </h3>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((difficulty) => {
              const isSelected = filters.difficulty === difficulty;

              return (
                <FilterChip
                  key={difficulty}
                  selected={isSelected}
                  onClick={() => setDifficulty(difficulty)}
                >
                  {DIFFICULTY_LABELS[difficulty]}
                </FilterChip>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

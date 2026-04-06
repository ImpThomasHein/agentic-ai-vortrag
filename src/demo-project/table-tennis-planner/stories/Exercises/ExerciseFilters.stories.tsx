import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { useState } from 'react';
import ExerciseFilters from '@/components/exercises/ExerciseFilters';
import type { ExerciseFilters as FilterType } from '@/lib/types';

const emptyFilters: FilterType = { categories: [], difficulty: null };

const meta: Meta<typeof ExerciseFilters> = {
  title: 'Exercises/ExerciseFilters',
  component: ExerciseFilters,
  parameters: { layout: 'padded' },
  argTypes: { showDifficulty: { control: 'boolean' } },
  args: {
    filters: emptyFilters,
    onFiltersChange: fn(),
    showDifficulty: true,
  },
};
export default meta;
type Story = StoryObj<typeof ExerciseFilters>;

export const AllDeselected: Story = {
  args: { filters: emptyFilters },
};

export const CategorySelected: Story = {
  args: {
    filters: { categories: ['beinarbeit', 'topspin'], difficulty: null },
  },
};

export const DifficultySelected: Story = {
  args: {
    filters: { categories: [], difficulty: 'beginner' },
  },
};

export const NoDifficultyFilter: Story = {
  args: { filters: emptyFilters, showDifficulty: false },
};

export const Interactive: Story = {
  render: () => {
    const [filters, setFilters] = useState<FilterType>(emptyFilters);
    return (
      <div style={{ maxWidth: '400px' }}>
        <ExerciseFilters filters={filters} onFiltersChange={setFilters} />
        <pre style={{ marginTop: '16px', fontSize: '11px', background: 'rgba(0,0,0,0.05)', padding: '8px', borderRadius: '8px' }}>
          {JSON.stringify(filters, null, 2)}
        </pre>
      </div>
    );
  },
};

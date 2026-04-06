import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NextTrainingInfo } from '@/components/training/NextTrainingInfo';
import { falkenbergExercise, topspinExercise, mockVoteCountFn } from '../mocks/mockData';

const nextMonday = new Date('2026-02-23');

const meta: Meta<typeof NextTrainingInfo> = {
  title: 'Training/NextTrainingInfo',
  component: NextTrainingInfo,
  parameters: { layout: 'padded' },
  args: {
    nextTrainingDate: nextMonday,
    weekdays: [1, 3, 5],
    variant: 'default',
    plannedExercises: [],
  },
};
export default meta;
type Story = StoryObj<typeof NextTrainingInfo>;

export const Default: Story = {
  args: { nextTrainingDate: nextMonday, weekdays: [1, 3, 5] },
};

export const NoSchedule: Story = {
  args: { nextTrainingDate: null, weekdays: [] },
};

export const CompactVariant: Story = {
  args: { nextTrainingDate: nextMonday, weekdays: [1, 3, 5], variant: 'compact' },
};

export const WithPlannedExercises: Story = {
  args: {
    nextTrainingDate: nextMonday,
    weekdays: [1, 3, 5],
    plannedExercises: [falkenbergExercise, topspinExercise],
    voteCount: mockVoteCountFn,
    showVoteCount: true,
  },
};

export const WithReorder: Story = {
  args: {
    ...WithPlannedExercises.args,
    onReorder: (exerciseId: string, direction: 'up' | 'down') => {
      console.log(`Reorder: ${exerciseId} ${direction}`);
    },
  },
};

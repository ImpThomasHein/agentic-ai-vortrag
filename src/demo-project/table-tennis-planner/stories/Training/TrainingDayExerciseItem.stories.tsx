import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { TrainingDayExerciseItem } from '@/components/training/TrainingDayExerciseItem';
import { falkenbergExercise, topspinExercise, mockAssignments } from '../mocks/mockData';

const meta: Meta<typeof TrainingDayExerciseItem> = {
  title: 'Training/TrainingDayExerciseItem',
  component: TrainingDayExerciseItem,
  parameters: { layout: 'padded' },
  args: {
    exercise: falkenbergExercise,
    assignment: mockAssignments[0],
    onRemove: fn(),
    onCopyToNext: fn(),
    onMove: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof TrainingDayExerciseItem>;

export const Default: Story = {
  args: { exercise: falkenbergExercise, voteCount: undefined },
};

export const WithVoteCount: Story = {
  args: { exercise: falkenbergExercise, voteCount: 5 },
};

export const HighVoteCount: Story = {
  args: { exercise: topspinExercise, voteCount: 12 },
};

export const DifferentCategory: Story = {
  args: { exercise: topspinExercise, voteCount: 3 },
};

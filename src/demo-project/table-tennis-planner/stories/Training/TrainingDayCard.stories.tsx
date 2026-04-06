import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { TrainingDayCard } from '@/components/training/TrainingDayCard';
import {
  mockUpcomingDays,
  mockExercises,
  mockAssignments,
  mockVoteCountFn,
} from '../mocks/mockData';

const meta: Meta<typeof TrainingDayCard> = {
  title: 'Training/TrainingDayCard',
  component: TrainingDayCard,
  parameters: { layout: 'padded' },
  args: {
    trainingDay: mockUpcomingDays[0],
    exercises: mockExercises,
    assignments: mockAssignments,
    voteCount: mockVoteCountFn,
    onRemoveExercise: fn(),
    onCopyExercise: fn(),
    onMoveExercise: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof TrainingDayCard>;

export const WithExercises: Story = {
  args: {
    trainingDay: mockUpcomingDays[0],
    assignments: mockAssignments,
  },
};

export const EmptyDay: Story = {
  args: {
    trainingDay: mockUpcomingDays[1],
    assignments: [],
  },
};

export const TodayHighlighted: Story = {
  args: {
    trainingDay: { ...mockUpcomingDays[0], isToday: true, displayLabel: 'Heute' },
    assignments: mockAssignments,
    voteCount: mockVoteCountFn,
  },
};

export const MultipleExercises: Story = {
  args: {
    trainingDay: mockUpcomingDays[2],
    assignments: mockAssignments,
    voteCount: mockVoteCountFn,
  },
};

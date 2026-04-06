import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { ExerciseActionMenu } from '@/components/exercises/ExerciseActionMenu';
import { falkenbergExercise, mockUpcomingDays } from '../mocks/mockData';

const meta: Meta<typeof ExerciseActionMenu> = {
  title: 'Exercises/ExerciseActionMenu',
  component: ExerciseActionMenu,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '48px', paddingRight: '48px', minHeight: '300px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    exercise: falkenbergExercise,
    upcomingTrainingDays: mockUpcomingDays,
    onAssignToDay: fn(),
    voteCount: 5,
  },
};
export default meta;
type Story = StoryObj<typeof ExerciseActionMenu>;

export const WithTrainingDays: Story = {
  args: {
    upcomingTrainingDays: mockUpcomingDays,
    voteCount: 5,
  },
};

export const WithoutTrainingDays: Story = {
  args: {
    upcomingTrainingDays: [],
    voteCount: 0,
  },
};

export const WithAssignedDay: Story = {
  args: {
    upcomingTrainingDays: mockUpcomingDays,
    voteCount: 3,
    isAssignedToDate: (exerciseId: string, dateString: string) =>
      exerciseId === 'bein-001' && dateString === '2026-02-23',
  },
};

export const NoVotes: Story = {
  args: {
    upcomingTrainingDays: mockUpcomingDays,
    voteCount: 0,
  },
};

export const WithGroupName: Story = {
  args: {
    upcomingTrainingDays: mockUpcomingDays,
    voteCount: 3,
    groupName: 'Jugend',
  },
};

export const WithGroupNameAndAssigned: Story = {
  args: {
    upcomingTrainingDays: mockUpcomingDays,
    voteCount: 3,
    groupName: 'Herren 1',
    isAssignedToDate: (_exerciseId: string, dateString: string) => dateString === '2026-02-23',
  },
};

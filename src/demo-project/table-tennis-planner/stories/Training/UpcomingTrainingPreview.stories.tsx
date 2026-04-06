import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { UpcomingTrainingPreview } from '@/components/training/UpcomingTrainingPreview';
import { mockUpcomingDays, mockExercises, mockVoteCountFn } from '../mocks/mockData';

const meta: Meta<typeof UpcomingTrainingPreview> = {
  title: 'Training/UpcomingTrainingPreview',
  component: UpcomingTrainingPreview,
  parameters: { layout: 'padded' },
  args: {
    upcomingDays: mockUpcomingDays,
    allExercises: mockExercises,
    voteCount: mockVoteCountFn,
  },
};
export default meta;
type Story = StoryObj<typeof UpcomingTrainingPreview>;

export const WithDays: Story = {
  args: { upcomingDays: mockUpcomingDays, allExercises: mockExercises, voteCount: mockVoteCountFn },
};

export const NoDays: Story = {
  args: { upcomingDays: [] },
};

export const SingleDay: Story = {
  args: {
    upcomingDays: [mockUpcomingDays[0]],
    allExercises: mockExercises,
    voteCount: mockVoteCountFn,
  },
};

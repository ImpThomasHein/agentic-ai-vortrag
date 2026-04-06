/**
 * Stories for the QuickDashboard homepage component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QuickDashboard } from '@/components/dashboard/QuickDashboard';

const meta: Meta<typeof QuickDashboard> = {
  title: 'Dashboard/QuickDashboard',
  component: QuickDashboard,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof QuickDashboard>;

export const TrainerDashboard: Story = {
  args: {
    displayName: 'Thomas',
    role: 'trainer',
    nextTraining: {
      date: 'Mittwoch, 25. März · 19:00',
      detail: 'in 3 Tagen',
      exerciseCount: 4,
      attendanceLabel: '5/8 zugesagt',
    },
    mannschaften: {
      count: 2,
      nextGame: 'Sa, 28. März — Herren II vs. TTC Mitte',
    },
    uebungen: {
      exerciseCount: 23,
      noteCount: 5,
      newVotes: 3,
    },
  },
};

export const PlayerDashboard: Story = {
  args: {
    displayName: 'Max',
    role: 'player',
    nextTraining: {
      date: 'Mittwoch, 25. März · 19:00',
      detail: 'in 3 Tagen',
      exerciseCount: 4,
      attendanceLabel: 'Zugesagt',
    },
    mannschaften: {
      count: 1,
    },
    uebungen: {
      exerciseCount: 23,
      noteCount: 5,
    },
  },
};

export const NoTraining: Story = {
  args: {
    displayName: 'Lisa',
    role: 'player',
    mannschaften: {
      count: 0,
    },
    uebungen: {
      exerciseCount: 10,
      noteCount: 2,
    },
  },
};

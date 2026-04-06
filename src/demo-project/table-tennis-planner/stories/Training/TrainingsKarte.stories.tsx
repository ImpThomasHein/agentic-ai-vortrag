/**
 * Stories for the TrainingsKarte training session overview card.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TrainingsKarte } from '@/components/training/TrainingsKarte';

const meta: Meta<typeof TrainingsKarte> = {
  title: 'Training/TrainingsKarte',
  component: TrainingsKarte,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 400 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof TrainingsKarte>;

export const NextTraining: Story = {
  args: {
    sessionId: '1',
    date: new Date(Date.now() + 3 * 86400000),
    exerciseCount: 4,
    attendance: { yes: 5, no: 2, open: 1 },
    isNext: true,
    accentColor: 'blue',
    onClick: () => {},
  },
};

export const FutureTraining: Story = {
  args: {
    sessionId: '2',
    date: new Date(Date.now() + 10 * 86400000),
    exerciseCount: 2,
    attendance: { yes: 3, no: 0, open: 5 },
    isNext: false,
    onClick: () => {},
  },
};

export const NoExercises: Story = {
  args: {
    sessionId: '3',
    date: new Date(Date.now() + 12 * 86400000),
    exerciseCount: 0,
    attendance: { yes: 0, no: 0, open: 8 },
    isNext: false,
    onClick: () => {},
  },
};

export const PlayerGreen: Story = {
  args: {
    sessionId: '4',
    date: new Date(Date.now() + 3 * 86400000),
    exerciseCount: 4,
    attendance: { yes: 5, no: 2, open: 1 },
    isNext: true,
    accentColor: 'green',
    onClick: () => {},
  },
};

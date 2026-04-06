import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { MoveExerciseModal } from '@/components/training/MoveExerciseModal';
import { falkenbergExercise, mockUpcomingDays } from '../mocks/mockData';

const meta: Meta<typeof MoveExerciseModal> = {
  title: 'Training/MoveExerciseModal',
  component: MoveExerciseModal,
  parameters: { layout: 'fullscreen' },
  args: {
    isOpen: true,
    onClose: fn(),
    exercise: falkenbergExercise,
    currentDateString: '2026-02-23',
    availableDays: mockUpcomingDays,
    onMove: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof MoveExerciseModal>;

export const Open: Story = {
  args: { isOpen: true },
};

export const Closed: Story = {
  args: { isOpen: false },
};

export const WithMultipleDays: Story = {
  args: {
    isOpen: true,
    availableDays: mockUpcomingDays,
    currentDateString: '2026-02-23',
  },
};

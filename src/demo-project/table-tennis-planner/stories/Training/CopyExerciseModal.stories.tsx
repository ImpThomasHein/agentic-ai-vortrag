import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { CopyExerciseModal } from '@/components/training/CopyExerciseModal';
import { falkenbergExercise, mockUpcomingDays } from '../mocks/mockData';

const meta: Meta<typeof CopyExerciseModal> = {
  title: 'Training/CopyExerciseModal',
  component: CopyExerciseModal,
  parameters: { layout: 'fullscreen' },
  args: {
    isOpen: true,
    onClose: fn(),
    exercise: falkenbergExercise,
    currentDateString: '2026-02-23',
    availableDays: mockUpcomingDays,
    onCopy: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof CopyExerciseModal>;

export const Open: Story = {
  args: { isOpen: true },
};

export const Closed: Story = {
  args: { isOpen: false },
};

export const WithAlreadyAssignedDay: Story = {
  args: {
    isOpen: true,
    // Freitag hat bereits die Übung bein-001
    availableDays: mockUpcomingDays,
    currentDateString: '2026-02-23',
  },
};

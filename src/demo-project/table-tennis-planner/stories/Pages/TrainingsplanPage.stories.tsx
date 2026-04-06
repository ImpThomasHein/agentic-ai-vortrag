import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TrainingsplanPage from '@/app/trainingsplan/page';
import { withTrainerAuth, withGroupContext } from '../mocks/decorators';
import { STORAGE_KEYS } from '@/lib/constants';

const meta: Meta<typeof TrainingsplanPage> = {
  title: 'Pages/TrainingsplanPage',
  component: TrainingsplanPage,
  parameters: { layout: 'fullscreen' },
  decorators: [withTrainerAuth, withGroupContext()],
};
export default meta;
type Story = StoryObj<typeof TrainingsplanPage>;

// Kein Schedule → leerer Zustand
export const NoSchedule: Story = {
  beforeEach() {
    localStorage.clear();
  },
};

// Schedule mit Übungen
export const WithTrainingDays: Story = {
  beforeEach() {
    localStorage.setItem(
      STORAGE_KEYS.TRAINING_SCHEDULE,
      JSON.stringify({
        id: 'schedule-1',
        weekdays: [1, 3, 5],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    );
    localStorage.setItem(
      STORAGE_KEYS.TRAINING_ASSIGNMENTS,
      JSON.stringify({
        assignments: [
          { id: 'a1', exerciseId: 'bein-001', trainingDate: '2026-02-23', weekday: 1, createdAt: Date.now() },
          { id: 'a2', exerciseId: 'technik-001', trainingDate: '2026-02-23', weekday: 1, createdAt: Date.now() },
          { id: 'a3', exerciseId: 'aufschlag-001', trainingDate: '2026-02-25', weekday: 3, createdAt: Date.now() },
        ],
        updatedAt: Date.now(),
      })
    );
  },
};

// Schedule ohne Übungen
export const EmptyDays: Story = {
  beforeEach() {
    localStorage.setItem(
      STORAGE_KEYS.TRAINING_SCHEDULE,
      JSON.stringify({
        id: 'schedule-1',
        weekdays: [1, 3, 5],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    );
    localStorage.setItem(
      STORAGE_KEYS.TRAINING_ASSIGNMENTS,
      JSON.stringify({ assignments: [], updatedAt: Date.now() })
    );
  },
};

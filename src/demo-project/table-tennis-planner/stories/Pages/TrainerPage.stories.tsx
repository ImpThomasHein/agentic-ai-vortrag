import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TrainerPage from '@/app/trainer/page';
import { withTrainerAuth, withGroupContext } from '../mocks/decorators';
import { STORAGE_KEYS } from '@/lib/constants';

const meta: Meta<typeof TrainerPage> = {
  title: 'Pages/TrainerPage',
  component: TrainerPage,
  parameters: { layout: 'fullscreen' },
  decorators: [withTrainerAuth, withGroupContext()],
};
export default meta;
type Story = StoryObj<typeof TrainerPage>;

// Schedule vorhanden
export const WithSchedule: Story = {
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
          { id: 'a2', exerciseId: 'technik-001', trainingDate: '2026-02-25', weekday: 3, createdAt: Date.now() },
        ],
        updatedAt: Date.now(),
      })
    );
  },
};

// Kein Schedule → zeigt Einrichtungs-Hinweis
export const NoSchedule: Story = {
  beforeEach() {
    localStorage.clear();
  },
};

// Mit Votes (simuliert Stimmen von Spielern)
export const WithVotedExercises: Story = {
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
      STORAGE_KEYS.VOTING_SESSION,
      JSON.stringify({
        id: 'session-1',
        trainingDate: '2026-02-23',
        startedAt: Date.now(),
        active: true,
      })
    );
  },
};

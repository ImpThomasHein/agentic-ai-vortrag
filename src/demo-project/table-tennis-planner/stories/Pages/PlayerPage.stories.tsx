import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PlayerPage from '@/app/player/page';
import { withPlayerAuth, withTrainerAuth, withGroupContext } from '../mocks/decorators';
import { STORAGE_KEYS } from '@/lib/constants';

const meta: Meta<typeof PlayerPage> = {
  title: 'Pages/PlayerPage',
  component: PlayerPage,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof PlayerPage>;

// Schedule + Übungen vorhanden
export const WithSchedule: Story = {
  decorators: [withPlayerAuth, withGroupContext()],
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
  },
};

// Kein Schedule → zeigt Hinweis
export const NoSchedule: Story = {
  decorators: [withPlayerAuth, withGroupContext()],
  beforeEach() {
    localStorage.clear();
  },
};

// Mit abgegebenen Votes
export const WithVotes: Story = {
  decorators: [withPlayerAuth, withGroupContext()],
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
    localStorage.setItem(
      STORAGE_KEYS.VOTES,
      JSON.stringify({
        visitorId: 'visitor_test',
        votes: ['bein-001', 'technik-001'],
        lastUpdated: Date.now(),
        sessionId: 'session-1',
      })
    );
  },
};

// Als Trainer-Rolle (auch erlaubt auf der Player-Seite)
export const AsTrainer: Story = {
  decorators: [withTrainerAuth, withGroupContext()],
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
  },
};

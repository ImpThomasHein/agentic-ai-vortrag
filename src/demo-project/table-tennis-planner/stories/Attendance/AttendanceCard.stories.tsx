import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AttendanceCard } from '@/components/attendance/AttendanceCard';
import { withTrainerAuth, withPlayerAuth, withGroupContext } from '../mocks/decorators';
import { mockUpcomingSessions } from '../mocks/mockData';

// Mock fetch – gibt leere Attendee-Liste zurück
function mockFetchEmpty() {
  globalThis.fetch = (() => Promise.resolve({ json: () => Promise.resolve([]) })) as typeof fetch;
}

// Mock fetch – gibt zwei Einträge für session-1 zurück
function mockFetchWithEntries() {
  globalThis.fetch = ((url: string | URL | Request) => {
    const urlStr = String(url);
    if (urlStr.includes('session-1')) {
      return Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 'a1', userId: 'u1', sessionId: 'session-1', status: 'yes', user: { username: 'trainer', displayName: 'Trainer', groupRole: 'trainer' } },
            { id: 'a2', userId: 'u2', sessionId: 'session-1', status: 'no', user: { username: 'lisa', displayName: 'Lisa Meier', groupRole: 'player' } },
          ]),
      });
    }
    return Promise.resolve({ json: () => Promise.resolve([]) });
  }) as typeof fetch;
}

const meta: Meta<typeof AttendanceCard> = {
  title: 'Attendance/AttendanceCard',
  component: AttendanceCard,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof AttendanceCard>;

// Keine Sessions → Komponente rendert null
export const NoSessions: Story = {
  decorators: [withTrainerAuth, withGroupContext([])],
};

// 4 Sessions, keine Einträge
export const WithSessionsEmpty: Story = {
  decorators: [withTrainerAuth, withGroupContext(mockUpcomingSessions)],
  beforeEach() {
    mockFetchEmpty();
  },
};

// 4 Sessions, erste hat Einträge
export const WithEntries: Story = {
  decorators: [withTrainerAuth, withGroupContext(mockUpcomingSessions)],
  beforeEach() {
    mockFetchWithEntries();
  },
};

// Als Spieler
export const AsPlayer: Story = {
  decorators: [withPlayerAuth, withGroupContext(mockUpcomingSessions)],
  beforeEach() {
    mockFetchWithEntries();
  },
};

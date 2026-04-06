import React, { type ReactNode } from 'react';
import type { Decorator } from '@storybook/nextjs-vite';
import { AuthProvider } from './AuthContext.mock';
import type { AuthUser } from '@/lib/auth';
import { mockTrainerUser, mockPlayerUser } from './mockData';
import { STORAGE_KEYS } from '@/lib/constants';

// ─── Auth Decorators ──────────────────────────────────────────────────────────

export const withTrainerAuth: Decorator = (Story) => (
  <AuthProvider user={mockTrainerUser}>
    <Story />
  </AuthProvider>
);

export const withPlayerAuth: Decorator = (Story) => (
  <AuthProvider user={mockPlayerUser}>
    <Story />
  </AuthProvider>
);

export const withNoAuth: Decorator = (Story) => (
  <AuthProvider user={null}>
    <Story />
  </AuthProvider>
);

export const withLoadingAuth: Decorator = (Story) => (
  <AuthProvider user={null} isLoading>
    <Story />
  </AuthProvider>
);

export function withAuth(user: AuthUser | null): Decorator {
  // eslint-disable-next-line react/display-name
  return (Story) => (
    <AuthProvider user={user}>
      <Story />
    </AuthProvider>
  );
}

// ─── localStorage Decorator ───────────────────────────────────────────────────

export function withScheduleInStorage(weekdays: number[] = [1, 3, 5]): Decorator {
  // eslint-disable-next-line react/display-name
  return (Story) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        STORAGE_KEYS.TRAINING_SCHEDULE,
        JSON.stringify({
          id: 'schedule-mock',
          weekdays,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        })
      );
    }
    return <Story />;
  };
}

// ─── Layout Wrappers ──────────────────────────────────────────────────────────

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: '#e8f0fe' }}>
      {children}
    </div>
  );
}

export const withPageLayout: Decorator = (Story) => (
  <PageWrapper>
    <Story />
  </PageWrapper>
);

// ─── GroupContext Decorator ───────────────────────────────────────────────────

import { GroupContext } from '@/contexts/GroupContext';
import { mockUpcomingSessions } from './mockData';
import type { TrainingSessionSummary } from '@/lib/types';

export function withGroupContext(sessions: TrainingSessionSummary[] = mockUpcomingSessions): Decorator {
  // eslint-disable-next-line react/display-name
  return (Story) => (
    <GroupContext.Provider
      value={{
        groups: [{ id: 'g1', name: 'Jugend', description: null, myRole: 'trainer' }],
        groupId: 'g1',
        group: { id: 'g1', name: 'Jugend', description: null, myRole: 'trainer' },
        setGroupId: () => {},
        isLoading: false,
        upcomingSessions: sessions,
        refreshSessions: async () => {},
      }}
    >
      <Story />
    </GroupContext.Provider>
  );
}

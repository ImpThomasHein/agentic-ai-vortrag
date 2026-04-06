'use client';

import { type ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { GroupProvider } from '@/contexts/GroupContext';
import { useServiceWorker } from '@/hooks/useServiceWorker';

export function Providers({ children }: { children: ReactNode }) {
  useServiceWorker();

  return (
    <AuthProvider>
      <GroupProvider>{children}</GroupProvider>
    </AuthProvider>
  );
}

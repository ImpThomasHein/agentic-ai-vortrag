'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, type UserRole, getRoleHomePath } from '@/contexts/AuthContext';

interface UseRequireAuthOptions {
  allowedRoles?: UserRole[];
}

interface UseRequireAuthReturn {
  user: ReturnType<typeof useAuth>['user'];
  isLoading: boolean;
  isAuthorized: boolean;
}

export function useRequireAuth(options: UseRequireAuthOptions = {}): UseRequireAuthReturn {
  const { user, isLoading, hasRole } = useAuth();
  const router = useRouter();
  const { allowedRoles } = options;

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (allowedRoles && !hasRole(allowedRoles)) {
      router.replace(getRoleHomePath(user.role));
    }
  }, [isLoading, user, hasRole, allowedRoles, router]);

  const isAuthorized =
    !isLoading && user !== null && (!allowedRoles || hasRole(allowedRoles));

  return { user, isLoading, isAuthorized };
}

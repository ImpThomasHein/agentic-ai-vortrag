// Business logic for push notification toggle state management.

export type PushSupportStatus = 'supported' | 'unsupported';

export function getPushSupportStatus(
  hasServiceWorker: boolean,
  hasPushManager: boolean
): PushSupportStatus {
  if (!hasServiceWorker || !hasPushManager) return 'unsupported';
  return 'supported';
}

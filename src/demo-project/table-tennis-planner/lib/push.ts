// Server-side push notification utility.
// Sends Web Push notifications to users via their stored push subscriptions.
// Includes domain-specific helpers for training plan and attendance changes.
import webpush from 'web-push';
import { getPrisma } from '@/lib/db';

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT;

if (vapidPublicKey && vapidPrivateKey && vapidSubject) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

/**
 * Send push notifications to all subscriptions for the given user IDs.
 * Errors are logged but never thrown — callers are not blocked.
 * Stale subscriptions (410 Gone) are automatically removed.
 */
export async function sendPushNotification(
  userIds: string[],
  title: string,
  body: string,
  url?: string
): Promise<void> {
  const prisma = await getPrisma();
  if (userIds.length === 0) return;

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId: { in: userIds } },
  });

  if (subscriptions.length === 0) return;

  const payload = JSON.stringify({ title, body, url } satisfies PushPayload);

  const results = subscriptions.map(async (sub) => {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      );
    } catch (error: unknown) {
      const statusCode = (error as { statusCode?: number }).statusCode;
      if (statusCode === 410) {
        // Subscription expired or unsubscribed — clean up
        await prisma.pushSubscription.delete({ where: { id: sub.id } });
      } else {
        console.error(`Push failed for subscription ${sub.id}:`, error);
      }
    }
  });

  await Promise.allSettled(results);
}

/** Returns user IDs of all team members except the given sender */
export async function getTeamMemberIdsExcept(
  teamId: string,
  senderUserId: string
): Promise<string[]> {
  const prisma = await getPrisma();
  const members = await prisma.teamMember.findMany({
    where: { teamId, userId: { not: senderUserId } },
    select: { userId: true },
  });
  return members.map((m) => m.userId);
}

/** Builds the push notification payload for a new chat message */
export function buildChatNotificationPayload(
  teamName: string,
  senderDisplayName: string,
  messageContent: string | null
): PushPayload {
  let body: string;
  if (messageContent === null) {
    body = `${senderDisplayName} hat ein Bild gesendet`;
  } else {
    const truncated =
      messageContent.length > 80
        ? messageContent.slice(0, 79) + '…'
        : messageContent;
    body = `${senderDisplayName}: ${truncated}`;
  }
  return { title: teamName, body };
}

/** Notify team members about a new chat message. Fire-and-forget. */
export function notifyTeamAboutNewMessage(
  teamId: string,
  senderUserId: string,
  teamName: string,
  senderDisplayName: string,
  messageContent: string | null
): void {
  getTeamMemberIdsExcept(teamId, senderUserId).then((memberIds) => {
    if (memberIds.length === 0) return;
    const { title, body } = buildChatNotificationPayload(
      teamName,
      senderDisplayName,
      messageContent
    );
    sendPushNotification(memberIds, title, body, '/mannschaft');
  }).catch((err) => console.error('Chat notification failed:', err));
}

function formatSessionDate(date: Date): string {
  return new Date(date).toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

async function getSessionWithGroupMembers(sessionId: string, role: 'player' | 'trainer') {
  const prisma = await getPrisma();
  return prisma.trainingSession.findUnique({
    where: { id: sessionId },
    select: {
      sessionDate: true,
      group: {
        select: {
          members: {
            where: { role },
            select: { userId: true },
          },
        },
      },
    },
  });
}

/**
 * Notify all players in the session's group that the training plan was updated.
 * Fire-and-forget — does not block the caller.
 */
export function notifyPlayersAboutPlanChange(sessionId: string): void {
  getSessionWithGroupMembers(sessionId, 'player').then((session) => {
    if (!session) return;
    const playerIds = session.group.members.map((m) => m.userId);
    const dateStr = formatSessionDate(session.sessionDate);
    sendPushNotification(
      playerIds,
      'Trainingsplan geändert',
      `Der Trainingsplan für ${dateStr} wurde aktualisiert.`,
      '/trainingsplan'
    );
  });
}

/**
 * Notify all trainers in the session's group that a player changed their attendance.
 * Fire-and-forget — does not block the caller.
 */
export function notifyTrainersAboutAttendanceChange(sessionId: string, playerDisplayName: string): void {
  getSessionWithGroupMembers(sessionId, 'trainer').then((session) => {
    if (!session) return;
    const trainerIds = session.group.members.map((m) => m.userId);
    const dateStr = formatSessionDate(session.sessionDate);
    sendPushNotification(
      trainerIds,
      'Anwesenheit aktualisiert',
      `${playerDisplayName} hat die Anwesenheit für ${dateStr} geändert.`,
      '/trainingsplan'
    );
  });
}

/** Helper functions for team chat API routes */
import type { ChatMessage } from '@/lib/types';

/** DB record shape returned by Prisma with user relation */
interface ChatMessageRecord {
  id: string;
  teamId: string;
  userId: string;
  content: string | null;
  imageId: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    username: string;
    displayName: string;
  };
}

/** Maps a Prisma ChatMessage record (with user relation) to the API response shape */
export function buildChatResponse(record: ChatMessageRecord): ChatMessage {
  return {
    id: record.id,
    teamId: record.teamId,
    userId: record.userId,
    username: record.user.username,
    displayName: record.user.displayName,
    content: record.content,
    imageId: record.imageId,
    createdAt: record.createdAt.toISOString(),
    isEdited: record.updatedAt.getTime() !== record.createdAt.getTime(),
  };
}

/** Checks whether a user is allowed to delete a given chat message */
export function canDeleteMessage(
  requestUserId: string,
  messageUserId: string,
  isTrainer: boolean
): boolean {
  return requestUserId === messageUserId || isTrainer;
}

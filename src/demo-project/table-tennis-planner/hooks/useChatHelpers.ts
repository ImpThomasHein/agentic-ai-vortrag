/** Pure helper functions for the useChat hook */
import type { ChatMessage } from '@/lib/types';

/** Merges two message arrays, deduplicates by id, and sorts by createdAt ascending */
export function mergeMessages(existing: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] {
  const map = new Map<string, ChatMessage>();
  for (const msg of existing) map.set(msg.id, msg);
  for (const msg of incoming) map.set(msg.id, msg);
  return Array.from(map.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

/** Returns true if a date separator should be shown between two messages */
export function shouldShowDateSeparator(
  prevCreatedAt: string | null,
  currentCreatedAt: string
): boolean {
  if (prevCreatedAt === null) return true;
  const prevDate = new Date(prevCreatedAt).toDateString();
  const currentDate = new Date(currentCreatedAt).toDateString();
  return prevDate !== currentDate;
}

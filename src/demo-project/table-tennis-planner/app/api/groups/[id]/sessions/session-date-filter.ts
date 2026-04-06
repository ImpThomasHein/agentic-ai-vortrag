/** Builds a Prisma date filter that only includes sessions from today onwards. */
export function buildSessionDateFilter(now: Date = new Date()): { gte: Date } {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return { gte: today };
}

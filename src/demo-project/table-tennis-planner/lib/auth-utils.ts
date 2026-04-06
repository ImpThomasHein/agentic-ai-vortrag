/**
 * Shared authorization utilities for team access checks.
 * Centralizes the "team member OR trainer" access pattern used across API routes.
 */
import { getPrisma } from '@/lib/db';

interface SessionLike {
  userId?: string;
  role?: string;
}

/**
 * Checks whether a user has access to a team.
 * Access is granted if the user is a team member OR has the trainer role.
 * Returns true if the user has access, false otherwise.
 */
export async function hasUserAccessToTeam(teamId: string, session: SessionLike): Promise<boolean> {
  if (!session.userId) return false;

  if (session.role === 'trainer') return true;

  const prisma = await getPrisma();
  const membership = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId: session.userId } },
  });

  return membership !== null;
}

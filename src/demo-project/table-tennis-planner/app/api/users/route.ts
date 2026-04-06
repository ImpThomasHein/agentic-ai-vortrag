import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    include: {
      roles: { include: { userRole: true } },
      groupMembers: { include: { group: true } },
      teamMembers: { include: { team: { select: { id: true, name: true } } } },
    },
    orderBy: { displayName: 'asc' },
  });

  type UserRow = (typeof users)[number];
  type RoleRow = UserRow['roles'][number];
  type MemberRow = UserRow['groupMembers'][number];
  type TeamMemberRow = UserRow['teamMembers'][number];

  const result = users.map((user: UserRow) => ({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    email: user.email ?? null,
    roles: user.roles.map((r: RoleRow) => r.userRole.name),
    groups: user.groupMembers.map((gm: MemberRow) => ({
      groupId: gm.groupId,
      groupName: gm.group.name,
      memberRole: gm.role,
    })),
    teams: user.teamMembers.map((tm: TeamMemberRow) => ({
      teamId: tm.team.id,
      teamName: tm.team.name,
    })),
  }));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  try {
    const { username, displayName, password, email } = await request.json();

    if (!username || !displayName || !password) {
      return NextResponse.json({ error: 'Alle Felder sind erforderlich' }, { status: 400 });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Ungültiges E-Mail-Format' }, { status: 400 });
    }

    const normalizedUsername = username.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { username: normalizedUsername } });
    if (existing) {
      return NextResponse.json({ error: 'Loginname bereits vergeben' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const playerRole = await prisma.userRole.upsert({
      where: { name: 'player' },
      update: {},
      create: { name: 'player', description: 'Spieler' },
    });

    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { username: normalizedUsername, displayName: displayName.trim(), passwordHash, email: email?.trim() || null },
      });
      await tx.role.create({ data: { userId: user.id, userRoleId: playerRole.id } });
      return user;
    });

    return NextResponse.json(
      { id: newUser.id, username: newUser.username, displayName: newUser.displayName, email: newUser.email ?? null, roles: ['player'], groups: [], teams: [] },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

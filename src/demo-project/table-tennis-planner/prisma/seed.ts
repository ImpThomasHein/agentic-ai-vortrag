import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import exercisesData from "../data/exercises.json";
import fs from "fs";
import path from "path";

// Inline slugify + generateMatchId to avoid @/ path alias issues in ts-node
function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateMatchId(
  date: string,
  homeTeam: string,
  awayTeam: string,
): string {
  return slugify(`${date}_${homeTeam}_${awayTeam}`);
}

interface ParsedMember {
  firstName: string;
  lastName: string;
  username: string;
  displayName: string;
}

const TRAINER_NAMES = ["thomas.hein"];

function parseMembersFile(filePath: string): ParsedMember[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").slice(1); // Skip header
  const members: ParsedMember[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Format: "Nachname, Vorname [optional date]"
    const match = trimmed.match(
      /^([^,]+),\s*(.+?)(?:\s+\d{2}\.\d{2}\.\d{4})?\s*$/,
    );
    if (!match) continue;

    const lastName = match[1].trim();
    let firstName = match[2].trim();

    // Compound first names: only first part ("Jordan Charlize" → "Jordan")
    if (firstName.includes(" ")) {
      firstName = firstName.split(" ")[0];
    }

    // Hyphenated first names: only first part ("Karl-Ernst" → "Karl")
    if (firstName.includes("-")) {
      firstName = firstName.split("-")[0];
    }

    const username = `${firstName}.${lastName}`
      .toLowerCase()
      .replace(/é/g, "e");
    const displayName = `${firstName} ${lastName}`;

    members.push({ firstName, lastName, username, displayName });
  }

  return members;
}

// Creates Prisma client for either SQLite (dev) or PostgreSQL (production)
function createSeedClient(): PrismaClient {
  const url = process.env.DATABASE_URL!;
  if (url.startsWith("file:")) {
    const adapter = new PrismaLibSql({ url });
    return new PrismaClient({ adapter }) as unknown as PrismaClient;
  }
  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({ adapter }) as unknown as PrismaClient;
}

const prisma = createSeedClient();

async function main() {
  console.log("Seed wird ausgeführt...");

  // 1. Rollen anlegen
  const trainerRole = await prisma.userRole.upsert({
    where: { name: "trainer" },
    update: {},
    create: { name: "trainer", description: "Trainingsleiter" },
  });

  const playerRole = await prisma.userRole.upsert({
    where: { name: "player" },
    update: {},
    create: { name: "player", description: "Spieler" },
  });

  console.log("Rollen angelegt:", trainerRole.name, playerRole.name);

  // 2. Users anlegen
  const trainerPasswordHash = await bcrypt.hash("trainer123", 10);
  const maxPasswordHash = await bcrypt.hash("max123", 10);
  const lisaPasswordHash = await bcrypt.hash("lisa123", 10);

  const trainerUser = await prisma.user.upsert({
    where: { username: "trainer" },
    update: {},
    create: {
      username: "trainer",
      passwordHash: trainerPasswordHash,
      displayName: "Thomas Müller",
      roles: { create: { userRoleId: trainerRole.id } },
    },
  });

  const maxUser = await prisma.user.upsert({
    where: { username: "max" },
    update: {},
    create: {
      username: "max",
      passwordHash: maxPasswordHash,
      displayName: "Max Schneider",
      roles: { create: { userRoleId: playerRole.id } },
    },
  });

  const lisaUser = await prisma.user.upsert({
    where: { username: "lisa" },
    update: {},
    create: {
      username: "lisa",
      passwordHash: lisaPasswordHash,
      displayName: "Lisa Weber",
      roles: { create: { userRoleId: playerRole.id } },
    },
  });

  console.log(
    "Users angelegt:",
    trainerUser.username,
    maxUser.username,
    lisaUser.username,
  );

  // 3. Übungen aus exercises.json importieren
  for (const exercise of exercisesData.exercises) {
    await prisma.exercise.upsert({
      where: { id: exercise.id },
      update: {
        name: exercise.name,
        description: exercise.description,
        hints: exercise.hints ?? [],
        category: exercise.category,
        difficulty: exercise.difficulty,
        ttrMin: exercise.ttrRange.min,
        ttrMax: exercise.ttrRange.max,
        durationMinutes: exercise.duration ?? null,
        diagram: exercise.diagram as object,
        tags: exercise.tags ?? [],
        createdById: trainerUser.id,
      },
      create: {
        id: exercise.id,
        name: exercise.name,
        description: exercise.description,
        hints: exercise.hints ?? [],
        category: exercise.category,
        difficulty: exercise.difficulty,
        ttrMin: exercise.ttrRange.min,
        ttrMax: exercise.ttrRange.max,
        durationMinutes: exercise.duration ?? null,
        diagram: exercise.diagram as object,
        tags: exercise.tags ?? [],
        createdById: trainerUser.id,
      },
    });
  }

  console.log(`${exercisesData.exercises.length} Übungen importiert.`);

  // 3b. Sample trainer notes
  const sampleNotes = [
    {
      name: "Erwärmung: Laufen und Dehnen",
      type: "note",
      description:
        "10 Minuten lockeres Einlaufen um die Tische, danach Dehnübungen für Schultern, Arme und Beine. Anschließend 5 Minuten Einspielen mit dem Partner.",
      category: "notiz",
      difficulty: "beginner",
      ttrMin: 0,
      ttrMax: 2500,
      hints: [],
      diagram: { trajectories: [], playerPositions: [] },
      tags: [],
      createdById: trainerUser.id,
    },
    {
      name: "Abschlussspiel: Rundlauf",
      type: "note",
      description:
        "Klassischer Rundlauf mit allen Spielern. Wer ausscheidet, macht 10 Liegestütze. Letzte zwei Spieler spielen das Finale (Best of 3).",
      category: "notiz",
      difficulty: "beginner",
      ttrMin: 0,
      ttrMax: 2500,
      hints: [],
      diagram: { trajectories: [], playerPositions: [] },
      tags: [],
      createdById: trainerUser.id,
    },
  ];

  for (const note of sampleNotes) {
    await prisma.exercise.create({ data: note });
  }

  console.log(`${sampleNotes.length} Beispiel-Notizen angelegt.`);

  // 4. Gruppen anlegen
  const groupErwachsene = await prisma.group.upsert({
    where: { name: "Erwachsene" },
    update: {},
    create: { name: "Erwachsene", description: "Erwachsenengruppe" },
  });

  const groupSchueler = await prisma.group.upsert({
    where: { name: "Schüler" },
    update: {},
    create: { name: "Schüler", description: "Schülergruppe" },
  });

  console.log("Gruppen angelegt:", groupErwachsene.name, groupSchueler.name);

  // 5. Trainingspläne (Wochentage)
  await prisma.trainingSchedule.upsert({
    where: { groupId: groupErwachsene.id },
    update: { weekdays: [2, 4] }, // Dienstag, Donnerstag
    create: { groupId: groupErwachsene.id, weekdays: [2, 4] },
  });

  await prisma.trainingSchedule.upsert({
    where: { groupId: groupSchueler.id },
    update: { weekdays: [1, 3] }, // Montag, Mittwoch
    create: { groupId: groupSchueler.id, weekdays: [1, 3] },
  });

  // 6. Gruppenmitglieder
  // Trainer in beiden Gruppen
  await prisma.groupMember.upsert({
    where: {
      groupId_userId: { groupId: groupErwachsene.id, userId: trainerUser.id },
    },
    update: {},
    create: {
      groupId: groupErwachsene.id,
      userId: trainerUser.id,
      role: "trainer",
    },
  });

  await prisma.groupMember.upsert({
    where: {
      groupId_userId: { groupId: groupSchueler.id, userId: trainerUser.id },
    },
    update: {},
    create: {
      groupId: groupSchueler.id,
      userId: trainerUser.id,
      role: "trainer",
    },
  });

  // Max in Erwachsene, Lisa in Schüler
  await prisma.groupMember.upsert({
    where: {
      groupId_userId: { groupId: groupErwachsene.id, userId: maxUser.id },
    },
    update: {},
    create: { groupId: groupErwachsene.id, userId: maxUser.id, role: "player" },
  });

  await prisma.groupMember.upsert({
    where: {
      groupId_userId: { groupId: groupSchueler.id, userId: lisaUser.id },
    },
    update: {},
    create: { groupId: groupSchueler.id, userId: lisaUser.id, role: "player" },
  });

  console.log("Gruppenmitglieder zugeordnet.");

  // 6b. Mitglieder aus members.txt importieren (optional, file may not exist in CI)
  const membersFilePath = path.join(__dirname, "..", "data", "members.txt");
  const members = fs.existsSync(membersFilePath)
    ? parseMembersFile(membersFilePath)
    : [];

  let memberCount = 0;
  for (const member of members) {
    const passwordHash = await bcrypt.hash(member.username, 10);
    const isTrainer = TRAINER_NAMES.includes(member.username);

    const user = await prisma.user.upsert({
      where: { username: member.username },
      update: {},
      create: {
        username: member.username,
        passwordHash,
        displayName: member.displayName,
        roles: {
          create: { userRoleId: isTrainer ? trainerRole.id : playerRole.id },
        },
      },
    });

    await prisma.groupMember.upsert({
      where: { groupId_userId: { groupId: groupSchueler.id, userId: user.id } },
      update: {},
      create: {
        groupId: groupSchueler.id,
        userId: user.id,
        role: isTrainer ? "trainer" : "player",
      },
    });

    memberCount++;
  }

  console.log(
    `${memberCount} Mitglieder aus members.txt importiert (${TRAINER_NAMES.length} Trainer).`,
  );

  // 7. Trainingsessions anlegen (nächste 2 Termine pro Gruppe ab 2026-02-22)
  // Schüler: Montag 23.02, Mittwoch 25.02
  // Erwachsene: Dienstag 24.02, Donnerstag 26.02
  const sessionSchueler1 = await prisma.trainingSession.upsert({
    where: {
      groupId_sessionDate: {
        groupId: groupSchueler.id,
        sessionDate: new Date("2026-02-23T00:00:00.000Z"),
      },
    },
    update: { notes: "Fokus: Grundtechniken" },
    create: {
      groupId: groupSchueler.id,
      sessionDate: new Date("2026-02-23T00:00:00.000Z"),
      notes: "Fokus: Grundtechniken",
    },
  });

  const sessionSchueler2 = await prisma.trainingSession.upsert({
    where: {
      groupId_sessionDate: {
        groupId: groupSchueler.id,
        sessionDate: new Date("2026-02-25T00:00:00.000Z"),
      },
    },
    update: { notes: "Fokus: Beinarbeit" },
    create: {
      groupId: groupSchueler.id,
      sessionDate: new Date("2026-02-25T00:00:00.000Z"),
      notes: "Fokus: Beinarbeit",
    },
  });

  const sessionErwachsene1 = await prisma.trainingSession.upsert({
    where: {
      groupId_sessionDate: {
        groupId: groupErwachsene.id,
        sessionDate: new Date("2026-02-24T00:00:00.000Z"),
      },
    },
    update: { notes: "Fokus: Aufschlagvariationen" },
    create: {
      groupId: groupErwachsene.id,
      sessionDate: new Date("2026-02-24T00:00:00.000Z"),
      notes: "Fokus: Aufschlagvariationen",
    },
  });

  const sessionErwachsene2 = await prisma.trainingSession.upsert({
    where: {
      groupId_sessionDate: {
        groupId: groupErwachsene.id,
        sessionDate: new Date("2026-02-26T00:00:00.000Z"),
      },
    },
    update: { notes: "Fokus: Topspintraining" },
    create: {
      groupId: groupErwachsene.id,
      sessionDate: new Date("2026-02-26T00:00:00.000Z"),
      notes: "Fokus: Topspintraining",
    },
  });

  console.log("Trainingsessions angelegt.");

  // 8. Übungen den Sessions zuordnen
  const assignmentData = [
    // Schüler Mo
    { sessionId: sessionSchueler1.id, exerciseId: "bein-001", sortOrder: 1 },
    { sessionId: sessionSchueler1.id, exerciseId: "bein-002", sortOrder: 2 },
    { sessionId: sessionSchueler1.id, exerciseId: "bein-003", sortOrder: 3 },
    // Schüler Mi
    { sessionId: sessionSchueler2.id, exerciseId: "bein-002", sortOrder: 1 },
    { sessionId: sessionSchueler2.id, exerciseId: "bein-003", sortOrder: 2 },
    { sessionId: sessionSchueler2.id, exerciseId: "bein-004", sortOrder: 3 },
    // Erwachsene Di
    { sessionId: sessionErwachsene1.id, exerciseId: "bein-001", sortOrder: 1 },
    { sessionId: sessionErwachsene1.id, exerciseId: "bein-003", sortOrder: 2 },
    { sessionId: sessionErwachsene1.id, exerciseId: "bein-005", sortOrder: 3 },
    // Erwachsene Do
    { sessionId: sessionErwachsene2.id, exerciseId: "bein-002", sortOrder: 1 },
    { sessionId: sessionErwachsene2.id, exerciseId: "bein-004", sortOrder: 2 },
    { sessionId: sessionErwachsene2.id, exerciseId: "bein-005", sortOrder: 3 },
  ];

  for (const data of assignmentData) {
    await prisma.trainingAssignment.upsert({
      where: {
        sessionId_exerciseId: {
          sessionId: data.sessionId,
          exerciseId: data.exerciseId,
        },
      },
      update: { sortOrder: data.sortOrder },
      create: data,
    });
  }

  console.log("Übungen den Sessions zugeordnet.");

  // 9. Mannschaften anlegen
  const teamHerren1 = await prisma.team.upsert({
    where: { name: "Herren 1" },
    update: {},
    create: {
      name: "Herren 1",
      clickTtUrl:
        "https://www.mytischtennis.de/click-tt/TTVB/25--26/ligen/Kreisliga/gruppe/493601/tabelle/gesamt",
      leagueData: JSON.stringify({
        standings: [
          {
            rank: 1,
            teamName: "TTC Rotation Leegebruch",
            matchesPlayed: 16,
            wins: 14,
            draws: 0,
            losses: 2,
            games: "101:59",
            difference: 42,
            points: "28:4",
          },
          {
            rank: 2,
            teamName: "SG Empor Oranienburg",
            matchesPlayed: 13,
            wins: 10,
            draws: 2,
            losses: 1,
            games: "92:38",
            difference: 54,
            points: "22:4",
          },
          {
            rank: 3,
            teamName: "TT-Freunde Bötzow II",
            matchesPlayed: 13,
            wins: 10,
            draws: 1,
            losses: 2,
            games: "86:44",
            difference: 42,
            points: "21:5",
          },
          {
            rank: 4,
            teamName: "Hohen Neuendorfer SV II",
            matchesPlayed: 15,
            wins: 7,
            draws: 2,
            losses: 6,
            games: "84:66",
            difference: 18,
            points: "16:14",
          },
          {
            rank: 5,
            teamName: "TT-Freunde Bötzow",
            matchesPlayed: 13,
            wins: 6,
            draws: 2,
            losses: 5,
            games: "67:63",
            difference: 4,
            points: "14:12",
          },
        ],
        matches: [
          {
            matchId: generateMatchId(
              "2026-03-15",
              "TTC Rotation Leegebruch",
              "SG Empor Oranienburg",
            ),
            date: "2026-03-15",
            time: "18:00",
            homeTeam: "TTC Rotation Leegebruch",
            awayTeam: "SG Empor Oranienburg",
            score: null,
            isHome: false,
            isCompleted: false,
          },
          {
            matchId: generateMatchId(
              "2026-03-22",
              "TT-Freunde Bötzow II",
              "TTC Rotation Leegebruch",
            ),
            date: "2026-03-22",
            time: "10:00",
            homeTeam: "TT-Freunde Bötzow II",
            awayTeam: "TTC Rotation Leegebruch",
            score: null,
            isHome: false,
            isCompleted: false,
          },
          {
            matchId: generateMatchId(
              "2026-02-28",
              "TTC Rotation Leegebruch",
              "Hohen Neuendorfer SV II",
            ),
            date: "2026-02-28",
            time: "18:00",
            homeTeam: "TTC Rotation Leegebruch",
            awayTeam: "Hohen Neuendorfer SV II",
            score: "9:1",
            isHome: true,
            isCompleted: true,
          },
          {
            matchId: generateMatchId(
              "2026-02-15",
              "SG Empor Oranienburg",
              "TTC Rotation Leegebruch",
            ),
            date: "2026-02-15",
            time: "10:00",
            homeTeam: "SG Empor Oranienburg",
            awayTeam: "TTC Rotation Leegebruch",
            score: "5:9",
            isHome: false,
            isCompleted: true,
          },
        ],
        clickTtTeamName: "TT-Freunde Bötzow",
      }),
      lastSync: new Date(),
    },
  });

  // Trainer + Max in Herren 1 (trainer is captain)
  await prisma.teamMember.upsert({
    where: {
      teamId_userId: { teamId: teamHerren1.id, userId: trainerUser.id },
    },
    update: {},
    create: { teamId: teamHerren1.id, userId: trainerUser.id, role: "captain" },
  });

  await prisma.teamMember.upsert({
    where: { teamId_userId: { teamId: teamHerren1.id, userId: maxUser.id } },
    update: {},
    create: { teamId: teamHerren1.id, userId: maxUser.id },
  });

  console.log('Mannschaft "Herren 1" mit Mitgliedern angelegt.');

  // 10. Sample MatchAvailability and MatchLineup for the first upcoming match (2026-03-15)
  const firstUpcomingMatchId = generateMatchId(
    "2026-03-15",
    "TTC Rotation Leegebruch",
    "SG Empor Oranienburg",
  );

  await prisma.matchAvailability.upsert({
    where: {
      teamId_matchId_userId: {
        teamId: teamHerren1.id,
        matchId: firstUpcomingMatchId,
        userId: trainerUser.id,
      },
    },
    update: {},
    create: {
      teamId: teamHerren1.id,
      matchId: firstUpcomingMatchId,
      userId: trainerUser.id,
      status: "yes",
      canDrive: true,
    },
  });

  await prisma.matchAvailability.upsert({
    where: {
      teamId_matchId_userId: {
        teamId: teamHerren1.id,
        matchId: firstUpcomingMatchId,
        userId: maxUser.id,
      },
    },
    update: {},
    create: {
      teamId: teamHerren1.id,
      matchId: firstUpcomingMatchId,
      userId: maxUser.id,
      status: "yes",
      canDrive: false,
    },
  });

  await prisma.matchLineup.upsert({
    where: {
      teamId_matchId_userId: {
        teamId: teamHerren1.id,
        matchId: firstUpcomingMatchId,
        userId: trainerUser.id,
      },
    },
    update: {},
    create: {
      teamId: teamHerren1.id,
      matchId: firstUpcomingMatchId,
      userId: trainerUser.id,
      isDriver: true,
    },
  });

  await prisma.matchLineup.upsert({
    where: {
      teamId_matchId_userId: {
        teamId: teamHerren1.id,
        matchId: firstUpcomingMatchId,
        userId: maxUser.id,
      },
    },
    update: {},
    create: {
      teamId: teamHerren1.id,
      matchId: firstUpcomingMatchId,
      userId: maxUser.id,
      isDriver: false,
    },
  });

  console.log(
    `Sample MatchAvailability und MatchLineup für matchId "${firstUpcomingMatchId}" angelegt.`,
  );

  console.log("");
  console.log("=== Seed abgeschlossen ===");
  console.log("Zugangsdaten (Testbenutzer):");
  console.log("  trainer / trainer123  →  Trainer (beide Gruppen)");
  console.log("  max     / max123      →  Spieler (Erwachsene)");
  console.log("  lisa    / lisa123     →  Spieler (Schüler)");
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

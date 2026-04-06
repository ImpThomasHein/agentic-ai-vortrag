import type { Exercise, ComputedTrainingDay, TrainingDayAssignment, PlayerListItem, GroupSummary, TrainingSessionSummary, LeagueStanding, LeagueMatch, TeamMember } from '@/lib/types';

// ─── Exercises ───────────────────────────────────────────────────────────────

export const falkenbergExercise: Exercise = {
  id: 'bein-003',
  name: 'Falkenberg (2-1)',
  description:
    'Klassiker: Partner blockt 2x in RH-Ecke, 1x in VH-Ecke. Spieler spielt RH-Topspin, VH-Topspin aus Mitte, VH-Topspin aus VH-Ecke.',
  hints: [
    'Nach RH-Topspin sofort Ausfallschritt',
    'VH aus Mitte mit Gewichtsverlagerung',
    'Zurück in Mitte',
  ],
  category: 'beinarbeit',
  difficulty: 'intermediate',
  ttrRange: { min: 1000, max: 1500 },
  duration: 15,
  diagram: {
    trajectories: [
      { id: 'o1', startX: 50, startY: 15, endX: 25, endY: 85, type: 'block', player: 'opponent', stroke: 'BL', order: 1 },
      { id: 't1', startX: 25, startY: 85, endX: 50, endY: 15, type: 'topspin', player: 'self', stroke: 'RH', order: 2 },
      { id: 'o2', startX: 50, startY: 15, endX: 50, endY: 85, type: 'block', player: 'opponent', stroke: 'BL', order: 3 },
      { id: 't2', startX: 50, startY: 85, endX: 50, endY: 15, type: 'topspin', player: 'self', stroke: 'VH', order: 4 },
      { id: 'o3', startX: 50, startY: 15, endX: 75, endY: 85, type: 'block', player: 'opponent', stroke: 'BL', order: 5 },
      { id: 't3', startX: 75, startY: 85, endX: 50, endY: 15, type: 'topspin', player: 'self', stroke: 'VH', order: 6 },
    ],
  },
  tags: ['falkenberg', 'beinarbeit', 'klassiker'],
};

export const topspinExercise: Exercise = {
  id: 'top-003',
  name: 'VH-Topspin gegen Block diagonal',
  description:
    'Partner blockt stabil diagonal, Spieler spielt VH-Topspin-Serie diagonal. Fokus auf Kontinuität und gleichbleibende Qualität.',
  hints: ['Nach jedem Schlag Grundstellung', 'Mehr Spin als Tempo', 'Gewicht verlagern'],
  category: 'topspin',
  difficulty: 'intermediate',
  ttrRange: { min: 1000, max: 1500 },
  duration: 15,
  diagram: {
    trajectories: [
      { id: 'o1', startX: 25, startY: 15, endX: 75, endY: 85, type: 'block', player: 'opponent', stroke: 'BL', order: 1 },
      { id: 't1', startX: 75, startY: 85, endX: 25, endY: 15, type: 'topspin', player: 'self', stroke: 'VH', order: 2 },
    ],
  },
};

export const aufschlagExercise: Exercise = {
  id: 'auf-006',
  name: 'Aufschlag-Variation mit gleichem Bewegungsablauf',
  description:
    'Gleiche Aufschlagbewegung, aber Wechsel zwischen Unterschnitt, Überschnitt und leerem Aufschlag. Partner muss den Schnitt erraten.',
  hints: ['Handgelenk variiert minimal', 'Bewegungsablauf identisch', 'Partner rät den Schnitt'],
  category: 'aufschlag-rueckschlag',
  difficulty: 'advanced',
  ttrRange: { min: 1400, max: 2000 },
  duration: 15,
  diagram: {
    trajectories: [
      { id: 't1', startX: 45, startY: 85, endX: 40, endY: 42, type: 'backspin', player: 'self', stroke: 'RH', order: 1 },
      { id: 't2', startX: 50, startY: 85, endX: 50, endY: 40, type: 'topspin', player: 'self', stroke: 'RH', order: 2 },
    ],
  },
};

export const blockExercise: Exercise = {
  id: 'block-004',
  name: 'Chopblock',
  description:
    'Auf Topspin mit Chopblock antworten: kurze Abwärtsbewegung erzeugt überraschenden Unterschnitt. Taktisches Überraschungselement.',
  hints: ['Kurze Abwärtsbewegung', 'Timing exakt', 'Sparsam einsetzen'],
  category: 'block',
  difficulty: 'advanced',
  ttrRange: { min: 1400, max: 2000 },
  duration: 10,
  diagram: {
    trajectories: [
      { id: 'o1', startX: 75, startY: 15, endX: 30, endY: 85, type: 'topspin', player: 'opponent', stroke: 'VH', order: 1 },
      { id: 't1', startX: 30, startY: 85, endX: 60, endY: 25, type: 'backspin', player: 'self', stroke: 'RH', order: 2 },
    ],
  },
};

export const mockExercises: Exercise[] = [
  falkenbergExercise,
  topspinExercise,
  aufschlagExercise,
  blockExercise,
];

// ─── Training Days ────────────────────────────────────────────────────────────

// Referenz: Heute = 2026-02-22 (Sonntag)
const monday = new Date('2026-02-23');
const wednesday = new Date('2026-02-25');
const friday = new Date('2026-02-27');

export const mockUpcomingDays: ComputedTrainingDay[] = [
  {
    date: monday,
    dateString: '2026-02-23',
    weekday: 1,
    weekdayLabel: 'Montag',
    displayLabel: 'Montag, 23.02.',
    exerciseIds: ['bein-003'],
    isToday: false,
    isPast: false,
  },
  {
    date: wednesday,
    dateString: '2026-02-25',
    weekday: 3,
    weekdayLabel: 'Mittwoch',
    displayLabel: 'Mittwoch, 25.02.',
    exerciseIds: [],
    isToday: false,
    isPast: false,
  },
  {
    date: friday,
    dateString: '2026-02-27',
    weekday: 5,
    weekdayLabel: 'Freitag',
    displayLabel: 'Freitag, 27.02.',
    exerciseIds: ['top-003', 'bein-003'],
    isToday: false,
    isPast: false,
  },
];

export const mockAssignments: TrainingDayAssignment[] = [
  {
    id: 'assign-001',
    exerciseId: 'bein-003',
    trainingDate: '2026-02-23',
    weekday: 1,
    createdAt: Date.now(),
  },
  {
    id: 'assign-002',
    exerciseId: 'top-003',
    trainingDate: '2026-02-27',
    weekday: 5,
    createdAt: Date.now(),
  },
  {
    id: 'assign-003',
    exerciseId: 'bein-003',
    trainingDate: '2026-02-27',
    weekday: 5,
    createdAt: Date.now(),
  },
];

// ─── Users ────────────────────────────────────────────────────────────────────

export const mockTrainerUser = {
  username: 'trainer',
  role: 'trainer' as const,
  displayName: 'Trainer',
  displayInitial: 'T',
};

export const mockPlayerUser = {
  username: 'player',
  role: 'player' as const,
  displayName: 'Spieler',
  displayInitial: 'S',
};

// ─── Vote counts ──────────────────────────────────────────────────────────────

export const mockVoteCounts: Record<string, number> = {
  'bein-003': 5,
  'top-003': 3,
  'auf-006': 1,
  'block-004': 0,
};

export const mockVoteCountFn = (exerciseId: string): number =>
  mockVoteCounts[exerciseId] ?? 0;

// ─── Groups ───────────────────────────────────────────────────────────────────

export const mockGroups: GroupSummary[] = [
  { id: 'g1', name: 'Jugend', description: 'Jugendgruppe' },
  { id: 'g2', name: 'Herren 1', description: 'Erste Herrenmannschaft' },
  { id: 'g3', name: 'Damen', description: null },
];

// ─── Players ──────────────────────────────────────────────────────────────────

export const mockPlayers: PlayerListItem[] = [
  {
    id: 'user-p1',
    username: 'anna.mueller',
    displayName: 'Anna Müller',
    email: 'anna@example.com',
    roles: ['player'],
    groups: [{ groupId: 'g1', groupName: 'Jugend', memberRole: 'player' }],
    teams: [{ teamId: 'team-1', teamName: 'Herren 1' }],
  },
  {
    id: 'user-p2',
    username: 'ben.schmidt',
    displayName: 'Ben Schmidt',
    email: null,
    roles: ['player'],
    groups: [],
    teams: [],
  },
  {
    id: 'user-p3',
    username: 'clara.koch',
    displayName: 'Clara Koch',
    email: 'clara.koch@gmail.com',
    roles: ['player'],
    groups: [
      { groupId: 'g1', groupName: 'Jugend', memberRole: 'player' },
      { groupId: 'g2', groupName: 'Herren 1', memberRole: 'player' },
    ],
    teams: [
      { teamId: 'team-1', teamName: 'Herren 1' },
      { teamId: 'team-2', teamName: 'Herren 2' },
    ],
  },
];

// ─── Upcoming Sessions ────────────────────────────────────────────────────────

// ─── League / Team ───────────────────────────────────────────────────────────

export const mockStandings: LeagueStanding[] = [
  { rank: 1, teamName: 'TTC Rotation Leegebruch', matchesPlayed: 16, wins: 14, draws: 0, losses: 2, games: '101:59', difference: 42, points: '28:4' },
  { rank: 2, teamName: 'SG Empor Oranienburg', matchesPlayed: 13, wins: 10, draws: 2, losses: 1, games: '92:38', difference: 54, points: '22:4' },
  { rank: 3, teamName: 'TT-Freunde Bötzow II', matchesPlayed: 13, wins: 10, draws: 1, losses: 2, games: '86:44', difference: 42, points: '21:5' },
  { rank: 4, teamName: 'Hohen Neuendorfer SV II', matchesPlayed: 15, wins: 7, draws: 2, losses: 6, games: '84:66', difference: 18, points: '16:14' },
  { rank: 5, teamName: 'TT-Freunde Bötzow', matchesPlayed: 13, wins: 6, draws: 2, losses: 5, games: '67:63', difference: 4, points: '14:12' },
  { rank: 6, teamName: 'Hohen Neuendorfer SV III', matchesPlayed: 16, wins: 4, draws: 3, losses: 9, games: '69:91', difference: -22, points: '11:21' },
  { rank: 7, teamName: 'TTV Fürstenberg/Havel', matchesPlayed: 12, wins: 4, draws: 2, losses: 6, games: '49:71', difference: -22, points: '10:14' },
  { rank: 8, teamName: 'The Eagles III', matchesPlayed: 12, wins: 2, draws: 1, losses: 9, games: '44:76', difference: -32, points: '5:19' },
  { rank: 9, teamName: 'Motor Hennigsdorf', matchesPlayed: 12, wins: 2, draws: 1, losses: 9, games: '41:79', difference: -38, points: '5:19' },
  { rank: 10, teamName: 'TTC Ofenstadt Velten', matchesPlayed: 14, wins: 1, draws: 2, losses: 11, games: '47:93', difference: -46, points: '4:24' },
];

export const mockMatches: LeagueMatch[] = [
  { date: '2026-02-15', time: '10:00', homeTeam: 'SG Empor Oranienburg', awayTeam: 'TTC Rotation Leegebruch', score: '5:9', isHome: false, isCompleted: true },
  { date: '2026-02-28', time: '18:00', homeTeam: 'TTC Rotation Leegebruch', awayTeam: 'Hohen Neuendorfer SV II', score: '9:1', isHome: true, isCompleted: true },
  { date: '2026-03-15', time: '18:00', homeTeam: 'TTC Rotation Leegebruch', awayTeam: 'SG Empor Oranienburg', score: null, isHome: true, isCompleted: false },
  { date: '2026-03-22', time: '10:00', homeTeam: 'TT-Freunde Bötzow II', awayTeam: 'TTC Rotation Leegebruch', score: null, isHome: false, isCompleted: false },
  { date: '2026-04-05', time: '18:00', homeTeam: 'TTC Rotation Leegebruch', awayTeam: 'Motor Hennigsdorf', score: null, isHome: true, isCompleted: false },
];

export const mockTeamMembers: TeamMember[] = [
  { id: 'tm-1', teamId: 'team-1', userId: 'user-t1', username: 'trainer', displayName: 'Thomas Müller', role: 'captain' },
  { id: 'tm-2', teamId: 'team-1', userId: 'user-p1', username: 'max', displayName: 'Max Schneider', role: 'player' },
  { id: 'tm-3', teamId: 'team-1', userId: 'user-p2', username: 'anna.mueller', displayName: 'Anna Müller', role: 'player' },
  { id: 'tm-4', teamId: 'team-1', userId: 'user-p3', username: 'ben.schmidt', displayName: 'Ben Schmidt', role: 'player' },
];

// ─── Available Players (for add-to-team dropdown) ────────────────────────────

export const mockAvailablePlayers = [
  { id: 'user-p4', username: 'clara.koch', displayName: 'Clara Koch' },
  { id: 'user-p5', username: 'david.braun', displayName: 'David Braun' },
  { id: 'user-p6', username: 'eva.wolf', displayName: 'Eva Wolf' },
];

// ─── Upcoming Sessions ────────────────────────────────────────────────────────

export const mockUpcomingSessions: TrainingSessionSummary[] = [
  {
    id: 'session-1',
    groupId: 'g1',
    sessionDate: '2026-03-02',
    notes: null,
    _count: { assignments: 2, votes: 3, attendance: 2 },
  },
  {
    id: 'session-2',
    groupId: 'g1',
    sessionDate: '2026-03-04',
    notes: null,
    _count: { assignments: 0, votes: 0, attendance: 0 },
  },
  {
    id: 'session-3',
    groupId: 'g1',
    sessionDate: '2026-03-07',
    notes: null,
    _count: { assignments: 1, votes: 1, attendance: 0 },
  },
  {
    id: 'session-4',
    groupId: 'g1',
    sessionDate: '2026-03-09',
    notes: null,
    _count: { assignments: 0, votes: 0, attendance: 0 },
  },
];

// Gruppe (aus DB)
export interface Group {
  id: string;
  name: string;
  description: string | null;
  myRole: 'trainer' | 'player';
}

// Schwierigkeitsgrade basierend auf TTR-Punkten
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Exercise type discriminator
export type ExerciseType = 'exercise' | 'note';

// Form data for creating/editing a note
export interface NoteFormData {
  name: string;        // Title of the note
  description: string; // Description text
}

// Übungskategorien
export type ExerciseCategory =
  | 'aufschlag-rueckschlag'
  | 'topspin'
  | 'beinarbeit'
  | 'ballwechsel'
  | 'taktik'
  | 'wettkampf'
  | 'vorhandzentriert'
  | 'rueckhandzentriert'
  | 'block'
  | 'notiz';

// Ballflugtypen für unterschiedliche Darstellung
export type SpinType = 'topspin' | 'backspin' | 'flat' | 'sidespin' | 'block';

// Schlagtyp (Vorhand/Rückhand/Block)
export type StrokeType = 'VH' | 'RH' | 'BL';

// Spieler-Seite (selbst oder Gegner)
export type PlayerSide = 'self' | 'opponent';

// Balltrajektorie für das Diagramm
export interface BallTrajectory {
  id: string;
  startX: number;  // 0-100 Prozent der Tischbreite
  startY: number;  // 0-100 Prozent der Tischlänge
  endX: number;
  endY: number;
  type: SpinType;
  player?: PlayerSide;  // Wer spielt den Ball (self = unten, opponent = oben)
  stroke?: StrokeType;  // VH oder RH (nur für self)
  color?: string;  // Optionale Farbüberschreibung
  order?: number;  // Reihenfolge für Multi-Ball-Übungen
}

// Spielerposition auf dem Tisch
export interface PlayerPosition {
  side: 'near' | 'far';
  x: number;
  y: number;
  role: 'player' | 'trainer' | 'robot';
}

// Hauptdatenstruktur für Übungen
export interface Exercise {
  id: string;
  type?: ExerciseType;
  name: string;
  description: string;
  hints?: string[];
  category: ExerciseCategory;
  difficulty: DifficultyLevel;
  ttrRange: {
    min: number;
    max: number;
  };
  duration?: number;  // Empfohlene Dauer in Minuten
  diagram: {
    trajectories: BallTrajectory[];
    playerPositions?: PlayerPosition[];
  };
  tags?: string[];
}

// Filter-State
export interface ExerciseFilters {
  categories: ExerciseCategory[];
  difficulty: DifficultyLevel | null;
  ttrPoints?: number;
  searchQuery?: string;
}

// Wochentag (0 = Sonntag, 1 = Montag, ..., 6 = Samstag)
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// Zuordnung einer Übung zu einem spezifischen Trainingstag
export interface TrainingDayAssignment {
  id: string;                    // Unique ID der Zuordnung
  exerciseId: string;            // Referenz zur Exercise
  trainingDate: string;          // ISO-Date (YYYY-MM-DD)
  weekday: Weekday;              // Wochentag für einfache Abfragen
  createdAt: number;             // Timestamp
}

// Anwesenheits-Status für ein Training
export type AttendanceStatus = 'yes' | 'no';

export interface AttendanceEntry {
  username: string;
  displayName: string;
  role: 'trainer' | 'player';
  status: AttendanceStatus;
  updatedAt: number;
}

// Berechneter Trainingstag für UI-Anzeige
export interface ComputedTrainingDay {
  date: Date;
  dateString: string;            // YYYY-MM-DD
  weekday: Weekday;
  weekdayLabel: string;
  displayLabel: string;          // "Heute", "Morgen", "Montag, 20.01."
  exerciseIds: string[];
  isToday: boolean;
  isPast: boolean;
}

// Training-Session aus der Datenbank (für GroupContext / API-Antworten)
export interface TrainingSessionSummary {
  id: string;
  groupId: string;
  sessionDate: string; // ISO-Date-String
  notes?: string | null;
  _count: {
    assignments: number;
    votes: number;
    attendance: number;
  };
}

// Spielerverwaltung – API-Antwortstrukturen

export interface PlayerGroupMembership {
  groupId: string;
  groupName: string;
  memberRole: 'trainer' | 'player';
}

export interface PlayerTeamMembership {
  teamId: string;
  teamName: string;
}

export interface PlayerListItem {
  id: string;
  username: string;
  displayName: string;
  email: string | null;
  roles: string[];
  groups: PlayerGroupMembership[];
  teams: PlayerTeamMembership[];
}

export interface GroupSummary {
  id: string;
  name: string;
  description: string | null;
}

// Group member as returned by GET /api/groups/[id]/members
export interface GroupMemberItem {
  id: string;
  role: string;
  user: {
    id: string;
    username: string;
    displayName: string;
  };
}

// Mannschaft

export interface Team {
  id: string;
  name: string;
  clickTtUrl: string | null;
  lastSync: string | null;
  memberCount?: number;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  username: string;
  displayName: string;
  role: 'player' | 'captain';
}

// click-TT Ligadaten (als JSON in Team.leagueData gespeichert)

export interface LeagueStanding {
  rank: number;
  teamName: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  games: string;
  difference: number;
  points: string;
}

export interface LeagueMatch {
  matchId?: string;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  score: string | null;
  isHome: boolean;
  isCompleted: boolean;
}

export interface MatchAvailabilityEntry {
  userId: string;
  displayName: string;
  status: 'yes' | 'no' | 'maybe';
  canDrive: boolean;
}

export interface MatchLineupEntry {
  userId: string;
  displayName: string;
  isDriver: boolean;
}

export interface LeagueData {
  standings: LeagueStanding[];
  matches: LeagueMatch[];
  clickTtTeamName: string | null;  // Liga-Mannschaftsname (z.B. "TT-Freunde Bötzow")
}

// Vereins-Import: Team-Info von click-TT Vereinsseite
export interface ClubTeamInfo {
  teamName: string;
  leagueName: string;
  leagueUrl: string;
  rank: number | null;
  points: string;
}

// Spieler-Import: Spieler-Info von click-TT Bilanzen-Seite
export interface ClubPlayerInfo {
  firstName: string;
  lastName: string;
  teamName: string; // e.g. "Erwachsene VII"
}

// Mannschafts-Chat

export interface ChatMessage {
  id: string;
  teamId: string;
  userId: string;
  username: string;
  displayName: string;
  content: string | null;
  imageId: string | null;
  createdAt: string; // ISO-Date
  isEdited: boolean;
}

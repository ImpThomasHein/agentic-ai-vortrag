import { DifficultyLevel, ExerciseCategory, SpinType, Weekday, PlayerSide } from './types';

// Deutsche Labels für Kategorien
export const CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  'aufschlag-rueckschlag': 'Aufschlag/Rückschlag',
  'topspin': 'Topspin',
  'beinarbeit': 'Beinarbeit',
  'ballwechsel': 'Ballwechsel',
  'taktik': 'Taktik',
  'wettkampf': 'Wettkampf',
  'vorhandzentriert': 'Vorhand',
  'rueckhandzentriert': 'Rückhand',
  'block': 'Block',
  'notiz': 'Notiz',
};

// Alle Kategorien als Array
export const CATEGORIES: ExerciseCategory[] = [
  'aufschlag-rueckschlag',
  'topspin',
  'beinarbeit',
  'ballwechsel',
  'taktik',
  'wettkampf',
  'vorhandzentriert',
  'rueckhandzentriert',
  'block',
  'notiz',
];

// Deutsche Labels für Schwierigkeitsgrade
export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  'beginner': 'Anfänger',
  'intermediate': 'Fortgeschritten',
  'advanced': 'Leistung',
  'expert': 'Experte',
};

// TTR-Bereiche für Schwierigkeitsgrade
export const DIFFICULTY_TTR_RANGES: Record<DifficultyLevel, { min: number; max: number }> = {
  'beginner': { min: 0, max: 1100 },
  'intermediate': { min: 1100, max: 1500 },
  'advanced': { min: 1500, max: 1900 },
  'expert': { min: 1900, max: 2500 },
};

// Alle Schwierigkeitsgrade als Array
export const DIFFICULTIES: DifficultyLevel[] = [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
];

// Farben für Trajektorien nach Spin-Typ (für Selbst/Spieler)
export const SPIN_COLORS: Record<SpinType, string> = {
  'topspin': '#ef4444',    // Rot
  'backspin': '#3b82f6',   // Blau
  'flat': '#1f2937',       // Dunkelgrau
  'sidespin': '#8b5cf6',   // Lila
  'block': '#6b7280',      // Grau
};

// Linien-Stile für Spin-Typen
export const SPIN_DASH_ARRAYS: Record<SpinType, string> = {
  'topspin': '',           // Durchgezogen
  'backspin': '8,4',       // Gestrichelt
  'flat': '',              // Durchgezogen
  'sidespin': '2,2',       // Gepunktet
  'block': '4,2',          // Kurz gestrichelt
};

// Farben für Spieler-Seite (selbst = Spieler unten, opponent = Gegner oben)
export const PLAYER_COLORS: Record<PlayerSide, string> = {
  'self': '#ef4444',       // Rot - eigene Schläge
  'opponent': '#3b82f6',   // Blau - Gegner/Trainer Schläge
};

// Kategorie-Farben für Badges
export const CATEGORY_COLORS: Record<ExerciseCategory, { bg: string; text: string }> = {
  'aufschlag-rueckschlag': { bg: 'bg-green-100', text: 'text-green-700' },
  'topspin': { bg: 'bg-red-100', text: 'text-red-700' },
  'beinarbeit': { bg: 'bg-orange-100', text: 'text-orange-700' },
  'ballwechsel': { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  'taktik': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  'wettkampf': { bg: 'bg-amber-100', text: 'text-amber-700' },
  'vorhandzentriert': { bg: 'bg-rose-100', text: 'text-rose-700' },
  'rueckhandzentriert': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'block': { bg: 'bg-slate-100', text: 'text-slate-700' },
  'notiz': { bg: 'bg-amber-100', text: 'text-amber-700' },
};

// Schwierigkeits-Farben für Badges
export const DIFFICULTY_COLORS: Record<DifficultyLevel, { bg: string; text: string }> = {
  'beginner': { bg: 'bg-green-100', text: 'text-green-700' },
  'intermediate': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  'advanced': { bg: 'bg-orange-100', text: 'text-orange-700' },
  'expert': { bg: 'bg-red-100', text: 'text-red-700' },
};

// Wochentags-Labels (vollständig)
export const WEEKDAY_LABELS: Record<Weekday, string> = {
  0: 'Sonntag',
  1: 'Montag',
  2: 'Dienstag',
  3: 'Mittwoch',
  4: 'Donnerstag',
  5: 'Freitag',
  6: 'Samstag',
};

// Wochentags-Labels (kurz)
export const WEEKDAY_LABELS_SHORT: Record<Weekday, string> = {
  0: 'So',
  1: 'Mo',
  2: 'Di',
  3: 'Mi',
  4: 'Do',
  5: 'Fr',
  6: 'Sa',
};

/** @deprecated localStorage wird nicht mehr genutzt – nur noch für Storybook-Mocks */
export const STORAGE_KEYS = {
  VOTES: 'tt-planner-votes',
  TRAINING_PLAN: 'tt-planner-training',
  VISITOR_ID: 'tt-planner-visitor-id',
  TRAINING_SCHEDULE: 'tt-planner-schedule',
  VOTING_SESSION: 'tt-planner-voting-session',
  TRAINING_ASSIGNMENTS: 'tt-planner-training-assignments',
  ATTENDANCE: 'tt-planner-attendance',
} as const;

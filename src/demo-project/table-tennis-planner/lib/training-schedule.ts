import { Weekday, TrainingDayAssignment, ComputedTrainingDay } from './types';
import { WEEKDAY_LABELS } from './constants';

/**
 * Convert an ISO date string to a local YYYY-MM-DD string.
 * Useful for matching DB session dates (stored as UTC) with local training days.
 */
export function toLocalDateString(isoString: string): string {
  const d = new Date(isoString);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

/**
 * Berechnet den nächsten Trainingstag ab einem bestimmten Datum
 * @param weekdays Array der aktiven Trainingstage (0 = Sonntag, 6 = Samstag)
 * @param fromDate Startdatum (default: heute)
 * @returns Date-Objekt des nächsten Trainings oder null wenn keine Trainingstage definiert
 */
export function getNextTrainingDate(
  weekdays: Weekday[],
  fromDate: Date = new Date()
): Date | null {
  if (weekdays.length === 0) return null;

  // Normalisiere auf Mitternacht (lokale Zeit) um Uhrzeit-Probleme zu vermeiden
  const today = new Date(fromDate);
  today.setHours(0, 0, 0, 0);

  const currentWeekday = today.getDay() as Weekday;

  // Suche nächsten Trainingstag in den nächsten 7 Tagen (inkl. heute)
  for (let i = 0; i < 7; i++) {
    const checkDay = (currentWeekday + i) % 7 as Weekday;

    if (weekdays.includes(checkDay)) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      return nextDate;
    }
  }

  // Sollte nie passieren wenn weekdays.length > 0
  return null;
}

/**
 * Prüft ob heute ein Trainingstag ist
 * @param weekdays Array der aktiven Trainingstage
 * @returns true wenn heute Training ist
 */
export function isTodayTrainingDay(weekdays: Weekday[]): boolean {
  const today = new Date().getDay() as Weekday;
  return weekdays.includes(today);
}

/**
 * Formatiert ein Date-Objekt zu einem ISO-String (nur Datum, keine Uhrzeit)
 * @param date Date-Objekt
 * @returns ISO-String im Format YYYY-MM-DD
 */
export function formatTrainingDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Vergleicht ob zwei Dates am selben Tag sind
 * @param date1 Erstes Datum
 * @param date2 Zweites Datum
 * @returns true wenn beide Dates am selben Tag sind
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return formatTrainingDate(date1) === formatTrainingDate(date2);
}

/**
 * Berechnet wie viele Tage es bis zum nächsten Training ist
 * @param weekdays Array der aktiven Trainingstage
 * @returns Anzahl der Tage bis zum nächsten Training oder null
 */
export function daysUntilNextTraining(weekdays: Weekday[]): number | null {
  const nextTraining = getNextTrainingDate(weekdays);
  if (!nextTraining) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = nextTraining.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Formatiert ein Trainingsdatum für die Anzeige
 * - "Heute" wenn heute
 * - "Morgen" wenn morgen
 * - "Wochentag, DD.MM.YYYY" sonst
 * @param date Das zu formatierende Datum
 * @param weekdayLabels Labels für Wochentage
 * @returns Formatierter String
 */
export function formatTrainingDateForDisplay(
  date: Date,
  weekdayLabels: Record<Weekday, string>
): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (isSameDay(date, today)) {
    return 'Heute';
  }

  if (isSameDay(date, tomorrow)) {
    return 'Morgen';
  }

  const weekday = weekdayLabels[date.getDay() as Weekday];
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${weekday}, ${day}.${month}.${year}`;
}

/**
 * Berechnet die nächsten N Trainingstage
 * @param weekdays Array der aktiven Trainingstage
 * @param count Anzahl der gewünschten Trainingstage (default: 6)
 * @param fromDate Startdatum (default: heute)
 * @returns Array von Date-Objekten für die nächsten Trainingstage
 */
export function getUpcomingTrainingDates(
  weekdays: Weekday[],
  count: number = 6,
  fromDate: Date = new Date()
): Date[] {
  if (weekdays.length === 0) return [];

  const dates: Date[] = [];
  const currentDate = new Date(fromDate);
  currentDate.setHours(0, 0, 0, 0);

  // Suche maximal 60 Tage in die Zukunft
  for (let i = 0; i < 60 && dates.length < count; i++) {
    const checkDate = new Date(currentDate);
    checkDate.setDate(currentDate.getDate() + i);

    if (weekdays.includes(checkDate.getDay() as Weekday)) {
      dates.push(checkDate);
    }
  }

  return dates;
}

/**
 * Findet den nächsten Trainingstag mit dem gleichen Wochentag
 * @param weekdays Array der aktiven Trainingstage
 * @param targetWeekday Der gewünschte Wochentag
 * @param afterDate Das Datum ab dem gesucht werden soll
 * @returns Date-Objekt des nächsten passenden Trainingstags oder null
 */
export function getNextSameWeekdayDate(
  weekdays: Weekday[],
  targetWeekday: Weekday,
  afterDate: Date
): Date | null {
  if (!weekdays.includes(targetWeekday)) return null;

  const startDate = new Date(afterDate);
  startDate.setHours(0, 0, 0, 0);

  // Suche in den nächsten 8 Wochen
  for (let i = 0; i < 56; i++) {
    const checkDate = new Date(startDate);
    checkDate.setDate(startDate.getDate() + i);

    if (checkDate.getDay() === targetWeekday) {
      return checkDate;
    }
  }

  return null;
}

/**
 * Erstellt berechnete Trainingstage mit allen Infos für die UI
 * @param weekdays Array der aktiven Trainingstage
 * @param assignments Array aller Zuordnungen
 * @param count Anzahl der gewünschten Trainingstage (default: 6)
 * @returns Array von ComputedTrainingDay Objekten
 */
export function computeTrainingDays(
  weekdays: Weekday[],
  assignments: TrainingDayAssignment[],
  count: number = 6
): ComputedTrainingDay[] {
  const upcomingDates = getUpcomingTrainingDates(weekdays, count);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return upcomingDates.map(date => {
    const dateString = formatTrainingDate(date);
    const weekday = date.getDay() as Weekday;
    const dayAssignments = assignments.filter(a => a.trainingDate === dateString);

    return {
      date,
      dateString,
      weekday,
      weekdayLabel: WEEKDAY_LABELS[weekday],
      displayLabel: formatTrainingDateForDisplay(date, WEEKDAY_LABELS),
      exerciseIds: dayAssignments.map(a => a.exerciseId),
      isToday: isSameDay(date, today),
      isPast: date < today,
    };
  });
}

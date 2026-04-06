# Implementierungsplan: Trainingstage-Verwaltung und zeitgesteuertes Voting

## Überblick
Der Trainer soll Trainingstage (Mo-So) definieren können, die sich wöchentlich wiederholen. Das Voting der Kinder ist nur für die nächste Trainingseinheit möglich.

## Anforderungen
1. Trainer kann Wochentage für Training auswählen (Mo-So)
2. Trainingstage wiederholen sich wöchentlich
3. Voting ist nur für die nächste Trainingseinheit möglich
4. Einfache, intuitive Benutzeroberfläche

## Technische Architektur

### 1. Datenmodell erweitern (lib/types.ts)

**Neue Interfaces:**
```typescript
// Trainingsplan-Konfiguration
export interface TrainingSchedule {
  id: string;
  weekdays: number[];  // 0 = Sonntag, 1 = Montag, ..., 6 = Samstag
  createdAt: string;
  updatedAt: string;
}

// Berechnete nächste Trainingseinheit
export interface NextTrainingSession {
  date: string;        // ISO Date String
  weekday: number;     // 0-6
  isToday: boolean;
  daysUntil: number;
}
```

### 2. Storage-Funktionen erweitern (lib/storage.ts)

**Neue Funktionen:**
- `getTrainingSchedule(): TrainingSchedule | null` - Lädt Trainingsplan
- `saveTrainingSchedule(weekdays: number[]): void` - Speichert Trainingstage
- `calculateNextTrainingSession(schedule: TrainingSchedule): NextTrainingSession | null` - Berechnet nächstes Training
- `getLastVoteReset(): string | null` - Holt Zeitstempel des letzten Vote-Resets
- `setLastVoteReset(date: string): void` - Setzt Zeitstempel des letzten Vote-Resets
- `clearVotes(): void` - Löscht alle aktuellen Votes

**Voting-Logik:**
- Voting ist IMMER erlaubt (auch ohne Trainingsplan)
- Beim Laden der App prüfen:
  - Gibt es einen Trainingsplan?
  - Ist das letzte Training vorbei?
  - Wenn ja → Votes automatisch zurücksetzen
- Spieler sehen Info über nächstes Training (falls Plan existiert)

### 3. Constants erweitern (lib/constants.ts)

**Hinzufügen:**
```typescript
// Wochentags-Labels
export const WEEKDAY_LABELS = {
  0: 'So',
  1: 'Mo',
  2: 'Di',
  3: 'Mi',
  4: 'Do',
  5: 'Fr',
  6: 'Sa',
};

export const WEEKDAY_FULL_LABELS = {
  0: 'Sonntag',
  1: 'Montag',
  2: 'Dienstag',
  3: 'Mittwoch',
  4: 'Donnerstag',
  5: 'Freitag',
  6: 'Samstag',
};

// Storage-Key
STORAGE_KEYS.TRAINING_SCHEDULE = 'tt-planner-schedule'
```

### 4. Neue Komponente: TrainingScheduleEditor

**Datei:** `components/trainer/TrainingScheduleEditor.tsx`

**Features:**
- Checkbox-Auswahl für jeden Wochentag
- Visuelle Darstellung der ausgewählten Tage
- Anzeige des nächsten Trainings
- Speichern-Button
- Responsive Design im Glass-Morphism-Stil

**UI-Struktur:**
```
┌─────────────────────────────────┐
│ Trainingstage festlegen         │
├─────────────────────────────────┤
│ ☐ Mo  ☐ Di  ☐ Mi  ☐ Do         │
│ ☐ Fr  ☐ Sa  ☐ So               │
├─────────────────────────────────┤
│ Nächstes Training:              │
│ Mittwoch, 15.01.2026            │
│ in 4 Tagen                      │
├─────────────────────────────────┤
│       [Speichern]               │
└─────────────────────────────────┘
```

### 5. Trainer-Page erweitern (app/trainer/page.tsx)

**Änderungen:**
- Neue Sektion oberhalb der Filter für Trainingsplan-Konfiguration
- TrainingScheduleEditor einbinden
- Zusammenklappbar/Erweiterbar (Accordion-Style)

### 6. Voting-Hook erweitern (hooks/useVotes.ts)

**Neue Funktion:**
```typescript
const getNextTrainingInfo = useCallback((): {
  hasSchedule: boolean;
  nextTraining?: NextTrainingSession;
} => {
  const schedule = getTrainingSchedule();
  if (!schedule || schedule.weekdays.length === 0) {
    return { hasSchedule: false };
  }

  const nextTraining = calculateNextTrainingSession(schedule);
  return {
    hasSchedule: true,
    nextTraining
  };
}, []);
```

**useEffect hinzufügen (beim Laden):**
- Trainingsplan laden
- Prüfen ob letztes Training vorbei ist
- Wenn ja → Votes zurücksetzen (clearVotes())
- Implementierung: Zeitstempel des letzten Vote-Resets speichern

### 7. VoteButton (components/exercises/VoteButton.tsx)

**Keine Änderungen nötig:**
- Voting ist immer erlaubt
- VoteButton bleibt unverändert

### 8. Spieler-Page anpassen (app/player/page.tsx)

**Änderungen:**
- `getNextTrainingInfo()` aufrufen
- Info-Box anpassen basierend auf Trainingsplan

**Info-Box Beispiel (mit Trainingsplan):**
```
┌─────────────────────────────────────┐
│ 💚 Nächstes Training:               │
│    Mittwoch, 15.01.2026             │
│    Wähle deine Favoriten!           │
└─────────────────────────────────────┘
```

**Info-Box Beispiel (ohne Trainingsplan):**
```
┌─────────────────────────────────────┐
│ 💚 Wähle deine Favoriten!           │
│    Tippe auf das Herz, um für      │
│    Übungen zu stimmen.             │
└─────────────────────────────────────┘
```

## Implementierungsreihenfolge

1. **Phase 1: Datenmodell & Storage**
   - types.ts erweitern
   - constants.ts erweitern
   - storage.ts erweitern mit neuen Funktionen

2. **Phase 2: Trainer-Komponenten**
   - TrainingScheduleEditor erstellen
   - Trainer-Page erweitern

3. **Phase 3: Voting-Einschränkung**
   - useVotes Hook erweitern
   - VoteButton anpassen
   - Spieler-Page anpassen

4. **Phase 4: Testing & Polishing**
   - Edge Cases testen (keine Trainingstage, vergangene Tage, etc.)
   - UI-Feedback verbessern
   - Mobile Responsive prüfen

## Entscheidungen (User-Input)

1. **Voting-Zeitfenster:**
   ✅ Voting ist IMMER für das nächste Training möglich
   - Einfach und flexibel für die Kinder
   - Keine zeitliche Einschränkung

2. **Vote-Reset:**
   ✅ Votes werden nach jedem Training AUTOMATISCH zurückgesetzt
   - Kinder können für jedes Training neu abstimmen
   - Implementierung: Beim Laden prüfen ob letztes Training vorbei → Votes löschen

3. **Fallback (kein Trainingsplan):**
   ✅ Voting ist TROTZDEM erlaubt
   - Auch ohne Trainingsplan können Kinder abstimmen
   - Optional: Hinweis an Trainer, dass er Tage festlegen sollte

## Geschätzte Dateien

**Neu zu erstellen:**
- `components/trainer/TrainingScheduleEditor.tsx`

**Zu bearbeiten:**
- `lib/types.ts` - Neue Interfaces hinzufügen
- `lib/constants.ts` - Wochentags-Labels und Storage-Key
- `lib/storage.ts` - Trainingsplan-Funktionen und Vote-Reset-Logik
- `hooks/useVotes.ts` - Auto-Reset beim Laden implementieren
- `app/trainer/page.tsx` - TrainingScheduleEditor einbinden
- `app/player/page.tsx` - Info-Box mit nächstem Training

**Total:** 6 Dateien zu bearbeiten, 1 neu zu erstellen

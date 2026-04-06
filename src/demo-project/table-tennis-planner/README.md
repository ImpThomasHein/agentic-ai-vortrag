# Tischtennis Trainingsplaner

Dies ist eine Demoapplikationen zum Testing von AI Engineering. Das Projekt ist klein genug, damit man schnell Dinge wie Skills, Agenten und Agent.md files ausprobieren kann.

Eine mobile-first Webanwendung für die Planung von Tischtennistraining.

## Rollen

| Rolle       | Aufgaben                                                             |
| ----------- | -------------------------------------------------------------------- |
| **Trainer** | Trainingseinheiten planen, Übungen zuweisen, Abstimmungen beobachten |
| **Spieler** | Über Lieblingsübungen für kommende Trainings abstimmen               |

## Tech Stack

| Bereich   | Technologie                                          |
| --------- | ---------------------------------------------------- |
| Framework | Next.js 15 (App Router), React 18, TypeScript 5      |
| Styling   | Tailwind CSS 3, Glass-Morphism Design                |
| Datenbank | SQLite (lokal), PostgreSQL via Supabase (Produktion) |
| ORM       | Prisma 7                                             |
| Auth      | iron-session (verschlüsselte Cookie-Sessions)        |
| Testing   | Vitest, Storybook 10                                 |

## Lokale Entwicklung

### Voraussetzungen

- Node.js 18+
- npm

### Setup

env.local

```bash
npm install
npm run dev
```

`npm run dev` führt beim Start automatisch folgende Schritte aus:

1. Löscht die vorherige `prisma/dev.db` (temporäre SQLite-Datenbank)
2. Generiert den Prisma Client (SQLite-Schema)
3. Erstellt alle Tabellen via `prisma db push`
4. Befüllt die Datenbank mit Testdaten (Seed)
5. Startet den Next.js Dev-Server

> Die lokale Datenbank ist **temporär** — sie wird bei jedem `npm run dev` neu erstellt.

### Testdaten (Dev-Seed)

| Benutzername | Passwort     | Rolle   | Gruppe               |
| ------------ | ------------ | ------- | -------------------- |
| `trainer`    | `trainer123` | Trainer | Erwachsene + Schüler |
| `max`        | `max123`     | Spieler | Erwachsene           |
| `lisa`       | `lisa123`    | Spieler | Schüler              |

**Gruppen und Trainingspläne:**

| Gruppe     | Trainingstage        |
| ---------- | -------------------- |
| Erwachsene | Dienstag, Donnerstag |
| Schüler    | Montag, Mittwoch     |

Die nächsten 2 Trainingseinheiten pro Gruppe sind bereits mit Übungen verplant.

## Befehle

```bash
npm run dev          # Dev-Server starten (mit DB-Reset und Seed)
npm run build        # Produktionsbuild
npm run start        # Produktionsserver starten
npm run lint         # ESLint ausführen
npm run storybook    # Storybook starten (Port 6006)

npm run db:generate  # Prisma Client neu generieren
npm run db:seed      # Nur Testdaten neu einspielen
npm run db:studio    # Prisma Studio öffnen
npm run db:migrate   # Migration erstellen (Produktion)
```

## Projektstruktur

```
app/                        # Next.js App Router Pages
├── page.tsx                # Startseite / Rollenauswahl
├── login/                  # Login-Seite
├── player/                 # Spieler-Abstimmungsansicht
├── trainer/                # Trainer-Planungsansicht
└── trainingsplan/          # Trainingsplan-Übersicht

app/api/                    # API Routes (Next.js Route Handlers)
├── auth/                   # Login, Logout, Session
├── exercises/              # Übungskatalog
├── groups/                 # Gruppen, Mitglieder, Zeitplan
├── sessions/               # Trainingseinheiten, Zuordnungen, Votes

components/
├── diagrams/               # Tischtennis-Court SVG-Visualisierung
├── exercises/              # Übungsanzeige und Abstimmung
├── training/               # Trainingszeitplan und Planung
└── ui/                     # Generische UI-Komponenten

contexts/
└── AuthContext.tsx          # Authentifizierungskontext

hooks/                      # Custom React Hooks
├── useExercises.ts
├── useVotes.ts
├── useTrainingPlan.ts
└── useTrainingSchedule.ts

lib/
├── types.ts                # TypeScript-Interfaces
├── constants.ts            # Labels, Farben
├── db.ts                   # Prisma Client Singleton (mit Driver Adapter)
└── session.ts              # iron-session Hilfsfunktionen

prisma/
├── schema.prisma           # PostgreSQL-Schema (Produktion)
├── schema.dev.prisma       # SQLite-Schema (lokale Entwicklung)
└── seed.ts                 # Testdaten

scripts/
└── dev-setup.mjs           # DB-Reset und Seed beim Dev-Start
```

## Datenbankschemas

Das Projekt hat zwei Prisma-Schemas:

| Schema                     | Datenbank  | Verwendung            |
| -------------------------- | ---------- | --------------------- |
| `prisma/schema.prisma`     | PostgreSQL | Produktion (Supabase) |
| `prisma/schema.dev.prisma` | SQLite     | Lokale Entwicklung    |

Das richtige Schema wird anhand der `DATABASE_URL` in `.env.local` automatisch gewählt:

- `file:./prisma/dev.db` → SQLite (Dev)
- `postgresql://...` → PostgreSQL (Prod)

## Umgebungsvariablen

Datei `.env.local` anlegen (wird nicht ins Git eingecheckt):

```env
# Lokale Entwicklung (SQLite)
DATABASE_URL="file:./prisma/dev.db"
SESSION_SECRET="mindestens-32-zeichen-langes-geheimnis!!!!"

# Produktion (Supabase PostgreSQL) – in Vercel als Env-Variable setzen
# DATABASE_URL="postgresql://..."
# SESSION_SECRET="..."
```

## Produktion (Supabase)

### Ersteinrichtung

1. Supabase-Projekt anlegen und Connection String kopieren
2. `.env.prod` anlegen (wird nicht ins Git eingecheckt):

```env
DATABASE_URL="postgresql://postgres:PASSWORT@HOST:5432/postgres"
SESSION_SECRET="mindestens-32-zeichen-langes-geheimnis!!!!"
```

3. Schema in Supabase pushen und Admin-User anlegen:

```bash
DATABASE_URL="$(grep DATABASE_URL .env.prod | cut -d'"' -f2)" npm run prod:db-push
DATABASE_URL="$(grep DATABASE_URL .env.prod | cut -d'"' -f2)" npm run prod:add-admin
```

### Lokaler Dev-Server gegen Supabase

```bash
npm run prod
```

Startet den Next.js Dev-Server mit der Supabase-Datenbank aus `.env.prod` (kein DB-Reset, kein Seed).

### Docker-Deployment

`DATABASE_URL` und `SESSION_SECRET` als Umgebungsvariablen beim Container-Start setzen:

```bash
docker run -e DATABASE_URL="postgresql://..." -e SESSION_SECRET="..." image-name
```

## Datenmodell

Das vollständige Entity-Relationship-Diagramm ist in [`diagramm.mmd`](diagramm.mmd) (Mermaid-Format).

**Kernentitäten:**

- `users` + `roles` — Benutzer mit Trainer- oder Spieler-Rolle
- `groups` — Trainingsgruppen (z.B. Erwachsene, Schüler)
- `group_members` — N:M-Zuordnung User ↔ Gruppe mit Rolle
- `exercises` — Globaler Übungskatalog mit Diagrammdaten
- `training_schedules` — Wöchentlich wiederkehrende Trainingstage pro Gruppe
- `training_sessions` — Konkrete Trainingseinheit (Gruppe + Datum)
- `training_assignments` — Übungen einer Trainingseinheit (geordnet)
- `votes` — Spieler-Abstimmungen pro Session
- `attendance` — Anwesenheitsmeldungen pro Session

## Konventionen

- Deutsche Labels in der UI, englische Bezeichner im Code
- `'use client'` für clientseitige Komponenten
- Mobile-first Design (max-width: 32rem)
- Glass-Morphism Styling
- Neue React-Komponenten werden auch in Storybook angelegt
- Komplexe Logik in separate `.ts`-Dateien ausgelagert (mit Unit Tests)

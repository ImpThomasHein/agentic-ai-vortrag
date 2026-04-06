---
name: dc-easy-feature-dev
description: Use when implementing a small to medium feature or bugfix without a pre-existing plan, where developer control and TDD are still needed
---

# DC Easy Feature Dev

## Overview

Implement features directly — no pre-existing plan needed. The agent gathers context from the codebase, proposes an approach, and executes with the same discipline as `datacider-executing`: TDD, code review after each task, developer decisions at every important point.

**Core principle:** Erst verstehen, dann vorschlagen, dann umsetzen — immer mit Entwickler-Kontrolle.

**Announce at start:** "Ich verwende dc-easy-feature-dev. Ich sammle zuerst den Kontext, dann schlage ich einen Ansatz vor."

## When to Use

- Small to medium features (1-5 Dateien betroffen)
- Bugfixes
- Erweiterungen bestehender Features
- Kein formaler datacider-planning Plan nötig

## When NOT to Use

- Große Features über viele Dateien → `datacider-planning` + `datacider-executing`
- Reine Konfigurationsänderungen → direkt machen

## The Process

```dot
digraph dc_easy {
    rankdir=TB;

    gather [label="1. Kontext sammeln\n(Codebase lesen)", shape=box];
    understand [label="2. Anforderung\nverstehen", shape=box];
    clarify [label="Rückfragen?", shape=diamond];
    ask [label="Entwickler fragen", shape=box];
    propose [label="3. Ansatz vorschlagen\n+ Schritte auflisten", shape=box];
    dev_approve [label="Entwickler OK?", shape=diamond];
    adjust [label="Ansatz anpassen", shape=box];

    subgraph cluster_per_step {
        label="Pro Schritt (wie datacider-executing)";
        style=dashed;
        decision [label="Entscheidungspunkt?", shape=diamond];
        ask_decision [label="Optionen vorstellen\nEntwickler entscheidet", shape=box];
        tdd_red [label="RED: Failing Test", shape=box, style=filled, fillcolor="#ffcccc"];
        tdd_green [label="GREEN: Implementieren", shape=box, style=filled, fillcolor="#ccffcc"];
        run_tests [label="Alle Tests ausführen", shape=box];
        storybook [label="Frontend?\nStory + Test", shape=diamond];
        write_story [label="Story schreiben", shape=box];
        commit [label="Commit", shape=box];
        review [label="Code Review", shape=box, style=filled, fillcolor="#ccccff"];
        show [label="Entwickler: Ergebnis\nzeigen + bestätigen", shape=box];
    }

    more [label="Weitere Schritte?", shape=diamond];
    done [label="Fertig: Finale\nVerifikation", shape=doublecircle];

    gather -> understand;
    understand -> clarify;
    clarify -> ask [label="ja"];
    ask -> understand;
    clarify -> propose [label="nein"];
    propose -> dev_approve;
    dev_approve -> adjust [label="nein"];
    adjust -> propose;
    dev_approve -> decision [label="ja"];
    decision -> ask_decision [label="ja"];
    ask_decision -> tdd_red;
    decision -> tdd_red [label="nein"];
    tdd_red -> tdd_green;
    tdd_green -> run_tests;
    run_tests -> storybook;
    storybook -> write_story [label="ja"];
    write_story -> commit;
    storybook -> commit [label="nein"];
    commit -> review;
    review -> show;
    show -> more;
    more -> decision [label="ja"];
    more -> done [label="nein"];
}
```

## Phase 1: Kontext sammeln

Der Agent liest selbstständig:

1. **CLAUDE.md** — Projekt-Konventionen, Tech Stack
2. **data-model.mmd** — Datenmodell verstehen
3. **Betroffene Dateien** — Bestehenden Code lesen der relevant ist
4. **Bestehende Tests** — Testmuster und -konventionen erkennen
5. **Bestehende Stories** — Storybook-Konventionen erkennen (falls Frontend)

**Checkliste für Kontext-Sammlung:**

| Was | Wozu | Wo finden |
|-----|------|-----------|
| Datenmodell | Schema-Änderungen einschätzen | `data-model.mmd`, `prisma/schema.dev.prisma` |
| API-Routen | Bestehende Endpunkte verstehen | `app/api/` |
| Hooks | Bestehende Datenzugriffsmuster | `hooks/` |
| Komponenten | UI-Muster und Konventionen | `components/` |
| Types | Bestehende Interfaces | `lib/types.ts` |
| Tests | Test-Konventionen | `**/*.test.ts`, `**/*.stories.tsx` |

## Phase 2: Ansatz vorschlagen

Dem Entwickler präsentieren:

```
Ich habe den Kontext analysiert. Hier mein Vorschlag:

**Was zu tun ist:**
[Zusammenfassung der Änderungen]

**Betroffene Dateien:**
- [Datei 1] — [was sich ändert]
- [Datei 2] — [was sich ändert]

**Schritte:**
1. [Schritt 1 — was verifizierbar ist danach]
2. [Schritt 2 — was verifizierbar ist danach]
...

**Offene Fragen / Entscheidungen:**
- [Frage 1: Option A vs. Option B]

Einverstanden? Oder soll ich etwas anpassen?
```

**Warte auf Bestätigung bevor du anfängst.**

## Phase 3: Umsetzung — Pro Schritt

Identischer Workflow wie `datacider-executing`:

### Entscheidungspunkte

Bei Design-/Architektur-/UX-Entscheidungen:

```
Es gibt eine Entscheidung:

[Beschreibung]

Option A: [Beschreibung]
  + [Vorteil]  - [Nachteil]

Option B: [Beschreibung]
  + [Vorteil]  - [Nachteil]

Meine Empfehlung: [Option], weil [Grund].
Was möchtest du?
```

**Regel:** NIEMALS selbst entscheiden. Immer fragen.

### TDD — RED → GREEN

```bash
# RED: Failing Test zuerst
npx vitest run path/to/test.ts
# Erwartet: FAIL

# GREEN: Minimal implementieren
npx vitest run path/to/test.ts
# Erwartet: PASS
```

### Alle Tests ausführen

```bash
npx vitest run                    # Unit-Tests
npx vitest --project=storybook    # Storybook-Tests (bei Frontend)
npm run lint                      # Lint
```

### API Routes: Integrationstests gegen SQLite

Für jeden neuen/geänderten API-Endpunkt — Integrationstests schreiben, die gegen eine echte SQLite-Datenbank laufen (keine Mocks). Tests nutzen Prisma-Client direkt für Setup/Teardown und rufen die Route-Handler auf.

### Frontend: Storybook-Story + Test

Für jede neue/geänderte Komponente — Story erstellen, Storybook-Test ausführen. **Keine Playwright-Tests.**

### Commit + Review

Nach jedem logischen Schritt:
1. Commit mit beschreibender Message
2. Code Review (7-Punkte-Checkliste aus `datacider-executing`)
3. Bei Issues: beheben, Tests erneut, erneut reviewen

### Ergebnis zeigen

```
Schritt N abgeschlossen ✅

Ergebnis: [Was gebaut wurde]
Tests: ✅ [Anzahl] passed
Review: ✅ Keine Issues

Zum Selbst-Prüfen: [curl-Befehl / Storybook-URL / UI-Pfad]

Weiter? (Oder möchtest du erst prüfen?)
```

**Warte auf Bestätigung.**

## Red Flags — STOP

- Code vor Test geschrieben → Löschen, TDD neu starten
- Entscheidung selbst getroffen → Rückgängig, Entwickler fragen
- Tests nicht ausgeführt → Sofort nachholen
- Review übersprungen → Sofort nachholen
- Weitergemacht ohne Entwickler-OK → STOP, Ergebnis zeigen
- Playwright-Test geschrieben → Löschen, Storybook-Test stattdessen
- Kontext nicht gesammelt → STOP, erst lesen

## Pflichtschritt: Dokumentation aktualisieren

Vor dem Abschluss MUSS die Dokumentation aktualisiert werden:

1. **CLAUDE.md** — Neues Feature unter Keyfeatures dokumentieren, neue API-Endpunkte in die API-Tabelle eintragen
2. **data-model.mmd** — Bei Schema-Änderungen das Mermaid-Diagramm aktualisieren

**Akzeptanzkriterien:**
- [ ] CLAUDE.md enthält Feature-Beschreibung
- [ ] CLAUDE.md API-Tabelle enthält alle neuen Endpunkte
- [ ] data-model.mmd ist konsistent mit dem Prisma-Schema (falls Schema geändert)

## Abschluss

```
Feature abgeschlossen! 🏁

Zusammenfassung:
- [N] Schritte umgesetzt
- [Anzahl] Tests geschrieben, alle ✅
- [Anzahl] Storybook-Stories (falls Frontend)
- [Anzahl] Commits
- Dokumentation aktualisiert (CLAUDE.md, data-model.mmd)

Finale Verifikation:
npx vitest run → [Ergebnis]
npx vitest --project=storybook → [Ergebnis]
npm run lint → [Ergebnis]

Nächste Schritte?
```

## Common Mistakes

| Fehler | Lösung |
|--------|--------|
| Sofort losimplementieren ohne Kontext | Erst CLAUDE.md, Datenmodell, betroffene Dateien lesen |
| Keinen Ansatz vorschlagen | Immer erst Vorschlag + Bestätigung |
| "Kleines Feature, braucht keine TDD" | Jedes Feature bekommt TDD. Keine Ausnahmen. |
| Zu viele Schritte auf einmal | Pro Schritt: implementieren → testen → reviewen → zeigen |
| Kontext-Sammlung überspringen | Ohne Kontext falsche Annahmen → Nacharbeit |

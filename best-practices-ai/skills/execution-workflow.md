# Execution Workflow — Best Practice

## Kernprinzip

Agent schlaegt vor, Entwickler entscheidet.
Kein Schritt ohne Bestaetigung — erst planen, dann ausfuehren.

> Hinweis: Planung und Execution werden kuenftig als separate Skills bereitgestellt.

---

## Phase 1: Planung

**Ziel:** Erst Richtung klaeren (Grobplanung), dann auf Code-Ebene konkretisieren (Feinplanung) — kein Code ohne bestaetigen Plan.

### 1a. Grobplanung

1. Anforderung beschreiben (Feature, Aenderung, Problem)
2. Agent erstellt Grobplan:
   - Auflistung der betroffenen Bereiche
   - Vorschlag fuer Reihenfolge der Tasks
   - Offene Designentscheidungen (mit Optionen)
3. Entwickler beantwortet Designfragen und bestaetigt Reihenfolge
4. **Akzeptanzkriterium erfuellt → weiter zur Feinplanung**
5. Jeder Schritt sollt eine

Typische Designentscheidungen in der Grobplanung:

- Neue Abhaengigkeit einfuehren — ja/nein?
- Architektur-Ansatz (z.B. Event-basiert vs. direkte Abhaengigkeit)
- DB-Schema-Aenderungen — Migrationsweg?
- Oeffentliche API-Aenderungen — Breaking change?

### 1b. Feinplanung (TDD-orientiert)

1. Agent erstellt Feinplan pro Task nach TDD-Reihenfolge:
   - Welche Dateien werden bearbeitet?
   - Vorher/Nachher-Vergleich des Codes (Pseudocode oder Diff-Skizze)
   - Welche Tests werden zuerst geschrieben (Red)?
   - Welche Implementierung bringt sie zum Laufen (Green)?
   - Wo wird refaktoriert (Refactor)?
   - Akzeptanzkriterien fuer diesen Task
2. Entwickler prueft Feinplan und gibt Feedback
3. **Akzeptanzkriterium erfuellt → Execution startet**

---

## Phase 2: Execution

**Ziel:** Tasks ausfuehren — einen nach dem anderen, mit Pruefung.
**Immer in einem Git Worktree** — so kann parallel auf derselben Maschine gearbeitet werden.

### Git Worktree einrichten

```bash
git worktree add .worktrees/<feature-name> -b feature/<feature-name>
```

- Jeder Task oder jedes Feature laeuft in einem eigenen Worktree
- Mehrere Agenten oder Entwickler koennen gleichzeitig arbeiten, ohne sich gegenseitig zu blockieren
- Nach Abschluss: `git worktree remove .worktrees/<feature-name>`

### Ablauf fuer grosse Aufgaben

1. Worktree anlegen (aus Planungs-Ergebnis)
2. Pro Task:
   a. Agent kuendigt Task an und erklaert Vorgehen
   b. Entwickler bestaetigt oder aendert Vorgehen
   c. Agent fuehrt aus nach TDD (Test schreiben → Red → Implementierung → Green → Refactor)
   d. Entwickler prueft Ergebnis gegen Akzeptanzkriterien
   e. Commit im Worktree
3. Nach jedem 3. Task: Kurze Retrospektive
   - "Sind wir noch auf Kurs?"
   - "Muss der Plan angepasst werden?"

### Ablauf fuer kleine Aenderungen

1. Worktree anlegen
2. Kurze Beschreibung der Aenderung
3. Agent schlaegt Loesung vor (mit Vorher/Nachher)
4. Entwickler bestaetigt
5. Agent implementiert + Test (TDD)
6. Commit im Worktree

---

## Entscheidungspunkte (wo der Agent IMMER stoppen soll)

- Neue Abhaengigkeiten einfuehren
- Architektur-Entscheidungen
- DB-Schema-Aenderungen
- Oeffentliche API-Aenderungen
- Unklare oder mehrdeutige Anforderungen

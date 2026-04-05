# Execution Workflow — Best Practice

## Kernprinzip
Agent schlaegt vor, Entwickler entscheidet.
Kein Schritt ohne Bestaetigung — erst planen, dann ausfuehren.

> Hinweis: Planung und Execution werden kuenftig als separate Skills bereitgestellt.

---

## Phase 1: Planung

**Ziel:** Erst Richtung klaeren (Grobplanung), dann auf Code-Ebene konkretisieren (Feinplanung) — kein Code ohne bestaetigen Plan.

### 1a. Grobplanung → Planungsdokument

1. Anforderung beschreiben (Feature, Aenderung, Problem)
2. Agent erstellt Grobplan und **legt eine Planungsdatei an** (z.B. `docs/plans/YYYY-MM-DD-<feature>.md`)
3. Entwickler beantwortet Designfragen und bestaetigt Reihenfolge
4. **Planungsdatei wird committet — sie ist die Grundlage fuer alle weiteren Schritte**

#### Aufbau der Planungsdatei

```markdown
# Plan: <Feature-Name>

## Ziele
- Was soll nach Abschluss moeglich sein?
- Warum wird dieses Feature gebaut?

## Gesamt-Akzeptanzkriterien (Ticket-Ebene)
- [ ] Kriterium 1
- [ ] Kriterium 2
- [ ] ...

## Offene Designentscheidungen
- Frage 1: Option A vs. Option B → Entscheidung: ...
- ...

## Tasks

### Task 1: <Name>
- Beschreibung
- Betroffene Bereiche
- Akzeptanzkriterien:
  - [ ] ...
  - [ ] ...

### Task 2: <Name>
- ...

## Validierungsschritte (nach Abschluss aller Tasks)
- [ ] ...
```

Typische Designentscheidungen in der Grobplanung:
- Neue Abhaengigkeit einfuehren — ja/nein?
- Architektur-Ansatz (z.B. Event-basiert vs. direkte Abhaengigkeit)
- DB-Schema-Aenderungen — Migrationsweg?
- Oeffentliche API-Aenderungen — Breaking change?

### 1b. Feinplanung (TDD-orientiert)

1. Agent konkretisiert jeden Task aus der Planungsdatei nach TDD-Reihenfolge:
   - Welche Dateien werden bearbeitet?
   - Vorher/Nachher-Vergleich des Codes (Pseudocode oder Diff-Skizze)
   - Welche Tests werden zuerst geschrieben (Red)?
   - Welche Implementierung bringt sie zum Laufen (Green)?
   - Wo wird refaktoriert (Refactor)?
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
   d. Entwickler prueft Ergebnis gegen Akzeptanzkriterien des Tasks (aus Planungsdatei)
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

## Phase 3: Abschlussvalidierung

Nach Abschluss aller Tasks werden die Gesamt-Akzeptanzkriterien aus der Planungsdatei geprueft.

### Automatische Validierung (Empfehlung)

Enthalten die Akzeptanzkriterien **grafische oder UI-bezogene Pruefpunkte**, soll ein Agent die Validierung einmalig automatisiert durchfuehren — anstatt dass der Entwickler manuell klickt.

**Beispiel: Playwright-Agent fuer Frontend-Validierung**

```
Agent (mit Playwright Skill):
  Lies die Akzeptanzkriterien aus docs/plans/YYYY-MM-DD-<feature>.md.
  Oeffne die Anwendung und pruefe jeden Punkt:
  - Ist das Element sichtbar?
  - Reagiert es korrekt auf Interaktion?
  - Stimmt das visuelle Ergebnis mit der Beschreibung ueberein?
  Erstelle einen Validierungsbericht mit Pass/Fail pro Kriterium.
```

Der Agent arbeitet die Kriterien durch und liefert einen strukturierten Bericht.
Der Entwickler prueft nur noch den Bericht — kein manuelles Durchklicken.

**Wann lohnt sich das?**

| Szenario | Automatische Validierung sinnvoll? |
|---|---|
| Reine Logik / Backend | Nein — Unit-/Integrationstests reichen |
| UI-Aenderungen (Layout, Farben, Formulare) | Ja — Playwright-Agent |
| Komplexe Nutzerflows (Login, Checkout) | Ja — Playwright-Agent |
| Barrierefreiheit (a11y) | Ja — spezialisierter Agent |

### Manueller Fallback

Kann kein Agent die Pruefung uebernehmen, werden die Akzeptanzkriterien manuell abgehakt und die Planungsdatei entsprechend aktualisiert.

---

## Entscheidungspunkte (wo der Agent IMMER stoppen soll)
- Neue Abhaengigkeiten einfuehren
- Architektur-Entscheidungen
- DB-Schema-Aenderungen
- Oeffentliche API-Aenderungen
- Unklare oder mehrdeutige Anforderungen

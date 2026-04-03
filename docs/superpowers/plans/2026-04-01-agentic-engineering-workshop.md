# Agentic Engineering Workshop — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete 3.5-4h workshop (Marp slides + best-practices repository + use cases) that teaches developers structured agentic engineering workflows.

**Architecture:** The workshop consists of 4 Marp slide decks (one per block), a best-practices repository with working examples (AGENTS.md templates, skills, plugin recommendations), graded use cases, and a consolidated reference collection. Each block's slides and associated repo artifacts are developed together. Research gates are resolved inline before content creation.

**Tech Stack:** Marp (Markdown slides with YAML frontmatter), Markdown for all repo content, no build tooling beyond Marp CLI.

**Spec:** `docs/superpowers/specs/2026-03-31-agentic-engineering-workshop-design.md`

**Slide-Regel:** Jede inhaltliche Section (1.1, 1.2, 2.1, ...) erhaelt am Ende eine **Link-Folie** mit den 3-5 relevantesten Quellen/Links zum Thema. Format:
```markdown
---
# Quellen & Weiterlesen — [Thema]
- [Titel](URL) — Kurzbeschreibung
- [Titel](URL) — Kurzbeschreibung
```
Diese Link-Folien sind fuer Teilnehmer, die sich vertiefen wollen.

**Existing assets:**
- `docs/quotes-ai-future-of-coding.md` — researched quotes with sources (ready to use)
- `example-repo-perplexity/` — AGENTS.md examples, agent personas, linklist (research material)
- `example-skills/` — agentic-python-feature skill example (research material)
- `Aufgabe.md` — original task description (context only)

---

## Chunk 1: Repository-Setup & Marp-Konfiguration

### Task 1: Create directory structure

**Files:**
- Create: `slides/assets/.gitkeep`
- Create: `best-practices/agents-md/.gitkeep`
- Create: `best-practices/skills/.gitkeep`
- Create: `best-practices/plugins/.gitkeep`
- Create: `best-practices/kontext-management/.gitkeep`
- Create: `best-practices/dokumentation/.gitkeep`
- Create: `best-practices/antipatterns/.gitkeep`
- Create: `use-cases/01-einfach/.gitkeep`
- Create: `use-cases/02-mittel/.gitkeep`
- Create: `use-cases/03-komplex/.gitkeep`
- Create: `referenzen/.gitkeep`

- [ ] **Step 1: Create all directories with .gitkeep files**

Create each directory listed above with an empty `.gitkeep` file. This matches the repo structure defined in the spec section "Code-Repository Struktur".

- [ ] **Step 2: Commit**

```bash
git add slides/ best-practices/ use-cases/ referenzen/
git commit -m "chore: create workshop repository directory structure"
```

### Task 2: Set up Marp configuration and theme

**Files:**
- Create: `slides/marp.config.js`
- Create: `slides/theme-contact.css`
- Create: `package.json` (root, minimal — Marp CLI only)

- [ ] **Step 1: Create package.json with Marp CLI dependency**

```json
{
  "name": "vortrag-agentic-ai",
  "version": "1.0.0",
  "private": true,
  "description": "Workshop: Agentic Engineering — Slides & Best Practices",
  "scripts": {
    "slides:dev": "npx @marp-team/marp-cli --watch slides/",
    "slides:build": "npx @marp-team/marp-cli slides/ --output dist/",
    "slides:pdf": "npx @marp-team/marp-cli slides/ --pdf --output dist/"
  },
  "devDependencies": {
    "@marp-team/marp-cli": "^4.1.0"
  }
}
```

- [ ] **Step 2: Create custom theme CSS**

Create `slides/theme-contact.css` with a clean, professional theme. Key properties:
- Dark blue header bar (`#1a365d`) for Dataciders branding
- White slide background, dark text
- Monospace code blocks with subtle background
- Speaker-note-friendly layout (not too much text per slide)
- Max 6 bullet points per slide guidance via CSS comment

```css
/* @theme contact */
@import 'default';

:root {
  --color-primary: #1a365d;
  --color-accent: #2b6cb0;
  --color-text: #1a202c;
  --color-bg: #ffffff;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

section {
  background-color: var(--color-bg);
  color: var(--color-text);
  padding: 40px 60px;
}

section::after {
  /* Page number styling */
  color: #718096;
  font-size: 0.7em;
}

h1 {
  color: var(--color-primary);
  border-bottom: 3px solid var(--color-accent);
  padding-bottom: 0.3em;
}

h2 {
  color: var(--color-accent);
}

code {
  background: #edf2f7;
  padding: 2px 6px;
  border-radius: 3px;
}

pre {
  background: #2d3748;
  color: #e2e8f0;
  border-radius: 8px;
  padding: 1em;
}

blockquote {
  border-left: 4px solid var(--color-accent);
  background: #ebf8ff;
  padding: 0.5em 1em;
  font-style: italic;
}

table {
  font-size: 0.85em;
}

/* Title slide */
section.lead h1 {
  font-size: 2.2em;
  text-align: center;
  border: none;
}
```

- [ ] **Step 3: Create Marp config**

Create `slides/marp.config.js`:

```javascript
module.exports = {
  allowLocalFiles: true,
  themeSet: ['./theme-contact.css'],
}
```

- [ ] **Step 4: Verify Marp renders**

```bash
npm install
npx @marp-team/marp-cli --version
```

Expected: Marp CLI version output, no errors.

- [ ] **Step 5: Commit**

```bash
git add package.json slides/marp.config.js slides/theme-contact.css
git commit -m "feat: add Marp CLI setup with Dataciders theme"
```

### Task 3: Create slide deck scaffolds (all 4 blocks)

**Files:**
- Create: `slides/block-1-grundlagen.md`
- Create: `slides/block-2-anforderung-plan.md`
- Create: `slides/block-3a-praxis-execution-testing-frontend.md`
- Create: `slides/block-3b-praxis-reviews-bugfixing-abschluss.md`

- [ ] **Step 1: Create scaffold for each slide deck**

Each deck gets identical Marp frontmatter and a title slide only. Content will be added in subsequent chunks. Example for Block 1:

```markdown
---
marp: true
theme: contact
paginate: true
header: 'Agentic Engineering Workshop'
footer: 'Thomas Hein | Dataciders | 2026'
---

<!-- _class: lead -->

# Block 1: Grundlagen & Orientierung

**Workshop: Agentic Engineering**
Thomas Hein — Dataciders

<!--
Dauer: ~45 Minuten
Ziel: Grundverstaendnis schaffen, Orientierung geben, Motivation aufbauen
-->
```

Repeat for blocks 2, 3a, 3b with their respective titles and durations:
- Block 2: "Von der Anforderung zum Plan" (~50min)
- Block 3a: "Praxis I — Execution, Testing, Frontend" (~45min)
- Block 3b: "Praxis II — Reviews, Bugfixing, Abschluss" (~45min)

- [ ] **Step 2: Verify all 4 decks render**

```bash
npx @marp-team/marp-cli slides/block-1-grundlagen.md --output /dev/null
```

Expected: No errors for each deck.

- [ ] **Step 3: Commit**

```bash
git add slides/block-*.md
git commit -m "feat: add slide deck scaffolds for all 4 workshop blocks"
```

### Task 4: Consolidate existing references

**Files:**
- Create: `referenzen/quellen.md`
- Create: `referenzen/videos.md`
- Existing: `docs/quotes-ai-future-of-coding.md` (source)
- Existing: `example-repo-perplexity/linklist.md` (source)

- [ ] **Step 1: Create referenzen/quellen.md**

Merge content from:
1. `docs/quotes-ai-future-of-coding.md` — copy the "Quick Reference: Top Quotes" table and all source URLs
2. `example-repo-perplexity/linklist.md` — copy all categorized links

Structure the file as:

```markdown
# Quellen & Referenzen

## Zitate (fuer Slides)
[Table from quotes file]

## Links nach Themen
[Categorized links from linklist]

## Buecher & Papers
- arXiv: "Vibe Coding vs. Agentic Coding: Fundamentals" (Mai 2025)
[Add others from spec references section]
```

- [ ] **Step 2: Create referenzen/videos.md**

Extract video references from the spec and existing research:

```markdown
# Video-Referenzen

## Demos & Tutorials
- GitHub Blog: "Real-world demo: Using different AI models in Copilot" (Kedasha Kerr)
- Microsoft Learn: "Ask, Edit, Agent — In-depth Overview"

## Konferenz-Vortraege
- QCon London 2025: "From Autocomplete to Agents" (Birgitta Boeckeler, Thoughtworks)

## Erklaervideos
- DEV Community: "Forget the Hype: Agents are Loops"
- Oracle: "What Is the AI Agent Loop?"
- Steve Kinney: "The Anatomy of an Agent Loop"
```

Note: Actual YouTube/video URLs need to be researched and added during slide creation tasks. Mark each entry without a URL with `[URL RECHERCHIEREN]`. **These markers are intentionally deferred — they will be resolved in Task 29 (Chunk 6: Finalize referenzen/videos.md).**

- [ ] **Step 3: Commit**

```bash
git add referenzen/
git commit -m "feat: consolidate existing references into referenzen/"
```

---

## Chunk 2: Block 1 — Grundlagen & Orientierung (Slides)

### Task 5: Slide 1.1 — Einstieg: Blick in die Zukunft

**Files:**
- Modify: `slides/block-1-grundlagen.md`
- Reference: `docs/quotes-ai-future-of-coding.md` (quotes with sources)

- [ ] **Step 1: Write slides for section 1.1**

Append to `slides/block-1-grundlagen.md` after the title slide. Create these slides:

**Slide: Icebreaker**
```markdown
---

# Blick in die Zukunft — Was bleibt fuer uns uebrig?

> "Wer von euch findet gut, was gerade in der Softwareentwicklung passiert?"

<!--
Icebreaker: Handzeichen. Erzeugt sofort eine Diskussion.
Erwartung: gemischte Reaktionen — genau das ist der Punkt.
-->
```

**Slide: Die grosse Debatte (Zitate)**
```markdown
---

# Die grosse Debatte

> "Nobody has to program. The programming language is human."
> — Jensen Huang, 2024

> "This is the best time yet to learn to code."
> — Bill Gates, 2025

> "You are orchestrating agents who do and acting as oversight."
> — Andrej Karpathy, 2026

<!--
Drei Perspektiven: Ersetzung, Empowerment, Evolution.
Karpathy gibt die Antwort: Die Rolle aendert sich, verschwindet aber nicht.
Quellen: docs/quotes-ai-future-of-coding.md
-->
```

**Slide: Zahlen und Fakten**
```markdown
---

# Zahlen und Fakten

| Unternehmen | AI-generierter Code | Quelle |
|-------------|--------------------:|--------|
| Google      | >30%                | Pichai, Q1 2025 |
| Microsoft   | 20-30%              | Nadella, Apr 2025 |
| Meta        | Ziel: 50% bis 2026  | Zuckerberg, 2025 |

- **Gartner:** 90% der Enterprise-Entwickler nutzen AI bis 2028
- **Aber:** 2500% mehr Defekte durch unkontrollierte AI-Nutzung

<!--
Die Zahlen zeigen: AI-Code ist Realitaet.
Die Gartner-Warnung ist der Schluessel: UNKONTROLLIERT ist das Problem.
Genau deshalb brauchen wir Methodik — das ist die Bruecke zum Rest des Workshops.
-->
```

**Slide: Kernthese**
```markdown
---

# Kernthese des Workshops

1. Softwareentwicklung wird **niederschwelliger**
2. Es wird relevanter, Agenten zu **beherrschen** und praezise auszudruecken was gefordert ist
3. Die Rolle verschiebt sich: **Code-Schreiber → Architekt, Steuermann, Qualitaetssicherer**
4. **Der Entwickler wird zum Boss des Agenten, nicht umgekehrt**

<!--
Punkt 4 ist die zentrale Botschaft des gesamten Workshops.
Ueberleitung: "Wie machen wir das konkret? Dafuer gibt es ein Modell."
-->
```

- [ ] **Step 2: Verify deck renders**

```bash
npx @marp-team/marp-cli slides/block-1-grundlagen.md --output /dev/null
```

- [ ] **Step 3: Commit**

```bash
git add slides/block-1-grundlagen.md
git commit -m "feat(slides): add Block 1.1 — Einstieg und Kernthese"
```

### Task 6: Slide 1.2 — Das 4-Stufen-Modell

**Files:**
- Modify: `slides/block-1-grundlagen.md`

- [ ] **Step 1: Write slides for section 1.2**

**Slide: Das 4-Stufen-Modell (Uebersicht)**
```markdown
---

# Das 4-Stufen-Modell

| # | Ansatz | Input | Menschliche Rolle |
|---|--------|-------|-------------------|
| 1 | **Vibe Coding** | Kurze Phrasen, fachliche Wuensche | Fachanwender |
| 2 | **Spec-Driven (Business)** | Pflichtenheft, Use Cases | IT Consultant |
| 3 | **Spec-Driven (Technical)** | UML, ERM, Architektur | Architekt |
| 4 | **Agentic Engineering** | Anforderungen + kollaborative Umsetzung | Architekt/Entwickler |

<!--
Besonderheit: Die meisten Frameworks kategorisieren nach AI-Autonomie.
Unser Modell kategorisiert nach MENSCHLICHER ROLLE — greifbarer fuer Entwickler.
Begriffe: Vibe Coding (Karpathy 2025), Spec-Driven (Thoughtworks), Agentic Engineering (Karpathy 2026).
Business vs. Technical Spec ist unser eigener Beitrag.
-->
```

**Slide: Nicht jede Stufe ist schlecht**
```markdown
---

# Wann welche Stufe?

- **Vibe Coding:** Prototypen, Demos, Wegwerf-Experimente
- **Spec-Driven (Business):** Wenn Fachbereich fuehrt, wenig technische Tiefe noetig
- **Spec-Driven (Technical):** Neue Systeme, klare Architektur, gruene Wiese
- **Agentic Engineering:** Produktionscode, bestehende Systeme, Qualitaet entscheidend

> Kleine UI-Aenderung ≠ neues Modul — die Methodik muss zur Aufgabe passen.

<!--
Entscheidungsfaktoren: Aufgabengroesse x Risiko x Komplexitaet.
Wichtig: Niemanden verurteilen, der Vibe Coding nutzt — es hat seinen Platz.
Der Workshop fokussiert auf Stufe 4, weil das unser Arbeitsalltag ist.
-->
```

- [ ] **Step 2: Commit**

```bash
git add slides/block-1-grundlagen.md
git commit -m "feat(slides): add Block 1.2 — 4-Stufen-Modell"
```

### Task 7: Slide 1.3 — Wie funktioniert ein Coding Agent?

**Files:**
- Modify: `slides/block-1-grundlagen.md`

- [ ] **Step 1: Research images for agent architecture**

Search for publicly available images/diagrams to embed or reference:
1. **Agent Loop:** Search "DEV Community Forget the Hype Agents are Loops diagram" — find the blog post URL and its agent-loop diagram
2. **5-Step Agent Loop:** Search "Oracle What Is the AI Agent Loop diagram" — Perceive/Reason/Plan/Act/Observe
3. **MCP Architecture:** Go to `modelcontextprotocol.io` — find the Host-Client-Server architecture diagram
4. **Copilot Modes:** Search "GitHub Blog Copilot Ask Edit Agent modes comparison" — find the comparison graphic

**Verification:** An image counts as "found" when you have a public source URL and can confirm the image is visible in the blog/docs page.

**Output format per image:**
- If directly linkable: `![description](URL)` in slide + source URL in speaker notes
- If not embeddable (licensing/paywall): `[BILD: description — Quelle: URL]` as placeholder in slide, note in speaker notes to screenshot or recreate

**Fallback:** If a specific image cannot be found, describe the concept textually with bullet points on the slide and note in speaker notes that a diagram should be created or an alternative found before the workshop.

- [ ] **Step 2: Write slides for section 1.3**

**Slide: LLM + Tools + Kontext = Agent**
```markdown
---

# Wie funktioniert ein Coding Agent?

**LLM + Tools + Kontext = Agent**

Der Kreislauf:
1. **Prompt** empfangen
2. **Denken** (Reasoning)
3. **Tool aufrufen** (Dateien lesen, Code schreiben, Tests ausfuehren)
4. **Ergebnis** auswerten
5. **Weiter denken** oder antworten

<!--
Kernkonzept: Ein Agent ist eine Schleife, kein einzelner Aufruf.
Zeige hier das Agent-Loop-Diagramm von DEV Community oder Oracle.
Referenz: "Forget the Hype: Agents are Loops" (DEV Community)
-->
```

**Slide: Autocomplete vs. Chat vs. Agent**

Reference the CodeRabbit timeline graphic or GitHub Copilot modes comparison.

```markdown
---

# Autocomplete → Chat → Agent

| Modus | Wie es funktioniert | Beispiel |
|-------|--------------------:|---------|
| **Autocomplete** | Inline-Vorschlaege beim Tippen | Tab-Completion in IDE |
| **Chat** | Frage-Antwort im Seitenpanel | "Erklaere diese Funktion" |
| **Agent** | Autonome Ausfuehrung mit Tool-Zugriff | "Implementiere Feature X mit Tests" |

<!--
Copilot bietet alle 3 Modi: Ask, Edit, Agent.
Referenz: GitHub Blog "Copilot Ask, Edit, Agent modes"
Agent-Modus ist das, was wir heute lernen zu steuern.
-->
```

**Slide: Das Oekosystem**
```markdown
---

# Das Oekosystem eines Coding Agents

- **Skills/Rules:** Vordefinierte Workflows und Regeln (z.B. TDD-Skill)
- **Plugins:** Erweiterungen (z.B. Context7 fuer aktuelle Doku)
- **MCP-Server:** Externe Datenquellen anbinden (DB, Jira, Git)
- **Hooks:** Automatische Aktionen bei bestimmten Events

<!--
MCP = Model Context Protocol (Anthropic, jetzt offener Standard).
Zeige hier das MCP-Architekturdiagramm von modelcontextprotocol.io.
Wird in Block 3 vertieft — hier nur Ueberblick.
-->
```

- [ ] **Step 3: Commit**

```bash
git add slides/block-1-grundlagen.md
git commit -m "feat(slides): add Block 1.3 — Funktionsweise Coding Agent"
```

### Task 8: Slide 1.4 — Wie aendert sich unsere Arbeitsweise?

**Files:**
- Modify: `slides/block-1-grundlagen.md`

- [ ] **Step 1: Write slides for section 1.4**

**Slide: Vom Tipper zum Steuermann**
```markdown
---

# Wie aendert sich unsere Arbeitsweise?

**Vom Code-Tipper zum Architekten und Steuermann**

- Du schreibst weniger Code — du **steuerst** mehr
- Pair-Programming mit dem Agenten: Zu zweit den Agenten steuern
- Fokus verschiebt sich: Technische Qualitaet, Fachlichkeit, Konzeptionsfaehigkeit

<!--
Konkret: Im Planning-Modus zu zweit vor einem Bildschirm.
Einer formuliert die Anforderung, der andere prueft die Agent-Vorschlaege.
-->
```

**Slide: Hypothese Teams**
```markdown
---

# Hypothese: Was bedeutet das fuer Teams?

- Teams werden **kleiner** — max. 2 Entwickler pro Product Owner
- **Anforderungsaufnahme wird laenger** als die Entwicklung
- Der Product Owner wird zum Engpass, nicht der Entwickler
- Qualitaet der Anforderungen bestimmt Qualitaet des Ergebnisses

<!--
Provokante These — zur Diskussion stellen.
Referenz: Anthropic 2026 Agentic Coding Trends Report
-->
```

- [ ] **Step 2: Commit**

```bash
git add slides/block-1-grundlagen.md
git commit -m "feat(slides): add Block 1.4 — Aenderung der Arbeitsweise"
```

### Task 9: Slide 1.5 — Demo: Gleiche Aufgabe, zwei Ansaetze

**Files:**
- Modify: `slides/block-1-grundlagen.md`

- [ ] **Step 1: Research demo options**

Search for suitable demos to embed or recreate:
1. Search for "GitHub Blog Real-world demo Using different AI models Copilot Kedasha Kerr" — find video URL
2. Search for "QCon London 2025 From Autocomplete to Agents Birgitta Boeckeler video" — find video URL
3. Evaluate: Is a live demo feasible? If yes, create a simple Python task (e.g., "build a CLI calculator with input validation") and prepare two approaches:
   - Vibe Coding: just type "build me a calculator" and accept everything
   - Agentic: spec → plan → TDD → implementation

- [ ] **Step 2: Write slides for section 1.5**

**Slide: Demo-Ankuendigung**
```markdown
---

# Demo: Gleiche Aufgabe, zwei Ansaetze

**Aufgabe:** _[ENTSCHEIDUNGSPUNKT: Thomas waehlt Demo-Aufgabe vor Workshop]_

| | Vibe Coding | Agentic Engineering |
|---|---|---|
| **Input** | "Bau mir X" | Spec → Plan → TDD |
| **Designentscheidungen** | Agent entscheidet | Entwickler entscheidet |
| **Tests** | Vielleicht | Erst Test, dann Code |
| **Nachvollziehbarkeit** | Gering | Hoch (Plan, Commits, Doku) |

<!--
Option A: Live-Demo (empfohlen, ~10min).
Option B: Aufgezeichnetes Video oder Chat-Mitschnitt.
Option C: Referenz-Video von GitHub Blog oder QCon.
Entscheidung: [Thomas waehlt vor dem Workshop]
-->
```

- [ ] **Step 3: Commit**

```bash
git add slides/block-1-grundlagen.md
git commit -m "feat(slides): add Block 1.5 — Demo Vibe Coding vs. Agentic"
```

---

## Chunk 3: Block 2 — Von der Anforderung zum Plan (Slides + Repo-Artefakte)

### Task 10: Research — Kontextmanagement Community-Ansaetze

**Files:**
- Create: `best-practices/kontext-management/community-ansaetze.md`

This is a **research gate** from the spec: "Verschiedene Community-Ansaetze zum Kontextmanagement sammeln, Thomas die Stroeme vorstellen und entscheiden lassen welchen Weg er gehen moechte."

- [ ] **Step 1: Web research on context management approaches**

Research and compare these community approaches:

1. **AGENTS.md / .github/copilot-instructions.md** — standard approach (GitHub, GitLab)
2. **CLAUDE.md** — Anthropic's approach for Claude Code
3. **Rules files** (Cursor rules, Windsurf rules) — IDE-specific
4. **MCP-based context** — dynamic context via MCP servers
5. **Kontext-Schichten** (always-on / task-specific / ephemeral) — as described in spec 2.2
6. **Workspace-based** — VS Code multi-root workspaces for cross-repo context

Search queries:
- "AGENTS.md vs CLAUDE.md vs copilot-instructions context management 2026"
- "context engineering coding agents best practices"
- "Martin Fowler context engineering coding agents"
- "Anthropic effective context engineering AI agents"

- [ ] **Step 2: Write community-ansaetze.md**

Structure as a comparison document:

```markdown
# Kontextmanagement — Community-Ansaetze

## Ansatz 1: AGENTS.md (GitHub/GitLab Standard)
- Wie: Markdown-Datei im Repo-Root
- Vorteile: [aus Step 1 Recherche befuellen — keine Platzhalter im Endergebnis]
- Nachteile: [aus Step 1 Recherche befuellen]
- Tools: GitHub Copilot, GitLab Duo
- Referenz: https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/

## Ansatz 2: CLAUDE.md + Hierarchie
- Wie: Verschachtelte .claude/ Verzeichnisse
- Vorteile: [aus Step 1 Recherche befuellen]
- Nachteile: [aus Step 1 Recherche befuellen]

## Ansatz 3: IDE-spezifische Rules
- Wie: .cursorrules, .windsurfrules
- Vorteile: [aus Step 1 Recherche befuellen]
- Nachteile: [aus Step 1 Recherche befuellen]

## Ansatz 4: MCP-basierter dynamischer Kontext
- Wie: MCP-Server liefern Kontext on demand
- Vorteile: [aus Step 1 Recherche befuellen]
- Nachteile: [aus Step 1 Recherche befuellen]

## Empfehlung fuer professionelle Softwareentwicklung
Basierend auf den Recherche-Ergebnissen: Allgemeine Empfehlung formulieren,
die fuer professionelle Entwicklungsteams gilt — unabhaengig von konkretem Toolstack.
Kriterien: Tool-Agnostik, Versionierbarkeit, Team-Skalierbarkeit, Wartbarkeit.
```

- [ ] **Step 3: Commit**

```bash
git add best-practices/kontext-management/community-ansaetze.md
git commit -m "research: context management community approaches comparison"
```

### Task 11: Slide 2.1 — Kontextmanagement

**Files:**
- Modify: `slides/block-2-anforderung-plan.md`
- Create: `best-practices/kontext-management/kontext-schichten.md`

- [ ] **Step 1: Write slides for section 2.1**

**Slide: Kontextmanagement — Das Fundament**
```markdown
---

# Kontextmanagement — Das Fundament

> "Ein Agent ist nur so gut wie sein Kontext"

- **AGENTS.md / Copilot Instructions** — dem Agenten das Projekt erklaeren
- **Kontext-Hygiene:** Irrelevantes entfernen, Relevantes fokussieren
- **Token-Budgets:** Nicht alles reinpacken — Relevanz > Vollstaendigkeit

<!--
Das ist DAS Kernthema. Ohne guten Kontext funktioniert nichts.
Praxisbeispiel: Contact Software — 20 Jahre alte Python-Plattform,
die LLMs nicht kennen. Wir MUESSEN dem Agenten erklaeren, wie sie funktioniert.
-->
```

**Slide: 3-Schichten-Modell**
```markdown
---

# Die 3 Kontext-Schichten

| Schicht | Inhalt | Beispiel |
|---------|--------|----------|
| **Immer aktiv** | Konventionen, Architektur, Plattform | AGENTS.md, Coding Guidelines |
| **Aufgabenbezogen** | Feature-Specs, API-Docs, Modul-Doku | Spec fuer aktuelles Ticket |
| **Temporaer** | Recherche, Debugging-Kontext | Logfiles, Stacktraces |

<!--
Schicht 1 wird einmal aufgebaut und gepflegt.
Schicht 2 wechselt pro Aufgabe.
Schicht 3 wird nach der Aufgabe verworfen.
Details und Vorlage: best-practices/kontext-management/kontext-schichten.md
-->
```

**Slide: Tools zur Kontextverwaltung**
```markdown
---

# Tools zur Kontextverwaltung

- **`.github/copilot-instructions.md`** — Copilot-spezifisch, immer geladen
- **AGENTS.md** — Tool-agnostisch, wachsender Standard
- **VS Code Workspaces** — mehrere Repos als Kontext einbinden
- **MCP-Server** — dynamischer Kontext (DB-Schema, Jira-Tickets, Git-Historie)
- **Context7** — aktuelle Library-Dokumentation on demand

<!--
Empfehlung fuer das Team:
Copilot Instructions als gemeinsamer Nenner (VS Code + JetBrains).
Details: best-practices/kontext-management/community-ansaetze.md
-->
```

- [ ] **Step 2: Create kontext-schichten.md**

Write `best-practices/kontext-management/kontext-schichten.md` — a practical template:

```markdown
# Kontext-Schichten — Vorlage

## Schicht 1: Immer aktiv (Projekt-Baseline)
In `.github/copilot-instructions.md` oder `AGENTS.md`:
- Plattform-Beschreibung (Python 3.11, Frameworks, DB)
- Verzeichnisstruktur mit Erklaerung
- Coding Conventions (Naming, Error Handling, Logging)
- Test-Strategie und Kommandos
- Git-Workflow
- Bekannte Stolpersteine / Legacy-Bereiche

## Schicht 2: Aufgabenbezogen (wechselnd)
Je nach Ticket/Feature hinzuschalten:
- Feature-Spec oder User Story
- Relevante API-Docs / Modul-Dokumentation
- Architekturentscheidungen (ADRs) fuer den Bereich
- Code-Beispiele aus dem betroffenen Modul

## Schicht 3: Temporaer (Session-spezifisch)
Waehrend der Arbeit entstehend:
- Recherche-Ergebnisse (Web, Doku)
- Debugging-Kontext (Logs, Stacktraces)
- Hypothesen und Zwischenergebnisse
→ Nach Abschluss: verwerfen oder in Schicht 1/2 uebernahmen
```

- [ ] **Step 3: Commit**

```bash
git add slides/block-2-anforderung-plan.md best-practices/kontext-management/
git commit -m "feat(slides): add Block 2.1 — Kontextmanagement + Schichten-Vorlage"
```

### Task 12: Research — Dokumentation fuer Agenten

**Files:**
- Create: `best-practices/dokumentation/doku-fuer-agenten.md`

Research gate from spec: "Community-Ansaetze zur Dokumentationsverwaltung fuer Agenten sammeln."

- [ ] **Step 1: Web research on documentation for agents**

Search queries:
- "documentation for AI coding agents best practices 2026"
- "ADR architecture decision records AI agents"
- "where to put documentation code agents repo vs separate"
- "Addy Osmani LLM coding workflow documentation"

Key questions to answer:
1. Repo-intern vs. separates Doku-Repo — was funktioniert besser?
2. Welche Formate verstehen Agenten am besten? (Markdown, UML, Code-Beispiele)
3. Wie haelt man Doku aktuell, wenn der Agent sie mitnutzt?

- [ ] **Step 2: Write doku-fuer-agenten.md**

```markdown
# Dokumentation als Steuerungsinstrument

## Warum Doku wieder wichtig wird
- Dokumentation ist nicht mehr nur fuer Menschen — sie ist fuer den Agenten
- Gute Doku = besserer Agent-Output
- Fehlende Doku = Agent erfindet oder raet

## Empfohlene Formate
| Format | Wofuer | Agent-Verstaendnis |
|--------|--------|--------------------|
| Markdown | Alles | Exzellent |
| UML (PlantUML/Mermaid) | Architektur, Sequenzen | Gut |
| ADRs | Designentscheidungen | Exzellent |
| Code-Beispiele | Konventionen zeigen | Exzellent |
| JSON Schema | API-Vertraege | Gut |

## Nicht-funktionale Anforderungen (NFRs) festhalten
- Performance-Vorgaben, Latenz-Budgets, SLAs
- Security-Anforderungen (OWASP, Compliance)
- Skalierungsanforderungen
- Format: ADRs oder dedizierte NFR-Sektion in der Architektur-Doku
- NFRs gehoeren in Schicht 1 (immer aktiv) — Agent muss sie bei jeder Aenderung kennen

## Wo lebt die Doku? (progressive Verfuegbarkeit)
### Option A: Im Code-Repo (empfohlen fuer Agenten)
- Vorteil: Agent hat direkten Zugriff, Doku wird mit Code versioniert
- Nachteil: Kann Repo aufblaahen
- Progressive Nutzung: Agent zieht Doku automatisch via AGENTS.md-Referenz
### Option B: Separates Doku-Repo (via Workspace/MCP)
- Vorteil: Saubere Trennung, eigenes Review
- Nachteil: Agent braucht VS Code Workspace oder MCP-Server
- Progressive Nutzung: MCP-Server liefert Doku on demand per Query
### Empfehlung: Doku so nah am Code wie moeglich, damit der Agent sie progressiv (automatisch bei Bedarf) ziehen kann. Schicht-1-Doku immer im gleichen Repo.

## Dokumentation als lebendes Projekt
- Bei jedem Feature: relevante Doku mitaktualisieren
- Agent kann Doku-Updates vorschlagen (in PR-Beschreibung)
- Review-Schritt: "Ist die Doku noch aktuell?"
```

- [ ] **Step 3: Commit**

```bash
git add best-practices/dokumentation/doku-fuer-agenten.md
git commit -m "research: documentation practices for AI coding agents"
```

### Task 13: Slide 2.2 — Dokumentation als Steuerungsinstrument

**Files:**
- Modify: `slides/block-2-anforderung-plan.md`

- [ ] **Step 1: Write slides for section 2.2**

**Slide: Doku ist fuer den Agenten**
```markdown
---

# Dokumentation als Steuerungsinstrument

**Warum Dokumentation wieder wichtig wird: Sie ist fuer den Agenten.**

- Fehlende Doku = Agent erfindet oder raet
- Gute Doku = besserer, vorhersagbarer Output
- Dokumentation wird zum **Steuerungsinstrument**, nicht zum Papiertiger

<!--
Paradigmenwechsel: Frueher hat niemand Doku gelesen.
Jetzt liest der Agent sie IMMER — und handelt danach.
-->
```

**Slide: Empfohlene Formate**
```markdown
---

# Welche Formate fuer Agenten?

| Format | Wofuer | Agent-Verstaendnis |
|--------|--------|--------------------|
| **Markdown** | Alles | ★★★ Exzellent |
| **UML** (Mermaid) | Architektur, Ablaeufe | ★★☆ Gut |
| **ADRs** | Designentscheidungen | ★★★ Exzellent |
| **Code-Beispiele** | Konventionen zeigen | ★★★ Exzellent |
| **Coding Guidelines** | Standards durchsetzen | ★★★ Exzellent |

<!--
Praxistipp: Code-Beispiele sind das staerkste Format.
"Zeig dem Agenten wie es aussehen soll" > "Beschreib dem Agenten wie es aussehen soll"
-->
```

**Slide: Nicht-funktionale Anforderungen**
```markdown
---

# NFRs festhalten — auch fuer den Agenten

- **Performance:** Latenz-Budgets, SLAs, Skalierung
- **Security:** OWASP-Anforderungen, Compliance-Regeln
- **Verfuegbarkeit:** SLAs, Fallback-Strategien
- **Format:** ADRs oder NFR-Sektion in Architektur-Doku
- **Wo:** Schicht 1 (immer aktiv) — Agent muss NFRs bei jeder Aenderung kennen

<!--
NFRs werden oft vergessen — aber der Agent braucht sie,
um keine Performance-Killer oder Security-Luecken einzubauen.
Beispiel: "Max 200ms Response Time" verhindert, dass der Agent
eine N+1-Query einbaut.
-->
```

**Slide: 3 Doku-Schichten**
```markdown
---

# 3 Schichten der Dokumentation

1. **Immer aktiv:** Konventionen, Architektur, Plattform-Grundlagen
2. **Aufgabenbezogen:** Feature-Specs, API-Docs, Modul-Dokumentation
3. **Temporaer:** Recherche-Ergebnisse, Debugging-Kontext

> Dokumentation als lebendes Projekt — bei jedem Feature mitaktualisieren.

<!--
Parallel zu den 3 Kontext-Schichten aus 2.1.
Die Doku FUELLT die Kontext-Schichten.
Vorlage: best-practices/dokumentation/doku-fuer-agenten.md
-->
```

- [ ] **Step 2: Commit**

```bash
git add slides/block-2-anforderung-plan.md
git commit -m "feat(slides): add Block 2.2 — Dokumentation als Steuerungsinstrument"
```

### Task 14: Slide 2.3 — Brainstorming & Planning mit dem Agenten

**Files:**
- Modify: `slides/block-2-anforderung-plan.md`

- [ ] **Step 1: Write slides for section 2.3**

**Slide: Der Workflow**
```markdown
---

# Brainstorming & Planning mit dem Agenten

```
Anforderung → Brainstorming → Spec → Plan → Execution
```

1. **Brainstorming:** Anforderung verstehen, Optionen erkunden
2. **Spec:** Technische Spezifikation schreiben
3. **Plan:** Aufgaben in 5-20min Tasks zerlegen (TDD)
4. **Execution:** Task fuer Task umsetzen mit Entwickler-Checkpoints

<!--
Das ist der Kern des Agentic Engineering Workflows.
Demo: Eine Anforderung gemeinsam durchplanen.
Referenz: Addy Osmani "My LLM Coding Workflow 2026" / Martin Fowler "Humans and Agents"
[Workflow-Diagramm einbinden falls verfuegbar]
-->
```

**Slide: Grosse vs. kleine Aufgabe**
```markdown
---

# Wann volle Methodik, wann reduziert?

| Aufgabe | Methodik |
|---------|----------|
| Neues Modul / Feature | Brainstorming → Spec → Plan → TDD |
| Groesseres Refactoring | Plan → TDD |
| API-Aenderung | Spec → Plan → TDD |
| Kleine UI-Aenderung | Direkter Prompt mit Test |
| Bugfix (lokal) | Failing Test → Fix |
| Config-Aenderung | Direkter Prompt |

<!--
Nicht jede Aufgabe braucht den vollen Workflow.
Die Kunst ist, die richtige Stufe zu waehlen.
Faustregel: Wenn mehr als 2 Dateien betroffen → mindestens Plan.
-->
```

**Slide: Subagenten (Ausblick)**
```markdown
---

# Ausblick: Subagenten & Multi-Agent

- **Subagenten:** Spezialisierte Agenten fuer Teilaufgaben
  - Recherche-Agent, Test-Agent, Review-Agent
- **Koordination:** Hauptagent delegiert und integriert
- **Praxis heute:** Claude Code Subagents, GitHub Copilot Agent Mode

> Noch frueh — aber die Richtung ist klar.

<!--
Nicht Workshop-Fokus, aber wichtig zu erwaehnen.
Thomas nutzt bereits Subagent-Workflows (superpowers:subagent-driven-development).
-->
```

- [ ] **Step 2: Commit**

```bash
git add slides/block-2-anforderung-plan.md
git commit -m "feat(slides): add Block 2.3 — Brainstorming und Planning"
```

### Task 15: Research — Modelle und Kosten

**Files:**
- Create: `referenzen/modell-vergleich.md`

Research gate from spec: "Qwen-Modelle Recherche" + "Kosten-Recherche: Copilot Premium-Requests."

- [ ] **Step 1: Web research on models and costs**

Search queries:
- "GitHub Copilot premium requests pricing 2026 models comparison"
- "Claude Sonnet vs GPT-4o vs Gemini coding comparison 2026"
- "Qwen 2.5 Coder coding benchmark comparison"
- "GitHub Copilot billing premium requests how to reduce"

- [ ] **Step 2: Write modell-vergleich.md**

Fill all sections from Step 1 research. **No `[brackets]` or `...` placeholders may remain in the committed file.** Every cell must contain concrete findings.

```markdown
# Modell-Vergleich fuer Coding

## Copilot-verfuegbare Modelle (Stand April 2026)
| Modell | Version | Staerke | Schwaeche | Kosten |
|--------|---------|---------|-----------|--------|
| GPT / Codex | 5.3 | Breites Wissen, gute Codegenerierung | [aus Recherche] | Standard |
| Claude Sonnet | 4.6 | Praezise Instruktionsbefolgung, gute Planung | [aus Recherche] | Premium |
| Claude Opus | 4.6 | Beste Qualitaet, komplexe Aufgaben | Langsamer, teurer | Premium |
| Gemini | 3.1 | Grosses Kontextfenster, multimodal | [aus Recherche] | Standard |

## Open-Source-Modelle (lokal einsetzbar)
| Modell | Version | Staerke | Schwaeche |
|--------|---------|---------|-----------|
| Qwen Coder | 3.5 | [aus Recherche] | [aus Recherche] |
| DeepSeek Coder | [aktuell] | [aus Recherche] | [aus Recherche] |

## Welches Modell wofuer?
- **Planning/Architektur:** Claude Opus 4.6 oder Sonnet 4.6 (beste Instruktionsbefolgung)
- **Coding:** Codex 5.3 oder Claude Sonnet 4.6 (je nach Komplexitaet)
- **Review:** Claude 4.6 (beste Regelanalyse), Gemini 3.1 (groesserer Kontext)

## Kosten & Premium-Requests
- [Copilot-Abrechnungsmodell]
- [Wie entstehen Premium-Requests]
- [Einsparmethoden: Modellwahl, Kontextoptimierung]
```

- [ ] **Step 3: Commit**

```bash
git add referenzen/modell-vergleich.md
git commit -m "research: model comparison and cost overview for coding agents"
```

### Task 16: Slide 2.4 — Modelle und ihre Staerken

**Files:**
- Modify: `slides/block-2-anforderung-plan.md`

- [ ] **Step 1: Write slides for section 2.4**

**Slide: Welches Modell wofuer?**
```markdown
---

# Modelle und ihre Staerken

| Aufgabe | Empfohlenes Modell | Warum |
|---------|-------------------|-------|
| **Planning** | Claude Opus/Sonnet 4.6 | Beste Instruktionsbefolgung |
| **Coding** | Codex 5.3, Claude Sonnet 4.6 | Schnell + praezise |
| **Review** | Claude 4.6, Gemini 3.1 | Regelanalyse, grosser Kontext |
| **Recherche** | Gemini 3.1 | Grosses Kontextfenster |

<!--
Copilot erlaubt Modellwahl pro Aufgabe — das ist ein Vorteil.
Open Source: Qwen 2.5 Coder fuer lokale/offline-Szenarien.
Details: referenzen/modell-vergleich.md
-->
```

**Slide: Kosten im Griff**
```markdown
---

# Kosten im Griff behalten

- **Premium-Requests:** Entstehen bei Nutzung leistungsstaerkerer Modelle
- **Einsparen durch:**
  - Richtiges Modell fuer die richtige Aufgabe
  - Guten Kontext (weniger Iterationen = weniger Requests)
  - Standard-Modelle fuer einfache Aufgaben
- **Investition:** Bessere Methodik → weniger Nacharbeit → weniger Kosten

<!--
Konkrete Zahlen aus Task 15 Recherche hier einfuegen:
- Copilot Business vs. Enterprise: Premium-Request-Kontingente
- Preis pro Premium-Request, monatliches Limit
- Typische Einsparungen durch Modellwahl
Wenn Task 15 vor Task 16 ausgefuehrt wird, diese Daten direkt einsetzen.
-->
```

- [ ] **Step 2: Commit**

```bash
git add slides/block-2-anforderung-plan.md
git commit -m "feat(slides): add Block 2.4 — Modelle und Kosten"
```

---

## Chunk 4: Block 3a — Praxis I (Slides + Repo-Artefakte)

### Task 17: Research — Execution Skills & Plugins

**Files:**
- Create: `best-practices/plugins/empfehlungen.md`

Research gate from spec: "Recherchieren oder eigene bauen" for Execution and recommended plugins.

- [ ] **Step 1: Web research on execution skills and plugins**

Search queries:
- "Claude Code superpowers skills execution plans 2026"
- "GitHub Copilot coding agent plugins best practices"
- "Context7 MCP server documentation"
- "claude-md-management plugin"
- "techwolf ai first principles plugin"
- "Opra skills brainstorming writing-plans"

Evaluate each for Copilot CLI compatibility (the common denominator for VS Code + JetBrains).

- [ ] **Step 2: Write empfehlungen.md**

Fill all sections from Step 1 research. **No `[brackets]` or `...` placeholders may remain in the committed file.**

```markdown
# Plugin- und Skill-Empfehlungen

## Copilot-kompatibel (VS Code + JetBrains)
| Plugin/Skill | Zweck | Kompatibilitaet |
|-------------|-------|-----------------|
| [Recherche-Ergebnis] | ... | ... |

## Claude-Code-spezifisch
| Plugin/Skill | Zweck |
|-------------|-------|
| superpowers (brainstorming, writing-plans, executing-plans) | Workflow-Steuerung |
| Context7 | Aktuelle Library-Doku |
| claude-md-management | CLAUDE.md Verwaltung |

## Evaluation: Copilot CLI als gemeinsamer Nenner
[Welche Skills/Plugins funktionieren tooluebergreifend?]
[Was ist Copilot-CLI-spezifisch vs. IDE-spezifisch?]
```

- [ ] **Step 3: Commit**

```bash
git add best-practices/plugins/empfehlungen.md
git commit -m "research: plugin and skill recommendations for coding agents"
```

### Task 18: Slide 3.1 — Execution: Den Agenten steuern

**Files:**
- Modify: `slides/block-3a-praxis-execution-testing-frontend.md`
- Create: `best-practices/skills/execution-workflow.md`

- [ ] **Step 1: Write execution-workflow.md**

This is a **repo artifact** from the spec: "Skill/Rules fuer Execution-Workflow erstellen oder evaluieren."

```markdown
# Execution Workflow — Best Practice

## Kernprinzip
Agent schlaegt vor, Entwickler entscheidet.

## Ablauf fuer grosse Aufgaben
1. Plan laden (aus Writing-Plans Ergebnis)
2. Pro Task:
   a. Agent kuendigt Task an und erklaert Vorgehen
   b. Entwickler bestaetigt oder aendert Vorgehen
   c. Agent fuehrt aus (Test → Code → Test)
   d. Entwickler prueft Ergebnis
   e. Commit
3. Nach jedem 3. Task: Kurze Retrospektive
   - "Sind wir noch auf Kurs?"
   - "Muss der Plan angepasst werden?"

## Ablauf fuer kleine Aenderungen
1. Kurze Beschreibung der Aenderung
2. Agent schlaegt Loesung vor
3. Entwickler bestaetigt
4. Agent implementiert + Test
5. Commit

## Entscheidungspunkte (wo der Agent IMMER stoppen soll)
- Neue Abhaengigkeiten einfuehren
- Architektur-Entscheidungen
- DB-Schema-Aenderungen
- Oeffentliche API-Aenderungen
- Unklare Anforderungen
```

- [ ] **Step 2: Write slides for section 3.1**

**Slide: Execution — Den Agenten steuern**
```markdown
---

# Execution: Den Agenten steuern

**Kernprinzip: Agent schlaegt vor, Entwickler entscheidet.**

1. Plan laden
2. Task fuer Task:
   - Agent kuendigt an → Entwickler bestaetigt
   - Agent fuehrt aus → Entwickler prueft
   - Commit
3. Regelmaessige Checkpoints: "Sind wir noch auf Kurs?"

<!--
WICHTIG: Nicht einfach "Accept All" druecken.
Jeder Task ist ein bewusster Schritt.
Demo: Chat-Mitschnitt oder Live-Durchlauf zeigen.
Repo-Artefakt: best-practices/skills/execution-workflow.md
-->
```

**Slide: Entscheidungspunkte**
```markdown
---

# Wo der Agent IMMER stoppen soll

- ⚠️ Neue Abhaengigkeiten einfuehren
- ⚠️ Architektur-Entscheidungen
- ⚠️ DB-Schema-Aenderungen
- ⚠️ Oeffentliche API-Aenderungen
- ⚠️ Unklare oder mehrdeutige Anforderungen

> Diese Punkte gehoeren in eure AGENTS.md!

<!--
In AGENTS.md als "Ask first" Regeln definieren.
Siehe: example-repo-perplexity/agent/agents.md Abschnitt 8 "Ask first"
Empfohlene Plugins: [aus Recherche Task 17]
-->
```

- [ ] **Step 3: Commit**

```bash
git add slides/block-3a-praxis-execution-testing-frontend.md best-practices/skills/execution-workflow.md
git commit -m "feat(slides): add Block 3.1 — Execution Workflow + Best Practice"
```

### Task 19: Slide 3.2 — Testing: Die Kontrolle behalten

**Files:**
- Modify: `slides/block-3a-praxis-execution-testing-frontend.md`
- Create: `best-practices/skills/testing-workflow.md`

- [ ] **Step 1: Write testing-workflow.md**

Repo artifact: "Skill/Rules fuer Testing-Workflow erstellen oder evaluieren."

```markdown
# Testing Workflow — Best Practice

## Kernproblem
Der Agent passt den Test an, statt den Code zu fixen.
→ Regression wird unsichtbar.

## Harte Regeln (in AGENTS.md verankern)
1. Jeder Bugfix: ERST failing Test, DANN Fix
2. Tests duerfen NICHT veraendert werden, um sie gruen zu machen
3. Aenderungen an Tests nur nach expliziter Freigabe
4. Ohne Tests KEIN Merge in main

## TDD-Ablauf mit dem Agenten
1. Testfall schreiben (beschreibt gewuenschtes Verhalten)
2. Test ausfuehren → ROT sehen
3. Minimalen Code schreiben → GRUEN sehen
4. Refactoring (optional) → Tests erneut GRUEN
5. Commit

## Fehlgeschlagene Tests durchgehen
Bei mehreren fehlgeschlagenen Tests nach einer Aenderung:
1. Jeden Test EINZELN analysieren
2. Pro Test: Ist es eine Regression oder eine erwartete Aenderung?
3. Regressionen: Code fixen, NICHT den Test
4. Erwartete Aenderungen: Mit Entwickler besprechen, dann Test anpassen

## Feedbackschleifen
| Ebene | Was wird geprueft | Wann |
|-------|------------------|------|
| Unit Tests | Einzelne Funktionen/Klassen | Bei jedem Task |
| Integration Tests | Zusammenspiel von Modulen | Nach Feature-Abschluss |
| Akzeptanztests | Fachliche Korrektheit | Vor Merge |
| E2E / Playwright | Manuelle Test-Automatisierung | Optional, bei UI-Features |
```

- [ ] **Step 2: Write slides for section 3.2**

**Slide: Das Kernproblem**
```markdown
---

# Testing: Die Kontrolle behalten

## Das Kernproblem

> Der Agent passt den **Test** an, statt den **Code** zu fixen.
> → Regression wird unsichtbar.

**Loesung: Tests zuerst, dann Implementierung (TDD)**

<!--
Das ist das groesste Risiko bei AI-generiertem Code.
Gartner-Warnung: 2500% mehr Defekte durch unkontrollierte AI-Nutzung.
Die Ursache ist oft genau das: Tests werden "passend gemacht".
-->
```

**Slide: Harte Regeln**
```markdown
---

# Harte Regeln fuer Tests

1. **Tests zuerst** — erst der Test, dann der Code
2. **Tests sind heilig** — nicht aendern, um gruen zu werden
3. **Einzeln durchgehen** — bei Fehlschlaegen: Regression oder erwartete Aenderung?
4. **Ohne Tests kein Merge**

> Diese Regeln gehoeren als "Hard Facts" in eure AGENTS.md!

<!--
Referenz: best-practices/skills/testing-workflow.md
Referenz: example-repo-perplexity/agent/hard-facts-testing.md
Praxistipp: Den Agent explizit anweisen, Tests NICHT zu aendern.
-->
```

**Slide: Feedbackschleifen**
```markdown
---

# Feedbackschleifen

| Ebene | Was | Wann |
|-------|-----|------|
| **Unit Tests** | Einzelne Funktionen | Bei jedem Task |
| **Integration** | Modul-Zusammenspiel | Nach Feature |
| **Akzeptanz** | Fachliche Korrektheit | Vor Merge |
| **E2E (Playwright)** | UI-Verhalten automatisiert | Optional, bei UI |

> Je frueher der Fehler gefunden wird, desto guenstiger die Korrektur.

<!--
Feedbackschleifen sind der Kern der Qualitaetssicherung.
Agenten koennen alle diese Schleifen bedienen — wenn man sie richtig konfiguriert.
-->
```

- [ ] **Step 3: Commit**

```bash
git add slides/block-3a-praxis-execution-testing-frontend.md best-practices/skills/testing-workflow.md
git commit -m "feat(slides): add Block 3.2 — Testing Workflow + Best Practice"
```

### Task 20: Slide 3.3 — Frontend-Entwicklung mit Agenten

**Files:**
- Modify: `slides/block-3a-praxis-execution-testing-frontend.md`
- Create: `best-practices/dokumentation/frontend-beschreibungen.md`

- [ ] **Step 1: Research frontend description approaches**

Search queries:
- "describe UI to AI coding agent best practices 2026"
- "Figma to code AI agent workflow"
- "screenshot annotation AI frontend development"
- "design tokens AI coding"

Incorporate findings into the template in Step 2. If research reveals additional methods beyond Screenshots/Figma/Design Tokens, add them. If research confirms or refines the existing methods, update the descriptions accordingly.

- [ ] **Step 2: Write frontend-beschreibungen.md**

Repo artifact: "Best-Practice-Anleitung fuer Frontend-Beschreibungen."

```markdown
# Frontend-Beschreibungen fuer Agenten — Best Practice

## Wie beschreibe ich eine UI passgenau?

### Methode 1: Screenshots + Annotationen (pragmatisch)
- Screenshot der aktuellen UI machen
- In Paint/Snip & Sketch annotieren (Pfeile, Markierungen, Text)
- Als Bild dem Agenten mitgeben
- Vorteil: Schnell, kein Tooling noetig
- Nachteil: Nicht maschinenlesbar

### Methode 2: Design-Tool-Exports (Figma / Penpot)
- Design in Figma oder Penpot erstellen
- Export als Bild oder Dev-Modus nutzen
- Vorteil: Praezise, professionell
- Nachteil: Einarbeitungszeit
- **Figma:** Industriestandard, kostenpflichtig
- **Penpot:** Open-Source-Alternative, kostenlos, self-hostable

### Methode 3: Design Tokens
Design Tokens sind eine standardisierte Datei (JSON/YAML), die visuelle
Gestaltungswerte zentral definiert — Farben, Abstaende, Schriftgroessen,
Radien, Schatten. Der Agent nutzt diese Werte konsistent ueber alle
Komponenten hinweg, statt Werte zu raten.

Beispiel (JSON):
\`\`\`json
{
  "color": { "primary": "#1a365d", "accent": "#2b6cb0" },
  "spacing": { "sm": "8px", "md": "16px", "lg": "32px" },
  "font": { "body": "14px", "heading": "24px" }
}
\`\`\`

- Agent referenziert `tokens.json` statt Pixelwerte zu erfinden
- Vorteil: Konsistenz ueber die gesamte Anwendung
- Nachteil: Initialer Aufwand, Token-Datei muss gepflegt werden

### Empfehlung fuer den Alltag
Screenshots + Paint-Annotationen reichen fuer die meisten Aenderungen.
Fuer neue Komponenten: Referenz-Screenshot + textuelle Beschreibung.
Design Tokens lohnen sich ab mittlerer Projektgroesse.
```

- [ ] **Step 3: Write slides for section 3.3**

**Slide: Frontend mit Agenten**
```markdown
---

# Frontend-Entwicklung mit Agenten

**Wie beschreibe ich eine UI passgenau?**

| Methode | Aufwand | Praezision | Empfehlung |
|---------|---------|-----------|------------|
| **Screenshots + Paint** | Niedrig | Mittel | Alltag |
| **Figma / Penpot** | Hoch | Hoch | Neue Komponenten |
| **Design Tokens** (JSON) | Mittel | Hoch | Ab mittlerer Projektgroesse |

> Pragmatisch: Screenshots + Annotationen reichen meistens!
> Design Tokens = zentrale JSON-Datei mit Farben, Abstaenden, Schriften.

<!--
Demo-Idee: Screenshot mit Paint-Annotationen zeigen,
dann den Agenten daraus Code generieren lassen.
Repo-Artefakt: best-practices/dokumentation/frontend-beschreibungen.md
-->
```

- [ ] **Step 4: Commit**

```bash
git add slides/block-3a-praxis-execution-testing-frontend.md best-practices/dokumentation/frontend-beschreibungen.md
git commit -m "feat(slides): add Block 3.3 — Frontend mit Agenten + Best Practice"
```

---

## Chunk 5: Block 3b — Praxis II + Abschluss (Slides + Repo-Artefakte + Use Cases)

### Task 21: Slide 3.4 — Code Reviews mit dem Agenten

**Files:**
- Modify: `slides/block-3b-praxis-reviews-bugfixing-abschluss.md`
- Create: `best-practices/skills/review-workflow.md`

- [ ] **Step 1: Research review plugins**

Search queries:
- "AI code review plugins GitHub Copilot 2026"
- "CodeRabbit AI review security"
- "agent code review conventions security best practices"
- "Claude Code code-reviewer skill"

Evaluate: Which review plugins/skills work with Copilot CLI?

- [ ] **Step 2: Write review-workflow.md**

Repo artifact: "Review-Skills/Plugins evaluieren und konfigurieren."

```markdown
# Code Review Workflow — Best Practice

## Agent als Reviewer
Der Agent kann Reviews geben basierend auf:
- Coding Conventions (aus AGENTS.md)
- Security Best Practices (OWASP Top 10)
- Performance-Patterns
- Architektur-Konformitaet

## Workflow: Agent-Review
1. Code-Aenderungen dem Agent zeigen (Diff oder PR)
2. Agent prueft gegen:
   - Projektkonventionen
   - Security-Checkliste
   - Test-Abdeckung
   - Architektur-Konformitaet
3. Agent listet Findings mit Schweregrad
4. Entwickler entscheidet ueber Umsetzung

## Review-Kommentare abarbeiten
1. Agent zieht die Liste der Review-Kommentare (z.B. aus GitHub/GitLab)
2. Pro Kommentar:
   a. Agent schlaegt Loesungsweg vor
   b. Entwickler bestaetigt oder aendert
   c. Agent implementiert
   d. Commit
3. Antwort auf Review-Kommentar erstellen

## Empfohlene Plugins/Tools
[Aus Step 1 Recherche befuellen — keine Platzhalter im Endergebnis]
```

**No `[brackets]` or placeholder text may remain in the committed file.** Fill all sections from Step 1 research.

- [ ] **Step 3: Write slides for section 3.4**

**Slide: Agent als Reviewer**
```markdown
---

# Code Reviews mit dem Agenten

**Der Agent als zusaetzlicher Reviewer:**

- Prueft: Konventionen, Security, Best Practices, Architektur
- Findet: Was Menschen uebersehen (Security-Luecken, vergessene Edge Cases)
- Liefert: Konsistente Reviews nach definierten Regeln

<!--
Der Agent ersetzt NICHT den menschlichen Review.
Er ergaenzt ihn — und findet andere Dinge.
Mensch: Fachliche Korrektheit, Architektur-Entscheidungen.
Agent: Konsistenz, Security, Patterns.
-->
```

**Slide: Review-Kommentare abarbeiten**
```markdown
---

# Review-Kommentare schrittweise abarbeiten

1. Agent holt die **Liste aller Review-Kommentare**
2. Pro Kommentar:
   - Agent **schlaegt Loesungsweg** vor
   - Entwickler **bestaetigt oder aendert**
   - Agent **implementiert + testet**
   - **Commit**
3. Agent verfasst **Antwort auf den Kommentar**

> Nicht alle auf einmal — Schritt fuer Schritt!

<!--
Praxistipp: MCP-Server fuer GitHub/GitLab anbinden,
damit der Agent direkt auf PR-Kommentare zugreifen kann.
Repo-Artefakt: best-practices/skills/review-workflow.md
-->
```

- [ ] **Step 4: Commit**

```bash
git add slides/block-3b-praxis-reviews-bugfixing-abschluss.md best-practices/skills/review-workflow.md
git commit -m "feat(slides): add Block 3.4 — Code Reviews + Best Practice"
```

### Task 22: Slide 3.5 — Bugfixing

**Files:**
- Modify: `slides/block-3b-praxis-reviews-bugfixing-abschluss.md`
- Modify: `best-practices/skills/` (link to existing bugfixing-agent example)

- [ ] **Step 1: Create bugfixing best practice linking to existing example**

The repo already has `example-repo-perplexity/agent/bugfixing-agent.md` — a well-structured bugfixing agent persona. Create a symlink/reference in best-practices.

Create `best-practices/skills/bugfixing-workflow.md`:

```markdown
# Bugfixing Workflow — Best Practice

## Kernprinzip
Hypothesenbasiert: Erst Root Cause finden, dann fixen.

## Ablauf
1. **Kontext sammeln** (70% der Zeit)
   - Fehlermeldung, Logs, betroffene Nutzerpfade
   - Relevante Module und fruehere aehnliche Bugs
   - Hypothesen formulieren

2. **Failing Test schreiben** (Reproduktion)
   - Test beschreibt das fehlerhafte Verhalten
   - Test muss fehlschlagen → beweist den Bug

3. **Minimaler Fix**
   - Kleinstmoegliche Code-Aenderung
   - Bestehende Architektur respektieren
   - Tests gruen sehen

4. **Regression absichern**
   - Alle relevanten Test-Suites ausfuehren
   - Clean-Code-Check fuer geaenderte Dateien

5. **Dokumentieren**
   - Root-Cause-Erklaerung im PR
   - Welche Tests den Bug abdecken

## Wann eignet sich Bugfixing fuer Agenten?
- ✅ Gut: Klar reproduzierbare Bugs mit Stacktrace
- ✅ Gut: Regressions-Bugs (vorher ging es, jetzt nicht)
- ⚠️ Bedingt: Bugs in komplexer Geschaeftslogik
- ❌ Schwierig: Intermittierende Bugs, Race Conditions, Performance-Bugs

## Referenz
Ausgearbeitete Agent-Persona: example-repo-perplexity/agent/bugfixing-agent.md
```

- [ ] **Step 2: Write slides for section 3.5**

**Slide: Bugfixing mit dem Agenten**
```markdown
---

# Bugfixing: Hypothesenbasiert

**70% Analyse — 30% Fix**

1. **Kontext sammeln:** Logs, Fehlermeldung, betroffene Module
2. **Hypothese bilden:** "Der Bug entsteht weil..."
3. **Failing Test:** Test reproduziert den Bug → ROT
4. **Minimaler Fix:** Kleinstmoegliche Aenderung → GRUEN
5. **Absichern:** Regression-Tests + Clean-Code-Check

<!--
Der Agent ist ein guter Detektiv — er kann viel Code schnell lesen.
Aber: Der Mensch muss die Hypothese validieren.
Nicht einfach "Fix this bug" sagen — sondern die Root Cause suchen.
Repo-Artefakt: best-practices/skills/bugfixing-workflow.md
-->
```

**Slide: Wann Agent, wann nicht?**
```markdown
---

# Bugfixing: Wann Agent, wann nicht?

| Szenario | Agent-Eignung |
|----------|:------------:|
| Klarer Stacktrace, reproduzierbar | ✅ Gut |
| Regressions-Bug | ✅ Gut |
| Komplexe Geschaeftslogik | ⚠️ Bedingt |
| Intermittierend / Race Condition | ❌ Schwierig |
| Performance-Bug | ❌ Schwierig |

<!--
Bei schwierigen Bugs: Agent als Recherche-Assistent nutzen,
aber Fix-Entscheidung bleibt beim Entwickler.
-->
```

- [ ] **Step 3: Commit**

```bash
git add slides/block-3b-praxis-reviews-bugfixing-abschluss.md best-practices/skills/bugfixing-workflow.md
git commit -m "feat(slides): add Block 3.5 — Bugfixing + Best Practice"
```

### Task 23: Slide 3.6 — Sandboxing & Berechtigungssteuerung

> **Spec-Amendment:** Dieses Thema ist nicht in der Original-Spec, wurde aber von Thomas explizit als Ergaenzung fuer Block 3b angefordert. Verschiebt den bisherigen Abschluss (3.6) auf 3.7.

**Files:**
- Modify: `slides/block-3b-praxis-reviews-bugfixing-abschluss.md`
- Create: `best-practices/skills/sandbox-konfiguration.md`

This task addresses a core productivity problem: Most tools default to asking permission for every file edit, every shell command — and developers turn everything off or accept everything blindly. The goal is a **principled middle ground** that is tool-agnostic.

- [ ] **Step 1: Research sandboxing approaches across tools**

Search queries:
- "Claude Code permission modes allowedTools blockedTools settings 2026"
- "GitHub Copilot CLI agent sandbox trust settings workspace"
- "AI coding agent sandboxing best practices security"
- "coding agent permission management file system network"

Focus on **Copilot CLI** and **Claude Code** only — no OpenAI Codex.

Key questions to answer:
1. How does each tool handle permissions? (Claude Code: settings.json, Copilot CLI: workspace trust)
2. What are the tool-agnostic principles regardless of implementation?
3. How to pre-configure a team-wide sandbox profile?

- [ ] **Step 2: Write sandbox-konfiguration.md**

Repo artifact: Tool-agnostic sandbox configuration guide.

```markdown
# Sandbox & Berechtigungssteuerung — Best Practice

## Das Problem
- Zu viele Stopps → Entwickler klickt "Accept All" → kein Schutz
- Zu wenige Stopps → Agent trifft Entscheidungen allein → Kontrollverlust
- Ziel: **Nur bei wichtigen Dingen stoppen**

## Klassifikation von Aktionen

### ✅ Auto-erlauben (kein Stopp noetig)
| Aktion | Begruendung |
|--------|-------------|
| Dateien lesen | Kein Risiko, reversibel |
| Dateien erstellen/editieren | Reversibel via Git |
| Lokale Tests ausfuehren | Kein Seiteneffekt |
| Git add/commit (lokal) | Reversibel |
| Package-Lock lesen | Kein Risiko |

### ⚠️ Nachfragen (Entwickler-Entscheidung noetig)
| Aktion | Begruendung |
|--------|-------------|
| Architektur-Entscheidung | Nicht reversibel im Design |
| Neue Abhaengigkeit installieren | Supply-Chain-Risiko |
| DB-Schema aendern / Migration | Schwer reversibel |
| Oeffentliche API aendern | Breaking Change moeglich |
| Unklare Anforderung | Agent soll nicht raten |

### 🚫 Blockieren (Security-kritisch)
| Aktion | Begruendung |
|--------|-------------|
| Netzwerkzugriff (curl, fetch, API-Calls) | Datenabfluss-Risiko |
| Datenbankverbindungen | Produktionsdaten-Risiko |
| SSH / Remote-Zugriff | Sicherheitskritisch |
| Secrets/Credentials lesen/schreiben | Compliance |
| Git push (remote) | Oeffentliche Sichtbarkeit |
| Beliebige Shell-Befehle mit sudo | Systemrisiko |

## Tool-spezifische Umsetzung

### Claude Code
Settings in `.claude/settings.json`:
- `"permissions": { "allow": ["Read", "Edit", "Write", "Glob", "Grep"], ... }`
- `"permissions": { "deny": ["Bash(curl*)", "Bash(ssh*)", ...] }`
- Projekt-Settings versionierbar im Repo → Team-Standard

### GitHub Copilot CLI (VS Code / JetBrains)
- Workspace Trust Settings
- `.github/copilot-instructions.md` fuer Verhaltensregeln
- [Weitere tool-spezifische Konfiguration aus Recherche]

### Tool-agnostisch via AGENTS.md
Unabhaengig vom Tool: In AGENTS.md die Regeln definieren:
- Abschnitt "Grenzen & No-Gos" mit Always/Ask first/Never
- Agent haelt sich an diese Regeln — die Sandbox ist die zweite Absicherung

## Team-Profil bereitstellen
1. Sandbox-Konfiguration im Repo versionieren (z.B. `.claude/settings.json`)
2. In AGENTS.md dokumentieren welche Aktionen erlaubt/verboten sind
3. Onboarding: Neue Entwickler klonen Repo → Sandbox ist vorkonfiguriert
4. Regelmaessig reviewen: Brauchen wir neue Ausnahmen?
```

- [ ] **Step 3: Write slides for section 3.6**

**Slide: Das Stopp-Problem**
```markdown
---

# Sandboxing: Die richtigen Stopps setzen

## Das Problem

> Zu viele Stopps → "Accept All" → kein Schutz
> Zu wenige Stopps → Agent entscheidet allein → Kontrollverlust

**Ziel: Nur bei wichtigen Dingen stoppen.**

<!--
Kernproblem in der Praxis: Der Agent fragt bei JEDER Dateiaenderung.
Entwickler gewoehnen sich an "Ja, ja, ja" → gefaehrlich.
Oder sie schalten alles aus → genauso gefaehrlich.
Die Loesung: Bewusstes Konfigurieren der Sandbox.
-->
```

**Slide: Klassifikation**
```markdown
---

# Welche Aktionen brauchen welchen Schutz?

| | Aktion | Warum |
|---|--------|-------|
| ✅ **Auto** | Dateien lesen/editieren, lokale Tests | Reversibel via Git |
| ✅ **Auto** | Git add/commit (lokal) | Reversibel |
| ⚠️ **Fragen** | Architektur-Entscheidung, neue Dependency | Nicht-trivial reversibel |
| ⚠️ **Fragen** | DB-Schema, oeffentliche API | Breaking Change |
| 🚫 **Block** | Netzwerk, Datenbank, SSH, Secrets | Security-kritisch |
| 🚫 **Block** | Git push, sudo | Oeffentlich / Systemrisiko |

<!--
Der Schluessel: File-Edits sind NICHT sicherheitskritisch — Git macht sie reversibel.
Entscheidungen und Netzwerk/externe Systeme SIND kritisch.
Das muss man dem Team einmal erklaeren, dann konfigurieren.
-->
```

**Slide: Tool-agnostische Umsetzung**
```markdown
---

# Sandbox konfigurieren — tooluebergreifend

**Schicht 1: AGENTS.md (alle Tools)**
```
## Grenzen & No-Gos
Always: Dateien lesen, editieren, Tests ausfuehren
Ask first: Neue Dependencies, DB-Schema, API-Aenderungen
Never: Netzwerk, Secrets, Push ohne Review
```

**Schicht 2: Tool-spezifische Config**
- Claude Code: `.claude/settings.json` (im Repo versionierbar)
- Copilot CLI: Workspace Trust + Copilot Instructions

**Schicht 3: Team-Profil bereitstellen**
- Config im Repo → `git clone` = fertig konfiguriert

<!--
Die AGENTS.md-Regeln sind die erste Verteidigungslinie (alle Tools).
Die tool-spezifische Sandbox ist die zweite (technische Durchsetzung).
Repo-Artefakt: best-practices/skills/sandbox-konfiguration.md
-->
```

- [ ] **Step 4: Commit**

```bash
git add slides/block-3b-praxis-reviews-bugfixing-abschluss.md best-practices/skills/sandbox-konfiguration.md
git commit -m "feat(slides): add Block 3.6 — Sandboxing und Berechtigungssteuerung"
```

### Task 24: Slide 3.7 — Abschluss: Euer Werkzeugkasten

**Files:**
- Modify: `slides/block-3b-praxis-reviews-bugfixing-abschluss.md`

- [ ] **Step 1: Write slides for section 3.7**

**Slide: Welche Aufgaben eignen sich?**
```markdown
---

# Euer Werkzeugkasten: Was eignet sich?

| Eignung | Aufgabentyp |
|---------|-------------|
| ✅ **Gut** | CRUD, UI, Boilerplate, Refactoring, Demonstratoren, Library Updates |
| ⚠️ **Bedingt** | Bugfixing, Integration, Legacy-Code |
| ❌ **Schwierig** | Komplexe Algorithmik, Performance, tiefe fachliche Logik |

<!--
Die Liste ist nicht absolut — sie aendert sich mit der Modellentwicklung.
In 6 Monaten kann "bedingt" zu "gut" werden.
-->
```

**Slide: AI Code Archaeology**
```markdown
---

# AI Code Archaeology

**Bestehende Codebasen verstehen und unter Kontrolle bringen**

- Agent liest und erklaert bestehenden Code
- Erzeugt Dokumentation fuer undokumentierte Module
- Hilft beim Onboarding in neue Projekte
- Identifiziert Patterns, Antipatterns, Abhaengigkeiten

> Besonders wertvoll fuer unsere 20-Jahre-Plattform!

<!--
Querschnittsfaehigkeit: Nuetzlich in allen Stufen.
Praxisbeispiel: Agent erklaert ein unbekanntes Modul der Contact-Plattform.
-->
```

**Slide: Das Best-Practice-Repo**
```markdown
---

# Das Best-Practice-Repo

```
vortrag-agentic-ai/
  best-practices/
    agents-md/          ← AGENTS.md Vorlagen
    skills/             ← Evaluierte Workflows
    plugins/            ← Plugin-Empfehlungen
    kontext-management/ ← Kontext-Schichten
    dokumentation/      ← Doku-Vorlagen
    antipatterns/       ← Was NICHT tun
  use-cases/            ← Uebungsaufgaben
```

> Lebendes Dokument — das Team pflegt es weiter!

<!--
Das Repo gehoert dem Team, nicht dem Vortragenden.
Jeder kann PRs einreichen, Skills hinzufuegen, Antipatterns dokumentieren.
-->
```

**Slide: Kosten-Uebersicht (Recap)**
```markdown
---

# Kosten im Blick

- **Copilot Business:** [Kontingent] Premium-Requests/Monat inklusive
- **Premium-Modelle** (Claude, o1) verbrauchen mehr Requests
- **Einsparen:** Richtiges Modell waehlen, guten Kontext liefern, Standard-Modelle fuer einfache Aufgaben
- **ROI:** Weniger Nacharbeit durch Methodik > Kosten fuer Premium-Requests

> Details: `referenzen/modell-vergleich.md`

<!--
Kurzer Recap von Block 2.4 — hier nur die Zusammenfassung.
Konkrete Zahlen aus Task 15 Recherche einfuegen.
Spec-Anforderung: "Kosten-Uebersicht: Premium-Requests, Abrechnungsmodelle"
-->
```

**Slide: Hands-on-Aufgaben**
```markdown
---

# Hands-on: Aufgaben fuer die Projektarbeit

1. **Einfach (Vibe Coding reicht):**
   UI-Text aendern, Config anpassen

2. **Mittel (Spec-Driven):**
   Neuen API-Endpoint mit Tests erstellen

3. **Komplex (Agentic Engineering):**
   Neues Modul mit Architektur-Entscheidungen

> Use Cases mit Contact-Software-Kontext: `use-cases/`

<!--
Die Aufgaben werden nicht im Workshop gemacht,
sondern in der Projektarbeit danach.
Checkliste und Ueberpruefungs-Prompt: use-cases/README.md
-->
```

**Slide: Abschluss**
```markdown
---

<!-- _class: lead -->

# Der Entwickler ist der Boss.
# Der Agent ist das Werkzeug.

> "You are orchestrating agents who do and acting as oversight."
> — Andrej Karpathy, 2026

<!--
Schlussfolie: Die Kernbotschaft nochmal auf den Punkt.
Dann: Fragen und Diskussion.
-->
```

- [ ] **Step 2: Commit**

```bash
git add slides/block-3b-praxis-reviews-bugfixing-abschluss.md
git commit -m "feat(slides): add Block 3.7 — Abschluss und Werkzeugkasten"
```

### Task 25: Create AGENTS.md templates for best-practices

**Files:**
- Create: `best-practices/agents-md/vorlage-agents-md.md`
- Create: `best-practices/agents-md/vorlage-persona.md`
- Create: `best-practices/agents-md/README.md`

- [ ] **Step 1: Write README.md for agents-md section**

```markdown
# AGENTS.md — Vorlagen und Beispiele

## Inhalt
- `vorlage-agents-md.md` — Vorlage fuer ein vollstaendiges AGENTS.md
- `vorlage-persona.md` — Vorlage fuer spezialisierte Agent-Personas

## Beispiele (aus Recherche)
- `../../example-repo-perplexity/agent/agents.md` — Vollstaendiges Beispiel
- `../../example-repo-perplexity/agent/feature-dev-agent.md` — Feature-Dev Persona
- `../../example-repo-perplexity/agent/bugfixing-agent.md` — Bugfixing Persona
- `../../example-repo-perplexity/agent/hard-facts-testing.md` — Test-Regeln als Hard Facts
```

- [ ] **Step 2: Create vorlage-agents-md.md**

Copy and clean up the template from `example-repo-perplexity/example-agents.md`. Remove the placeholders and add comments explaining each section. Keep the structure:
1. Mission & Besonderheiten
2. Tech-Stack & Projektstruktur
3. Build-, Run- und Test-Kommandos
4. Arbeitsweise / Agentic Workflow
5. Personas (Registry)
6. Tests & Qualitaet
7. Git-Workflow
8. Grenzen & No-Gos
9. Architektur-Notizen & Stolpersteine

- [ ] **Step 3: Create vorlage-persona.md**

A minimal persona template with:
- Frontmatter (name, description)
- Beziehung zu AGENTS.md
- Mission
- Workflow (Pflichtschritte)
- Grenzen (Boundaries)
- Kommunikation

- [ ] **Step 4: Commit**

```bash
git add best-practices/agents-md/
git commit -m "feat: add AGENTS.md templates and persona templates"
```

### Task 26: Create use cases (3 difficulty levels)

**Files:**
- Create: `use-cases/README.md`
- Create: `use-cases/01-einfach/aufgabe.md`
- Create: `use-cases/02-mittel/aufgabe.md`
- Create: `use-cases/03-komplex/aufgabe.md`

- [ ] **Step 1: Write use-cases/README.md**

```markdown
# Use Cases — Uebungsaufgaben fuer die Projektarbeit

## Aufbau
Jede Aufgabe beschreibt ein realistisches Szenario mit Contact-Software-Kontext.

| Schwierigkeit | Empfohlene Methodik | Ordner |
|--------------|--------------------:|--------|
| Einfach | Vibe Coding / direkter Prompt | 01-einfach/ |
| Mittel | Spec-Driven | 02-mittel/ |
| Komplex | Agentic Engineering (voll) | 03-komplex/ |

## Ueberpruefungs-Prompt
Nach Abschluss einer Aufgabe: Kopiere diesen Prompt in deinen Agenten,
um zu pruefen ob die Loesung den Projektstandards entspricht:

> "Pruefe die Aenderungen gegen unsere AGENTS.md und Coding Guidelines.
> Checke: Tests vorhanden? Konventionen eingehalten?
> Doku aktualisiert? Clean-Code-Review bestanden?"
```

- [ ] **Step 2: Write 01-einfach/aufgabe.md**

```markdown
# Aufgabe: UI-Text aendern (Einfach)

## Szenario
Ein Kunde meldet: Der Button-Text "Abbrechen" soll in "Zurueck" geaendert werden.
Betroffen sind 3 Dialoge im Bestellmodul.

## Erwartung
- Direkte Umsetzung per Prompt: "Aendere den Button-Text..."
- Ein Test, der den neuen Text prueft (optional bei reinem Text-Change)
- Commit mit klarer Message

## Lernziel
Nicht jede Aufgabe braucht den vollen Workflow.
Aber: Selbst bei kleinen Aenderungen hilft ein kurzer Review.
```

- [ ] **Step 3: Write 02-mittel/aufgabe.md**

```markdown
# Aufgabe: REST-API Endpoint erstellen (Mittel)

## Szenario
Es soll ein neuer GET-Endpoint `/api/reports/summary` erstellt werden,
der eine aggregierte Zusammenfassung aller Reports eines Benutzers liefert.

## Anforderungen
- Authentifizierung erforderlich
- Filterbar nach Zeitraum (query params: from, to)
- Response: JSON mit Gesamtzahl, nach Status gruppiert
- Fehlerbehandlung: 401 bei fehlender Auth, 400 bei ungueltigem Zeitraum

## Empfohlene Methodik
1. Spec schreiben (API-Vertrag, Request/Response-Format)
2. Plan erstellen (3-5 Tasks)
3. TDD: Test → Implementierung → Test
4. Review + Commit

## Lernziel
Spec-Driven Ansatz: Die Spezifikation definiert den Vertrag,
der Agent implementiert innerhalb dieses Vertrags.
```

- [ ] **Step 4: Write 03-komplex/aufgabe.md**

```markdown
# Aufgabe: Benachrichtigungs-Modul (Komplex)

## Szenario
Es soll ein neues Benachrichtigungs-Modul entstehen, das:
- Bei bestimmten Events (Report erstellt, Status geaendert) Benachrichtigungen erzeugt
- Verschiedene Kanaele unterstuetzt (E-Mail, In-App)
- Benutzerspezifische Praeferenzen beruecksichtigt
- Skalierbar ist (Event-Queue)

## Empfohlene Methodik (Agentic Engineering)
1. **Brainstorming:** Anforderung verstehen, Architektur-Optionen erkunden
2. **Spec:** Technische Spezifikation mit Komponenten, Schnittstellen, Datenmodell
3. **Plan:** Tasks in 5-20min Schritten, TDD, Entscheidungspunkte markiert
4. **Execution:** Task fuer Task mit Entwickler-Checkpoints
5. **Review:** Agent-Review + menschlicher Review

## Architektur-Entscheidungen (zu diskutieren)
- Event-Sourcing vs. einfache DB-Tabelle?
- Synchron vs. asynchron (Celery)?
- Kanal-Abstraktion: Strategy Pattern?

## Lernziel
Voller Agentic Engineering Workflow mit echten Architektur-Entscheidungen,
bei denen der Entwickler die Richtung vorgibt.
```

- [ ] **Step 5: Commit**

```bash
git add use-cases/
git commit -m "feat: add graded use cases for workshop hands-on tasks"
```

### Task 27: Create antipatterns collection

**Files:**
- Create: `best-practices/antipatterns/README.md`

- [ ] **Step 1: Write antipatterns README.md**

```markdown
# Antipatterns — Was NICHT tun

## 1. "Accept All" ohne Lesen
**Problem:** Alle Agent-Vorschlaege akzeptieren ohne die Diffs zu lesen.
**Folge:** Unverstandener Code, versteckte Bugs, technische Schulden.
**Stattdessen:** Jeden Diff lesen, Designentscheidungen hinterfragen.

## 2. Tests anpassen statt Code fixen
**Problem:** Agent aendert Tests, damit sie gruen werden — statt den Bug zu fixen.
**Folge:** Regressionen werden unsichtbar.
**Stattdessen:** Harte Regel: Tests sind heilig. Nur nach expliziter Freigabe aendern.

## 3. Riesige Aenderungen ohne Plan
**Problem:** "Implementiere Feature X" als einzelnen Prompt, alles auf einmal.
**Folge:** Unuebersichtliche Diffs, schwer reviewbar, schlecht testbar.
**Stattdessen:** Plan in kleine Tasks zerlegen, Task fuer Task umsetzen.

## 4. Kontext-Ueberladung
**Problem:** Dem Agent die gesamte Codebasis als Kontext geben.
**Folge:** Agent verliert Fokus, Antworten werden ungenauer.
**Stattdessen:** Relevanten Kontext gezielt auswaehlen (3-Schichten-Modell).

## 5. Agent als Orakel behandeln
**Problem:** Dem Agent blind vertrauen, auch bei Architektur-Entscheidungen.
**Folge:** Agent trifft Entscheidungen, die nicht zur bestehenden Architektur passen.
**Stattdessen:** Der Entwickler entscheidet bei Architektur, der Agent schlaegt vor.

## 6. Fehlender Kontext fuer die Plattform
**Problem:** Kein AGENTS.md, keine Plattform-Dokumentation fuer den Agent.
**Folge:** Agent generiert Code, der nicht zur Plattform passt.
**Stattdessen:** AGENTS.md mit Plattform-Besonderheiten, Conventions, Beispielen.

## 7. Schlechte Execution-Plaene
### Beispiel: Zu grobe Tasks
❌ "Task 1: Backend implementieren. Task 2: Frontend implementieren. Task 3: Tests."
✅ "Task 1: DB-Schema fuer Notifications erstellen (Migration + Test).
    Task 2: NotificationService.create() mit failing Test..."

### Beispiel: Fehlende TDD-Schritte
❌ "Task 1: Implementiere den Endpoint inkl. Tests"
✅ "Task 1: Schreibe failing Test fuer GET /api/notifications.
    Task 2: Implementiere minimalen Handler fuer gruen.
    Task 3: Schreibe failing Test fuer Filterung..."
```

- [ ] **Step 2: Commit**

```bash
git add best-practices/antipatterns/
git commit -m "feat: add antipatterns collection for workshop"
```

---

## Chunk 6: Referenzen-Konsolidierung & Qualitaetspruefung

### Task 28: Finalize referenzen/quellen.md

**Files:**
- Modify: `referenzen/quellen.md` (created in Task 4)

- [ ] **Step 1: Cross-check all slide references**

Go through all 4 slide decks and verify every reference mentioned in speaker notes is listed in `referenzen/quellen.md`. Add any missing entries.

Ensure these sources from the spec are included:
- Karpathy: Vibe Coding + Agentic Engineering
- Thoughtworks Tech Radar: Spec-Driven Development
- GitHub Spec Kit
- arXiv: "Vibe Coding vs. Agentic Coding"
- Martin Fowler: "Humans and Agents in SE Loops"
- Hyperact: 7 Levels of AI-Assisted Development
- BMAD Method
- Addy Osmani: "My LLM Coding Workflow 2026"
- Anthropic: 2026 Agentic Coding Trends Report
- Pragmatic Engineer: "How Claude Code is Built"
- All video references from spec

- [ ] **Step 2: Commit**

```bash
git add referenzen/
git commit -m "docs: finalize and cross-check all references"
```

### Task 29: Finalize referenzen/videos.md with researched URLs

**Files:**
- Modify: `referenzen/videos.md` (created in Task 4)

- [ ] **Step 1: Research and add video URLs**

For each entry marked `[URL RECHERCHIEREN]`:
- Search YouTube and official blogs for the exact video
- Add the URL
- Add duration and upload date if available
- Mark videos suitable for embedding in slides vs. linking as reference

- [ ] **Step 2: Commit**

```bash
git add referenzen/videos.md
git commit -m "docs: add researched video URLs to references"
```

### Task 30: Cross-check all slides against spec

**Files:**
- All slide decks in `slides/`
- Spec: `docs/superpowers/specs/2026-03-31-agentic-engineering-workshop-design.md`

- [ ] **Step 1: Verify spec coverage**

Go through the spec section by section and check:

| Spec Section | Slide File | Status |
|-------------|------------|--------|
| 1.1 Einstieg | block-1, Task 5 | |
| 1.2 4-Stufen-Modell | block-1, Task 6 | |
| 1.3 Coding Agent | block-1, Task 7 | |
| 1.4 Arbeitsweise | block-1, Task 8 | |
| 1.5 Demo | block-1, Task 9 | |
| 2.1 Kontextmanagement | block-2, Task 11 | |
| 2.2 Dokumentation | block-2, Task 13 | |
| 2.3 Brainstorming & Planning | block-2, Task 14 | |
| 2.4 Modelle | block-2, Task 16 | |
| 3.1 Execution | block-3a, Task 18 | |
| 3.2 Testing | block-3a, Task 19 | |
| 3.3 Frontend | block-3a, Task 20 | |
| 3.4 Code Reviews | block-3b, Task 21 | |
| 3.5 Bugfixing | block-3b, Task 22 | |
| 3.6 Sandboxing | block-3b, Task 23 | |
| 3.7 Abschluss | block-3b, Task 24 | |

Also verify:
- All "RECHERCHE ERFORDERLICH" items have corresponding research tasks
- All "Repo-Artefakt" items have corresponding files in best-practices/
- All Querschnittsthemen are covered (see spec section "Querschnittsthemen")
- Speaker notes are present on every slide

- [ ] **Step 2: Fix any gaps found**

For each gap: add the missing content to the relevant slide deck or best-practice file.

- [ ] **Step 3: Final commit**

```bash
git add slides/ best-practices/ use-cases/ referenzen/
git commit -m "docs: cross-check and finalize all slides against spec"
```

### Task 31: Remove .gitkeep files and final cleanup

**Files:**
- All `.gitkeep` files in directories that now have content

- [ ] **Step 1: Remove .gitkeep from populated directories**

Check each directory. If it has real content files, remove the `.gitkeep`.

```bash
# Example: find and remove .gitkeep files in dirs that have other files
find best-practices/ use-cases/ referenzen/ slides/ -name ".gitkeep" -exec rm {} \;
```

- [ ] **Step 2: Verify repo structure matches spec**

Run `tree` or `ls -R` and compare against the spec's "Code-Repository Struktur" section. Ensure all directories and key files exist.

- [ ] **Step 3: Final commit**

```bash
git add best-practices/ use-cases/ referenzen/ slides/
git commit -m "chore: clean up .gitkeep files after content creation"
```

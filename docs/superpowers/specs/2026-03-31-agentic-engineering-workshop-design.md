# Design Spec: Workshop "Agentic Engineering" + Best-Practice-Repo

## Zusammenfassung

Ein 3,5-4h Workshop (4 Blöcke) zum Thema Agentic Engineering fuer Entwickler-Kollegen, begleitet von einem lebenden Best-Practice-Repository als Team-Standard. Der Workshop fuehrt vom Grundverstaendnis ueber die Methodik bis zu konkreten Werkzeugen und gibt den Teilnehmern Hands-on-Aufgaben fuer die Projektarbeit mit.

## Kontext & Motivation

- **Vortragende(r):** Thomas Hein, nutzt bereits Agentic-Engineering-Workflows (Claude Code, Opra-Skills, Context7)
- **Plattform-Kontext:** Contact Software — Python 3.11, 20 Jahre alt, LLMs kennen sie nicht
- **Zielgruppe:** Entwickler-Kollegen, Mischung aus (A) Copilot-Nutzern ohne strukturierte Methodik und (B) AI-Neulingen
- **Tool-Basis:** GitHub Copilot (Firmenlizenz), primaer Copilot CLI als gemeinsamer Nenner fuer VS Code + JetBrains
- **Praesentationsformat:** Marp (Markdown-basierte Slides mit Speaker Notes)
- **Hands-on:** Ausgelagert in die Projektarbeit, nicht als Workshop-Block

## Das 4-Stufen-Modell

| # | Ansatz | Input | Menschliche Rolle |
|---|---|---|---|
| 1 | **Vibe Coding** | Kurze Phrasen, fachliche Wuensche | Fachanwender |
| 2 | **Spec-Driven (Business)** | Pflichtenheft, Use Cases | IT Consultant |
| 3 | **Spec-Driven (Technical)** | UML, ERM, Architektur, Workflows | Architekt |
| 4 | **Agentic Engineering** | Anforderungen + kollaborative Umsetzung | Architekt/Entwickler |

**Herkunft der Begriffe:**
- "Vibe Coding" — Andrej Karpathy, Feb 2025
- "Spec-Driven Development" — etabliert (Thoughtworks Tech Radar, GitHub Spec Kit, AWS Kiro)
- Die Unterscheidung Business-Spec vs. Technical-Spec ist ein eigener Beitrag des Vortragenden
- "Agentic Engineering" — Karpathy, Feb 2026; wird in der Community zum Standard

**Besonderheit des Modells:** Die meisten Community-Frameworks kategorisieren nach AI-Autonomie-Level. Dieses Modell kategorisiert nach menschlicher Rolle — das ist fuer den Teilnehmerkreis greifbarer.

## Querschnittsthemen

Diese Themen sind ueber die Bloecke verteilt, wo sie im Entwicklungs-Workflow relevant sind:

1. **Kontextmanagement** — AGENTS.md, Kontext-Hygiene, Tools zur Verwaltung
2. **Testing & Qualitaetssicherung** — Kontrolle ueber Tests, Regressionserkennung
3. **Frontend-Entwicklung** — UI beschreiben (Screenshots, Figma, Design Tokens)
4. **Code Reviews** — Agent als Reviewer, Review-Kommentare abarbeiten
5. **Bugfixing** — Hypothesenbasiert, Root Cause Analysis
6. **AI Code Archaeology** — Bestehende Codebasen verstehen und unter Kontrolle bringen
7. **Feedbackschleifen** — Unit Tests, Integration, Akzeptanzkriterien, Developer-in-the-Loop

## Workshop-Struktur

### Block 1: Grundlagen & Orientierung (~45min)

**1.1 Einstieg: Was passiert gerade?**
- Karpathy-Zitat: Von "Vibe Coding" zu "Agentic Engineering" (Feb 2025 -> Feb 2026)
- Zentrale These: Der Entwickler wird zum Boss des Agenten, nicht umgekehrt
- Icebreaker: Umfrage/Diskussion zum aktuellen Umgang mit AI-Tools
- Weitere relevante Zitate und Prognosen aus der Community

**1.2 Das 4-Stufen-Modell**
- Jede Stufe: Was geht rein, was kommt raus, welche Rolle hat der Mensch
- Kernaussage: Nicht jede Stufe ist schlecht — es kommt auf die Aufgabe an
- Kleine UI-Aenderung != neues Modul
- Entscheidungsmatrix: Wann welche Stufe? (Aufgabengroesse x Risiko x Komplexitaet)

**1.3 Wie funktioniert ein Coding Agent?**
- LLM + Tools + Kontext = Agent
- Der Kreislauf: Prompt -> Denken -> Tool aufrufen -> Ergebnis -> weiter denken
- Unterschied: Autocomplete (inline) vs. Chat vs. Agent (CLI)
- Landkarte: Skills, Plugins, MCP-Server, Hooks
- Referenzen:
  - DEV Community: "Forget the Hype: Agents are Loops"
  - Oracle: "What Is the AI Agent Loop?"
  - MCP Official Architecture Docs
  - GitHub Blog: "Copilot Ask, Edit, Agent modes"

**1.4 Wie aendert sich unsere Arbeitsweise?**
- Vom Tipper zum Architekten/Steuermann
- Pair-Programming mit dem Agenten: Zu zweit den Agenten steuern (Planning-Modus)
- Hypothese: Teams werden kleiner — Anforderungsaufnahme wird laenger als die Entwicklung
- Fokus verschiebt sich: Technische Qualitaet, Fachlichkeit, Konzeptionsfaehigkeit

**1.5 Demo: Gleiche Aufgabe, zwei Ansaetze**
- Live oder aufgezeichnet: Vibe Coding vs. Agentic Engineering
- Unterschied sichtbar machen: Designentscheidungen, Testqualitaet, Nachvollziehbarkeit

### Block 2: Von der Anforderung zum Plan (~50min)

**2.1 Kontextmanagement — Das Fundament**
- "Ein Agent ist nur so gut wie sein Kontext"
- AGENTS.md / Copilot Instructions — Aufbau und Struktur
- Praxis: Contact Software einem Agenten erklaeren
- Kontext-Hygiene: Wie entfernt/modifiziert man Kontext
- Gute Kontextgroesse: Token-Budgets, Relevanz vs. Rauschen
- Tools zur Kontextverwaltung: Workspaces, `.github/copilot-instructions.md`, MCP-Server

**2.2 Dokumentation als Steuerungsinstrument**
- Warum Doku wieder wichtig wird — sie ist fuer den Agenten
- Formate: UML, ADRs, Coding Guidelines, Code-Beispiele
- Wo lebt die Doku: Direkt in Projektordnern vs. separates Repo
- 3 Schichten:
  1. **Immer aktiv:** Konventionen, Architektur, Plattform-Grundlagen
  2. **Aufgabenbezogen:** Feature-Specs, API-Docs, Modul-Dokumentation
  3. **Temporaer:** Recherche-Ergebnisse, Debugging-Kontext
- Dokumentation als lebendes Projekt — wann und wie aktualisieren

**2.3 Brainstorming & Planning mit dem Agenten**
- Workflow: Anforderung -> Brainstorming -> Spec -> Plan -> Execution
- Demo: Eine Anforderung gemeinsam durchplanen
- Grosse vs. kleine Aufgabe — wann volle Methodik, wann reduziert
- Ausblick: Subagenten und Multi-Agent-Koordination

**2.4 Modelle und ihre Staerken**
- Welches Modell fuer welche Aufgabe (Planning, Coding, Review)
- Copilot-Modelle: GPT-4o, Claude Sonnet, Gemini
- Qwen-Modelle (Open Source, lokal einsetzbar)
- Kosten: Premium-Requests, Einsparmethoden

### Block 3: Von der Umsetzung zum Review (~60min)

**3.1 Execution: Den Agenten steuern**
- Kernprinzip: Agent schlaegt vor, Entwickler entscheidet
- Entscheidungspunkte definieren
- Grosse Aufgabe vs. kleine Aenderung — wann volle Methodik, wann reduziert
- Demo: Schrittweise Umsetzung mit Diskussionspunkten
- **Offener Punkt:** Skills/Plugins fuer Execution recherchieren oder eigene erstellen

**3.2 Testing: Die Kontrolle behalten**
- Kernproblem: Agent passt Test an statt Code zu fixen
- Best Practice: Tests zuerst, dann Implementierung
- Fehlgeschlagene Tests einzeln durchgehen: Regression oder erwartete Aenderung?
- Feedbackschleifen: Unit -> Integration -> Akzeptanz -> Playwright?
- **Offener Punkt:** Skills/Plugins fuer Testing recherchieren oder eigene erstellen

**3.3 Frontend-Entwicklung mit Agenten**
- UI passgenau beschreiben: Screenshots, Figma-Exports, Design Tokens
- Pragmatisch: Screenshots + Paint-Annotationen — reicht das?
- Demo oder Beispiel

**3.4 Code Reviews mit dem Agenten**
- Agent als Reviewer: Konventionen, Security, Best Practices
- Review-Kommentare schrittweise abarbeiten
- Geeignete Plugins (Security, Frontend, Backend)

**3.5 Bugfixing**
- Hypothesenbasiert: Erst Root Cause finden, dann fixen
- Workflow: Fehlschlagender Test -> Hypothese -> Fix -> Test gruen
- Wann eignet sich Bugfixing fuer Agenten, wann nicht

### Block 4: Tooling & Teamstandards (~30min)

**4.1 Euer Best-Practice-Repo**
- Inhalte: AGENTS.md-Vorlagen, Skills, Plugins, Use Cases, Beispiel-Prompts
- Nutzung: Repo klonen, in Workspace einbinden, loslegen
- Lebendes Dokument — Team-Pflege

**4.2 Empfohlene Plugins & Skills**
- Evaluierte Liste: Copilot-CLI-kompatibel, MCP-basiert
- Kategorien: Planning, Execution, Reviews, Context-Management, externe Systeme (Jira, GitLab, DB)
- Kosten-Uebersicht

**4.3 Welche Aufgaben eignen sich — und welche nicht**
- Gut: CRUD, UI, Boilerplate, Refactoring, Demonstratoren, Library Updates
- Bedingt: Bugfixing, Integration, Legacy-Code
- Schwierig: Komplexe Algorithmik, Performance, tiefe fachliche Logik
- AI Code Archaeology als Querschnittsfaehigkeit
- Onboarding von Codebasen: Agenten helfen, sich schnell in neue Projekte einzufinden

**4.4 Hands-on-Aufgaben fuer die Projektarbeit**
- 3-5 konkrete Use Cases mit Contact Software
- Abgestuft: Einfach (Vibe Coding reicht), mittel (Spec-Driven), komplex (Agentic Engineering)
- Checkliste und Ueberpruefungs-Prompt fuer Projektstandards

## Code-Repository Struktur

Das Repo dient als lebendes Team-Dokument mit folgenden Bereichen:

```
vortrag-agentic-ai/
  slides/                     # Marp-basierte Praesentations-Slides
    block-1-grundlagen.md
    block-2-anforderung-plan.md
    block-3-umsetzung-review.md
    block-4-tooling-standards.md
    assets/                   # Bilder, Diagramme
  best-practices/
    agents-md/                # AGENTS.md Vorlagen und Beispiele
    skills/                   # Evaluierte und eigene Skills
    plugins/                  # Plugin-Empfehlungen und Konfiguration
    kontext-management/       # Anleitungen zur Kontext-Verwaltung
    dokumentation/            # Vorlagen fuer ADRs, Coding Guidelines
    antipatterns/             # Schlechte Execution Plaene, haeufige Fehler
  use-cases/                  # Konkrete Uebungsaufgaben
    01-einfach/               # Vibe Coding reicht
    02-mittel/                # Spec-Driven
    03-komplex/               # Agentic Engineering
  referenzen/                 # Quellen, Links, Zitate
    quellen.md
    videos.md
    modell-vergleich.md
  docs/
    superpowers/specs/        # Design-Specs
```

## Offene Punkte (fuer Implementierung)

1. **Zitate & Icebreaker:** Recherche laeuft — Ergebnisse in Block 1.1 einbauen
2. **YouTube-Videos & Grafiken:** Recherchiert — beste Quellen in Referenzen aufnehmen
3. **Plugin-Evaluation:** Opra, Context7, claude-md-management, techwolf ai, weitere — Copilot-CLI-Kompatibilitaet pruefen
4. **Skills fuer Execution (3.1):** Recherchieren oder eigene bauen
5. **Skills fuer Testing (3.2):** Recherchieren oder eigene bauen
6. **Marp-Setup:** Konfiguration, Theme, Speaker-Notes-Format
7. **Contact-Software-Beispiele:** Plattform-Dokumente und Code spaeter einbinden
8. **Qwen-Modelle:** Recherche zu Staerken/Schwaechen fuer Modell-Vergleich
9. **Multi-Agent-Orchestrierung:** Fuer Thomas' eigenes Lernen — nicht Workshop-Inhalt
10. **Kosten-Recherche:** Copilot Premium-Requests, Abrechnungsmodelle
11. **Language Server:** Koennen diese auch fuer Contact Software genutzt werden? (Thomas' eigenes Lernen)

## Referenzen

### Grundlagen & Begriffe
- Karpathy: "Vibe Coding" (Feb 2025), "Agentic Engineering" (Feb 2026)
- Thoughtworks Tech Radar: Spec-Driven Development
- GitHub Spec Kit (72K+ Stars)
- arXiv: "Vibe Coding vs. Agentic Coding: Fundamentals" (Mai 2025)

### Frameworks & Modelle
- Martin Fowler: "Humans and Agents in SE Loops" — in/on/out of the loop
- Hyperact: 7 Levels of AI-Assisted Development
- BMAD Method: Role-based AI agent framework

### Praxis & Workflows
- Addy Osmani: "My LLM Coding Workflow Going Into 2026"
- Anthropic: 2026 Agentic Coding Trends Report
- Pragmatic Engineer: "How Claude Code is Built"

### Videos & visuelle Ressourcen
- GitHub Blog: "Real-world demo: Using different AI models in Copilot"
- Microsoft Learn: "Ask, Edit, Agent — In-depth Overview"
- QCon London 2025: "From Autocomplete to Agents" (Birgitta Boeckeler, Thoughtworks)
- DEV Community: "Forget the Hype: Agents are Loops"

### Architektur
- MCP Official Architecture: modelcontextprotocol.io
- Oracle: "What Is the AI Agent Loop?"
- Steve Kinney: "The Anatomy of an Agent Loop"

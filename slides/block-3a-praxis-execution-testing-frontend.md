---
marp: true
theme: contact
paginate: true
header: 'Agentic Engineering Workshop'
footer: 'Thomas Hein | Dataciders | 2026'
---

<!-- _class: lead -->

# Block 3a: Praxis I — Execution, Testing, Frontend

**Workshop: Agentic Engineering**
Thomas Hein — Dataciders

<!--
Dauer: ~45 Minuten
Ziel: Praktische Techniken fuer Execution, Testing und Frontend-Entwicklung
-->

---

# Execution: Den Agenten steuern

**Kernprinzip: Agent schlaegt vor, Entwickler entscheidet.**

Zwei Phasen — keine wird uebersprungen:

1. **Planung** — Erst Grobplanung, dann Feinplanung
2. **Execution** — Task fuer Task, mit Akzeptanzkriterien

> Kein Schritt ohne explizite Bestaetigung.
> Planung und Execution werden kuenftig als separate Skills bereitgestellt.

<!--
WICHTIG: Nicht einfach "Accept All" druecken.
Jeder Task ist ein bewusster Schritt.
Demo: Chat-Mitschnitt oder Live-Durchlauf zeigen.
Repo-Artefakt: best-practices/skills/execution-workflow.md
-->

---

# Phase 1: Planung

**Grobplanung — Richtung klaeren, noch kein Code:**
- Betroffene Bereiche & vorgeschlagene Reihenfolge
- Offene Designentscheidungen (mit Optionen zur Auswahl)
- Entwickler entscheidet → Akzeptanzkriterium bestaetigt

**Feinplanung — auf Code-Ebene pro Task (TDD-orientiert):**
- Welche Dateien werden bearbeitet? Vorher/Nachher-Vergleich
- Welche Tests zuerst? (Red → Green → Refactor)
- Akzeptanzkriterien fuer diesen Task

> **Feinplan bestaetigt → Execution startet**

<!--
Der Vorher/Nachher-Vergleich macht Aenderungen greifbar, bevor Code geschrieben wird.
TDD-Reihenfolge in der Feinplanung: Tests sind das erste Artefakt, nicht der Produktivcode.
Entwickler kann hier noch eingreifen, ohne Rollback-Aufwand.
-->

---

# Phase 2: Execution

**Immer in einem Git Worktree — parallel arbeiten auf einer Maschine.**

```bash
git worktree add .worktrees/<feature> -b feature/<feature>
```

Pro Task:
- Agent kuendigt an → Entwickler bestaetigt
- Agent fuehrt aus nach TDD (Red → Green → Refactor)
- Entwickler prueft gegen Akzeptanzkriterien → Commit

Nach jedem 3. Task: Checkpoint — "Sind wir noch auf Kurs?"

<!--
Git Worktrees ermoeglicht paralleles Arbeiten: mehrere Features oder Agenten gleichzeitig,
ohne gegenseitige Blockierung. Besonders wertvoll bei laengeren Tasks.
Regelmaessige Retrospektiven vermeiden Drift.
-->

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
-->

---

# Quellen & Weiterlesen — Execution Workflow

- [Dev.to — The AI Coding Workflow That Actually Works: Separate Planning from Execution](https://dev.to/matthewhou/separate-planning-from-execution-the-ai-coding-workflow-that-actually-works-1n00) — Warum Planning und Execution getrennt werden sollten
- [InfoQ — From Prompts to Production: a Playbook for Agentic Development](https://www.infoq.com/articles/prompts-to-production-playbook-for-agentic-development/) — Praxisleitfaden fuer agentic Development-Workflows
- [Thoughtworks — Preparing your team for the agentic SDLC](https://www.thoughtworks.com/en-us/insights/articles/preparing-your-team-for-agentic-software-development-life-cycle) — Team-Vorbereitung fuer agentic Software Development
- [GitHub Blog — How to build reliable AI workflows with agentic primitives](https://github.blog/ai-and-ml/github-copilot/how-to-build-reliable-ai-workflows-with-agentic-primitives-and-context-engineering/) — Zuverlässige AI-Workflows mit Context Engineering
- [Knostic — AI Coding Agent Governance Policies That Work](https://www.knostic.ai/blog/ai-coding-agent-governance) — Governance-Regeln fuer AI-Coding-Agents

<!--
Link-Folie fuer Teilnehmer, die sich vertiefen wollen.
-->

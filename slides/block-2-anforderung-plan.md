---
marp: true
theme: contact
paginate: true
header: "Agentic Engineering Workshop"
footer: "Thomas Hein | Dataciders | 2026"
---

<!-- _class: lead -->

# Block 2: Von der Anforderung zum Plan

**Workshop: Agentic Engineering**
Thomas Hein — Dataciders

<!--
Dauer: ~50 Minuten
Ziel: Strukturierte Anforderungsanalyse und Planung mit dem Agenten
-->

---

# Das Ökosystem eines Coding Agents

<div class="columns">
<div>

## Kontextmanagement

- **Agents.md:** Allgemeine Regeln
- **Skills/Rules:** Vordefinierte Workflows, TDD-Skill

## Tools

- **MCP-Server:** Externe Datenquellen (DB, Jira, Git)
- **CLI:** Tools als CLI-Zugriffe
- **Hooks:** Automatische Aktionen bei Events
- **Plugins:** Erweiterungen (z.B. Context7)

</div>
<div>

## Governance

- **Settings:** Was darf ein Agent tun
- **Permissions:** Welche Tools sind erlaubt
- **Sandboxing:** Schutz vor unerwuenschten Aktionen

## Human

🤦‍♂️

</div>
</div>

<!--
MCP = Model Context Protocol (Anthropic, jetzt offener Standard).
Wird in Block 3 vertieft — hier nur Ueberblick.
-->

---

# Quellen & Weiterlesen — Funktionsweise Coding Agent

- [DEV Community: "Forget the Hype: Agents are Loops"](https://dev.to/jakesweb/forget-the-hype-agents-are-loops-2fi5) — Praxis-Erklaerung des Agent-Loop-Konzepts
- [Oracle: "What Is the AI Agent Loop?"](https://www.oracle.com/artificial-intelligence/what-is-ai-agent-loop/) — Perceive/Reason/Plan/Act/Observe Schleife
- [Model Context Protocol — Architektur](https://modelcontextprotocol.io/docs/concepts/architecture) — MCP Host-Client-Server Konzept
- [GitHub Blog: Copilot Ask, Edit, Agent modes](https://github.blog/ai-and-ml/github-copilot/github-copilot-agent-mode-is-now-generally-available/) — Drei Modi im Vergleich

<!--
Link-Folie fuer Teilnehmer, die sich vertiefen wollen.
-->

---

# Context Engineering — Was ist das?

- "The discipline of intelligently selecting, organizing, and delivering exactly what the AI needs to make good decisions — without overwhelming it. — Elastic"

**Was ist der Kontext?** Alles was das Modell in diesem Moment "sieht":

| Was                  | Beispiel                                       |
| -------------------- | ---------------------------------------------- |
| System-Prompt        | AGENTS.md, Regeln, Rolle                       |
| Conversation History | Alle bisherigen Nachrichten der Session        |
| Tool Results         | Dateiinhalte, Terminalausgaben, Testergebnisse |
| Injiziertes Wissen   | RAG-Ergebnisse, Dokumentation, Memory          |

[Context in Action](https://code.claude.com/docs/en/context-window)

---

# Context Engineering — Was ist das?

![bg height:350px contain](./assets/block2/block-of-context-engineering.png)

---

# Warum brauchen wir das? LLMs haben 4 Grundprobleme:

- Wissen eingefroren zum Trainingszeitpunkt → kein aktuelles Wissen
- Kein Zugriff auf private Unternehmensdaten
- Tendenz zu Halluzinationen bei fehlendem Kontext
- Kein persistentes Gedächtnis über Sessions hinweg

**Der Kontext-Window ist das wichtigste Betriebsmittel des Agenten**

- Enthält Code, Reasoning, Useranweisungen, generierten Code
- 200K Tokens sind 20K Zeilen Code.
- Opus 4.6 kann 100K Zeilen Code lesen

<!--
Quelle: elastic.co/what-is/context-engineering
Paradigmenwechsel: Nicht "Prompt Engineering" (taktisch) sondern "Context Engineering" (strategisch).
Praxisbeispiel: Contact Software — 20 Jahre alte Python-Plattform die LLMs nicht kennen.
-->

---

# Context Engineering — Die 4 Strategien

| Strategie       | Was                        | Beispiel                                 |
| --------------- | -------------------------- | ---------------------------------------- |
| **Selection**   | Nur notwendige Infos laden | RAG, AGENTS.md statt ganzer Codebasis    |
| **Writing**     | Zustand extern speichern   | Memory-Dateien, Scratchpads, ADRs        |
| **Compression** | Token reduzieren           | `/compact`, Zusammenfassungen, Trimming  |
| **Isolation**   | Aufgaben aufteilen         | Subagenten mit eigenem, sauberem Kontext |

> Mehr Information ≠ bessere Entscheidungen — Relevanz schlägt Vollständigkeit

<!--
Quelle: elastic.co/what-is/context-engineering
Die 4 Strategien sind das Handwerkszeug des Context Engineers.
Isolation = Subagenten — Bruecke zu Block 3.
-->

---

# Context Rot — Wenn der Kontext kippt

**Context Rot** = schleichende Qualitätsdegradation durch zu vollen Kontext

- **"Lost in the middle"** — Informationen in der Mitte langer Kontexte werden schlechter erinnert
- **Noise-Effekt** — Irrelevante Inhalte lenken das Modell ab, Fehlerrate steigt
- **Fehler-Akkumulation** — Falsche Antworten werden Teil des nächsten Kontexts

**Symptome:**

- Agent wiederholt Fehler trotz Korrektur
- Agent "vergisst" frühere Instruktionen
- Qualität nimmt im Laufe der Session ab

**Gegenmassnahmen:** `/clear` — `/compact` — Subagenten — kurze Sessions

<!--
Context Rot ist der Hauptgrund fuer Qualitaetsverlust in langen Agenten-Sessions.
Demo-Tipp: Zeigen wie `/clear` eine Session "resettet".
Referenz: elastic.co + Claude Code Best Practices
-->

---

# Quellen & Weiterlesen — Kontextmanagement

- [Martin Fowler — Context Engineering for Coding Agents](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html) — Grundlagen und Patterns fuer kontextbewusstes Agenten-Design
- [Anthropic — Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Empfehlungen direkt vom Hersteller
- [GitHub Blog — How to write a great agents.md](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) — Lessons from over 2,500 repositories
- [AGENTS.md Specification — ASDLC](https://asdlc.io/practices/agents-md-spec/) — Offizielle Spec und Best Practices
- [JetBrains Research — Smarter Context Management for LLM-Powered Agents](https://blog.jetbrains.com/research/2025/12/efficient-context-management/) — Effizientes Kontext-Management in der Praxis

<!--
Link-Folie fuer Teilnehmer, die sich vertiefen wollen.
-->

---

# Erklären der Codebasis - Dokumentation

## Welche Formate fuer Agenten?

| Inhale                | Wofuer                | Agent-Verstaendnis |
| --------------------- | --------------------- | ------------------ |
| **Agents.md**         | Alles                 | ★★★ Exzellent      |
| **UML** (Mermaid)     | Architektur, Ablaeufe | ★★☆ Gut            |
| **ADRs**              | Designentscheidungen  | ★★★ Exzellent      |
| **Code-Beispiele**    | Konventionen zeigen   | ★★★ Exzellent      |
| **Coding Guidelines** | Standards durchsetzen | ★★★ Exzellent      |

<!--
Praxistipp: Code-Beispiele sind das staerkste Format.
"Zeig dem Agenten wie es aussehen soll" > "Beschreib dem Agenten wie es aussehen soll"
-->

---

# Quellen & Weiterlesen — Dokumentation als Steuerungsinstrument

- [Mintlify — What to Include in AGENTS.md](https://www.mintlify.com/agentsmd/agents.md/guides/what-to-include) — Welche Doku-Inhalte Agenten wirklich brauchen
- [AI Hero — A Complete Guide To AGENTS.md](https://www.aihero.dev/a-complete-guide-to-agents-md) — Praxisleitfaden fuer agentengerechte Dokumentation
- [Harness — The Agent-Native Repo: Why AGENTS.MD is the New Standard](https://www.harness.io/blog/the-agent-native-repo-why-agents-md-is-the-new-standard) — ADRs, Guidelines und Doku-Schichten im Ueberblick
- [GitHub Blog — How to write a great agents.md](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) — Lessons from over 2,500 repositories
- [Elastic — What is Context Engineering? Architecting Reliable AI](https://www.elastic.co/what-is/context-engineering) — Doku als Kontext-Fundament fuer zuverlaessige Agenten

<!--
Link-Folie fuer Teilnehmer, die sich vertiefen wollen.
-->

# Übergabe der Aufgabe

## TBD was ist das ideale Aufgabenformat

## NFRs festhalten — auch fuer den Agenten

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
-->

---

# Wann volle Methodik, wann reduziert?

| Aufgabe                | Methodik                          |
| ---------------------- | --------------------------------- |
| Neues Modul / Feature  | Brainstorming → Spec → Plan → TDD |
| Groesseres Refactoring | Plan → TDD                        |
| API-Aenderung          | Spec → Plan → TDD                 |
| Kleine UI-Aenderung    | Direkter Prompt mit Test          |
| Bugfix (lokal)         | Failing Test → Fix                |
| Config-Aenderung       | Direkter Prompt                   |

<!--
Nicht jede Aufgabe braucht den vollen Workflow.
Die Kunst ist, die richtige Stufe zu waehlen.
Faustregel: Wenn mehr als 2 Dateien betroffen → mindestens Plan.
-->

---

# Ausblick: Subagenten & Multi-Agent

- **Subagenten:** Spezialisierte Agenten fuer Teilaufgaben
  - Recherche-Agent, Test-Agent, Review-Agent
- **Koordination:** Hauptagent delegiert und integriert
- **Praxis heute:** Claude Code Subagents, GitHub Copilot Agent Mode

> Noch frueh — aber die Richtung ist klar.

<!--
Nicht Workshop-Fokus, aber wichtig zu erwaehnen.
-->

---

# Quellen & Weiterlesen — Brainstorming und Planning

- [Claude Code: Best Practices](https://code.claude.com/docs/en/best-practices) — Offizielle Empfehlungen von Anthropic: Workflow, Planning und Execution mit Claude Code
- [Dev.to — The AI Coding Workflow That Actually Works: Separate Planning from Execution](https://dev.to/matthewhou/separate-planning-from-execution-the-ai-coding-workflow-that-actually-works-1n00) — Warum Planung und Umsetzung getrennt werden sollten
- [superpowers — writing-plans Skill (SKILL.md)](https://github.com/obra/superpowers/blob/main/skills/writing-plans/SKILL.md) — Praxisvorlage fuer strukturierte Planung mit dem Agenten
- [InfoQ — From Prompts to Production: a Playbook for Agentic Development](https://www.infoq.com/articles/prompts-to-production-playbook-for-agentic-development/) — Vollstaendiges Playbook vom Prompt bis zum Deployment
- [Thoughtworks — Preparing your team for the agentic software development life cycle](https://www.thoughtworks.com/en-us/insights/articles/preparing-your-team-for-agentic-software-development-life-cycle) — Team-Vorbereitung auf den Agentic SDLC

<!--
Link-Folie fuer Teilnehmer, die sich vertiefen wollen.
-->

---

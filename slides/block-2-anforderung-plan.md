---
marp: true
theme: contact
paginate: true
header: 'Agentic Engineering Workshop'
footer: 'Thomas Hein | Dataciders | 2026'
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

# Dokumentation als Steuerungsinstrument

**Warum Dokumentation wieder wichtig wird: Sie ist fuer den Agenten.**

- Fehlende Doku = Agent erfindet oder raet
- Gute Doku = besserer, vorhersagbarer Output
- Dokumentation wird zum **Steuerungsinstrument**, nicht zum Papiertiger

<!--
Paradigmenwechsel: Frueher hat niemand Doku gelesen.
Jetzt liest der Agent sie IMMER — und handelt danach.
-->

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

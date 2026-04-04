---
marp: true
theme: contact
paginate: true
header: 'Agentic Engineering Workshop'
footer: 'Thomas Hein | Dataciders | 2026'
---

<!-- _class: lead -->

# Block 3b: Praxis II — Reviews, Bugfixing, Abschluss

**Workshop: Agentic Engineering**
Thomas Hein — Dataciders

<!--
Dauer: ~45 Minuten
Ziel: Code Reviews, systematisches Bugfixing, Zusammenfassung und Ausblick
-->

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

---

# Quellen & Weiterlesen — Code Reviews mit Agenten

- [CodeRabbit — AI Code Reviews](https://www.coderabbit.ai/) — Automatische PR-Reviews auf GitHub & GitLab, Multi-Layer-Analyse, agentic @coderabbitai-Interaktion
- [Claude Code — Code Review (Docs)](https://code.claude.com/docs/en/code-review) — Multi-Agent-Review mit Confidence Scoring, Inline-Kommentare auf GitHub PRs
- [GitHub Copilot Code Review (Docs)](https://docs.github.com/en/copilot/concepts/agents/code-review) — Agentic Review mit vollem Repository-Kontext, CLI-Integration via `gh pr`
- [Request Copilot review from GitHub CLI](https://github.blog/changelog/2026-03-11-request-copilot-code-review-from-github-cli/) — Copilot-Review direkt aus dem Terminal starten
- [State of AI Code Review Tools 2025](https://www.devtoolsacademy.com/blog/state-of-ai-code-review-tools-2025/) — Vergleich der wichtigsten Tools

<!--
Link-Folie fuer Teilnehmer, die sich vertiefen wollen.
-->

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

---

# Quellen & Weiterlesen — Bugfixing mit Agenten

- [Test-driven development (TDD) with GitHub Copilot](https://github.blog/ai-and-ml/github-copilot/github-for-beginners-test-driven-development-tdd-with-github-copilot/) — TDD-Workflow mit Copilot, schrittweise Anleitung fuer Einsteiger
- [How to Use TDD for better AI coding outputs](https://nimbleapproach.com/blog/how-to-use-test-driven-development-for-better-ai-coding-outputs/) — TDD als Qualitaetssicherung fuer KI-generierten Code
- [How I Validate Quality When AI Agents Write My Code](https://dev.to/teppana88/how-i-validate-quality-when-ai-agents-write-my-code-481c) — Praxisbericht: Qualitaetssicherung und Bugfixing mit KI-Agenten

<!--
Link-Folie fuer Teilnehmer, die sich vertiefen wollen.
-->

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

---

# Quellen & Weiterlesen — Sandboxing und Berechtigungssteuerung

- [Claude Code: Configure Permissions (Docs)](https://code.claude.com/docs/en/permissions) — allowedTools/blockedTools, deny-Regeln, Wildcard-Syntax fuer `.claude/settings.json`
- [Claude Code Security Best Practices — Backslash](https://www.backslash.security/blog/claude-code-security-best-practices) — Praxisleitfaden: Filesystem-Restrictions, Secrets-Management, Sandbox-Konfiguration
- [VS Code Copilot Security (Docs)](https://code.visualstudio.com/docs/copilot/security) — Workspace Trust, Agent Sandboxing, MCP-Server-Sicherheit
- [Safeguarding VS Code against prompt injections — GitHub Blog](https://github.blog/security/vulnerability-research/safeguarding-vs-code-against-prompt-injections/) — Angriffsvektoren auf Agent Mode und Gegenmassnahmen
- [Knostic — AI Coding Agent Governance Policies That Work](https://www.knostic.ai/blog/ai-coding-agent-governance) — Team-Governance: Policies definieren, durchsetzen, reviewen

<!--
Link-Folie fuer Teilnehmer, die sich vertiefen wollen.
-->

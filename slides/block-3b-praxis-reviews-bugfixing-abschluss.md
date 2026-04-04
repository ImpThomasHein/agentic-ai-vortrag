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

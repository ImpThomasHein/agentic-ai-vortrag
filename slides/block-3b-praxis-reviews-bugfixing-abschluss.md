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

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

### CodeRabbit
- Automatisches Review auf jedem Pull Request (GitHub und GitLab)
- Liefert: PR-Zusammenfassung, zeilenweise Kommentare, Severity-Einstufung
- Prueft: Logic Errors, Security Issues, Style, Test-Abdeckung
- Agentic: @coderabbitai im PR-Kommentar anschreiben — generiert Tests, oeffnet Issues
- Lernt aus Team-Feedback: loest Threads automatisch wenn Fix angewendet wird
- Ueber 2 Millionen Repositories, 13+ Millionen Pull Requests verarbeitet
- CLI-Support: IDE-Integration fuer VS Code, Cursor, Windsurf
- Kein direkter Copilot-CLI-Support, aber GitHub-Integration laeuft parallel zu Copilot

### Claude Code — Code Review (Research Preview)
- Offizielle Funktion: https://code.claude.com/docs/en/code-review
- Multi-Agent-Analyse: 5 unabhaengige Reviewer pruefen parallel (Logic, Security, CLAUDE.md-Compliance, Git-History-Kontext, Edge Cases)
- Jedes Finding bekommt Confidence Score 0–100; nur Findings >= 80 werden gepostet (< 1% als falsch markiert)
- Postet Inline-Kommentare direkt auf GitHub Pull Requests
- Grosse PRs (1000+ Zeilen): 84% erhalten Findings, im Schnitt 7,5 Issues
- Verfuegbar: Team- und Enterprise-Subscriptions; durchschnittliche Review-Zeit: 20 Minuten
- Skill-Variante: code-reviewer Skill prueft auch waehrend der Entwicklung (nicht nur im PR)

### GitHub Copilot Code Review
- Direkt in GitHub-Oberflaeche integriert: Reviewer in PR-Dialog auswaehlen
- Agentic: holt vollen Repository-Kontext vor dem Review (nicht nur den Diff)
- Durchschnittlich 5,1 Kommentare pro Review; in 71% der Reviews actionable Feedback
- Deterministische Tools zuschaltbar: CodeQL, ESLint als Teil des Reviews konfigurierbar
- Hand-off: Suggested Changes direkt an Copilot Coding Agent weitergeben (@copilot im PR-Kommentar)
- CLI-Support: `gh pr create` und `gh pr edit` unterstuetzen Copilot als Reviewer direkt vom Terminal
- Einschraenkung: Copilot hinterlasst immer "Comment"-Review (kein Approve/Request Changes)
- 60 Millionen Reviews bis Maerz 2026 (10x Wachstum seit April 2025)

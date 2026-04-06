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

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
→ Nach Abschluss: verwerfen oder in Schicht 1/2 uebernehmen

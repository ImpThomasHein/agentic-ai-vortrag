# Aufgabe: Benachrichtigungs-Modul (Komplex)

## Szenario
Es soll ein neues Benachrichtigungs-Modul entstehen, das:
- Bei bestimmten Events (Report erstellt, Status geaendert) Benachrichtigungen erzeugt
- Verschiedene Kanaele unterstuetzt (E-Mail, In-App)
- Benutzerspezifische Praeferenzen beruecksichtigt
- Skalierbar ist (Event-Queue)

## Empfohlene Methodik (Agentic Engineering)
1. **Brainstorming:** Anforderung verstehen, Architektur-Optionen erkunden
2. **Spec:** Technische Spezifikation mit Komponenten, Schnittstellen, Datenmodell
3. **Plan:** Tasks in 5-20min Schritten, TDD, Entscheidungspunkte markiert
4. **Execution:** Task fuer Task mit Entwickler-Checkpoints
5. **Review:** Agent-Review + menschlicher Review

## Architektur-Entscheidungen (zu diskutieren)
- Event-Sourcing vs. einfache DB-Tabelle?
- Synchron vs. asynchron (Celery)?
- Kanal-Abstraktion: Strategy Pattern?

## Lernziel
Voller Agentic Engineering Workflow mit echten Architektur-Entscheidungen,
bei denen der Entwickler die Richtung vorgibt.

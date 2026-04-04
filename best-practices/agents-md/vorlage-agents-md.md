# AGENTS.md — Projektvorlage

<!--
Dieses Template dient als Startpunkt fuer ein eigenes AGENTS.md.
Kopieren, anpassen, ins Repo-Root legen (oder nach .github/copilot-instructions.md).
-->

## 1. Mission & Besonderheiten

<!--
Was ist das Projekt? Welche Besonderheiten gibt es? Plattform-Eigenheiten?
Kurzbeschreibung (2–4 Sätze), wichtigste fachliche Ziele, spezielle Constraints (Performance, Sicherheit, Legacy).
-->

[Kurze Projektbeschreibung fuer den Agenten]

## 2. Tech-Stack & Projektstruktur

<!--
Welche Sprachen, Frameworks, Tools? Wo liegen die wichtigsten Verzeichnisse?
Hilft dem Agenten, die richtige Umgebung zu verstehen und zu navigieren.
-->

- Language: [z.B. Python 3.11]
- Framework: [z.B. Django 4.2]
- Struktur: [Kurze Erklaerung]

## 3. Build-, Run- und Test-Kommandos

<!--
Welche Befehle braucht der Agent um zu testen, bauen, starten?
Exakte Kommandos, die tatsaechlich im Projekt funktionieren.
-->

- Tests: `[z.B. pytest]`
- Lint: `[z.B. ruff check .]`
- Run: `[z.B. python manage.py runserver]`

## 4. Arbeitsweise / Agentic Workflow

<!--
Wie soll der Agent vorgehen? Welche Schritte sind Pflicht?
Definiert die Prozesse: Brainstorming, Planung, TDD, Clean Code, PR.
-->

- Immer erst Tests schreiben, dann Code
- Immer Planung vor Implementierung
- Vor grossen Aenderungen: Fragen stellen

## 5. Personas (Registry)

<!--
Welche spezialisierte Agenten-Personas gibt es im Projekt?
Link zu separaten .md-Dateien, die spezifische Rollen definieren.
-->

- Feature-Dev: [Beschreibung oder Pfad zur Persona-Datei]
- Bugfixer: [Beschreibung oder Pfad zur Persona-Datei]

## 6. Tests & Qualitaet

<!--
Was sind die Test-Anforderungen? Mindest-Coverage? CI-Checks?
Klaert ab, wann Tests gelten, und was der Agent mit Tests tun/nicht tun darf.
-->

- Coverage: [z.B. minimum 80%]
- Kein Merge ohne gruene Tests
- Tests duerfen nicht angepasst werden, um gruen zu werden

## 7. Git-Workflow

<!--
Branch-Strategie, Commit-Messages, PR-Regeln.
Klaert ab, welche Git-Operationen der Agent selbst machen darf und welche nicht.
-->

- Branch: feature/, bugfix/, hotfix/
- Commits: conventional commits (feat:, fix:, chore:)
- PR: mindestens ein Reviewer + gruene Tests

## 8. Grenzen & No-Gos

<!--
Was darf der Agent NICHT ohne Rueckfrage?
Definiert Kategorien: Always (kann der Agent immer), Ask first (muss fragen), Never (absolutes Verbot).
-->

Always:
- Dateien lesen und editieren
- Lokale Tests ausfuehren

Ask first:
- Neue Abhaengigkeiten installieren
- DB-Schema aendern
- Architekturentscheidungen

Never:
- Netzwerk-Requests an externe Dienste
- Secrets oder Credentials manipulieren
- Git push (remote) ohne explizite Anweisung

## 9. Architektur-Notizen & Stolpersteine

<!--
Was muss der Agent wissen, um keine alten Fehler zu wiederholen?
Dokumentiert bekannte Legacy-Bereiche, wichtige Entscheidungen, typische Fallstricke.
-->

- [Bekannte Legacy-Bereiche]
- [Wichtige Architektur-Entscheidungen]
- [Typische Fallstricke]

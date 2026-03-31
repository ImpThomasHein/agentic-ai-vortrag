---
name: agentic-python-feature
description: >
  Orchestriert einen Agentic-Coding-Workflow für Python-Features:
  zuerst Plan mit writing-plans, dann TDD-Schritte, dann Clean-Code-Review.
version: 0.1.0
author: Dein Name / Team
requires:
  # Passe die Skill-Namen an eure tatsächlichen Installations-Namen an
  - superpowers-writing-plans
  - python-tdd-workflow
  - clean-code-review
tags:
  - agentic-coding
  - python
  - tdd
  - clean-code
  - planning
---

# Agentic Python Feature Workflow

Dieser Skill definiert einen **verpflichtenden Ablauf** für die Implementierung eines neuen Features in unserer Python-Plattform:

1. **Verständnis & Scope klären**
2. **Implementierungsplan mit `writing-plans` erstellen**
3. **Plan gemeinsam prüfen und ggf. anpassen**
4. **Plan Task für Task im TDD-Stil umsetzen**
5. **Nach jedem Task Clean-Code-Review ausführen**
6. **Doku & Agents.md aktualisieren**

> WICHTIG: Schreibe niemals direkt viel Code, ohne zuerst diesen Workflow auszuführen.

---

## Wann dieser Skill verwendet wird

Nutze `agentic-python-feature`, wenn:

- ein neues Feature oder eine signifikante Änderung an der Plattform umgesetzt wird,
- ein Bugfix mit größerem Impact auf Architektur oder Datenmodelle verbunden ist,
- Domänenlogik neu geschnitten oder refaktoriert wird.

Für sehr kleine Änderungen (z. B. nur UI-Text, minimale Config-Änderung) kann eine vereinfachte Variante ohne vollen Plan ausreichend sein – das entscheidet der Entwickler.

---

## 1. Verständnis & Scope klären

1. Frage den Entwickler nach:
   - Ticket-/Issue-Referenz (z. B. Jira-Key),
   - fachlichem Ziel in 2–3 Sätzen,
   - betroffenen Komponenten/Module unserer Python-Plattform,
   - Qualitätsanforderungen (Performance, Security, Observability, etc.).

2. Fasse diese Informationen in einem kurzen Abschnitt **„Problem & Zielbild“** zusammen.

3. Verifiziere mit dem Entwickler:
   - „Habe ich das richtig verstanden? Gibt es wichtige Randbedingungen, die fehlen?“

---

## 2. Plan mit `writing-plans` erstellen

1. Verwende nun **ausschließlich** den Skill `superpowers-writing-plans`, um einen detaillierten Implementierungsplan zu erzeugen.

2. Vorgaben für den Plan:
   - Unterteile das Feature in Tasks von ca. 5–20 Minuten Umfang.
   - Jeder Code-Task folgt explizit dem TDD-Muster:
     1. failing Test schreiben/ergänzen,
     2. Tests ausführen und rot sehen,
     3. minimalen Code schreiben, um grün zu werden,
     4. Tests erneut ausführen,
     5. optional Refactor + erneute Tests.
   - Markiere Abhängigkeiten zwischen Tasks (z. B. „Task 3 hängt von 1 und 2 ab“).
   - Berücksichtige bestehende Architektur und Module unserer Plattform
     (lies dazu Agents.md, ADRs und relevante Architektur-Dokumente, falls vorhanden).

3. Präsentiere den vollständigen Plan in einer klaren, nummerierten Liste.

4. Frage den Entwickler explizit:
   - „Möchtest du Tasks umsortieren, aufteilen oder zusammenfassen?“
   - „Fehlt ein Task (z. B. Migration, Logging, Monitoring, Doku)?“

Passe den Plan ggf. anhand des Feedbacks an.

---

## 3. Ausführung Task für Task (TDD)

Für **jeden** Task im Plan:

1. **Ankündigung**
   - Nenne den aktuellen Task-Namen und das Ziel in 1–2 Sätzen.
   - Frage den Entwickler kurz, ob es besondere Wünsche für diesen Schritt gibt
     (z. B. bestimmte Patterns, Libraries, Constraints).

2. **TDD-Schritt durchführen**
   - Verwende den `python-tdd-workflow`-Skill oder folge manuell diesem Ablauf:
     1. Schreibe oder erweitere einen Test, der aktuell fehlschlägt
        und das gewünschte Verhalten des Tasks beschreibt.
     2. Führe die Tests aus und zeige die relevante Fehlermeldung.
     3. Schreibe **minimalen** Produktionscode, um den Test grün zu bekommen.
     4. Führe die Tests erneut aus und stelle sicher, dass alles grün ist.
     5. Führe falls sinnvoll ein kurzes Refactoring durch (ohne Verhalten zu ändern)
        und lasse die Tests erneut laufen.

3. **Entwickler im Loop**
   - Halte nach jedem Task kurz an und frage:
     - „Bist du mit diesem Schritt einverstanden?“
     - „Gibt es Anpassungen, die du hier bevorzugst (z. B. anderer Name, anderes Pattern)?“

---

## 4. Clean-Code-Review nach jedem Task

Nach Abschluss der TDD-Schritte für einen Task:

1. Rufe den `clean-code-review`-Skill auf, mit Kontext:
   - neu erstellte/angepasste Dateien,
   - relevante Tests.

2. Bitte den Clean-Code-Skill insbesondere auf Folgendes zu achten:
   - Lesbarkeit, Benennung, SRP
   - Duplication/DRY
   - Fehlerbehandlung & Logging
   - Einhaltung der Projekt-Coding-Guidelines
   - architektonische Konventionen (Schichten, Abhängigkeiten)

3. Fasse die gefundenen Punkte in einer Liste:
   - „Must-Fix vor Merge“
   - „Nice-to-have / später refactoren“

4. Frage den Entwickler, welche Vorschläge direkt umgesetzt werden sollen,
   und implementiere **nur diese** Änderungen.

---

## 5. Dokumentation & Agents.md

Am Ende des Features:

1. Aktualisiere (falls nötig) folgende Artefakte:
   - relevante Architektur- oder Modul-Dokumentation,
   - Architecture Decision Records (ADRs),
   - `Agents.md` (z. B. neue Konventionen, bekannte Stolpersteine, Beispiele).

2. Erstelle eine kurze **„Change Summary“**:
   - fachliche Änderung in 2–3 Sätzen,
   - betroffene Module,
   - neue/angepasste Tests,
   - bekannte Limitationen oder Follow-ups.

3. Schlage eine Formulierung für Commit-Message und Pull-Request-Beschreibung vor.

---

## 6. Regeln & Anti-Patterns (was dieser Skill vermeiden soll)

Dieser Skill ist ausdrücklich dazu da, folgende Anti-Patterns zu verhindern:

- „Vibe Coding“: viel Code ohne Plan, ohne Tests, ohne Doku.
- Riesige Änderungen ohne kleine, nachvollziehbare Schritte.
- Tests, die nur vorhandenen Code absichern, statt Fachlichkeit/Use-Cases.
- Clean-Code/Security nur „am Ende irgendwie“ statt schrittweise.

Wenn der Entwickler versucht, Code ohne Plan, ohne TDD-Schritte
oder ohne Clean-Code-Review zu erzeugen, erinnere höflich an diesen Workflow
und schlage vor, den entsprechenden Abschnitt zuerst auszuführen.

---

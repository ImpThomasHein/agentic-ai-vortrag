# AGENTS.md – Python-Plattform

Dieses Projekt nutzt AI-Coding-Agenten im **Agentic-Coding-Ansatz**.  
Ziel: hohe Codequalität, nachvollziehbare Architektur, saubere Tests und Doku.

Bitte lies diese Datei vollständig, bevor du größere Änderungen mit einem Agenten durchführst.

---

## 1. Dein Modus: Du bist der Boss, der Agent ist das Werkzeug

- Du triffst Design- und Architekturentscheidungen, der Agent schlägt nur Optionen vor.
- Du verantwortest, dass Code, Tests und Doku zu unserer Plattform passen.
- Wenn du unsicher bist, bitte den Agenten zuerst um Rückfragen und Alternativen, nicht um „irgendeine Lösung“.

---

## 2. Standard-Workflow für neue Features

Für **alle neuen Features und größeren Refactorings** verwende:

> `/agentic-python-feature`

Dieser Meta-Skill orchestriert unseren Workflow:

1. **Verständnis klären**
   - Ticket/Issue, fachliches Ziel, betroffene Module, Qualitätsanforderungen.

2. **Plan vor Code**
   - Nutze `superpowers-writing-plans`, um einen detaillierten Implementierungsplan zu erzeugen  
     (Tasks à 5–20 Minuten, mit klaren Abhängigkeiten).

3. **TDD-Schritte pro Task**
   - Pro Task:
     - failing Test schreiben/erweitern,
     - Tests ausführen (rot),
     - minimalen Code schreiben,
     - Tests erneut ausführen (grün),
     - optional Refactor + Tests.

4. **Clean-Code-Review nach jedem Task**
   - Nutze den Clean-Code-/Anti-Pattern-Skill, um Lesbarkeit, Duplication, Fehlerbehandlung,
     Projektkonventionen und Security-Smells zu prüfen.
   - Nur die vom Entwickler bestätigten Vorschläge umsetzen.

5. **Doku & Agents.md aktualisieren**
   - RELEVANTE Doku (Architektur, Module, ADRs) anpassen.
   - Kurz zusammenfassen, was sich fachlich und technisch geändert hat.

**Nicht erlaubt:** große Code-Änderungen ohne vorherigen Plan und ohne Tests.

---

## 3. Kleine Änderungen (vereinfachter Workflow)

Für **kleine Änderungen** (z. B. UI-Text, Logging ergänzen, offensichtlicher Bugfix ohne Architektur-Impact):

1. Erkläre dem Agenten kurz:
   - Datei(en), Scope der Änderung, gewünschtes Ergebnis.
2. Bitte um einen **Mini-Plan mit 2–3 Schritten** (kein Voll-Feature-Plan).
3. Schreibe/aktualisiere mindestens einen Test oder Smoke-Test, sofern sinnvoll.
4. Lasse den Clean-Code-/Lint-Skill einmal über die betroffenen Dateien laufen.

---

## 4. Code-Stil & Architektur (Kurzfassung)

- Halte dich an unsere bestehenden Module und Boundaries (siehe `docs/architecture/*.md`).
- Bevorzuge kleine, fokussierte Funktionen und Dateien statt „God-Module“.
- Kein Copy-Paste von Legacy-Anti-Patterns – orientiere dich an aktuellen, gut getesteten Beispielen.

Wenn du unsicher bist, bitte den Agenten:

> „Finde ein gutes Beispiel für diese Art von Logik in diesem Repo und erkläre mir kurz, wie es aufgebaut ist.“

---

## 5. Tests

- **Neue Features:** immer mindestens einen neuen oder erweiterten Test pro wichtigem Use-Case.
- **Bugfixes:** zunächst failing Test schreiben, der den Bug reproduziert, dann fixen.
- Nutze Test-Runner-Kommandos aus `README.md` bzw. `docs/testing.md`.

Der Agent darf Tests **nicht stillschweigend lockern oder löschen**, nur nach expliziter Bestätigung.

---

## 6. Git & PR-Workflow

- Kein direktes Arbeiten auf `main`/`master`.
- Jeder größere Change geht über einen separaten Branch und Pull Request.
- PR-Beschreibung enthält:
  - fachliche Änderung in 2–3 Sätzen,
  - technische Änderung (Module, Patterns),
  - Tests, die hinzugefügt/aktualisiert wurden.

Bitte den Agenten bei Bedarf:

> „Erstelle eine PR-Beschreibung, die die fachlichen und technischen Änderungen für Reviewer klar erklärt.“

---

## 7. Dokumentation für Agenten

- **Diese Datei** ist der zentrale Ort für Agent-Regeln; halte sie schlank und konkret.
- Detail-Doku (Architektur, How-Tos, Migrations) lebt unter `docs/`.
- Bevor du neue Markdown-Dateien anlegst, prüfe:
  - Gibt es einen passenden Ort in `docs/`?
  - Gibt es bestehende ADRs, die erweitert werden sollten?

Wenn du neue Agent-Regeln brauchst (z. B. für ein neues Modul oder eine neue Konvention),  
schlage dem Agenten vor:

> „Hilf mir, diesen Punkt dauerhaft in AGENTS.md zu ergänzen, so dass andere Agents ihn beim nächsten Mal berücksichtigen.“

---

## 8. Anti-Patterns (was wir vermeiden wollen)

- „Vibe Coding“: viel Code ohne Plan, ohne Tests, ohne Doku.
- Riesige, schwer erklärbare Diffs.
- Tests, die nur aktuellen Code abnicken statt Fachlichkeit absichern.
- Markdown-Spam am Repo-Root (Doku gehört in `docs/`, siehe `docs/HOW_TO_DOC.md`).

Wenn der Agent in diese Richtung geht, erinnere ihn an diesen Agentic-Workflow und  
wechsle zurück zu `/agentic-python-feature` oder einem Mini-Plan.

---

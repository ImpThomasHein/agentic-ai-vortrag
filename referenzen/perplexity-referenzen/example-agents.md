# AGENTS.md – [Projektname]

Dieses Repository gehört zu einer Python-basierten Plattform.  
AI-Coding-Agenten sollen hier **im Agentic-Coding-Ansatz** arbeiten:  
Plan → Review → TDD → Implementierung → Clean Code → Doku.

Bitte halte dich an dieses Dokument, wenn du Aufgaben in diesem Repo bearbeitest
– egal ob du ein Mensch oder ein Agent bist.

---

## 1. Mission & Besonderheiten

- Kurzbeschreibung des Systems (2–4 Sätze).
- Wichtigste fachliche Ziele (z. B. Reporting, Workflows, Integrationen).
- Besondere Constraints:
  - Performance-/Latenzanforderungen
  - Sicherheits-/Compliance-Aspekte
  - Technische Grenzen (z. B. Legacy-Subsysteme, die nicht geändert werden dürfen).

---

## 2. Tech-Stack & Projektstruktur

**Tech-Stack**

- Python 3.11
- [Frameworks, z. B.] FastAPI, SQLAlchemy, Celery
- PostgreSQL, Redis
- Testing: pytest, [weitere Tools]

**Verzeichnisstruktur (wichtigste Ordner)**

- `app/` – Domain- und Use-Case-Logik (Services, Use Cases)
- `core/` – Infrastruktur (DB, Config, Logging, Security)
- `api/` – HTTP-/RPC-APIs
- `tests/` – Unit- und Integrationstests
- `docs/` – Architektur-, Domain- und Betriebsdokumentation
- `skills/` – SKILL.md-Dateien für Agenten-Workflows (Brainstorming, Plans, TDD, Clean Code)

Bitte bevorzuge bestehende Module gegenüber neuen Dateien, wenn sie fachlich passen.

---

## 3. Build-, Run- und Test-Kommandos

**Lokaler Start**

- `make run-api`
- `make run-worker`
- (oder die in `README.md` definierten Kommandos eintragen)

**Tests ausführen**

- Alle Tests: `make test`
- Nur Unit-Tests: `make test-unit`
- Nur Integrationstests: `make test-integration`

> Agenten: Nutzt diese Kommandos, wenn ihr „Tests ausführen“ sollt.
> Erfindet keine eigenen Test-Befehle.

---

## 4. Arbeitsweise / Entwicklungs-Workflow (Agentic Coding)

### 4.1 Für neue Features & größere Refactorings

Nutze IMMER den Meta-Skill `/agentic-python-feature` (oder Äquivalent).

Verpflichtende Schritte:

1. **VERSTEHEN (Brainstorming-Skill)**
   - Ticket/Story + Akzeptanzkriterien zusammenfassen.
   - 2–3 relevante bestehende Code-Stellen identifizieren und kurz erklären.
   - Pseudocode / Funktionssignaturen für neue/anzupassende Funktionen vorschlagen.
   - Geplante Testszenarien (Namen, Dateien, Szenarien) auflisten.

2. **PLANEN (Writing-Plans)**
   - Mit `writing-plans` einen detaillierten Task-Plan erstellen:
     - Tasks à 5–20 Minuten
     - Pro Task expliziter TDD-Ablauf (failing Test → minimaler Code → Tests grün).
   - Plan dem Entwickler zur Freigabe vorlegen; erst nach Freigabe implementieren.

3. **UMSETZEN (TDD)**
   - Task für Task:
     - neuen/angepassten Test hinzufügen → rot sehen
     - minimalen Code schreiben → Tests grün
     - optionales Refactoring mit erneutem Testlauf.

4. **CLEAN CODE**
   - Nach jedem abgeschlossenen Task den Clean-Code-/Anti-Pattern-Skill
     für die betroffenen Dateien ausführen.
   - Gefundene Punkte als „Must-Fix“ vs. „Nice-to-have“ markieren; nur von
     Entwickler freigegebene Änderungen anwenden.

5. **DOKU & PR**
   - Relevante Doku in `docs/` aktualisieren (Architektur, Module, Domain).
   - Kurze Change-Notiz im PR (fachlich + technisch + Tests).
   - Falls nötig, ADR anlegen/erweitern.

### 4.2 Für kleine Änderungen

Kleine Änderungen = z. B. UI-Texte, Logging, klar lokaler Bugfix ohne Architektur-Impact.

- Mini-Plan (2–3 Schritte) statt Voll-Plan erstellen.
- Mindestens einen Test ergänzen/aktualisieren, wenn sinnvoll.
- Einmal Clean-Code-/Lint-Skill über die geänderten Dateien laufen lassen.
- Doku nur dann ändern, wenn Verhalten oder Schnittstellen betroffen sind.

---

## 5. Code-Style & Beispiele

Kurzregeln (bitte an Projekt anpassen):

- Services bleiben dünn, Domain-Logik steckt in klar benannten Funktionen/Klassen.
- Keine Business-Logik in API-Handlern; diese delegieren an Services.
- Fehlerbehandlung:
  - fachliche Fehler → klare, typisierte Exceptions mit sprechenden Messages
  - technische Fehler loggen, keine „Silent Fails“.

**Beispiel für guten Stil (Python-Service)**

```python
def list_reports(user_id: str, filters: ReportFilter) -> list[Report]:
    """
    Liefert alle Reports für einen Nutzer und angewendete Filter zurück.
    """
    # Input validieren
    validate_filters(filters)

    # Reports aus Repository holen
    reports = self._repository.list_reports(user_id=user_id, filters=filters)

    # ggf. Post-Processing
    return reports
```

Wenn du unsicher bist, bitte zuerst:

> „Zeig mir ein gutes Beispiel für Funktion X in diesem Repo.“

---

## 6. Tests & Qualität

- Für neue Features:
  - mindestens ein neuer oder erweiterter Unit-/Integrationstest pro Kern-Use-Case.
- Für Bugfixes:
  - zuerst einen failing Test schreiben, der den Bug reproduziert,
    dann fixen, dann alle relevanten Tests ausführen.
- Tests werden NICHT ohne explizite Freigabe gelockert oder gelöscht.

Test-Dateikonventionen (anpassen):

- `tests/app/<bereich>/test_<modul>.py` für Unit-Tests
- `tests/integration/<bereich>/...` für Integrations-Tests

---

## 7. Git-Workflow

- Kein Push direkt auf `main` / `master`.
- Jeder Change läuft über Feature-Branch + Pull Request.
- PR-Beschreibung enthält:
  - Ticket-Referenz
  - fachliche Kurzbeschreibung
  - technische Änderungen (betroffene Module)
  - Tests (neu/angepasst, wie ausgeführt)

Agenten dürfen:

- Branches anlegen
- Commits erstellen
- PR-Beschreibungen vorschlagen

Agenten dürfen NICHT:

- ohne Human-Review in `main` mergen
- CI/Quality-Checks deaktivieren

---

## 8. Grenzen & No-Gos

**Always**

- `AGENTS.md` und relevante `docs/`-Seiten lesen, bevor du größere Änderungen vornimmst.
- Tests ausführen, bevor du große Refactorings abschließt.
- Kontext auf die relevanten Module/Ordner begrenzen.

**Ask first**

- DB-Schema ändern, Migrations hinzufügen/ändern.
- Neue externe Services / Libraries einführen.
- Öffentliche APIs brechen oder stark verändern.

**Never**

- Secrets, Zugangsdaten, Keys in Code oder Tests schreiben.
- `migrations/`, generierten Code oder Vendor/3rd-Party-Verzeichnisse überschreiben.
- Sehr große Dateien (z. B. Dumps, ML-Modelle) anfassen oder in den LLM-Kontext laden.

---

## 9. Architektur-Notizen & Stolpersteine

- Kurzbeschreibung wichtiger Bounded Contexts / Module.
- Typische Stolpersteine (z. B. spezielle Flags, Legacy-Workarounds).
- Hinweise auf bekannte flakey Tests oder Bereiche, die angefasst werden sollten
  (oder gerade NICHT angefasst werden dürfen).

Wenn du bei einem dieser Punkte unsicher bist, bitte:

> „Erkläre mir kurz, wie Modul X in dieser Architektur gedacht ist
> und welche Regeln dort gelten.“

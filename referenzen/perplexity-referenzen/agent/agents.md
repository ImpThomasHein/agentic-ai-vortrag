# AGENTS.md – [Projektname]

Dieses Repository gehört zu einer Python-basierten Plattform.  
AI-Coding-Agenten sollen hier **im Agentic-Coding-Ansatz** arbeiten:
Plan → Review → TDD → Implementierung → Clean Code → Doku.

Dieses Dokument ergänzt das README und erklärt speziell Agenten,
wie sie in diesem Projekt effizient und sicher arbeiten sollen.

---

## 1. Mission & Besonderheiten

- Dieses System implementiert [kurz beschreiben: z. B. Reporting-Plattform, Workflow-Engine …].
- Kernanforderungen:
  - Hohe Nachvollziehbarkeit (jede Änderung ist begründet und getestet).
  - Klare Modulgrenzen (Services, Repositories, APIs).
  - Stabile Schnittstellen zu Umsystemen (Jira, Datenbank, externe APIs).
- AI-Agenten unterstützen Menschen; sie entscheiden nichts Kritisches alleine.

---

## 2. Tech-Stack & Projektstruktur

**Tech-Stack**

- Python 3.11
- [z. B.] FastAPI, SQLAlchemy, Celery
- PostgreSQL, Redis
- Tests: pytest (+ evtl. weitere Tools)

**Wichtige Verzeichnisse**

- `app/` – Domain- und Use-Case-Logik (Services, Use Cases)
- `core/` – Infrastruktur (DB, Config, Logging, Security)
- `api/` – HTTP-/RPC-APIs
- `tests/` – Unit- und Integrationstests
- `docs/` – Architektur-, Domain- und Betriebsdokumentation
- `.github/agents/` – Agent-Personas (z. B. Feature-Dev, Bugfixing)

---

## 3. Build-, Run- und Test-Kommandos

**Entwicklung**

```bash
# API lokal starten
make run-api

# Worker lokal starten
make run-worker
```

**Tests**

```bash
# Alle Tests
make test

# Nur Unit-Tests
make test-unit

# Nur Integrationstests
make test-integration
```

> Agenten: Nutzt diese Kommandos, wenn ihr „Tests ausführen“ sollt.
> Erfindet keine eigenen Test-Befehle.

---

## 4. Arbeitsweise / Agentic Workflow (global)

Gilt für alle Agenten und Entwickler, sofern die Persona nichts Spezielleres sagt.

1. **Verstehen & Kontext sammeln**
   - Ticket/Story + Akzeptanzkriterien verstehen.
   - Relevante Module/Dateien und bestehende Tests identifizieren.
   - Wichtigste Rahmenbedingungen aus `docs/` und diesem `AGENTS.md` berücksichtigen.

2. **Planen vor Code**
   - Für Features: Einsatz von Plan-/Brainstorming-Skills (z. B. `writing-plans`, `/agentic-python-feature`).
   - Plan in kleinen Tasks (5–20 Minuten) mit expliziten Testschritten (TDD) erstellen.
   - Plan vom Entwickler bestätigen lassen, bevor implementiert wird.

3. **Umsetzen im TDD-Stil**
   - Pro Task:
     - failing Test hinzufügen/erweitern → rot sehen.
     - minimalen Code schreiben → Tests grün.
     - optionales Refactoring mit erneutem Testlauf.

4. **Clean Code & Qualität**
   - Nach jedem Task: Lint-/Clean-Code-/Anti-Pattern-Skills für geänderte Dateien ausführen.
   - Gefundene Punkte in „Must-Fix vor Merge“ vs. „Nice-to-have“ trennen.
   - Nur vom Entwickler bestätigte Anpassungen umsetzen.

5. **Doku & PR**
   - Relevante Doku in `docs/` aktualisieren (Architektur, Module, Domain, ADRs).
   - PR mit:
     - Ticket-Referenz,
     - fachlicher Kurzbeschreibung,
     - technischen Änderungen (Module, Schnittstellen),
     - Tests (neu/angepasst).

---

## 5. Personas (Registry)

Dieses Projekt nutzt mehrere spezialisierte Agent-Personas.  
Die **vollständigen Persona-Definitionen** stehen in separaten Dateien;
hier ist nur das „Telefonbuch“ (Registry).

- `@feature-dev`
  - Datei: `.github/agents/feature-dev-agent.md`
  - Rolle: Umsetzung neuer Features und größerer Refactorings nach Agentic-Workflow
  - Erwartung:
    - Brainstorming/Verstehen mit Pseudocode.
    - Plan via Writing-Plans.
    - TDD + Clean Code + Doku wie oben beschrieben.

- `@bugfix`
  - Datei: `.github/agents/bugfixing-agent.md`
  - Rolle: Hypothesenbasiertes Bugfixing mit Root-Cause-Fokus
  - Erwartung:
    - Kontext & Logs analysieren.
    - Failing Test schreiben (Reproduktion).
    - Minimaler Fix + Regression-Tests + Clean-Code-Prüfung.

> Agenten: Wenn du als spezielle Persona agierst, lade die passende Persona-Datei
> und befolge deren Workflow **zusätzlich** zu diesem globalen `AGENTS.md`.

---

## 6. Tests & Qualität (global)

- **Neue Features**
  - mind. ein neuer/erweiterter Test pro zentralem Use-Case.
- **Bugfixes**
  - zuerst failing Test schreiben, der den Bug reproduziert.
  - Fix implementieren, alle relevanten Tests ausführen.
- Tests werden nicht gelöscht/verwässert, um Builds „grün“ zu machen.

Test-Dateikonventionen (Beispiel, anpassen):

- `tests/app/<bereich>/test_<modul>.py` – Unit-Tests
- `tests/integration/<bereich>/...` – Integrationstests

---

## 7. Git-Workflow (global)

- Kein direktes Arbeiten auf `main`/`master`.
- Jeder Change über Feature-Branch + Pull Request.
- PR-Beschreibung:
  - Ticket-Referenz (z. B. `PY-1234`)
  - fachliche Kurzbeschreibung
  - technische Änderungen
  - Tests (neu/angepasst und wie ausgeführt)

Agenten dürfen:

- Branches anlegen,
- Commits erstellen,
- PR-Beschreibungen vorschlagen.

Agenten dürfen NICHT:

- ohne Human-Review in `main` mergen,
- CI-/Quality-Checks deaktivieren.

---

## 8. Grenzen & No-Gos

**Always**

- Dieses `AGENTS.md` und relevante `docs/`-Seiten lesen, bevor du größere Änderungen planst.
- Kontext auf relevante Module/Ordner begrenzen.
- Tests ausführen, bevor du größere Refactorings abschließt.

**Ask first**

- DB-Schema ändern, neue Migrations anlegen.
- Neue externe Services/Libraries einführen.
- Öffentliche APIs brechen.

**Never**

- Secrets, Zugangsdaten oder Tokens in Code oder Tests schreiben.
- generierte Dateien/Vendor-Ordner überschreiben.
- sehr große Dateien (Dumps, ML-Modelle) bearbeiten
  oder komplett in den LLM-Kontext laden.

---

## 9. Architektur-Notizen & Stolpersteine (Platzhalter)

- [Kurzbeschreibung wichtiger Bounded Contexts / Services.]
- [Hinweise auf Legacy-Bereiche, flakey Tests, bekannte Fallstricke.]

Aktualisiere diesen Abschnitt, sobald du neue Erkenntnisse hast,
damit zukünftige Agenten (und Entwickler) davon profitieren.

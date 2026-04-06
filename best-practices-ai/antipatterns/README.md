# Antipatterns — Was NICHT tun

## 1. "Accept All" ohne Lesen
**Problem:** Alle Agent-Vorschlaege akzeptieren ohne die Diffs zu lesen.
**Folge:** Unverstandener Code, versteckte Bugs, technische Schulden.
**Stattdessen:** Jeden Diff lesen, Designentscheidungen hinterfragen.

## 2. Tests anpassen statt Code fixen
**Problem:** Agent aendert Tests, damit sie gruen werden — statt den Bug zu fixen.
**Folge:** Regressionen werden unsichtbar.
**Stattdessen:** Harte Regel: Tests sind heilig. Nur nach expliziter Freigabe aendern.

## 3. Riesige Aenderungen ohne Plan
**Problem:** "Implementiere Feature X" als einzelnen Prompt, alles auf einmal.
**Folge:** Unuebersichtliche Diffs, schwer reviewbar, schlecht testbar.
**Stattdessen:** Plan in kleine Tasks zerlegen, Task fuer Task umsetzen.

## 4. Kontext-Ueberladung
**Problem:** Dem Agent die gesamte Codebasis als Kontext geben.
**Folge:** Agent verliert Fokus, Antworten werden ungenauer.
**Stattdessen:** Relevanten Kontext gezielt auswaehlen (3-Schichten-Modell).

## 5. Agent als Orakel behandeln
**Problem:** Dem Agent blind vertrauen, auch bei Architektur-Entscheidungen.
**Folge:** Agent trifft Entscheidungen, die nicht zur bestehenden Architektur passen.
**Stattdessen:** Der Entwickler entscheidet bei Architektur, der Agent schlaegt vor.

## 6. Fehlender Kontext fuer die Plattform
**Problem:** Kein AGENTS.md, keine Plattform-Dokumentation fuer den Agent.
**Folge:** Agent generiert Code, der nicht zur Plattform passt.
**Stattdessen:** AGENTS.md mit Plattform-Besonderheiten, Conventions, Beispielen.

## 7. Schlechte Execution-Plaene
### Beispiel: Zu grobe Tasks
❌ "Task 1: Backend implementieren. Task 2: Frontend implementieren. Task 3: Tests."
✅ "Task 1: DB-Schema fuer Notifications erstellen (Migration + Test).
    Task 2: NotificationService.create() mit failing Test..."

### Beispiel: Fehlende TDD-Schritte
❌ "Task 1: Implementiere den Endpoint inkl. Tests"
✅ "Task 1: Schreibe failing Test fuer GET /api/notifications.
    Task 2: Implementiere minimalen Handler fuer gruen.
    Task 3: Schreibe failing Test fuer Filterung..."

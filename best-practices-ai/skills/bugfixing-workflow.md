Anmerkungen für mich,
müssen auch Testdriven sein,
müssen auch in worktrees gelöst werden

# Bugfixing Workflow — Best Practice

## Kernprinzip

Hypothesenbasiert: Erst Root Cause finden, dann fixen.

## Ablauf

1. **Kontext sammeln** (70% der Zeit)
   - Fehlermeldung, Logs, betroffene Nutzerpfade
   - Relevante Module und fruehere aehnliche Bugs
   - Hypothesen formulieren

2. **Failing Test schreiben** (Reproduktion)
   - Test beschreibt das fehlerhafte Verhalten
   - Test muss fehlschlagen → beweist den Bug

3. **Minimaler Fix**
   - Kleinstmoegliche Code-Aenderung
   - Bestehende Architektur respektieren
   - Tests gruen sehen

4. **Regression absichern**
   - Alle relevanten Test-Suites ausfuehren
   - Clean-Code-Check fuer geaenderte Dateien

5. **Dokumentieren**
   - Root-Cause-Erklaerung im PR
   - Welche Tests den Bug abdecken

## Wann eignet sich Bugfixing fuer Agenten?

- ✅ Gut: Klar reproduzierbare Bugs mit Stacktrace
- ✅ Gut: Regressions-Bugs (vorher ging es, jetzt nicht)
- ⚠️ Bedingt: Bugs in komplexer Geschaeftslogik
- ❌ Schwierig: Intermittierende Bugs, Race Conditions, Performance-Bugs

## Referenz

Ausgearbeitete Agent-Persona: example-repo-perplexity/agent/bugfixing-agent.md

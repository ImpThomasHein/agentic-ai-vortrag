# Dokumentation als Steuerungsinstrument

> Recherche-Stand: April 2026  
> Quellen: GitHub Blog, Augment Code, Martin Fowler, Equal Experts, InfoWorld, Builder.io, Michel Lutz, AWS Architecture Blog

---

## Warum Doku wieder wichtig wird

- **Dokumentation ist nicht mehr nur fuer Menschen — sie ist fuer den Agenten**  
  Der Agent liest AGENTS.md, CLAUDE.md und `docs/`-Verzeichnisse, bevor er Code schreibt. Was dort steht, bestimmt die Qualitaet seiner Ausgabe.

- **Gute Doku = besserer Agent-Output**  
  GitHub hat 2.500+ Repositories ausgewertet: Agents mit klarer Kontextdatei produzieren konsistenteren, projektkonformen Code — weniger Stilbrueche, weniger falsche Annahmen.

- **Fehlende Doku = Agent erfindet oder raet**  
  Ohne explizite Vorgaben faellt der Agent auf Trainings-Defaults zurueck. Er verwendet z. B. `npm` statt `pnpm`, falsche Test-Kommandos oder veraltete Bibliotheken. Eine ETH-Zurich-Studie (2025) zeigt: Auto-generierte Kontextdateien halfen nur marginal (+4 %), waehrend manuell gepflegte Doku den groessten Nutzen bringt.

- **Doku als einmaliges Investment, das sich bei jedem Task auszahlt**  
  Statt bei jeder Session neu zu erklaeren "wie wir arbeiten", kodiert man die Regeln einmalig — und jeder Agent profitiert davon sofort.

---

## Empfohlene Formate

| Format | Wofuer | Agent-Verstaendnis |
|--------|--------|--------------------|
| Markdown | Alles: Regeln, Konventionen, Kontext | Exzellent — nativ in Trainingsdaten |
| UML (Mermaid) | Architektur, Sequenzen, ER-Diagramme | Gut — Mermaid ist besser als PlantUML fuer LLMs |
| UML (PlantUML) | Enterprise/Confluence-Umgebungen | Gut — aber schlechtere LLM-Syntax-Kompetenz |
| ADRs | Designentscheidungen, abgelehnte Alternativen | Exzellent — liefert "Warum", nicht nur "Was" |
| Code-Beispiele | Konventionen zeigen (echter Code > Beschreibung) | Exzellent — ein Beispiel schlaegt 3 Absaetze Text |
| JSON Schema | API-Vertraege, Datenstrukturen | Gut — praeziser als Prosatext |
| YAML Frontmatter | Persona-Definition in Agent-Dateien | Gut — strukturierter Metadaten-Header |

**Mermaid vs. PlantUML fuer Agenten:**  
Mermaid integriert sich nativ in GitHub/GitLab-Markdown und wird von LLMs zuverlaessiger erzeugt und gelesen. PlantUML hat breiteren UML-Umfang, ist aber in Confluence-Umgebungen sinnvoller. Fuer AI-first-Projekte: Mermaid bevorzugen.

---

## Nicht-funktionale Anforderungen (NFRs) festhalten

NFRs sind die am haeufigsten fehlende Dokumentation in KI-unterstuetzten Projekten. Der Agent optimiert sonst nur fuer Funktionalitaet.

### Pflicht-Kategorien

- **Performance-Vorgaben**: Latenz-Budgets, SLAs (z. B. "API antwortet in 98 % der Faelle unter 1 Sekunde"), Time-to-First-Token fuer LLM-basierte Features
- **Security-Anforderungen**: OWASP-Kategorien, Compliance-Vorgaben (DSGVO, ISO 27001), Secrets-Handling
- **Skalierungsanforderungen**: Erwartete Last, Burst-Szenarien, horizontale vs. vertikale Skalierung
- **Observability**: Logging-Anforderungen, Metriken, Alerting-Schwellen
- **Ethics/Fairness** (fuer AI-Features): Bias-Tests, Erklaerbarkeits-Anforderungen

### Format-Empfehlung

NFRs als messbare Pass/Fail-Kriterien formulieren — nicht als vage Wuensche:

```markdown
## NFR: Performance
- API-Endpunkte muessen p95 < 200ms erfuellen (gemessen mit k6)
- Datenbankabfragen: max. 3 Queries pro Request
- Kein Endpoint ohne Timeout-Konfiguration (default: 5s)

## NFR: Security
- Keine Secrets im Code oder in Tests (ESLint-Regel: no-hardcoded-credentials)
- OWASP Top 10: alle Punkte per Checklist geprueft vor Release
- Rate Limiting: alle oeffentlichen Endpunkte max. 100 req/min
```

### Wo NFRs hingehoeren

NFRs gehoeren in **Schicht 1 (immer aktiv)** — also direkt in `AGENTS.md` oder eine dedizierte `docs/nfr.md`, die in `AGENTS.md` referenziert wird. Der Agent muss sie bei **jeder Aenderung** kennen, nicht nur bei spezifischen Security-Tasks.

Alternativ: NFR-Sektion in der Architektur-Doku oder als eigene ADRs ("ADR-0012: Wir setzen p95 < 200ms als harte SLA-Grenze").

---

## ADRs — Designentscheidungen fuer Agenten

Architecture Decision Records (ADRs) sind kurze Markdown-Dokumente, die *eine* Architekturentscheidung festhalten — inklusive Kontext, Entscheidung, Konsequenzen und abgelehnten Alternativen.

### Warum ADRs fuer Agenten besonders wertvoll sind

1. **Der Agent versteht "Warum"** — nicht nur "Was". Ohne ADR weiss der Agent nicht, warum ihr Axios statt fetch verwendet, oder warum Repository Pattern statt direktem ORM-Zugriff.
2. **Warnungen bei Konflikten** — Agenten koennen neue Vorschlaege gegen bestehende ADRs pruefen und warnen, wenn ein Vorschlag einer dokumentierten Entscheidung widerspricht.
3. **Verhindert Regression** — Als "ADR-0007 deprecated" markierte Entscheidungen signalisieren dem Agenten: diesen Ansatz nicht wieder vorschlagen.
4. **Strukturierter Kontext fuer AI-generierte ADRs** — AI kann "kernel of truth"-Einzeiler (z.B. "Am 22. April entschieden: DBT statt dbt-core") zu vollstaendigen ADRs ausbauen.

### Standard-Format (Michael Nygard + AI-Erweiterung)

```markdown
# ADR-0042: Wir verwenden Mermaid fuer alle Architekturdiagramme

**Status:** Accepted | Proposed | Deprecated | Superseded by ADR-0056

## Kontext
Wir benoetigen Diagramme, die versioniert, diff-bar und agent-lesbar sind.
Bisherige Loesung (Confluence-Grafiken) war nicht im Repo, nicht versioniert.

## Entscheidung
Alle Architekturdiagramme werden als Mermaid-Syntax in Markdown-Dateien gepflegt.

## Konsequenzen
+ Diagramme sind versionierbar und review-faehig (Pull Requests)
+ LLM-Agenten koennen Mermaid lesen und generieren
+ GitHub/GitLab rendern Mermaid nativ
- Kein drag-and-drop wie in Draw.io
- Komplexe Diagramme benoetigen manuelle Layout-Korrekturen

## Abgelehnte Alternativen
- Draw.io: nicht text-basiert, Agent kann nicht lesen
- PlantUML: schlechtere LLM-Kompetenz, schwerer in Markdown
```

### Ablageort

```
docs/
  adr/
    0001-use-fastapi-not-flask.md
    0002-postgres-as-primary-database.md
    0042-mermaid-for-diagrams.md
```

Agenten-Konfiguration (in `AGENTS.md`): "Lies `docs/adr/` bevor du Architekturentscheidungen triffst."

---

## Wo lebt die Doku? (Progressive Verfuegbarkeit)

Das Kernprinzip: **Agenten koennen nur lesen, was im Kontext ist.** Je naeher die Doku am Code liegt, desto zuverlassiger nutzen Agenten sie.

### Option A: Im Code-Repo (empfohlen fuer Agenten)

**Vorteile fuer Agenten:**
- Doku wird automatisch geladen, wenn der Agent das Repo klont oder oeffnet
- Kein externer Zugriff noetig — kein Berechtigungs-Problem
- Doku und Code bleiben synchron — PRs aendern Doku und Code gemeinsam
- Hierarchisches Laden: `AGENTS.md` im Root fuer globale Regeln, `AGENTS.md` in Unterverzeichnissen fuer lokale Regeln (lokale Datei hat Vorrang)

**Progressive Loading via AGENTS.md:**

```
/                         <- Schicht 1: immer geladen
  AGENTS.md              <- globale Regeln, NFRs, Grenzen
  docs/
    architecture.md      <- Schicht 2: bei Architektur-Tasks laden
    adr/                 <- Schicht 3: bei Entscheidungspunkten laden
    nfr.md               <- Schicht 1 (referenziert aus AGENTS.md)
  src/
    payments/
      AGENTS.md          <- Schicht 2: nur bei Payment-Code relevant
```

**Empfohlene Struktur im Root-AGENTS.md:**
```markdown
## Pflichtlektuere vor grossen Aenderungen
- `docs/architecture.md` — Systemueberblick
- `docs/adr/` — Architekturentscheidungen (besonders neueste 5)
- `docs/nfr.md` — Performance/Security-Grenzen

## Immer gueltig (keine weiteren Dateien noetig)
- Secrets nie in Code oder Tests
- pnpm, nicht npm
- Tests laufen mit: pnpm test
```

**Grenze: unter 150 Zeilen im Haupt-AGENTS.md** (Augment Code-Empfehlung). Bei mehr Inhalt: Modularisierung in Unterverzeichnisse.

### Option B: Separates Doku-Repo (via Workspace/MCP)

**Wann sinnvoll:**
- Doku teilen sich mehrere Repos (Microservice-Landschaft mit gemeinsamen Standards)
- Compliance-Anforderungen verlangen strikte Trennung von Code und Doku
- Doku-Team hat eigenen Review-Prozess (technische Schreiber, Product Owners)

**Ansatz via MCP (Model Context Protocol):**
- MCP-Server expostiert Doku-Repo als Tool-Schnittstelle
- Agent kann gezielt Doku-Seiten anfragen (semantische Suche via `zilliztech/claude-context` oder aehnlich)
- Nachteil: erfordert MCP-Konfiguration pro Entwickler, Offline-Arbeit nicht moeglich

**Ansatz via Workspace:**
- Claude Code / Copilot Workspace-Konfiguration verweist auf externes Repo
- Agenten haben Lesezugriff auf beide Repos gleichzeitig

### Empfehlung

**Fuer Teams, die gerade starten:** Alles ins Code-Repo. `AGENTS.md` + `docs/`-Ordner reichen. Agenten arbeiten sofort besser.

**Fuer groessere Organisationen:** Hybrid — globale Standards in einem zentralen Doku-Repo (via MCP oder Workspace), projekt-spezifische Regeln immer im Code-Repo. Niemals auf externes Repo als einzige Quelle setzen — Agenten muessen auch offline funktionieren.

**Nie empfehlenswert:** Doku nur in Confluence/Wiki ohne Code-Repo-Spiegel. Agenten haben keinen automatischen Zugriff, und Doku veraltet schneller ohne Code-nahe Pflege.

---

## Dokumentation als lebendes Projekt

Doku, die nicht mitgepflegt wird, schadet aktiv — ein Agent, der veraltete Regeln liest, macht systematisch falsche Entscheidungen.

### Pflege-Prinzipien

- **Bei jedem Feature: relevante Doku mitaktualisieren**  
  Feature-Branch aendert `src/payments/` → PR muss auch `docs/architecture.md` und ggf. neues ADR enthalten. Kein Feature-Merge ohne Doku-Check.

- **Agent kann Doku-Updates vorschlagen (in PR-Beschreibung)**  
  Im AGENTS.md-Workflow: "Schreibe in jede PR-Beschreibung einen Abschnitt 'Doku-Impakt': Welche Dateien in docs/ sind betroffen? Schlage konkrete Aenderungen vor."

- **Review-Schritt: "Ist die Doku noch aktuell?"**  
  PR-Checklist-Punkt: "Relevante ADRs / NFRs / AGENTS.md-Abschnitte geprueft und aktualisiert?"

- **Veraltete ADRs markieren, nicht loeschen**  
  Status "Deprecated" oder "Superseded by ADR-0056" signalisiert dem Agenten: diesen Ansatz nicht verwenden, ohne Kontext.

### ADRs automatisch vorschlagen lassen

Im `AGENTS.md` konfigurieren:
```markdown
## Wann ADRs erstellen
- Neue externe Library einfuehren → ADR vorschlagen
- Architekturmuster aendern → ADR vorschlagen
- NFR brechen oder anpassen → ADR vorschlagen
- Schreibe ADR-Entwurf in die PR-Beschreibung, Review entscheidet ob merge
```

### Docs-as-Code-Workflow

```
Feature-Branch
  ├── src/feature/...          <- Code
  ├── tests/feature/...        <- Tests
  ├── docs/adr/0043-new.md    <- ADR (wenn Architekturentscheidung)
  └── docs/feature.md         <- Feature-Doku (wenn noetig)
  
PR-Beschreibung (vom Agenten generiert):
  - Ticket-Referenz
  - Fachliche Beschreibung
  - Technische Aenderungen
  - Doku-Impakt: "ADR-0043 added, docs/architecture.md section 3.2 updated"
```

---

## Anti-Patterns: Was Agenten schadet

| Anti-Pattern | Problem | Loesung |
|---|---|---|
| AGENTS.md > 300 Zeilen ohne Modularisierung | Kontext-Overhead, Agent ignoriert Teile | Aufteilen in Unterverzeichnis-Dateien |
| Auto-generiertes AGENTS.md (LLM-Output) | Redundant mit existierender Doku, +20% Token-Kosten | Manuell pflegen, nur nicht-offensichtliche Regeln |
| Architektur-Uebersichten im Root-AGENTS.md | Keine Performance-Verbesserung nachweisbar | In `docs/architecture.md` auslagern, verlinken |
| Doku nur in Confluence | Agent kein automatischer Zugriff | Spiegel im Code-Repo als Markdown |
| NFRs als vage Wuensche ("soll schnell sein") | Agent kann nicht pruefen | Messbare Kriterien: p95 < 200ms |
| Veraltete ADRs ohne Status-Update | Agent schlaegt deprecated Ansatz vor | Status-Feld: Deprecated/Superseded pflegen |

---

## Quellen

- [GitHub Blog: How to write a great AGENTS.md — Lessons from 2,500+ repositories](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)
- [Augment Code: How to Build Your AGENTS.md (2026)](https://www.augmentcode.com/guides/how-to-build-agents-md)
- [Builder.io: Improve your AI code output with AGENTS.md](https://www.builder.io/blog/agents-md)
- [Martin Fowler: Context Engineering for Coding Agents](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html)
- [Equal Experts: Accelerating ADRs with Generative AI](https://www.equalexperts.com/blog/our-thinking/accelerating-architectural-decision-records-adrs-with-generative-ai/)
- [Michel Lutz: ADRs und Generative AI](https://micheltlutz.me/en/articles/architecture/adr/adr-guia-iniciantes-ia-generativa)
- [AWS Architecture Blog: Master ADRs — Best Practices](https://aws.amazon.com/blogs/architecture/master-architecture-decision-records-adrs-best-practices-for-effective-decision-making/)
- [InfoWorld: How to write nonfunctional requirements for AI agents](https://www.infoworld.com/article/4061123/how-to-write-nonfunctional-requirements-for-ai-agents.html)
- [Mermaid vs PlantUML 2025 — Cybewave Studio](https://www.cybewave.io/mermaid-vs-plantuml)
- [Claude Code: Best Practices](https://code.claude.com/docs/en/best-practices)

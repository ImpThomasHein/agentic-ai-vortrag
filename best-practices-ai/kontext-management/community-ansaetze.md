# Kontextmanagement — Community-Ansätze

Stand: April 2026. Vergleich der verbreitetsten Ansätze zum Bereitstellen von Kontext für AI-Coding-Agenten.

---

## Ansatz 1: AGENTS.md (GitHub/GitLab-Standard)

**Wie:** Markdown-Datei im Repo-Root (und optional in Unterverzeichnissen), die Agent-Personas, Projektkontext, Workflows und Grenzen beschreibt. Unterstützt von GitHub Copilot und GitLab Duo.

**Vorteile:**
- Herstellerübergreifend: GitHub Copilot, GitLab Duo und weitere Tools lesen die gleiche Datei — eine Quelle, mehrere Konsumenten
- Versionierbar im Repository; Änderungen sind im Git-History nachvollziehbar
- Erzwingt klare Struktur: Tech-Stack, Befehle, Grenzen (Always / Ask first / Never) in einer Datei
- Unterstützt verschachtelte AGENTS.md in Unterverzeichnissen für Monorepos
- Analyse von 2.500+ Repositories zeigt: spezifische Befehle, echte Code-Beispiele und explizite Grenzen reduzieren Fehler und unerwünschte Aktionen messbar
- GitLab Duo: drei Ebenen (User-Level, Workspace, Unterverzeichnis) ermöglichen individuelle und Team-Präferenzen nebeneinander

**Nachteile:**
- Erfordert erheblichen initialen Dokumentationsaufwand — vage Beschreibungen ("helpful coding assistant") versagen vollständig
- Wartungsaufwand: bei sich änderndem Tech-Stack oder Architektur muss die Datei aktiv gepflegt werden
- Keine dynamische Kontextzulieferung — alles wird statisch bei Session-Beginn geladen
- Eine einzelne Datei im Root wird schnell unübersichtlich bei großen Projekten (ohne verschachtelte Struktur)

**Tools:** GitHub Copilot, GitLab Duo; als Daten-Layer lesbar von OpenAI Codex und anderen Agenten

**Referenz:** https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/

---

## Ansatz 2: CLAUDE.md + Hierarchie

**Wie:** Verschachtelte `.claude/`-Verzeichnisse mit CLAUDE.md-Dateien auf drei Ebenen — User (`~/.claude/CLAUDE.md`), Projekt-Root (`./CLAUDE.md`) und Unterverzeichnisse (`subdir/CLAUDE.md`). Ergänzt durch ein `.claude/rules/`-Verzeichnis mit pfadgesteuertem Laden.

**Wie die Hierarchie funktioniert:**
Claude Code lädt beim Start alle CLAUDE.md-Dateien vom Dateisystem-Root abwärts bis zum aktuellen Arbeitsverzeichnis. Dateien in Unterverzeichnissen werden erst geladen, wenn der Agent in diesen Verzeichnissen arbeitet (Lazy Loading). Spezifischere Dateien haben höhere Priorität. CLAUDE.local.md ermöglicht lokale Overrides ohne Versionierung.

Das `.claude/rules/`-Verzeichnis erlaubt pfadgezielte Regeln per YAML-Frontmatter:

```yaml
---
paths: src/api/**/*.ts
---
# API-Regeln — nur aktiv bei API-Dateien
- Alle Endpoints validieren Input mit Zod
```

**Vorteile:**
- Feinste Granularität: User-Präferenzen, Team-Standards und modul-spezifische Regeln sauber getrennt
- Lazy Loading vermeidet "Priority Saturation" — irrelevante Regeln landen nicht im Kontext
- Pfadgezielte Regeln im `.claude/rules/`-Verzeichnis halten den Kontext präzise und schlank
- CLAUDE.local.md ermöglicht persönliche Overrides ohne Konflikte mit dem Team
- Besonders stark für Monorepos mit heterogenen Technologien in verschiedenen Packages

**Nachteile:**
- Claude-Code-spezifisch — andere Tools ignorieren diese Dateien (GitHub Copilot, Cursor, Windsurf lesen CLAUDE.md nicht)
- Komplexere Struktur erfordert Team-Disziplin beim Anlegen und Pflegen der Verzeichnishierarchie
- Neues Teammitglied muss das Hierarchiemodell verstehen, bevor es effektiv genutzt werden kann
- Individuelle User-Level-Dateien (`~/.claude/CLAUDE.md`) sind nicht versioniert — gefährlich für Teamkonsistenz

**Dokumentation:** https://code.claude.com/docs/en/memory | https://claudefa.st/blog/guide/mechanics/rules-directory

---

## Ansatz 3: IDE-spezifische Rules
- **Wie:** `.cursorrules` (Cursor IDE), `.windsurfrules` (Windsurf IDE), `.github/copilot-instructions.md` (VS Code/JetBrains)
- **Vorteile:**
  - Nahtlose IDE-Integration, keine Konfiguration noetig
  - Direkte Einbindung in den Coding-Workflow
  - Versionierbar im Repo
- **Nachteile:**
  - Tool-spezifisch — nicht portabel zwischen IDEs
  - Keine Hierarchie-Unterstuetzung (ein File)
  - Konkurrierendes Ecosystem: jede IDE hat eigenes Format
- **Tools:** Cursor, Windsurf, VS Code (Copilot Instructions), JetBrains AI

---

## Ansatz 4: MCP-basierter dynamischer Kontext
- **Wie:** MCP-Server (Model Context Protocol) liefern Kontext dynamisch auf Anfrage statt statisch per Datei
- **Vorteile:**
  - Dynamisch und aktuell — Kontext wird zur Laufzeit generiert (z.B. aktuelles DB-Schema, Jira-Tickets)
  - Kein Token-Budgetproblem — nur relevanter Kontext wird geladen
  - Erweiterbar: beliebige Datenquellen anbindbar
- **Nachteile:**
  - Komplexerer Setup (MCP-Server muss betrieben werden)
  - Abhaengigkeit von externem Service
  - Noch wenig Standardisierung in der Praxis
- **Beispiele:** Context7 (Library-Doku), GitHub MCP (Repository-Kontext), Jira MCP (Ticket-Kontext)
- **Referenz:** https://modelcontextprotocol.io/docs/concepts/architecture

---

## Bonus: Kontext-Schichten (Layered Context)

**Wie:** Kein einzelnes Format, sondern ein Architektur-Prinzip: Kontext wird in Schichten organisiert nach Beständigkeit und Relevanz. Beschrieben u.a. von Martin Fowler (Context Engineering for Coding Agents) und Anthropic.

**Die drei Schichten:**

| Schicht | Inhalt | Wann aktiv |
|---------|--------|-----------|
| Always-on | CLAUDE.md / AGENTS.md im Root, globale Regeln | Bei jeder Session |
| Task-specific | Modul-CLAUDE.md, pfadgezielte Rules, Skills | Wenn passende Dateien/Pfade betroffen |
| Ephemeral | MCP-Calls, Sub-Agenten, temporäre Prompts | Für einzelne Aufgaben, danach verworfen |

**Vorteile:**
- Reduziert "Context Noise": irrelevante Informationen erreichen den Agenten nicht
- Skaliert mit Projektkomplexität ohne einzelne Dateien aufzublähen
- Kombiniert die Stärken der anderen Ansätze: stabile Basis (Always-on) + adaptiver Mittelkontext + dynamische Spezialabfragen
- Ermöglicht Kostenoptimierung: teure dynamische Kontextaufrufe nur wo nötig
- Team-skalierbar: verschiedene Rollen pflegen verschiedene Schichten

**Nachteile:**
- Kein einheitlicher Standard für die Kombination aller Schichten
- Erfordert bewusste Architekturentscheidungen und initiales Design
- Höherer konzeptueller Overhead für neue Teammitglieder

**Referenz:** https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html

---

## Empfehlung für professionelle Softwareentwicklung

Für professionelle Entwicklungsteams — unabhängig vom konkreten AI-Tool — empfiehlt sich eine **zweistufige Basis mit optionaler dynamischer Erweiterung**:

### Stufe 1 — Immer: Tool-agnostische Basisdokumentation (AGENTS.md)

Eine `AGENTS.md` im Repository-Root bildet das Fundament. Sie beschreibt Tech-Stack mit Versionen, Verzeichnisstruktur, Build- und Test-Kommandos, Code-Style mit konkreten Beispielen und explizite Grenzen (Always / Ask first / Never). Da AGENTS.md von GitHub Copilot, GitLab Duo und weiteren Tools gelesen wird, ist diese Investition herstellerneutral und langlebig. Verschachtelte AGENTS.md in Unterverzeichnissen skalieren diese Struktur auf Monorepos.

### Stufe 2 — Wo sinnvoll: Tool-spezifische Modularisierung (CLAUDE.md-Hierarchie)

Teams, die Claude Code primär nutzen, ergänzen die Basis mit `.claude/rules/`-Dateien für pfadgezieltes Laden — das hält den Kontext schlank und vermeidet Priority Saturation. CLAUDE.local.md deckt persönliche Overrides ab, ohne ins Team-Repo einzufließen. Diese Schicht ist additiv und bricht nicht die tool-agnostische AGENTS.md-Basis.

### Operativ: Was Teams tun sollten

- AGENTS.md als lebendiges Dokument behandeln: nach jedem Sprint-Ende prüfen, ob Tech-Stack, Befehle oder Grenzen noch stimmen
- Kontext minimal halten: "Find the smallest set of high-signal tokens" — Anthropic-Prinzip
- Keine Secrets in Kontext-Dateien, auch nicht implizit durch Pfadangaben zu `.env`-Dateien
- CLAUDE.local.md (oder `.gitignore`d lokale Overrides) für persönliche Präferenzen, die nicht ins Team-Repo gehören
- Iterativer Aufbau: mit einer guten AGENTS.md starten, Schichten nur hinzufügen wenn spürbare Probleme auftreten

---

## Quellen

- GitHub Blog: [How to write a great agents.md](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)
- Anthropic: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- GitLab: [AGENTS.md customization files](https://docs.gitlab.com/user/duo_agent_platform/customize/agents_md/)
- Martin Fowler: [Context Engineering for Coding Agents](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html)
- Claude Code Docs: [Memory and CLAUDE.md hierarchy](https://code.claude.com/docs/en/memory)
- claudefa.st: [Claude Code Rules Directory](https://claudefa.st/blog/guide/mechanics/rules-directory)
- GitHub Changelog: [Copilot coding agent supports AGENTS.md](https://github.blog/changelog/2025-08-28-copilot-coding-agent-now-supports-agents-md-custom-instructions/)

# Plugin- und Skill-Empfehlungen

Stand: April 2026. Recherchiert auf Basis aktueller Dokumentation und Community-Erfahrungen.

---

## Copilot-kompatibel (VS Code + JetBrains)

Diese Tools funktionieren mit GitHub Copilot — entweder als MCP-Server oder als agent skills, die in beiden IDEs verfügbar sind. Ab März 2026 sind Agent Mode, MCP-Server und Custom Agents in Copilot sowohl für VS Code als auch für JetBrains allgemein verfügbar (GA).

| Plugin/Skill | Zweck | Kompatibilität | Notizen |
|---|---|---|---|
| **GitHub MCP Server** | Repo-Zugriff, PRs, Issues direkt im Agenten | VS Code + JetBrains | Offizielle GitHub-Integration; in awesome-copilot enthalten |
| **Playwright MCP Server** | Browser-Automatisierung, UI-Tests | VS Code + JetBrains | Für End-to-End-Tests und Accessibility-Checks |
| **Figma MCP Server** | Design-Datei-Zugriff für UI-Codegenerierung | VS Code + JetBrains | Kombiniert mit GitHub MCP für Design-to-Code-Workflows |
| **Context7 MCP Server** | Aktuelle Library-Dokumentation on demand | VS Code + JetBrains (via MCP) | Über 9.000 Libraries indexiert; verhindert veraltete API-Verwendung |
| **polyglot-test-agent** | Multi-Agent-Pipeline für Unit-Tests | VS Code (Copilot plugin) | Teil von awesome-copilot; sprachunabhängig |
| **testing-automation** | Unit-, Integrations- und E2E-Teststrategien | VS Code (Copilot plugin) | awesome-copilot Marketplace |
| **azure-cloud-development** | IaC: Bicep, Terraform, serverlose Funktionen | VS Code + JetBrains (via MCP) | Azure-spezifisch; nur relevant für Azure-Projekte |
| **AGENTS.md / agent skills** | Projektspezifische Verhaltenssteuerung | VS Code + JetBrains | Ab 2026 GA in JetBrains; Copilot liest AGENTS.md und CLAUDE.md |

**Wichtige Einschränkung:** Agent Plugins (gebündelte Pakete aus skills + agents + hooks + MCP) sind derzeit nur in VS Code (Preview). In JetBrains sind einzelne MCP-Server und agent skills verfügbar, aber keine Plug-in-Bundles aus dem VS Code Marketplace.

---

## Claude-Code-spezifisch

Diese Skills sind Teil des Superpowers-Frameworks (github.com/obra/superpowers) und funktionieren ausschliesslich mit Claude Code. Superpowers ist ein Open-Source-Framework mit über 93.000 GitHub-Stars (März 2026) und ist im Anthropic Plugin-Marktplatz gelistet.

| Plugin/Skill | Zweck |
|---|---|
| **superpowers: brainstorming** | Verfeinert Ideen durch gezielte Fragen, erkundet Alternativen, dokumentiert das Design vor der Implementierung |
| **superpowers: writing-plans** | Zerlegt genehmigte Designs in 2–5-Minuten-Aufgaben mit exakten Dateipfaden, vollständigen Code-Specs und Verifikationsschritten |
| **superpowers: executing-plans** | Führt den Plan aus — entweder als parallele Subagenten mit zweistufigem Review oder in Batches mit menschlichen Checkpoints |
| **superpowers: systematic-debugging** | Hypothesenbasiertes Debugging; verhindert blindes Probieren |
| **superpowers: test-driven-development** | Erzwingt RED-GREEN-REFACTOR-Zyklen vor der Implementierung |
| **superpowers: requesting-code-review** | Strukturiertes Review-Request-Template nach Implementierung |
| **superpowers: receiving-code-review** | Verarbeitet Review-Feedback mit technischer Strenge statt blinder Zustimmung |
| **superpowers: verification-before-completion** | Erzwingt Verifikationsbefehle bevor eine Aufgabe als "fertig" deklariert wird |
| **superpowers: using-git-worktrees** | Erstellt isolierte Git-Worktrees für Feature-Arbeit |
| **superpowers: dispatching-parallel-agents** | Verteilt unabhängige Aufgaben auf parallele Subagenten |
| **superpowers: subagent-driven-development** | Führt Implementierungspläne mit unabhängigen Aufgaben in einer Session aus |
| **Context7 MCP Server** | Holt aktuelle Library-Dokumentation direkt in den Kontext — "use context7" im Prompt genügt |
| **claude-md-management** | Auditiert CLAUDE.md-Qualität, bewertet nach Kriterien (commands, architecture, gotchas), schlägt Ergänzungen vor; `/revise-claude-md` erfasst Session-Learnings |

### Superpowers Workflow-Überblick

```
brainstorming → writing-plans → executing-plans
     ↑                               ↓
   (Idee)                    (Code + Tests + Review)
```

Der Schlüssel: Mit detaillierten Plans aus brainstorming + writing-plans kann für die eigentliche Implementierung ein günstigeres Modell (z.B. Claude Haiku) eingesetzt werden.

---

## Warum Superpowers funktioniert — und was Copilot als Alternative hat

### Das Kernproblem: Ungeplantes Coden erzeugt Schulden

Ohne erzwungene Struktur springt ein LLM-Agent direkt in die Implementierung. Das führt zu:

- Anforderungen, die erst beim Coden klar werden (und dann umgebaut werden müssen)
- Scope-Creep durch fehlende Abgrenzung
- Code, der technisch läuft, aber die eigentliche Anforderung verfehlt
- Tests, die nachträglich geschrieben werden — wenn überhaupt

Superpowers löst das nicht durch Dokumentation, sondern durch **Architektur**: Die Skills erzwingen eine Reihenfolge. Der Agent kann gar nicht implementieren, bevor er gefragt hat.

### Superpowers: Der entscheidende Mechanismus

```
Standard Claude Code:     Aufgabe → Sofort Code schreiben
Mit Superpowers:          Aufgabe → Fragen stellen → Design bestätigen → Plan schreiben → Plan reviewen → Implementieren
```

Was das konkret bedeutet:
- **brainstorming** stellt Rückfragen, bis die Anforderung klar ist — kein Annehmen von Annahmen
- **writing-plans** zerlegt in Aufgaben von 2–5 Minuten, mit exakten Dateipfaden und Verifikationsschritten — der Plan ist lesbar für Menschen
- **executing-plans** behandelt den Plan als Kontrakt: Subagenten arbeiten den Plan ab, nicht ihre eigene Interpretation

Der Nebeneffekt: Mit einem guten Plan kann für die Implementierung ein günstigeres Modell eingesetzt werden (z.B. Claude Haiku statt Sonnet).

### Copilot Plan Mode — das native Äquivalent

Ab Januar 2026 hat GitHub Copilot einen eingebauten **Plan Mode** (`Shift + Tab` zum Wechseln):

- Copilot analysiert die Anfrage, stellt Rückfragen und baut einen strukturierten Implementierungsplan
- Der Plan wird in einem separaten Panel angezeigt und kann vor der Ausführung überarbeitet werden
- Das Plan Agent speichert den Plan automatisch in `/memories/session/plan.md`
- Ab April 2026: Copilot Cloud Agent unterstützt explizit Research → Plan → Code-Workflows

**Fazit:** Copilot hat einen nativen Plan Mode, der denselben Grundgedanken umsetzt. Der Unterschied zu Superpowers:

| | Superpowers (Claude Code) | Copilot Plan Mode |
|---|---|---|
| Planungstiefe | Explizite 2–5-Min-Aufgaben mit Dateipfaden | Strukturierter Plan, variabel granular |
| Erzwingung | Skill verhindert das Überspringen | Nutzer kann Plan Mode ignorieren |
| TDD-Integration | Erzwungene RED-GREEN-REFACTOR-Zyklen | Kein eingebauter TDD-Zwang |
| Subagenten | Automatisches Dispatching auf parallele Agenten | Manuell konfigurierbar |
| Verfügbarkeit | Claude Code exklusiv | VS Code + JetBrains + Copilot CLI |

---

## Evaluation: Copilot CLI als gemeinsamer Nenner

### Was cross-tool funktioniert (VS Code + JetBrains + Copilot CLI)

| Mechanismus | Verfügbarkeit | Bemerkung |
|---|---|---|
| MCP-Server (HTTP/SSE) | VS Code + JetBrains + Copilot CLI | Gemeinsamer Nenner; konfigurierbar via `.copilot/mcp.json` |
| AGENTS.md / Instruction files | VS Code + JetBrains + Copilot CLI | Seit 2026 in JetBrains GA; Copilot liest beide Formate |
| Agent Skills (.agent.md) | VS Code + JetBrains + Copilot CLI | Automatische Erkennung aus Repository-Struktur |
| Context7 MCP | VS Code + JetBrains (via MCP) | Einmal konfiguriert, überall verfügbar |

### Was VS Code-spezifisch ist

- **Agent Plugins** (gebündelte Pakete): Nur VS Code, aktuell noch Preview
- **awesome-copilot Marketplace**: Installation via `copilot plugin install` primär VS Code-getrieben
- **hooks**: Automatisierte Aktionen während Agent-Sessions — aktuell JetBrains in Preview

### Was Claude-Code-spezifisch ist (kein Copilot)

- **Superpowers Skills** (brainstorming, writing-plans, executing-plans): Funktionieren nur mit Claude Code
- **claude-md-management**: Claude-Code-Plugin, kein Copilot-Äquivalent
- **CLAUDE.md**: Wird von Copilot (seit 2026) gelesen, aber die Management-Tooling ist Claude-Code-spezifisch

### Copilot CLI als gemeinsamer Nenner: Realität

Copilot CLI ist der kleinste gemeinsame Nenner zwischen VS Code und JetBrains, weil:
1. MCP-Server unabhängig von der IDE konfigurierbar sind
2. AGENTS.md / Instruction files in beiden IDEs gelesen werden
3. Agent Skills aus dem Repository automatisch erkannt werden

Der entscheidende Unterschied: **Superpowers-Skills sind Claude-Code-exklusiv.** Für Copilot-Teams gibt es kein direktes Äquivalent zum brainstorming → writing-plans → executing-plans Workflow. Der nächste Ansatz wäre, diesen Workflow manuell über AGENTS.md-Instruktionen nachzubauen.

---

## Empfehlung fuer Teams

### Für Teams mit Claude Code

**Startpaket:** Superpowers (alle drei Core-Skills) + Context7 MCP + claude-md-management

- **Superpowers** für den strukturierten Entwicklungsworkflow (Planung vor Code)
- **Context7** gegen veraltete Library-Nutzung — besonders wichtig bei schnell ändernden APIs
- **claude-md-management** für CLAUDE.md-Pflege über Zeit

Installation via `claude skills add obra/superpowers`.

### Für Teams mit GitHub Copilot (VS Code primär)

**Startpaket:** Plan Mode aktivieren + Context7 MCP + GitHub MCP Server + AGENTS.md

- **Plan Mode** (`Shift + Tab`) konsequent nutzen — Copilots natives Äquivalent zu Superpowers' brainstorming + writing-plans
- **Context7** als MCP-Server konfigurieren (funktioniert in VS Code und JetBrains)
- **GitHub MCP Server** für nahtlose Repo/PR-Integration
- **Projekt-AGENTS.md** als Steuerungsdatei aufbauen; explizit den Plan-vor-Code-Workflow als Konvention dokumentieren
- Aus dem awesome-copilot Marketplace gezielt Plugins installieren: z.B. `polyglot-test-agent` für Testgenerierung

### Für gemischte Teams (Claude Code + Copilot)

- **Context7** als MCP-Server: Einmal einrichten, in beiden Tools nutzbar
- **AGENTS.md** als primäre Steuerungsdatei (wird von beiden Tools gelesen)
- Den Superpowers-Workflow (brainstorming → writing-plans) **manuell als AGENTS.md-Konvention** dokumentieren — so profitieren auch Copilot-Nutzer von der Planungsstruktur
- **Kein gemeinsamer Plugin-Standard**: Plugins/Skills sind tool-spezifisch; den Fokus auf MCP-Server und Instruction-Files als gemeinsamen Nenner legen

### Pragmatische Priorisierung

| Priorität | Tool | Begründung |
|---|---|---|
| 1 (sofort) | Context7 MCP | Geringer Aufwand, hoher Nutzen, cross-tool |
| 1 (sofort) | AGENTS.md / CLAUDE.md schreiben | Grundlage für alle anderen Verbesserungen |
| 2 (nach ersten Erfahrungen) | Superpowers (Claude Code) | Strukturiert Workflows signifikant |
| 2 (nach ersten Erfahrungen) | GitHub MCP Server (Copilot) | Bessere Repo-Integration |
| 3 (optional) | claude-md-management | Nützlich wenn CLAUDE.md komplexer wird |
| 3 (optional) | Sprachspezifische awesome-copilot Plugins | Nur wenn konkreter Bedarf besteht |

---

## Quellen

- [obra/superpowers — GitHub](https://github.com/obra/superpowers)
- [Superpowers: How I'm using coding agents in October 2025](https://blog.fsck.com/2025/10/09/superpowers/)
- [Superpowers 5 — March 2026](https://blog.fsck.com/2026/03/09/superpowers-5/)
- [Context7 MCP Server — Upstash Blog](https://upstash.com/blog/context7-mcp)
- [Context7 — GitHub](https://github.com/upstash/context7)
- [CLAUDE.md Management Plugin — Anthropic](https://claude.com/plugins/claude-md-management)
- [awesome-copilot — GitHub](https://github.com/github/awesome-copilot)
- [Agent plugins in VS Code (Preview)](https://code.visualstudio.com/docs/copilot/customization/agent-plugins)
- [Agent skills in VS Code](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [Major agentic capabilities in Copilot for JetBrains — March 2026](https://github.blog/changelog/2026-03-11-major-agentic-capabilities-improvements-in-github-copilot-for-jetbrains-ides/)
- [Agent mode and MCP support for JetBrains — May 2025](https://github.blog/changelog/2025-05-19-agent-mode-and-mcp-support-for-copilot-in-jetbrains-eclipse-and-xcode-now-in-public-preview/)
- [Enhancing GitHub Copilot agent mode with MCP](https://docs.github.com/en/copilot/tutorials/enhance-agent-mode-with-mcp)
- [GitHub Copilot CLI: Plan before you build, steer as you go — Jan 2026](https://github.blog/changelog/2026-01-21-github-copilot-cli-plan-before-you-build-steer-as-you-go/)
- [Planning with agents in VS Code](https://code.visualstudio.com/docs/copilot/agents/planning)
- [Research, plan, and code with Copilot cloud agent — Apr 2026](https://github.blog/changelog/2026-04-01-research-plan-and-code-with-copilot-cloud-agent/)
- [The Superpowers Plugin for Claude Code — builder.io](https://www.builder.io/blog/claude-code-superpowers-plugin)

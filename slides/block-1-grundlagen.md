---
marp: true
theme: contact
paginate: true
header: 'Agentic Engineering Workshop'
footer: 'Thomas Hein | Dataciders | 2026'
---

<!-- _class: lead -->

# Block 1: Grundlagen & Orientierung

**Workshop: Agentic Engineering**
Thomas Hein — Dataciders

<!--
Dauer: ~45 Minuten
Ziel: Grundverstaendnis schaffen, Orientierung geben, Motivation aufbauen
-->

---

# Blick in die Zukunft — Was bleibt fuer uns uebrig?

> "Wer von euch findet gut, was gerade in der Softwareentwicklung passiert?"

<!--
Icebreaker: Handzeichen. Erzeugt sofort eine Diskussion.
Erwartung: gemischte Reaktionen — genau das ist der Punkt.
-->

---

# Die grosse Debatte

> "Nobody has to program. The programming language is human."
> — Jensen Huang, 2024

> "This is the best time yet to learn to code."
> — Bill Gates, 2025

> "You are orchestrating agents who do and acting as oversight."
> — Andrej Karpathy, 2026

<!--
Drei Perspektiven: Ersetzung, Empowerment, Evolution.
Karpathy gibt die Antwort: Die Rolle aendert sich, verschwindet aber nicht.
Quellen: referenzen/quellen.md
-->

---

# Zahlen und Fakten

| Unternehmen | AI-generierter Code | Quelle |
|-------------|--------------------:|--------|
| Google      | >30%                | Pichai, Q1 2025 |
| Microsoft   | 20-30%              | Nadella, Apr 2025 |
| Meta        | Ziel: 50% bis 2026  | Zuckerberg, 2025 |

- **Gartner:** 90% der Enterprise-Entwickler nutzen AI bis 2028
- **Aber:** 2500% mehr Defekte durch unkontrollierte AI-Nutzung

<!--
Die Zahlen zeigen: AI-Code ist Realitaet.
Die Gartner-Warnung ist der Schluessel: UNKONTROLLIERT ist das Problem.
Genau deshalb brauchen wir Methodik — das ist die Bruecke zum Rest des Workshops.
-->

---

# Kernthese des Workshops

1. Softwareentwicklung wird **niederschwelliger**
2. Es wird relevanter, Agenten zu **beherrschen** und praezise auszudruecken was gefordert ist
3. Die Rolle verschiebt sich: **Code-Schreiber → Architekt, Steuermann, Qualitaetssicherer**
4. **Der Entwickler wird zum Boss des Agenten, nicht umgekehrt**

<!--
Punkt 4 ist die zentrale Botschaft des gesamten Workshops.
Ueberleitung: "Wie machen wir das konkret? Dafuer gibt es ein Modell."
-->

---

# Quellen & Weiterlesen — Blick in die Zukunft

- [Jensen Huang: "The programming language is human" (Tom's Hardware, 2024)](https://www.tomshardware.com/tech-industry/artificial-intelligence/jensen-huang-advises-against-learning-to-code-leave-it-up-to-ai) — NVIDIA CEO ueber AI und Programmierung
- [Bill Gates: "Best time to learn to code" (Windows Central, 2025)](https://www.windowscentral.com/artificial-intelligence/bill-gates-coding-will-remain-a-human-profession-centuries-later) — Gegenperspektive: AI als Werkzeug, nicht Ersatz
- [Andrej Karpathy: Agentic Engineering (X/Twitter, 2026)](https://x.com/karpathy/status/2019137879310836075) — Karpathys Vision: Orchestrierung statt direktes Coden
- [Gartner: 90% of enterprise developers will use AI by 2028 (April 2024)](https://www.gartner.com/en/newsroom/press-releases/2024-04-11-gartner-says-75-percent-of-enterprise-software-engineers-will-use-ai-code-assistants-by-2028) — Marktprognose mit Warnung vor unkontrollierter Nutzung

<!--
Link-Folie fuer Teilnehmer, die sich vertiefen wollen.
-->

---

# Das 4-Stufen-Modell

| # | Ansatz | Input | Menschliche Rolle |
|---|--------|-------|-------------------|
| 1 | **Vibe Coding** | Kurze Phrasen, fachliche Wuensche | Fachanwender |
| 2 | **Spec-Driven (Business)** | Pflichtenheft, Use Cases | IT Consultant |
| 3 | **Spec-Driven (Technical)** | UML, ERM, Architektur | Architekt |
| 4 | **Agentic Engineering** | Anforderungen + kollaborative Umsetzung | Architekt/Entwickler |

<!--
Besonderheit: Die meisten Frameworks kategorisieren nach AI-Autonomie.
Unser Modell kategorisiert nach MENSCHLICHER ROLLE — greifbarer fuer Entwickler.
Begriffe: Vibe Coding (Karpathy 2025), Spec-Driven (Thoughtworks), Agentic Engineering (Karpathy 2026).
Business vs. Technical Spec ist unser eigener Beitrag.
-->

---

# Wann welche Stufe?

- **Vibe Coding:** Prototypen, Demos, Wegwerf-Experimente
- **Spec-Driven (Business):** Wenn Fachbereich fuehrt, wenig technische Tiefe noetig
- **Spec-Driven (Technical):** Neue Systeme, klare Architektur, gruene Wiese
- **Agentic Engineering:** Produktionscode, bestehende Systeme, Qualitaet entscheidend

> Kleine UI-Aenderung ≠ neues Modul — die Methodik muss zur Aufgabe passen.

<!--
Entscheidungsfaktoren: Aufgabengroesse x Risiko x Komplexitaet.
Wichtig: Niemanden verurteilen, der Vibe Coding nutzt — es hat seinen Platz.
Der Workshop fokussiert auf Stufe 4, weil das unser Arbeitsalltag ist.
-->

---

# Quellen & Weiterlesen — Das 4-Stufen-Modell

- [Andrej Karpathy: "Vibe Coding" (X/Twitter, Feb 2025)](https://x.com/karpathy/status/1886192184808149383) — Ursprung des Begriffs "Vibe Coding"
- [Andrej Karpathy: Software is Changing (X/Twitter, Feb 2026)](https://x.com/karpathy/status/2019137879310836075) — Karpathys Begriff "Agentic Engineering"
- [Thoughtworks: "Preparing your team for the agentic software development life cycle"](https://www.thoughtworks.com/en-us/insights/articles/preparing-your-team-for-agentic-software-development-life-cycle) — Spec-Driven Ansaetze im Vergleich
- [DEV Community: "The AI Coding Workflow That Actually Works: Separate Planning from Execution"](https://dev.to/matthewhou/separate-planning-from-execution-the-ai-coding-workflow-that-actually-works-1n00) — Praxis-Perspektive auf Agenten-Ansaetze

<!--
Link-Folie fuer Teilnehmer, die sich vertiefen wollen.
-->

---

# Wie funktioniert ein Coding Agent?

**LLM + Tools + Kontext = Agent**

Der Kreislauf:
1. **Prompt** empfangen
2. **Denken** (Reasoning)
3. **Tool aufrufen** (Dateien lesen, Code schreiben, Tests ausfuehren)
4. **Ergebnis** auswerten
5. **Weiter denken** oder antworten

[BILD: Agent Loop Diagramm — Quelle: https://dev.to/jakesweb/forget-the-hype-agents-are-loops-2fi5]

<!--
Kernkonzept: Ein Agent ist eine Schleife, kein einzelner Aufruf.
Zeige hier das Agent-Loop-Diagramm von DEV Community oder Oracle.
Referenz: "Forget the Hype: Agents are Loops" (DEV Community)
-->

---

# Autocomplete → Chat → Agent

| Modus | Wie es funktioniert | Beispiel |
|-------|--------------------:|---------|
| **Autocomplete** | Inline-Vorschlaege beim Tippen | Tab-Completion in IDE |
| **Chat** | Frage-Antwort im Seitenpanel | "Erklaere diese Funktion" |
| **Agent** | Autonome Ausfuehrung mit Tool-Zugriff | "Implementiere Feature X mit Tests" |

<!--
Copilot bietet alle 3 Modi: Ask, Edit, Agent.
Referenz: GitHub Blog "Copilot Ask, Edit, Agent modes"
Agent-Modus ist das, was wir heute lernen zu steuern.
-->

---

# Das Oekosystem eines Coding Agents

- **Skills/Rules:** Vordefinierte Workflows und Regeln (z.B. TDD-Skill)
- **Plugins:** Erweiterungen (z.B. Context7 fuer aktuelle Doku)
- **MCP-Server:** Externe Datenquellen anbinden (DB, Jira, Git)
- **Hooks:** Automatische Aktionen bei bestimmten Events

[BILD: MCP Host-Client-Server Architektur — Quelle: https://modelcontextprotocol.io/docs/concepts/architecture]

<!--
MCP = Model Context Protocol (Anthropic, jetzt offener Standard).
Zeige hier das MCP-Architekturdiagramm von modelcontextprotocol.io.
Wird in Block 3 vertieft — hier nur Ueberblick.
-->

---

# Quellen & Weiterlesen — Funktionsweise Coding Agent

- [DEV Community: "Forget the Hype: Agents are Loops"](https://dev.to/jakesweb/forget-the-hype-agents-are-loops-2fi5) — Praxis-Erklaerung des Agent-Loop-Konzepts
- [Oracle: "What Is the AI Agent Loop?"](https://www.oracle.com/artificial-intelligence/what-is-ai-agent-loop/) — Perceive/Reason/Plan/Act/Observe Schleife
- [Model Context Protocol — Architektur](https://modelcontextprotocol.io/docs/concepts/architecture) — MCP Host-Client-Server Konzept
- [GitHub Blog: Copilot Ask, Edit, Agent modes](https://github.blog/ai-and-ml/github-copilot/github-copilot-agent-mode-is-now-generally-available/) — Drei Modi im Vergleich

<!--
Link-Folie fuer Teilnehmer, die sich vertiefen wollen.
-->

---

# Wie aendert sich unsere Arbeitsweise?

**Vom Code-Tipper zum Architekten und Steuermann**

- Du schreibst weniger Code — du **steuerst** mehr
- Pair-Programming mit dem Agenten: Zu zweit den Agenten steuern
- Fokus verschiebt sich: Technische Qualitaet, Fachlichkeit, Konzeptionsfaehigkeit

<!--
Konkret: Im Planning-Modus zu zweit vor einem Bildschirm.
Einer formuliert die Anforderung, der andere prueft die Agent-Vorschlaege.
-->

---

# Hypothese: Was bedeutet das fuer Teams?

- Teams werden **kleiner** — max. 2 Entwickler pro Product Owner
- **Anforderungsaufnahme wird laenger** als die Entwicklung
- Der Product Owner wird zum Engpass, nicht der Entwickler
- Qualitaet der Anforderungen bestimmt Qualitaet des Ergebnisses

<!--
Provokante These — zur Diskussion stellen.
Referenz: Anthropic 2026 Agentic Coding Trends Report
-->

---

# Quellen & Weiterlesen — Veraenderte Arbeitsweise

- [Andrej Karpathy: "You are orchestrating agents" (X/Twitter, 2026)](https://x.com/karpathy/status/2019137879310836075) — Die neue Rolle: Steuermann statt Tipper
- [Thoughtworks: Preparing your team for the agentic SDLC](https://www.thoughtworks.com/en-us/insights/articles/preparing-your-team-for-agentic-software-development-life-cycle) — Teamstruktur und Rollen im agentic Umfeld
- [GitHub Blog: Quantifying GitHub Copilot's impact on developer productivity](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/) — Entwickler 55,8% schneller mit AI-Unterstuetzung
- [InfoQ: From Prompts to Production — a Playbook for Agentic Development](https://www.infoq.com/articles/prompts-to-production-playbook-for-agentic-development/) — Praxis-Playbook fuer Teams

<!--
Link-Folie fuer Teilnehmer, die sich vertiefen wollen.
-->

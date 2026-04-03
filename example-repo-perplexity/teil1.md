Agentic Coding Vortrag – Erste Agenda und Arbeitsplan
Überblick
Dieser Bericht skizziert eine erste Agenda für einen Vortrag zu Agentic Coding für ein Python-basiertes Kundenprojekt, in dem spezialisierte Coding-Agenten wie Claude Code oder GitHub Copilot systematisch und kontrolliert eingesetzt werden sollen. Er fasst gleichzeitig einen Arbeitsplan zusammen, aus dem später ein Plan-Vortrag.md sowie ein Repo mit Best Practices, Skills und Agents.md-Beispielen abgeleitet werden können.

1. Begriffe: Vibe Coding vs. Agentic Coding
   Vibe Coding: Stark LLM-getriebene Entwicklung, bei der Entwickler grobe Ziele in natürlicher Sprache formulieren und das Modell große Teile der Implementierung erzeugt, oft mit wenig Spezifikation und teils geringer Kontrolle.

Agentic Coding: Ansatz, bei dem autonome Coding-Agenten einen gesamten Entwicklungs-Workflow planen, Code schreiben, Tests ausführen und iterativ verbessern, typischerweise auf Basis eines klaren Zielspezifikats und mit Toolzugriff (FS, Tests, VCS).

Ziel des Vortrags: Entwickler sollen lernen, Agenten bewusst zu steuern („Boss-Modus“), statt sich vom Agenten treiben zu lassen.

2. Motivation und Auswirkungen auf Entwicklungsprojekte
   Höherer Fokus auf Konventionen, Architektur und langfristige Wartbarkeit, während repetitive Implementierungsschritte zunehmend von Agenten übernommen werden.

„Planning first“ etabliert sich als Best Practice: Spezifikation und Implementierungsplan vor Codegenerierung, um Schleifen und Fehlentwicklungen zu vermeiden.

Erwartete Verschiebung der Projektzeit: Mehr Aufwand für Anforderungsaufnahme, Domänenverständnis und Design; geringerer Anteil für reine Umsetzung bei gleichbleibender oder höherer Gesamtqualität.

3. Arbeitsmodelle im Umgang mit LLMs
   3.1 Vibecoding (Lastenheft / Phrasen)
   Input: Grobe fachliche Anforderungen, oft in wenigen Sätzen oder Stichworten.

Vorteile: Sehr schnelle Ergebnisse, gut für Prototyping oder Explorationsphasen.

Nachteile: Fehlende Transparenz zu Designentscheidungen, schwer erklärbares Verhalten, potenziell hohe technische Schulden.

3.2 Spec-driven (Pflichtenheft, Use Cases)
Input: Ausformulierter fachlicher Scope (Use Cases, Akzeptanzkriterien), aber wenig technische Architektur.

Vorteile: Besser kontrollierbare Funktionalität, klarere Abgrenzung des Scopes.

Nachteile: Risiken bei Systemgrenzen, Integrationen und technischen Constraints, wenn diese nicht explizit gemacht werden.

3.3 Tech-Spec-driven (UML, Architektur, Workflows)
Input: Technische Spezifikation inkl. Architekturdiagrammen, Datenmodell, Workflows, Technologien.

Vorteile: Agenten können konsistent neue Komponenten und Services erzeugen, die zur Zielarchitektur passen.

Nachteile: Grenzen bei komplexen Integrationen mit Legacy- oder Drittsystemen, insbesondere wenn deren Verhalten schlecht dokumentiert ist.

3.4 Agentic Coding als Architekt/Entwickler-Workflow
Kombination aus klarer fachlicher Spezifikation, technischer Leitplanke und stark kontrolliertem Agenten-Workflow (Plan → Review → Implementierung → Test → Doku).

Agent stoppt an den „Entscheidungspunkten“ (z. B. Schnittstellendesign, Fehlerbehandlung, Persistenzschema) und verhandelt mit dem Entwickler die Optionen.

Ziel: Entwickler investieren mehr Zeit in Architektur, Schnittstellenschnitt, Fachlichkeit und Qualitätsanforderungen, während der Agent Implementierung und Routinearbeiten übernimmt.

4. Auswirkungen auf Teams und Vorgehensmodelle
   Kleinere, stärker eigenverantwortliche Teams, da ein Teil der „Delivery-Power“ von Agenten kommt; Product Owner können enger mit 1–2 Entwicklern zusammenarbeiten.

Längere und bewusstere Anforderungs- und Designphasen, ggf. mit gemeinsamer Arbeit von Entwickler + Agent im „Planning-Modus“ (Pairing mit Agent statt nur mit Menschen).

Notwendigkeit klarer Governance: Standards für Architektur, Security, Testing und Dokumentation müssen explizit gemacht und von Agenten beachtet werden.

5. Funktionsweise von Coding-Agenten (Skills, Plugins, Tools)
   Coding-Agenten kombinieren ein LLM mit einem „Reason-and-Act“-Loop: Sie planen Schritte, rufen Tools (Dateisystem, Shell, VCS, HTTP, Datenbank) auf, werten Ergebnisse aus und iterieren.

Skills/Plugins/Tools kapseln spezifische Fähigkeiten (z. B. Tests ausführen, Jira abfragen, Git-Branch erstellen), MCP- oder CLI-Server stellen eine standardisierte Schnittstelle bereit.

Gute Agenten-Setups definieren klare Grenzen (z. B. kein direktes Push nach main, nur in Sandbox-Verzeichnissen arbeiten) und dokumentierte Konventionen in Dateien wie AGENTS.md oder projektspezifischen Leitfäden.

6. Agents.md und Projektdokumentation
   AGENTS.md (oder GEMINI.md/CLAUDE.md analog) wird zunehmend als Projektartefakt genutzt, um Agenten Rollen, Ziele, Konventionen, Tools und Don’ts zu erklären.

Best Practices: Klare Beschreibung der Plattformbesonderheiten, zentraler Coding-Guidelines, Teststrategie, ADR-Struktur und zu nutzender Tools/Skills; Hinweise, wann Agent Rückfragen stellen soll.

Während der Entwicklung sollte diese Datei iterativ gepflegt werden; viele Teams lassen sich Änderungen an Architektur oder Workflows von Agenten direkt in diese Datei einpflegen.

7. Kontext-Management und Dokumentation
   Kontext umfasst Anforderungen (Tickets, Use Cases), Architektur- und UML-Diagramme, Code, Tests, ADRs, Coding-Guidelines und Agents.md; all dies sollte möglichst nah am Code (mono- oder Multi-Repo mit guter Referenzierung) gehalten werden.

Viele Workflows setzen auf IDE- oder Agent-Workspaces, die mehrere Repos (z. B. Backend, Frontend, Shared Libs) gemeinsam einbinden und dem Agenten lesend zugänglich machen.

Konsens in Erfahrungsberichten: Dokumentation ist ein primärer Hebel für gute Agent-Performance; LLMs sollten mindestens genauso viel Doku wie Code erzeugen und pflegen.

8. Tests, Qualitätssicherung und Feedbackschleifen
   Agenten können Unit-, Integrations- und End-to-End-Tests schreiben und ausführen; Best Practices empfehlen kleine, inkrementelle Änderungen mit klarer Testbasis statt großer, unüberschaubarer Refactorings.

Für Agenten-Workflows wird empfohlen, dass fehlgeschlagene Tests explizit analysiert und mit dem Entwickler diskutiert werden (Test anpassen vs. Code fixen), um Regressionen zu vermeiden.

Feedbackschleifen umfassen: automatisierte Tests, Code-Reviews (auch durch Agenten), Akzeptanzkriterien, manuelle Explorations-Tests (z. B. via Playwright) und explizite „Hold Points“, an denen der Entwickler Entscheidungen treffen muss.

9. Frontend, Design und Tools wie Figma
   LLM-Agenten können Figma-Designs und Design-Tokens nutzen, um UI-Code zu generieren; viele Tools unterstützen den Import von Figma-Strukturen in React/Vue/Flutter etc.

Alternativ können Screenshots und einfache Skizzen als Referenz dienen, wobei die Präzision geringer ist als bei strukturierten Figma-Dateien oder Design-Systemen.

Best Practices betonen klare textuelle Spezifikation von Layout, Zuständen und Responsiveness plus Referenzscreens, um Missverständnisse im UX-Design zu reduzieren.

10. Kosten und Eignung von Aufgaben
    Kommerzielle Tools wie GitHub Copilot werden häufig pro Benutzer und Monat abgerechnet; zusätzliche Kosten können durch „Premium“-Requests (größere Kontexte, fortgeschrittene Modelle) entstehen.

Kosten lassen sich durch bessere Spezifikationen, kleinere Inferenz-Jobs, gezieltes Kontext-Management und Modellwahl (stärkeres Modell für Planung, günstigeres für Routine-Code) senken.

Aufgaben mit hoher Struktur, viel Boilerplate und klaren Regeln (Scaffolding, Testgenerierung, Lib-Updates, einfache Bugfixes) eignen sich besonders gut für Agenten; stark algorithmische oder sicherheitskritische Kernlogik bleibt tendenziell im Fokus erfahrener Entwickler.

11. Erste Agenda für den Vortrag
    Einführung & Motivation

Warum AI-Coding-Agenten? Überblick Agentic Coding vs. Vibe Coding.

Erwartungen im Projekt: Qualität, Konventionen, Transparenz.

Kurze Demo/Story, wie „Vibe Coding gone wrong“ aussehen kann.

Begriffe & Landschaft

Vibe Coding, Agentic Coding, AI-assisted Coding: Definitionen und Unterschiede.

Überblick über Coding-Agenten, Skills, Plugins, MCP/CLI.

Relevante Modelle (z. B. Claude, Gemini, Copilot, lokale Modelle) und ihre Stärken/Schwächen.

Arbeitsmodelle mit LLMs

Vibecoding, Spec-driven, Tech-Spec-driven Entwicklungsmodi.

Agentic Coding als Zielbild: „Du bist der Boss des Agenten“.

Wann welcher Modus sinnvoll ist (Prototyp, Feature, Refactoring, Bugfix).

Neues Rollen- und Teamverständnis

Entwickler als Architekt, Reviewer und Domänenexperte.

Teamgrößen, Produkt-Owner-Fokus, Kommunikationsstrukturen.

Anpassung klassischer Vorgehensmodelle (Scrum, Kanban) mit Agenten.

Praktische Grundlagen von Coding-Agenten

Wie ein Agent intern arbeitet (Plan → Act → Observe → Iterate).

Unterschied Skills, Plugins, Tools, Hooks, Subagenten.

Externe Systeme einbinden: Jira, GitHub/GitLab, Datenbanken.

Kontext & Dokumentation

Welche Informationen Agenten brauchen (Kontext-Checkliste).

Agents.md / Projekt-Guides und ADRs.

Struktur von Repos, Workspaces (z. B. VS Code) und Doku-Orten.

Workflow für Agentic Coding in diesem Projekt

Planungsphase mit Agent (Execution-Plan, Varianten, Entscheidungspunkte).

Umsetzung, Tests, Doku – mit Agent im Loop.

Unterschiedliche Tiefe des Workflows für große Tasks vs. kleine Änderungen.

Tests, Bugfixing & Code Reviews mit Agenten

Kontrollierter Umgang mit Tests (Agent ändert Code, nicht ungefragt Tests).

Hypothesenbasiertes Bugfixing mit Agent-Unterstützung.

Review-Workflows, Sicherheits- und Qualitäts-Plugins.

Kosten, Grenzen und Antipatterns

Kostenmodelle (z. B. Copilot, Cloud-LLMs) und wie man Requests optimiert.

Welche Aufgaben (noch) nicht gut für Agenten geeignet sind.

Antipatterns: Blindes Vertrauen, fehlende Doku, „Big Bang“-Prompts.

Ausblick & Repo mit Best Practices

Vorstellung des geplanten Best-Practice-Repos.

Agents.md-Template, Beispiel-Skills, Execution-Pläne.

Use Cases zum Ausprobieren und nächste Schritte.

12. Arbeitsplan für Plan-Vortrag.md
    Die folgende Aufgabenliste kann später direkt als Plan-Vortrag.md ins Repo übernommen werden.

Agenda finalisieren und mit Team abstimmen.

Begriffsklärung und Folien zu Vibe Coding vs. Agentic Coding ausarbeiten (inkl. Beispiele und Code-Snippets).

Überblicksfolie(n) zu Coding-Agenten, Skills, Plugins, MCP/CLI erstellen.

Projekt-Agents.md-Template entwerfen, speziell für die Python-Plattform des Kunden.

Entscheidungen zur Doku-Struktur treffen (im Code vs. separates Repo) und dokumentieren.

Checkliste „Minimaler Kontext für jede Agent-Anfrage“ definieren.

Beispiel-Workflows für große Tasks (Feature) vs. kleine Tasks (Bugfix, UI-Text) ausarbeiten.

Leitfaden „Umgang mit Tests“ (inkl. Regeln, wann Tests vs. Code angepasst werden) erstellen.

Leitfaden „Bugfixing mit Agenten“ (hypothesenbasiert, Vorher/Nachher-Tests) ausarbeiten.

Leitfaden „Code Reviews mit Agenten“ inkl. empfohlener Plugins/Skills zusammenstellen.

Abschnitt zu Kosten & Modellwahl (welches Modell für Planung, welches für Code) vorbereiten.

Sammlung von Use Cases (Demo-Szenarien) definieren, inkl. Repo-Struktur und Beispielaufgaben.

Liste potenzieller Skills/Plugins zusammenstellen, die zum Agentic-Coding-Ansatz passen.

Evaluationsplan entwerfen: Wie wird gemessen, ob der neue Workflow produktiver/besser ist?

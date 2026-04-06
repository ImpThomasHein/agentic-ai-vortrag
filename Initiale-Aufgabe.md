Basierend auf diesen Prompt ist der Votrag und das Repo enstatenden

# Aufgabenkontext

Folgendes Schrifftstück dient als Prompt um 3 Dinge zu erreichen. (1. als wichtigstes Kriterium)

1. Wissenserweiterung des Vortragendes zum Thema Agentic Engineering
2. Erstellung von Tooling, Skills und Plugins um die im folgenden dargestellte Arbeitsweise zu Vereinheitlichen und Reproduzierbar zu gestalten.
3. Erstellung eines Vortrages zum Thema Agentic Engineering für meine Arbeitskollegen

# Kontext Vibecoding und Agentic Engineering

Ich möchte einen Vortrag halten über die Nutzung von Coding Agenten wie Claude Code oder Github Copilot als Softwaredienstleister. Es soll vor allem darum genau wie man es zielgenau schafft die Anforderungen des Kunden umzusetzen und nicht nur einfach irgendwie per Vibe Coding. Im Vortrag soll dargestellt werden welche Unterschiede es zwischen Vibecoding und Agentic Engineering gibt. Der Begriff "Agentic Engineering" wurde von Andrej Karpathy (Feb 2026) als Nachfolger von Vibe Coding geprägt und setzt sich in der Community durch.

# Motivation

- was bringt der Umgang mit Agenten
  ** Einhalten von Konventionen im Projekt auch über den Softwarelebenszyklus hinaus
  ** Plannung First
  ** Konzeption und Architektur gewinnen wieder an relevanz
  ** Mehr Zeit um in die richtige Richtung zu denken.
  \*\* Umsetzungszeit wird kleiner als Zeit der Anforderungsaufnahme.

## Spannende Fragen

** Was macht das mit Entwicklungsprojekten.
** Was macht das mit der Kommunikationsstruktur
\*\* Ändern sich Entwicklungsvorgehensweisen

## Grundlegend gilt

- Die Agenten sind ein Werkzeug und wir müssen noch herausfinden wie wir dieses nutzen.

# Aufbau

- Der Vortrag soll zunächst die großen allgemeine Fragen zur Änderung der Vorgehensweise für Entwickler klären
- Danach geht der Vortrag in die konkreten Details ein wie das erfolgen kann.

# Zielstellung des Vortrag

1. Ziel des Vortrags muss es sein, dass die Entwickler befähigt werden, der Boss des Coding Agenten zu sein. In unserer Arbeit kann es nicht darum gehen, dass der Agent viele Freiheiten hat, der Entwickler soll insbesondere beim geschrieben Code und Tests die Kontrolle behalten.

2. Es muss eine Arbeitsweise verankert werden, die Vorsieht, dass der Agent jeden Arbeitsschritt (nicht nur einzelne Codingänderung) zusammen mit den Entwickler angeht und diskutiert.
   Gut wäre es wenn der Agent bei jeden Entwicklungsschritt die Möglichen Umsetzungvarianten darstellt und der Entwickler diese auswählen oder erweitern kann.

3. Bei der Erstellung des Vortrags sollen konkrete Best Practices entstehen, dafür sollst du Skils für Webrecherche und Brainstorming verwenden.

# Besonderheiten des Teilnehemerkreises

In unserem Projekt ist die Besonderheit dass wir mit einer Python basierten Plattform arbeiten, dessen Besonderheiten LLMs nicht kennen. Wir müssen also den Agenten erklären wie die Plattform funktioniert, damit die richtige Lösungen entstehen.

# Änderung der Arbeitsweiseänderung für Entwickler

Bitte gebe auch Hinweise darauf wie sich die Arbeitsweise für Entwickler ändert. Worauf ist der Fokus zu setzen. Wo befinden sich die zukünftigen Freuden.
Inwieweit sollte man seine Arbeitsweise ändern, zu zweit einen Agenten steuern zumindest im Planning Modus um die Lösung ideal zu diskutieren.

Brainstorming und Webrecherche
Welche mögliche Anpassungen kann es geben um in Zukunft die Aufgaben zu erledigen?

## Vibecoding

Anforderungen werden in Form eines Lastenheftest oder kurzen Wortphrasen aus fachlicher Perspektive übergeben

Vorteil. Sehr schnell.
Nahteil Unkenntnis über Desigentscheidungen. Es entsteht verhalten in der Anwendung die man sich nicht erklären kann.

Wie weit können Modelle ihre Qualität steigern, dass dies noch besser

Rolle: Fachanwender

Tools: Agenten, Agentenschwärme

## Spec Drive

Anforderungen werden in Form eines Pflichtenheftes übergeben. Usecases.

Näher daran wo man sein möchte.

Nachteil. Unkenntnis über Systemarchitektur, Grenzen der Veränderbarkeit

Rolle: IT Consultant

Tools: Brainstorming, Agentenschwärme

## Tech Spec Driven

Es wird eine technische Spezifikation vorgegeben, (UML, USE CASE, Package Diagramme, ERM, Architektur, Workflows, etc.) und die Agenten anhand des benötigten Stack dann selbständig die Entwicklung übernimmt.

Vorteil Systeme können schnell neu gebaut werden
Nachteil: Hat aber bestimmt grenzen in der Integration von Umsysteme.

Rolle: Architekt
Tools: Brainstorming, Planning Skills, Agentenschwärme

## Agentic Engineering

Meine Vision für die Arbeitsweise von Entwickler ist folgender
Es gibt eine Umsetzungsaufgabe mit klaren Anforderungen, der Coding Agent unterstützt den Entwickler von der Planung bis zur kompletten Umsetzung. Bei allen relevanten Entscheidungen stoppt der Agent und geht in die Diskussion mit Entwickler.

Ich nehme an die Entwickler haben so die Möglichkeit mehr Fokus auf die technische Qualität zu legen. Mehr Zeit zum lernen der Fachlichkeit und Konzeptionsfähigkeit.
Vortiele Schnitt von Modulen. Wiederverwendbarkeit

Der Vortrag soll hauptsächlich diesen Ansatz pflegen.
Ziel bei der Erstellung des Vortrages muss es sein, ein Repo zu haben, wo all die genannten Dinge bereitgestellt werden. Es wäre gut wenn auch differenziert wird, zwischen wirklich schwierigen großen Aufgaben und kleinen Änderungen. Sicherlich kann man bei kleinen Änderungen, wie Anpassungen in der UI auch eine reduzierte Methodik fahren.

Rolle: Architekt/Entwickler
Tools: Brainstorming, Planning Skills, Execution Skill, Agenten

## AI analyzing

Kriege eine Vibecoding Codebasis wieder unter Kontrolle.
Nicht Fokus den Votrags, sollte aber auch in den Skillset von Entwicklern gehören

Brainstorming, gibt es noch weitere Differenzierungsmöglichkeiten?

### Aufgabe Agent: Verifizieren und Ausarbeiten der oben genannten Ansätze

# Team und Anpassung der Vorgehensmodelle

Zielstellung: Der Entwicklungsplan muss am Ende 100% zu verstanden werden. Die Designentscheidungen des Entwicklers müssen einfließen und dokumentiert sein.

Was heißt das für die Teamarbeit. Hypothese - Teams werden deutlich kleiner. Noch so viele wie der Project Owner direkt versorgen kann. Anforderungsaufnahme wird länger sein als die Entwicklung. Max 2 Entwickler pro ProduktOwner.

### Aufgabe Agent: Webrecherche oder Brainstorming

Oder gibt es hier schon andere Vorgehensmodelle.

# Praktische Anwendbarkeit

## Funktionsweise und Bestandteile von Coding Agenten

Was ist der Unterschied zwischen Skills, Plugins, ToolsMCP Server, CLI, Agenten, Subagenten. Tools. Hooks
Wie funktioniert eigentlich ein Agent Grundlegend? Wie ist das Zusammenspiel zwischen Tools und LLM

## Bedeutung und Funktionsweis von Agents.md

Es soll darum gehen wie man die Agents.md nutzt.
Wie werden diese vom Agenten verarbeitet.

Bestandteile von guten Agents.md Files.

### Aufgabe Agent: Brainstorming Webrecherche

Wie sollte man diese während der Entwicklung erweitern? Welche Plugins/Skills gibt es hierfür?

## Skills/Plugins als zentrales Arbeitsmittel

Besonders der Umgang mit Skills ist mir wichtig Es soll darum gehen welche planning Skills man benutzt und wie man diese in der execution nutzen kann.

Ich finde die Skills von nützlich

- Opra Brainstorming/writing-plans/execute-plans
- Context7 um die aktuellste Doku zu bekommen
- claude-md-manegement

In der Plugin Liste sehe ich noch weitere Plugins die interessant sein können

- techwolf ai - first principiles

### Aufgabe Agent: Brainstorming und Webrecherche

Welche Skills passen zum Agentic Engineering Ansatz noch

### Aufgabe Agent: zu empfehlende Plugins für die Arbeit

Es wäre schön für diese Ansatz eine Liste von zu empfehlenden Pluings und Skills zu erhalten.

## Einbinden von externen Systemen

Eklären warum es wichtig wird Umsysteme einzubinden? Erweiterung des Kontextes

- Wie kann man Jira anbinden
- wie kann man die Datenbank anbinden
- Wie kann man gitlab, github anbinden für Reviews, PUll Requests

### Aufgabe Agent: zu empfehlende Plugins für die Arbeit ermitteln

Es wäre schön für diese Ansatz eine Liste von zu empfehlenden Pluings und Skills zu erhalten.

## Relevante Modelle

Es soll eine Übersicht an Modellen geben, die sich für die Planung und Entwicklung eigenen. Bspw. Opus, Sonnet Codex (gibt es noch was) sind die stärken und schwächen.

Bitte erstelle eine tabelarische Übersicht zur Bewertung

## Umgang mit den Kontext

Es soll dargestellt werden wie man mit dem Kontext umgeht. Welche Informationen gehören rein und wie bekommt die Informationen am einfachsten in den Context In dem Zusammenhang soll die Bedeutung von Dokumentation dargestellt werden. Welche Methoden eigenen sich besonders. UML Diagramme Ablaufdiagramme etc. Konventionen, Codebeispiele, Coding Guidelines, Agents.md. Architecture Decision Records.

Nutzung von Workspaces in VS Code, binden von mehreren Repos, die der Agent dann nutzen kann.

### Aufgabe Agent: Brainstorming/Webrechechre

1. Wo sollte die Doku liegen im Code oder in einem separaten Repo. Was heißt es für einen Agenten zu dokumentieren.

2. Welcher Context sollte verpflichtend für jede Anfrage sein, welchen Context möchte ich beliebig je nach Aufgabe Wahlweise hinzuschalten können. Wie kann man das machn

3. Kann man aus den Context auch wieder Dinge entfernen.
   Wie können Subagents helfen, den Context sauber zu halten, Rewind Funktionen, falls die Suche von files nicht ideal verlaufen.

Auf was ist hierbei noch zu achten? Bitte stelle mir hierzu fragen?

### Aufgabe Agent: zu erarbeitendes Tooling

Es wäre gut ein Skill zu haben, der hilft ein ideales agents.md herzustellen.
nur ein /init Befehl finde ich nicht hilfreich, es sollte eher darum gehen die Vision von oben darzustellen und bereits zentrale Unternehmensvorgaben einzuhalten

# Onboarding von Codebasen

Wie können Agenten helfen, dass man sich schnell in Codebasen einfinden kann

### Aufgabe Agent: gibt es existierendes Tooling

# Umgang mit Testfälle

wie behält man die Kontrolle über TEst. Wie kann ich verhindern, dass das LLM den Testanpasst und nicht den Codefix. Am Besten geht der Agent von fehlgeschlagen Test zu fehlgeschlagenen Test durch und diskutiert mit den Entwickler ob der Test fehlschlägt wegen Codeänderungen oder ob tatsächlich eine Regression stattfand.

### Aufgabe Agent: Recherche zum Thema

# Umgang mit dem Frontent

- Wie kann man passgenau dem LLM beschreiben wie das Frontend aussehen soll
- Nutzung von Figma,
  \*\* kriegt man es auch einfacher mit Screenshots und Paint hin. Hierzu soll es auch aussagen zu geben.

### Aufgabe Agent:Recherche zum Thema

## Feedbackschleifen einbauen. Selbstkorrektur des Agenten

- Welche Arten von Feedbackschleifen gibt es,
  ** Code Review Schleifen
  ** Unittest
  ** Integrationstests
  ** Akzeptanzkriterien
  ** Entwickler in der Loop. Bereits im Execution Plan bestimmen wo der Entwickler helfen so und wie
  ** Playwright zur Nutzung zur Überprüfung der manuellen Tests ist das sinnvoll?

### Aufgabe Agent: Webrecherche über Best Practices

## Bugfixing

- Bugs sind eigentlich oftmals ziemlich schwierig, da es Aussnahmen gefunden worden sind, an die niemand gedacht hat. Hier muss das Vorgehen ganz klar daruf sein, den wirklichen ursprung gefunden zu haben, dieser kann natürlich auch im fachlichen Kontext sein. Es wäre gut Hyothensbasiert zu arbeiten und Änderungen herbeizuführen, die diese Thesen unterstüzten, gut ist es auch Tests zu haben die vorher fehlschlagen und nach dem Bugfixing

### Aufgabe Agent: Webrecherche über Best Practices. Recherche über geeignete Skills, ggf Skill selbst schreiben?

# Code Reviews

- wie kann ich den Agenten nutzen um mir Reviews zu geben
- Wie kann das Review Konvention einhalten
- welche Plugins sollte man nutzen um Standars wie Security reinzubekommen
- Welche Plugins gibt es für Frontend und Backend
- Wie kann ich noch bessere Tipps erhalten als vom erfahrensten Entwickler des Teams
- wie kann ich den Agenten nutzem um Review Kommentare abzuarbeiten
  \*\* auch hier wäre eine schrittweise abarbeitung sinnvoll. Lass uns die Liste aus den Tools ziehen. Am Besten schlägt der Agent den Lösungsweg vor und der Entwickler kann diesen bestätigen oder ändern.

### Aufgabe Agent: Webrecherche über Best Practices. Recherche über geeignete Skills, ggf Skill selbst schreiben?

## Kosten

Es soll auch eine kurze Diskussion über Kosten entstehen. Wie rechnet man bspw. Github Copilot ab, wie entstehen Premiumrequest, wie kann man die Anzahl an premiumrequests reduzieren.

### Aufgabe Agent: Webrecherche wie entstehen kosten wie kann man diese einsparen

# Welche Aufgaben eignen sich für Coding Agenten

### Aufgabe Agent: Webrecherche

# Welchhe Aufgaben eignen sich nicht Code für Agenten

- These Beispielweise Algorithmik. Komplexe fachliche Logik, Performance?
- Wie kann diese ggf. doch mit Agenten lösen. Wo bekommt man kein Qualiäts und Zeitvorteil

### Aufgabe Agent: Webrecherche

# Welche Aufgaben kann man komplett automatisieren

These

- Demonstratoren
- Library Updates
- Welche noch?

### Aufgabe Agent: Webrecherche

# Fragestellung Arbeitsweise vereinheitlichen

wie kann man sicherstellen, dass alle empfohlenen und enstandenen Plugins und Skills genauso funktionieren wie man es will. Kann man bspw. ein Beispielprompt bereitstellen, mit dem man überprüfen kann, dass alles nach Projektstandards eingebunden ist?

### Aufgabe Agent: Gibt es Tooling was das bereits kann

# Vorgehen für die Aufgabe

- Bitte lass uns über den Vortrag Brainstormen
- Lass uns zuerst die Agenda definieren
- Lass uns dann für die Agenda die Punkte vertiefen, die für die Enstehung des Coderepos und der Skills relevant sin
- Lass uns danach Stück für Stück die einzelnen Punkte der Agenda durchgehen. Ich würde immer bestätigen wenn ich denke, dass wir das Abschnitt beendet haben.
- Für all die Aufgaben Recherchiere im Netz
- Ich hätte immer gerne auch Bilder oder Code oder Chatbeispiele dafür
- Erstelle für die Erarbeitung des Vortrages und der Skills ebenfalls ein Plan-Vortrag.md File mit den gesamten Aufgaben, diesen kannst du nutzen um die bereits erledigten Aufgaben zu markieren

# Dinge die ich selbst noch heraufinden will

- Was sind language server, kann man diese auch für unsere Plattform nutzen

# Ergebnis

1. Ein Ergebnis des Plans soll ein Markdown File sein, dass ich einfach in eine PowerPoint überfahren kann. Also klare prägnante Überschriften, mit jeweils 3-6 Bulletpoints.

2. Es soll ein Coderepo mit Best practices entstehen

- relevante Skills
- Neue Skills die genau die Anforderungen erfüllen die ich stelle. Vielleicht gibt es aber gute Skills im Netz
- Gute Agents.md Files
- Best Practice zum Thema gute Doku für Agenten
- Best Practice zum Thema Execution Pläne
- Darstellung von diversen Antipatterns - Schlechte Execution Pläne

- Use Cases zum ausprobieren.
- Wie kann ich mein Ziel zielgerichtet erreichen. Wie verhalten sich die unterschiedliche Modelle bei den Aufgaben

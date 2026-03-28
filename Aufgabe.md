# Vortrag zum Agentic Coding

# Kontext Vibecoding und Agentic Coding

Ich möchte einen Vortrag halten über die Nutzung von Codidng Agenten wie Claude Code oder Github Copilot als Softwaredienstleister. Es soll vor allem darum genau wie man es zielgenau schafft genauf die Anforderungen des Kunden des Kunden punktgenau umzusetzen und nicht nur einfach irgendwie per Vibe Coding. Im Vortrag soll dargestellt werden welche Unterschiede es zu Vibecoding bei den Ansatz gibt. Gibt es hierfür einen Begriff in der Community?. Welche Methoden gehören dazu zu diesen Ansatz. Ich denke es sind folgende. Aber wenn du andere bessere Hinweise findest, dann lass uns darüber Brainstorem.

# Motivation

- was bringt der Umgang mit Agenten
  ** Einhalten von Konventionen im Projekt auch über Teamphasen hinaus
  ** Plannung First
  ** Konzeption und Architektur beginnt wieder an relevanz
  ** Mehr Zeit um in die richtige Richtung zu denken.
  ** Umsetzungszeit wird kleiner als die Anforderungsbestimmung
  ** Was macht das mit Entwicklungsprojekten.
  \*\* Was macht das mit der Kommunikationsstruktur

Die Agenten sind ein Werkzeug und wir müssen noch bestimmen wie wir diesen nutzen.

# Aufbau

- der Vortrag soll zunächst die großen allgemeine Fragen zur Änderung der Vorgehensweise klären
- Danach geht der Vortrag in die konkreten Details wie das erfolgen kann.

# Zielstellung des Vortrag

1. Ziel des Vortrags muss es sein, dass die Entwickler befähigt werden, der Boss des Coding Agenten zu sein. In unserer Arbeit kann es nicht darum gehen, dass der Agent viele Freiheiten hat, der Entwickler soll insbesondere beim geschrieben Code und Tests die Kontrolle behalten.

2. Es muss eine Arbeitsweise verankert werden, das der Agent jede Arbeitsschritt (nicht nur einzelne Codingänderung) zusammen mit den Entwickler angeht und diskutiert.
   Gut wäre es wenn der Agent bei jeden Entwicklungsschritt die Möglichen Umsetzungvarianten darstellt und der Entwickler diese auswählen oder erweitern kann.

3. Bei der Erstellung des Vortrags sollen konkrete Best Practices entstehen

# Besonderheiten des Teilnehemerkreises

In unserem Projekt ist die Besonderheit dass wir mit einer Python basierten Plattform Lösung arbeiten, welche die LLMs nicht kennen. Wir müssen also den Agenten erklären wie Plattform funktioniert, damit die richtige Lösungen entstehen.

# Änderung der Arbeitsweiseänderung für Entwickler

Bitte gebe auch Hinweise darauf wie sich die Arbeitsweise für Entwickler ändert. Worauf ist der Fokus zu setzen. Wo befinden sich die zukünftigen Freuden.
Inwieweit sollte man seine Arbeitsweise ändern, zu zweit einen Agenten steuern zumindest im Planning Modus um die Lösung ideal zu diskutieren.

Welche mögliche Anpassungen kann es geben um in Zukunft die Aufgaben zu erledigen.

## Vibecoding

Anforderungen werden in Form eines Lastenheftest oder kurzen Wortphrasen aus fachlicher Perspektive übergen

Vorteil. Sehr schnell.
Nahteil Unkenntnis über Desigentscheidungen

Wie weit können Modelle ihre Qualität steigern, dass

Rolle: Fachanwender

Tools: Agenten, Agentenschwärme

## Spec Drive

Anforderungen werden in Form eines Pflichtenheftes übergeben.

Näher daran wo man sein möchte. Architektur

Nachteil. Unkenntnis über Systemarchitektur, Grenzen der Verä

Rolle: IT Consultant

Tools: Brainstorming, Agentenschwärme

## Tech Spec Driven Hypothese

Glaube daran, dass man eine technische Spezifikation vorgibt, (UML, USE CASE, Package Diagramme, Workflows, etc.) und das System den benötigten Stack dann selbständig ausfüllt. Hat aber bestimmt grenzen in der Integration von Umsysteme.

Vorteil Systeme können schnell neu gebaut werden

Rolle: Architekt
Tools: Brainstorming, Planning, Agentenschwärme

## Ai Driven Softwaredevelopment

Meine Vision für die Arbeitsweise von Entwickler ist folgender
Es gibt eine Umsetzungsaufgabe mit klaren Anforderungen, der Coding Agent unterstützt den Entwickler von der Planung bis zur kompletten Umsetzung. Bei allen relevanten Entscheidungen stoppt der Agent und geht in die Diskussion mit Entwickler.

Ich nehme an die Entwickler haben so die Möglichkeit mehr Fokus auf die technische Qualität zu legen. Mehr Zeit zum lernen der Fachlichkeit und Konzeptionsfähigkeit.
Schnitt von Modulen. Wiederverwendbarkeit

Der Vortrag soll hauptsächlich diesen Ansatz pflegen.
Ziel bei der Erstellung des Vortrages muss es sein, ein Repo zu haben, wo all die genanten Dinge bereitgestellt werden. Es wäre gut wenn auch differenziert wird, zwischen wirklich schwierigen großen Aufgaben und kleinen Änderungen. Sicherlich kann man bei kleinen Änderungen, wie Anpassungen in der UI auch.

Rolle: Architekt/Entwickler
Tools: Brainstorming, Planning, Agenten

## AI analzying

Kriege eine Vibecoding Codebasis wieder unter

# Team und Anpassung der Vorgehensmodelle

Ziel der Plan muss am Ende 100% zu verstanden werde. Die Designentscheidungen des Entwicklers müssen eingeflossen und dokumentiert sein

Was heißt das für die Teamarbeit. Hypothese - Teams werden deutlich kleiner. Noch noch so viel wie der Project Owner direkt versorgen. Max 3 Personen.

Oder gibt es hier schon andere Vorgehensmodelle.

# Bestandteile für Coding Agenten

strukturiert. Was ist der Unterschied zwischen Skills, Plugins, ToolsMCP Server, CLI, Agenten, Subagenten. Tools. Hooks
Wie funktioniert eigentlich ein Agent Grundlegend? Wie ist das Zusammenspiel zwischen Tool und LLM

## Beudeutung und Funktionsweis von Agents.md

Es soll darum gehen wie man die Agents.md
Wie werden diese verarbeitet

Bestandteile von guten Agents.md Files

Wie kann man diese während der Bearbeitung von Aufgaben erweitern. Welche Plugins/Skills gibt es

## Skills/Plugins als zentrales Arbeitsmittel

Besonders der Umgang mit Skills ist mir wichtig Es soll darum gehen welche planning Skills man benutzt und wie man diese in der execution nutzen kann.

Ich finde die Skills von

- Opra Brainstorming/writing-plans/execute-plans
- Context7 um die aktuellste Doku zu bekommen
- claude-md-manegement

In der Plugin Liste sehe ich noch weitere Plugins die interessant sein können

- techwolf ai - first principiles
-

## Einbinden von externen Systemen

- Wie kann man Jira anbinden
- wie kann man die Datenbank anbinden
- Wie kann man gitlab, github anbinden für Reviews, PUll Requests

## zu empfehlende Plugins für die Arbeit

Es wäre schön für diese Ansatz eine Liste von zu empfehlenden Pluings und Skills zu erhalten.

## Relevante Modelle

Es soll eine Übersicht an Modellen geben, die sich für die Planung und Entwicklung eigenen. Bspw. Opus, Sonnet Codex (gibt es noch was) sind die stärken und schwächen.

## Umgang mit den Kontext

Es soll dargestellt werden wie man mit dem Kontext umgeht. Welche Informationen gehören rein und wie bekommt die Informationen am einfachsten in den Context In dem Zusammenhang soll die Bedeutung von Dokumentation dargestellt werden. Welche Methoden eigenen sich besonders. UML Diagramme Ablaufdiagramme etc. Konventionen, Codebeispiele, Coding Guidelines. Architecture Decision Records. Wo sollte die Doku liegen im Code oder in einem separaten Repo. Was heißt es für einen Agenten zu dokumentieren.

Welcher Context sollte verpflichtend für jede Anfrage sein, welchen Context möchte ich beliebig je nach Aufgabe Wahlweise hinzuschalten können. Wie kann man das machn

Kann man aus den Context auch wieder Dinge entfernen.
Wie können Subagents helfen, den Context sauber zu halten, Rewind Funktionen, falls die Suche von files nicht ideal verlaufen.

Nutzung von Workspaces in VS Code

Auf was ist hierbei noch zu achte? Bitte stelle mir hierzu fragen?

Es wäre gut ein Skill zu haben, der hilft ein ideales agents.md herzustellen.
nur ein /init Befehl finde ich nicht hilfreich, es sollte eher darum gehen die Vision von oben darzustellen und bereits zentrale Unternehmensvorgaben einzuhalten

# Umgang mit Testfälle

\*\* wie behält man die Kontrolle über TEst. Wie kann ich verhindern, dass das LLM den Testanpasst und nicht den Codefix. Am Besten geht der Agent von fehlgeschlagen Test zu fehlgeschlagenen Test durch und diskutiert mit den Entwickler ob der Test fehlschlägt wegen Codeänderungen oder ob tatsächlich eine Regression stattfand.

# Umgang mit dem Frontent

** Wie kann man passgenau dem LLM beschreiben wie das Frontend aussehen soll
** Nutzung von Figma,
\*\* kriegt man es auch einfacher mit Screenshots und Paint hin. Hierzu soll es auch aussagen zu geben.

## Feedbackschleifen

- Welche Arten von Feedbackschleifen gibt es,
  ** Code Review Schleifen
  ** Unittest
  ** Integrationstests
  ** Akzeptanzkriterien
  ** Entwickler in der Loop. Bereits im Execution Plan bestimmen wo der Entwickler helfen so und wie
  ** Playwright zur Nutzung zur Überprüfung der manuellen Tests ist das sinnvoll?

# Bugfixing

- Bugs sind eigentlich oftmals ziemlich schwierig, da es Aussnahmen gefunden worden sind, an die niemand gedacht hat. Hier muss das Vorgehen ganz klar daruf sein, den wirklichen ursprung gefunden zu haben, dieser kann natürlich auch im fachlichen Kontext sein. Es wäre gut Hyothensbasiert zu arbeiten und Änderungen herbeizuführen, die diese Thesen unterstüzten, gut ist es auch Tests zu haben die vorher fehlschlagen und nach dem Bugfixing

# Code Reviews

- wie kann ich den Agenten nutzen um mir Reviews zu geben
- Wie kann das Review Konvention einhalten
- welche Plugins sollte man nutzen um Standars wie Security reinzubekommen
- Welche Plugins gibt es für Frontend und Backend
- Wie kann ich noch bessere Tipps erhalten als vom erfahrensten Entwickler des Teams
- wie kann ich den Agenten nutzem um Review Kommentare abzuarbeiten
  \*\* auch hier wäre eine schrittweise abarbeitung sinnvoll. Lass uns die Liste aus den Tools ziehen. Am Besten schlägt der Agent den Lösungsweg vor und der Entwickler kann diesen bestätigen oder ändern.

## Kosten

Es soll auch eine kurze Diskussion über Kosten entstehen. Wie rechnet man bspw. Github Copilot ab, wie entstehen Premiumrequest, wie kann man die Anzahl an premiumrequests reduzieren.

# Welche Aufgaben eignen sich für Coding Agenten

- TBD

# Welchhe Aufgaben eignen sich nicht Code für Agenten

- wie ist es man nur ganz best
- Wie kann diese ggf. doch mit Agenten lösen. Wo bekommt man kein Qualiäts und Zeitvorteil

# Welche Aufgaben kann man komplett automatisieren

- Demonstratoren
- Library Updates
- Welche noch?

# wie kann man sicherstellen, das man testen, dass alle Plugins und Skills genauso funktionieren wie man es will. Kann man bspw. ein Beispielprompt bereitstellen, mit dem man überprüfen kann, dass alles nach Projektstandards eingebunden ist?

# Vorgehen für die Aufgabe

- Bitte lass uns über den Vortrag Brainstormen
- Lass uns zuerst die Agenda definiere
- Lass uns danach Stück für Stück die einzelnen Punkte der Agenda durchgehen. Ich würde immer bestätigen wenn ich denke, dass wir das Abschnitt beendet haben.
- Für all die Aufgaben Recherchiere im Netz
- Ich hätte immer gerne auch Bilder oder Code oder Chatbeispiele dafür
- Erstelle für die Erarbeitung des Vortrags ebenfalls ein Plan-Vortrag.md File mit den gesamten Aufgaben, diesen kannst du nutzen um die bereits erledigten Aufgaben zu markieren

# Dinge die ich selbst noch heraufinden will

- Was sind language server, kann man diese auch für unsere Plattform nutzen

# Ergebnis

1. Als Ergebnis soll ein Markdown File entstehen, dass ich einfach in eine PowerPoint überfahren kann. Also klare prägnante Überschriften, mit jeweils 3-6 Bulletpoints.

2. Es soll ein Coderepo mit Best practices entstehen

- relevante Skills
- Neue Skills die genau die Anforderungen erfüllen die ich stelle. Vielleicht gibt es aber gute Skills im Netz
- Gute Agents.md Files
- Best Practice zum Thema gute Doku
- Best Practice zum Thema Execution Pläne
- Schlechte Execution Pläne

- Use Cases zum ausprobieren.
- Wie kann ich mein Ziel gut erreichen. Wie verhalten sich die Modelle bei den Aufgaben

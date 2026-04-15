# Grobplanung

Der Plan enhält als Überschrift

Featurename 

Zielstellung,

Aufgabenkontext

Akzeptanzkritieren

Bei der Planung gibt es zuerst ein Grobplanung mit einer übersichtlichen Agenda der zu absolvierenden Schritte. Jeder Schritt enthält Zielstellung, Grobe Highlevel Änderung, Aktzeptanzkritieren, Verfikationsschritte, diese können automatisiert und manuell durch den Benutzer sein.
Jeder Schirtt ist als Checkliste markiert, damit der nächste Verarbeitungsschritt

Gehe mit dem Entwickler bei der Erstellung des Grobplans Schrittweise durch die Punkte und Frage ihn bei Designentscheidungen nach den möglichen Vorgehen. Gehe erst zum nächsten Punkt wenn der Entwickler es bestätigt

Der Entwickler hat die Möglichkeit die Reihenfolge, Schritte und Akzeptanzkritierein zu ändern

bitte Frage nach ob es zum Schluss auch Anpassung in der Dokumentation geben soll
bitte Frage nach ob es zum Schluss auch Anpassung in der Agents.md geben soll

Bei Standard soll immmer sein das

Zum Schluss gibt es immer die Aufgaben
- Code Review 
- Grafische Änderungn sollen nocheinmal per playwright abgetestet werden


Als Ergebnis der Planung entsteht  eine Datei im Ordner Plan/YYYY-MM-DD-<featname>/Grobplanug.md

Diese kann dann vom Skill dc-writing-detailed-plan weiterverarbeitet werden


 Stelle sicher in der Grobplanung, dass jeder abgestimmte Schritte bereits in der Datei abgelegt wird. Alles soll Schrittweise abgelegt wird, nicht als ein Block zum Schluss


# Feinplnaung

jetzt brauche ich ein skill cdb-writing-detailed-plan dieser soll prinzipiell auch nach writing-plans und tdd vorgehen. Als Grundlage dient der Plan aus der Grobplanung.

Hier gilt es aber einen sehr genauen Handlungsplan auf Codeebene aufzubauen, der die einzelnen Schritte und Codeänderungen ganz genau beschreibt. Am Ende jeden Schrittest stehen die zu testenden Akzeptanzkritieren. Diese können können sowohl vom Agenten als auch vom Nutzer überprüft werden

Die Erstellung des Plans erfolgt ebenfalls Schrittweise. Der Entwickler ist so in der Lage, Schritt für Schritt der Implementierung gleich ein Review zu geben bspw. über Namen von Variablen und konkreten Implementierungen. Die zu entstehenden Schritte sollen von einem Menschen in 10-15 min erledigt werden könenn.

Es ist wichtig, dass sich an den Entwickler Konventiionen aus dem Wiki wie der Benahmung gehalten wird 

Wenn ein Schritt aus der Grobplanung überführt worden ist, ist dieser Schritt in der Grobplanung abzuhaken.

Die zu erstellende Datei soll unter docs/plans/YYYY-MM-DD-<featname>/Feinplanung.md abgelegt werden

Betone werden, dass in der Feinplanung der Code jedes Implementierungsschritt schon  im wesentlich aufgeführt ist.

Am ende des Plans soll auch die Hinweise zur Dokumentation genannt werden. Zudem ist es wichtig die allgemeinen Akzeptanzkriterien der Grobplanung am Ende der Feinplanung zu überprüfen

 Stelle sicher in der Feinplanung, dass jeder abgestimmte Schritte bereits in der Datei abgelegt wird. Alles soll Schrittweise abgelegt wird, nicht als ein Block zum Schluss


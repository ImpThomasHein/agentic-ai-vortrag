# Aufgabe: REST-API Endpoint erstellen (Mittel)

## Szenario
Es soll ein neuer GET-Endpoint `/api/reports/summary` erstellt werden,
der eine aggregierte Zusammenfassung aller Reports eines Benutzers liefert.

## Anforderungen
- Authentifizierung erforderlich
- Filterbar nach Zeitraum (query params: from, to)
- Response: JSON mit Gesamtzahl, nach Status gruppiert
- Fehlerbehandlung: 401 bei fehlender Auth, 400 bei ungueltigem Zeitraum

## Empfohlene Methodik
1. Spec schreiben (API-Vertrag, Request/Response-Format)
2. Plan erstellen (3-5 Tasks)
3. TDD: Test → Implementierung → Test
4. Review + Commit

## Lernziel
Spec-Driven Ansatz: Die Spezifikation definiert den Vertrag,
der Agent implementiert innerhalb dieses Vertrags.

# Frontend-Beschreibungen fuer Agenten — Best Practice

## Wie beschreibe ich eine UI passgenau?

### Methode 1: Screenshots + Annotationen (pragmatisch)
- Screenshot der aktuellen UI machen
- In Paint/Snip & Sketch annotieren (Pfeile, Markierungen, Text)
- Als Bild dem Agenten mitgeben
- Vorteil: Schnell, kein Tooling noetig
- Nachteil: Nicht maschinenlesbar

### Methode 2: Design-Tool-Exports (Figma / Penpot) + Storybook
- Design in Figma oder Penpot erstellen
- Export als Bild oder Dev-Modus nutzen
- Vorteil: Praezise, professionell
- Nachteil: Einarbeitungszeit
- **Figma:** Industriestandard, kostenpflichtig
- **Penpot:** Open-Source-Alternative, kostenlos, self-hostable

**Storybook-Integration (React / Web Components):**
- Storybook dokumentiert Komponenten isoliert mit allen States und Props
- Der Agent kann Storybook-Stories als Spezifikation nutzen:
  Vorhandene Story = exakte Beschreibung des erwarteten Verhaltens
- Penpot-Plugin verbindet Design direkt mit Storybook-Stories
- Vorteil: Lebende Dokumentation, kein Drift zwischen Design und Code
- Empfehlung: Bei React- oder Web-Components-Projekten ab mittlerer Groesse

### Methode 3: Design Tokens
Design Tokens sind eine standardisierte Datei (JSON/YAML), die visuelle
Gestaltungswerte zentral definiert — Farben, Abstaende, Schriftgroessen,
Radien, Schatten. Der Agent nutzt diese Werte konsistent ueber alle
Komponenten hinweg, statt Werte zu raten.

Beispiel (JSON):
```json
{
  "color": { "primary": "#1a365d", "accent": "#2b6cb0" },
  "spacing": { "sm": "8px", "md": "16px", "lg": "32px" },
  "font": { "body": "14px", "heading": "24px" }
}
```

- Agent referenziert `tokens.json` statt Pixelwerte zu erfinden
- Vorteil: Konsistenz ueber die gesamte Anwendung
- Nachteil: Initialer Aufwand, Token-Datei muss gepflegt werden

**Tooling fuer Design Tokens:**

| Tool | Ansatz | Einsatz |
|------|--------|---------|
| **Style Dictionary** (Amazon) | JSON → CSS/JS/native | Build-Pipeline, framework-agnostisch |
| **Theo** (Salesforce) | YAML/JSON → viele Formate | Grosse Design-Systeme |
| **Figma Variables / Tokens Studio** | Export direkt aus Figma | Figma-zentrierte Workflows |
| **Penpot Design Tokens** | Nativ in Penpot | Open-Source-Workflow |
| **W3C Design Tokens Format** | Standard-Spezifikation | Interoperabilitaet zwischen Tools |

Empfehlung: **Style Dictionary** fuer eigene Projekte — weit verbreitet,
gut dokumentiert, funktioniert mit React, Vue, Angular und nativen Apps.

### Empfehlung fuer den Alltag
Screenshots + Paint-Annotationen reichen fuer die meisten Aenderungen.
Fuer neue Komponenten: Referenz-Screenshot + textuelle Beschreibung.
Design Tokens lohnen sich ab mittlerer Projektgroesse.

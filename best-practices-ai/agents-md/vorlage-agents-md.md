# AGENTS.md — Projektvorlage

<!--
Dieses Template dient als Startpunkt fuer ein eigenes AGENTS.md.
Kopieren, anpassen, ins Repo-Root legen (oder nach .github/copilot-instructions.md).

Basiert auf der Analyse von 2.500+ Repositories (GitHub Blog, Matt Nigh, Nov 2025):
https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/

Die 6 Kernbereiche guter Agent-Dateien:
1. Commands — Exakte Build-, Test-, Lint-Kommandos mit Flags
2. Testing — Test-Framework, Strategie, was getestet wird
3. Projektstruktur — Verzeichnisse mit Erklaerung, Tech-Stack mit Versionen
4. Code Style — Echte Code-Beispiele statt Prosa-Beschreibungen
5. Git Workflow — Branch-Strategie, Commit-Format, PR-Regeln
6. Grenzen — Always ✅ / Ask first ⚠️ / Never 🚫

Best Practices:
- Kommandos frueh im Dokument platzieren (Agent referenziert sie oft)
- Code-Beispiele > Prosa-Erklaerungen (ein Snippet > drei Absaetze)
- Stack mit Versionen angeben ("React 18 + TypeScript 5" statt "React-Projekt")
- Klare Grenzen setzen ("Never commit secrets" war die haeufigste hilfreiche Constraint)
- Iterativ wachsen: Klein starten, bei Agenten-Fehlern ergaenzen
- Progressive Disclosure nutzen: Nur Basis-Infos in AGENTS.md, Details verlinken

Anti-Patterns (NICHT tun):
- "Du bist ein hilfreicher Assistent" — zu vage, funktioniert nicht
- Nur Prosa ohne ausfuehrbare Kommandos
- Gesamte Dokumentation in eine einzige Datei packen
- Regeln ohne Code-Beispiele
- Keine Grenzen definieren (Agent darf "alles" → macht Fehler)
-->

## 1. Mission & Besonderheiten

<!--
Was ist das Projekt? Welche Besonderheiten gibt es? Plattform-Eigenheiten?
Kurzbeschreibung (2–4 Saetze), wichtigste fachliche Ziele, spezielle Constraints.
BEST PRACTICE: Spezifische Persona statt vage Beschreibung.
  ✅ "Du bist ein Test-Engineer der React-Komponenten testet"
  ❌ "Du bist ein hilfreicher Coding-Assistent"
-->

[Kurze Projektbeschreibung fuer den Agenten]

## 2. Commands (frueh im Dokument!)

<!--
BEST PRACTICE: Kommandos kommen frueh — der Agent referenziert sie oft.
Exakte Kommandos mit Flags, nicht nur Tool-Namen.
  ✅ `npm test -- --coverage --watchAll=false`
  ❌ "Nutze npm zum Testen"
-->

- Build: `[z.B. npm run build]`
- Tests: `[z.B. npm test -- --coverage]`
- Lint: `[z.B. npm run lint --fix]`
- Run: `[z.B. npm run dev]`

## 3. Tech-Stack & Projektstruktur

<!--
BEST PRACTICE: Stack mit Versionen und Key-Dependencies.
  ✅ "React 18, TypeScript 5.3, Vite 5, Tailwind CSS 3.4"
  ❌ "React-Projekt"
-->

- Language: [z.B. TypeScript 5.3]
- Framework: [z.B. Next.js 14]
- Datenbank: [z.B. PostgreSQL + Prisma 5]
- Struktur:
  - `src/` — Quellcode
  - `tests/` — Test-Dateien
  - `docs/` — Dokumentation

## 4. Code Style (mit Beispielen!)

<!--
BEST PRACTICE: Ein echtes Code-Snippet zeigt dem Agenten mehr als drei Absaetze Prosa.
Zeige was guter Output aussieht — nicht nur beschreiben.
-->

```typescript
// ✅ Gut — beschreibende Namen, Error Handling
async function fetchUserById(id: string): Promise<User> {
  if (!id) throw new Error('User ID required');
  const response = await api.get(`/users/${id}`);
  return response.data;
}

// ❌ Schlecht — vage Namen, kein Error Handling
async function get(x) {
  return await api.get('/users/' + x).data;
}
```

## 5. Tests & Qualitaet

<!--
Was sind die Test-Anforderungen? Mindest-Coverage? CI-Checks?
Was darf der Agent mit Tests tun/nicht tun?
-->

- Coverage: [z.B. minimum 80%]
- Kein Merge ohne gruene Tests
- Tests duerfen nicht angepasst werden, um gruen zu werden
- Jeder Bugfix: erst FAILING Test, dann Fix

## 6. Git-Workflow

<!--
Branch-Strategie, Commit-Messages, PR-Regeln.
Welche Git-Operationen darf der Agent selbst machen?
-->

- Branch: feature/, bugfix/, hotfix/
- Commits: conventional commits (feat:, fix:, chore:)
- PR: mindestens ein Reviewer + gruene Tests

## 7. Grenzen & No-Gos (Three-Tier Boundaries)

<!--
BEST PRACTICE: Drei Stufen definieren — die haeufigste hilfreiche Constraint war "Never commit secrets".
-->

✅ **Always:**
- Dateien lesen und editieren
- Lokale Tests ausfuehren
- Code-Style-Regeln befolgen

⚠️ **Ask first:**
- Neue Abhaengigkeiten installieren
- DB-Schema aendern
- Architekturentscheidungen
- CI/CD-Konfiguration aendern

🚫 **Never:**
- Secrets oder API-Keys committen
- `node_modules/` oder `vendor/` editieren
- Produktions-Konfigurationen aendern
- Netzwerk-Requests an externe Dienste

## 8. Progressive Disclosure (verlinkte Detail-Dokumente)

<!--
BEST PRACTICE: Nicht alles in AGENTS.md packen — Details verlinken.
Weniger Tokens = bessere Entscheidungen (Context Rot vermeiden!)
-->

| Thema | Datei | Wann lesen |
|-------|-------|------------|
| Features | `docs/features.md` | Bestehende Funktionalitaet pruefen |
| API | `docs/api-endpoints.md` | Bei API-Aenderungen |
| Konventionen | `docs/conventions.md` | Bei Code-Aenderungen |
| Datenmodell | `data-model.mmd` | **Immer** vor DB-Aenderungen |
- Git push (remote) ohne explizite Anweisung

## 9. Architektur-Notizen & Stolpersteine

<!--
Was muss der Agent wissen, um keine alten Fehler zu wiederholen?
Dokumentiert bekannte Legacy-Bereiche, wichtige Entscheidungen, typische Fallstricke.
-->

- [Bekannte Legacy-Bereiche]
- [Wichtige Architektur-Entscheidungen]
- [Typische Fallstricke]

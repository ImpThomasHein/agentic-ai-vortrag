# Sandbox & Berechtigungssteuerung — Best Practice

## Das Problem
- Zu viele Stopps → Entwickler klickt "Accept All" → kein Schutz
- Zu wenige Stopps → Agent trifft Entscheidungen allein → Kontrollverlust
- Ziel: **Nur bei wichtigen Dingen stoppen**

## Klassifikation von Aktionen

### ✅ Auto-erlauben (kein Stopp noetig)
| Aktion | Begruendung |
|--------|-------------|
| Dateien lesen | Kein Risiko, reversibel |
| Dateien erstellen/editieren | Reversibel via Git |
| Lokale Tests ausfuehren | Kein Seiteneffekt |
| Git add/commit (lokal) | Reversibel |
| Package-Lock lesen | Kein Risiko |

### ⚠️ Nachfragen (Entwickler-Entscheidung noetig)
| Aktion | Begruendung |
|--------|-------------|
| Architektur-Entscheidung | Nicht reversibel im Design |
| Neue Abhaengigkeit installieren | Supply-Chain-Risiko |
| DB-Schema aendern / Migration | Schwer reversibel |
| Oeffentliche API aendern | Breaking Change moeglich |
| Unklare Anforderung | Agent soll nicht raten |

### 🚫 Blockieren (Security-kritisch)
| Aktion | Begruendung |
|--------|-------------|
| Netzwerkzugriff (curl, fetch, API-Calls) | Datenabfluss-Risiko |
| Datenbankverbindungen | Produktionsdaten-Risiko |
| SSH / Remote-Zugriff | Sicherheitskritisch |
| Secrets/Credentials lesen/schreiben | Compliance |
| Git push (remote) | Oeffentliche Sichtbarkeit |
| Beliebige Shell-Befehle mit sudo | Systemrisiko |

## Tool-spezifische Umsetzung

### Claude Code

Konfiguration in `.claude/settings.json` (im Repo versionierbar, gilt fuer alle Teammitglieder):

```json
{
  "permissions": {
    "allow": [
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(npm run test:*)",
      "Bash(npm run lint:*)",
      "Read(**)",
      "Edit(**)"
    ],
    "ask": [
      "Bash(git push:*)",
      "Bash(npm install:*)"
    ],
    "deny": [
      "Bash(curl:*)",
      "Bash(wget:*)",
      "Bash(sudo:*)",
      "Bash(ssh:*)",
      "Read(./.env)",
      "Read(./secrets/**)",
      "Read(~/.ssh/**)"
    ]
  }
}
```

Regelauswertung: `deny` → `ask` → `allow` (erste passende Regel gewinnt).
Wildcards mit `*`, Pfad-Patterns analog zu `.gitignore`.

Zusaetzlich: OS-Level-Sandbox via Umgebungsvariable `CLAUDE_CODE_USE_SANDBOX=1`.
Schraenkt Dateisystem- und Netzwerkzugriff der Bash-Umgebung auf OS-Ebene ein (macOS/Linux).

Dokumentation: https://code.claude.com/docs/en/permissions

### GitHub Copilot CLI (VS Code / JetBrains)

**Workspace Trust:** Agent Mode startet nicht in nicht-vertrauenswuerdigen Workspaces.
Einstellung: `File > Trust Workspace` — sicherheitsrelevant bei fremdem Code.

**Terminal-Sandbox (macOS/Linux):**
```json
// .vscode/settings.json
{
  "chat.tools.terminal.sandbox.enabled": true,
  "chat.tools.terminal.sandbox.network.allowedDomains": [],
  "chat.tools.terminal.sandbox.denyWrite": ["./secrets/**", "./.env"]
}
```
Standardverhalten: Netzwerkzugriff blockiert, Schreibzugriff auf Working Directory erlaubt.
Hinweis: Unter Windows hat die Sandbox-Konfiguration derzeit keinen Effekt.

**Copilot Instructions (`/.github/copilot-instructions.md`):**
Verhaltensregeln fuer den Agenten dokumentieren (welche Aktionen der Agent fragen soll),
ergaenzend zur technischen Sandbox-Konfiguration.

Dokumentation: https://code.visualstudio.com/docs/copilot/security

### Tool-agnostisch via AGENTS.md
Unabhaengig vom Tool: In AGENTS.md die Regeln definieren:
- Abschnitt "Grenzen & No-Gos" mit Always/Ask first/Never
- Agent haelt sich an diese Regeln — die Sandbox ist die zweite Absicherung

Beispiel:
```markdown
## Grenzen & No-Gos
Always: Dateien lesen, editieren, lokale Tests ausfuehren, git add/commit
Ask first: Neue Dependencies installieren, DB-Schema aendern, oeffentliche API aendern
Never: Netzwerkzugriffe, Secrets lesen/schreiben, git push ohne Review, sudo
```

## Team-Profil bereitstellen
1. Sandbox-Konfiguration im Repo versionieren (`.claude/settings.json`, `.vscode/settings.json`)
2. In AGENTS.md dokumentieren welche Aktionen erlaubt/verboten sind
3. Onboarding: Neue Entwickler klonen Repo → Sandbox ist vorkonfiguriert
4. Regelmaessig reviewen: Brauchen wir neue Ausnahmen?

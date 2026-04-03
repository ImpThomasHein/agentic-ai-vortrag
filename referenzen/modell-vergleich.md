# Modell-Vergleich fuer Coding

Stand: April 2026 — Recherchiert anhand aktueller Benchmarks (SWE-bench Verified, HumanEval, LiveCodeBench)

---

## Copilot-verfuegbare Modelle (Stand April 2026)

| Modell | Staerke | Schwaeche | Kosten (Premium-Requests) |
|--------|---------|-----------|---------------------------|
| GPT-5.3-Codex | Groesste Staerke bei agentic Coding-Workflows, 400k-Token-Kontext, 77.3% Terminal-Bench 2.0, 25% schneller als Vorgaenger, optimiert fuer mehrstufige Aufgaben | Etwas hinter Claude beim SWE-bench Verified (56.8% SWE-bench Pro); bereits von GPT-5.4 abgeloest | Standard (1x Multiplier) |
| Claude Sonnet 4.6 | 79.6% SWE-bench Verified, 72.5% OSWorld, liefert 98% der Opus-Leistung zum 1/5 des Preises; von Entwicklern 70% der Zeit gegenueber Sonnet 4.5 bevorzugt | Knapp unter Opus 4.6 bei sehr komplexen Planungsaufgaben | Premium (1x Multiplier) |
| Claude Opus 4.6 | 80.8% SWE-bench Verified (Bestwert unter Claude-Modellen), staerkste Reasoning-Qualitaet, bevorzugt fuer Architektur und komplexe Multi-Step-Refactorings | 3x teurere Premium-Requests als Sonnet; 7.5x teurer als Gemini 3.1 Pro bei vergleichbarer Benchmark-Leistung; langsamer | Premium (3x Multiplier) |
| Gemini 3.1 Pro | 80.6% SWE-bench Verified, gewinnt 12 von 18 Coding-Benchmarks, 2887 Elo auf LiveCodeBench Pro, stark im Preis-Leistungs-Verhaeltnis | Entwickler berichten von weniger konsistenter Code-Qualitaet im Vergleich zu Claude bei Code Reviews und Erklaerungen | Standard (1x Multiplier) |

> Hinweis: Gemini 3 Pro (aeltere Version) wurde im Maerz 2026 deprecated. Gemini 3.1 Pro ist seit Februar 2026 im Copilot verfuegbar.
> GPT-5.4 ist seit Maerz 2026 der neueste OpenAI-Flagship, laeuft im Copilot ebenfalls als Standard-Modell.

---

## Open-Source-Modelle (lokal einsetzbar)

| Modell | Version | Staerke | Schwaeche |
|--------|---------|---------|-----------|
| Qwen Coder | Qwen3-Coder-Next (80B gesamt, 3B aktiv, Feb 2026) | Bestes frei verfuegbares Coding-Modell 2026; 44.3% SWE-bench Pro; uebertrifft Modelle mit 10-20x mehr aktiven Parametern; laeuft auf 16GB-Laptops mit 40-60 Tokens/Sek; unterstuetzt tool-calling zuverlaessig fuer agentic Workflows | Groesseres Modell benoetigt quantisierte Version fuer Consumer-Hardware; Qualitaet bei sehr abstrakten Architektur-Entscheidungen unter Frontier-Modellen |
| DeepSeek Coder | DeepSeek V3.1 (671B MoE, 37B aktiv, Oktober 2025) | 68.4% SWE-bench mit Thinking-Mode; uebertrifft V3 und R1 um 40%+ auf Coding-Agent-Benchmarks; MoE-Architektur ermoeglicht hohe Geschwindigkeit trotz grosser Parameterzahl; stark in Math und Reasoning | Erfordert erhebliche Hardware fuer lokalen Betrieb (MoE 671B); Cloud-Betrieb ueber DeepSeek API noetig fuer volle Leistung; Datenschutzbedenken bei Nutzung chinesischer Cloud-Infrastruktur |

> Ollama-Integration: Qwen3-Coder-Next und DeepSeek V3.1 sind ueber `ollama pull` verfuegbar und laufen lokal ohne Cloud-Abhaengigkeit.

---

## Welches Modell wofuer?

- **Planning/Architektur:** Claude Opus 4.6 (oder GPT-5.4 als Alternative). Begruendung: Die breitesten Reasoning-Faehigkeiten und das beste Verstaendnis fuer komplexe Systemzusammenhaenge. Die 80.8% SWE-bench-Leistung spiegelt reale Probleme wider, nicht nur Code-Generierung. Fuer mehrstufige Architektur-Entscheidungen mit langen Kontext-Ketten ist Opus die sicherere Wahl — trotz 3x Premium-Request-Kosten.

- **Coding (taegliche Arbeit):** Claude Sonnet 4.6. Begruendung: 98% der Opus-Leistung zu 1/5 des Preises; 79.6% SWE-bench; von Entwicklern in realen Tests bevorzugt. Fuer Aufgaben wie Feature-Implementierung, Bug-Fixes und Test-Generierung ist Sonnet der optimale Kompromiss aus Qualitaet und Premium-Request-Verbrauch.

- **Review:** Claude Sonnet 4.6 fuer qualitative Reviews (Erklaerungen auf Senior-Developer-Niveau); GPT-5.4 Mini fuer automatisierte CI-Pipeline-Checks (kostenguenstig, schnell). Claude's Staerke bei natuerlichsprachlicher Ausgabe macht Reviewer-Kommentare deutlich verstaendlicher.

- **Recherche:** Gemini 3.1 Pro oder GPT-5.3-Codex. Begruendung: Beide bringen sehr grosse Kontextfenster mit (400k+ Tokens), sind kostenguenstiger als Opus und gut darin, grosse Codebasen oder Dokumentations-Corpora zu durchsuchen. Gemini 3.1 Pro hat dabei Preisvorteile.

---

## Kosten & Premium-Requests

**Was sind Premium Requests?**
Premium Requests sind Anfragen an Copilot-Modelle, die mehr Rechenleistung benoetigen als die Basis-Modelle (GPT-5 mini, GPT-4.1, GPT-4o). Jedes Modell hat einen Multiplikator, der festlegt, wie viele Premium-Request-Einheiten pro Prompt verbraucht werden. Seit dem 18. Juni 2025 werden Premium Requests fuer alle bezahlten Copilot-Plaene auf GitHub.com abgerechnet.

**Premium-Request-Kontingente pro Plan:**

| Plan | Preis | Premium Requests/Monat |
|------|-------|------------------------|
| Copilot Free | $0 | 50 |
| Copilot Pro | $10/Monat | 300 |
| Copilot Pro+ | $39/Monat | 1.500 |
| Copilot Business | $19/User/Monat | 300 |
| Copilot Enterprise | $39/User/Monat | 1.000 |

**Kosten bei Ueberschreitung:** $0,04 USD pro zusaetzlichen Premium Request. Nutzer koennen ein monatliches Budget fuer Mehrverbrauch setzen.

**Premium-Request-Multiplier nach Modell-Kategorie:**

- Budget-Modelle (Claude Haiku 4.5, Gemini 3 Flash): 0,33x — verbraucht weniger als 1 Request pro Prompt
- Standard-Modelle (Claude Sonnet 4.6, Gemini 3.1 Pro, GPT-5.3-Codex): 1x
- Advanced-Modelle (Claude Opus 4.6): 3x — verbraucht 3 Requests pro Prompt

**Wie Premium-Request-Verbrauch reduzieren:**

1. **Modell-Wahl:** Fuer einfache Aufgaben (Autovervollstaendigung, kurze Fragen) auf Standard- oder Budget-Modelle wechseln. Claude Sonnet statt Opus spart 67% der Premium Requests bei vergleichbarer Alltagsleistung.
2. **Auto-Modus nutzen:** Copilots "Auto"-Modellauswahl waehlt automatisch das passende Modell und gewaehrt 10% Rabatt auf Premium-Request-Multiplier.
3. **Kontext-Optimierung:** Mit `/clear` in Chat den Kontext zuruecksetzen; nur relevante Dateien oeffnen. Kleiner Kontext = weniger Token = weniger Iterations-Bedarf.
4. **`/usage` Command:** Zeigt aktuellen Premium-Request-Verbrauch, Session-Dauer und Token-Aufschluesselung an.
5. **Budget setzen:** Im Copilot-Billing ein monatliches Ausgabenlimit fuer Premium-Overage konfigurieren, um Kostenkontrolle zu behalten.

---

## Quellen

- [GitHub Copilot Plans & Pricing](https://github.com/features/copilot/plans)
- [GitHub Docs: Copilot Requests](https://docs.github.com/en/copilot/concepts/billing/copilot-requests)
- [GitHub Docs: Supported AI Models](https://docs.github.com/en/copilot/reference/ai-models/supported-models)
- [GitHub Docs: Model Comparison](https://docs.github.com/en/copilot/reference/ai-models/model-comparison)
- [NxCode: Claude Sonnet 4.6 Complete Guide](https://www.nxcode.io/resources/news/claude-sonnet-4-6-complete-guide-benchmarks-pricing-2026)
- [NxCode: Claude Sonnet 4.6 vs Opus 4.6](https://www.nxcode.io/resources/news/claude-sonnet-4-6-vs-opus-4-6-complete-comparison-2026)
- [OpenAI: Introducing GPT-5.3-Codex](https://openai.com/index/introducing-gpt-5-3-codex/)
- [Gemini 3.1 Pro in GitHub Copilot (Feb 2026)](https://github.blog/changelog/2026-02-19-gemini-3-1-pro-is-now-in-public-preview-in-github-copilot/)
- [Qwen3-Coder-Next on Hugging Face](https://huggingface.co/Qwen/Qwen3-Coder-Next)
- [DeepSeek V3 vs V3.1 SWE-bench Analysis](https://localaimaster.com/models/deepseek-v3-vs-v3-1-analysis)
- [Best AI Models for Coding and Agentic Workflows 2026](https://teamai.com/blog/ai-automation/best-ai-models-for-coding-and-agentic-workflows-2026/)
- [Microsoft Tech Community: Choosing the Right Model in GitHub Copilot](https://techcommunity.microsoft.com/blog/azuredevcommunityblog/choosing-the-right-model-in-github-copilot-a-practical-guide-for-developers/4491623)

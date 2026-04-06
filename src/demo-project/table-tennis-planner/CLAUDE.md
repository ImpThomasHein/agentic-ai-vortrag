# CLAUDE.md - TTF Companion

## Project Overview

A mobile-first web application for table tennis training planning ("TTF Companion") for the Tischtennisfreunde Bötzow. German-speaking users with two roles:

- **Trainer**: Plan training sessions, assign exercises to training days, monitor votes
- **Spieler (Player)**: Vote on favorite exercises for upcoming training sessions

## Detailed Documentation

Read these files on demand — only load what you need for the current task:

| Topic | File | When to read |
|-------|------|--------------|
| Features | [docs/claude/features.md](docs/claude/features.md) | Understanding existing functionality, checking what's already built |
| Tech Stack | [docs/claude/tech-stack.md](docs/claude/tech-stack.md) | Choosing libraries, understanding framework versions |
| Project Structure | [docs/claude/project-structure.md](docs/claude/project-structure.md) | Finding files, understanding directory layout |
| Key Types | [docs/claude/types.md](docs/claude/types.md) | Working with TypeScript interfaces and data shapes |
| Database | [docs/claude/database.md](docs/claude/database.md) | DB setup, schemas, seeds, migrations |
| Commands | [docs/claude/commands.md](docs/claude/commands.md) | Running dev server, tests, builds, production |
| API Endpoints | [docs/claude/api-endpoints.md](docs/claude/api-endpoints.md) | Working with or adding API routes |
| Conventions | [docs/claude/conventions.md](docs/claude/conventions.md) | Code style, process rules, development approach |
| Datamodel | [data-model.mmd](data-model.mmd) | Always read before implementing DB changes |

## Essential Rules (always active)

- **Datamodel**: Always read `data-model.mmd` before implementing
- **JSDoc**: Every class, component, and API route file MUST have an English comment/JSDoc at the top
- **Storybook**: New/updated components must be added/changed in storybook
- **Testing**: Complex logic extracted to separate ts files with unit tests; key features need playwright integration tests
- **Conventions**: Read [docs/claude/conventions.md](docs/claude/conventions.md) for full code & process conventions
- **Simpler solutions are better**
- **Development approach**: Plans live in `plan/` folder — step-by-step with developer approval between steps. See [docs/claude/conventions.md](docs/claude/conventions.md) for details.

## Hard Facts: Testregeln (nicht zusammenfassen oder umformulieren)

- Jeder Bugfix: erst FAILING Test, dann Fix.
- Tests dürfen NICHT verändert werden, um sie grün zu machen.
- Änderungen an Tests nur nach expliziter Freigabe durch einen Entwickler.
- Ohne Tests KEIN Merge in main.

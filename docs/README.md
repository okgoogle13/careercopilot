# CareerCopilot Documentation

> **Last updated**: 2026-01-31

---

## Quick Links

| Category             | Entry Point                                    |
| -------------------- | ---------------------------------------------- |
| 🎨 **Design System** | [design/00-overview.md](design/00-overview.md) |
| 🏗️ **Architecture**  | [architecture/](architecture/)                 |
| 📖 **Guides**        | [guides/](guides/)                             |
| 📊 **Reports**       | [reports/](reports/)                           |
| 📁 **Archive**       | [\_archive/](_archive/)                        |

---

## Design System (Northcote Curio)

The visual and interaction language for CareerCopilot — a Victorian naturalist's field station.

| Doc                                      | Description                                   |
| ---------------------------------------- | --------------------------------------------- |
| [00-overview](design/00-overview.md)     | Master context, core directives, mode duality |
| [01-tokens](design/01-tokens.md)         | Colors, radii, motion physics                 |
| [02-typography](design/02-typography.md) | Font stack, variable axes, size contrast      |
| [03-components](design/03-components.md) | Pebble, Stone, Lens, Seed patterns            |
| [04-voice](design/04-voice.md)           | Microcopy, tier system, forbidden phrases     |
| [05-assets](design/05-assets.md)         | Asset manifest, naming conventions            |
| [06-wireframes](design/06-wireframes.md) | Page specifications for all 11 screens        |

---

## Architecture

| Doc                                                              | Description                   |
| ---------------------------------------------------------------- | ----------------------------- |
| [AGENT_SYSTEM_REFERENCE](architecture/AGENT_SYSTEM_REFERENCE.md) | AI agent configuration        |
| [BACKEND_STRUCTURE](architecture/BACKEND_STRUCTURE.md)           | Backend services overview     |
| [PROJECT_KNOWLEDGE_BASE](architecture/PROJECT_KNOWLEDGE_BASE.md) | Comprehensive project context |

---

## Project Management

| Location                           | Purpose                    |
| ---------------------------------- | -------------------------- |
| [project/active/](project/active/) | Current roadmaps and plans |
| [project/weekly/](project/weekly/) | Weekly tracker logs        |

---

## Folder Structure

```
docs/
├── design/           # Northcote Curio design system (source of truth)
├── architecture/     # System architecture
├── guides/           # How-to guides
├── project/          # Project management
│   ├── active/       # Current plans
│   └── weekly/       # Weekly logs
├── reports/          # Generated test/audit reports
└── _archive/         # Deprecated docs (date-prefixed)
```

---

## Naming Conventions

| Rule                               | Example                    |
| ---------------------------------- | -------------------------- |
| Lowercase kebab-case               | `design-tokens.md`         |
| Numbered prefix for ordered docs   | `01-tokens.md`             |
| Date prefix for temporal docs      | `2026-01-31_weekly-log.md` |
| Underscore prefix for meta folders | `_archive/`                |

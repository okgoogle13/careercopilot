# Glossary

## Acronyms & Terms

| Term | Meaning |
|------|---------|
| KR Solidarity | Design system ("Kerala Rage" Solidarity), v6.1, M3 Expressive, dark-only |
| M3 | Material Design 3 — Expressive variant used in design system |
| Figma sync | Process of aligning Figma node IDs / frames with code route targets |
| sync-contract | `figma-sync-order.json` + `figma-agent-tasks.md` — source of truth for Figma↔code mapping |
| canonical shell | Standard page shell: sidebar + page chrome header + content frame, stable node IDs |
| redirect-history | Legacy route aliases that exist for traceability only, not active product surfaces |
| node ID | Figma frame identifier (e.g. `1:4411`) used for design-to-code targeting |
| code targeting | Selecting a specific Figma node as the source for code generation |
| route family | Group of related routes (e.g. `/applications` = `/tracker` + `/kanban`) |
| TanStack Query | Data-fetching library used in frontend |
| Genkit | Firebase Genkit — AI flow orchestration in backend |
| Zustand | Frontend state management library |
| GCP | Google Cloud Platform — hosting target (us-central1) |

## Shorthands in Tasks

| Shorthand | Meaning |
|-----------|---------|
| `1:4411` | Figma node ID — `/profile` canonical desktop frame |
| `1:2333` | Figma node ID — `/opportunities` frame |
| `1:3176` | Figma node ID — `/applications` frame |
| `1:5116` | Figma node ID — `/analysis` frame |
| `1:5490` | Figma node ID — `/documents` frame |
| PageCanvas / Layout / Sidebar / Layout | Anti-pattern shell structure to be replaced with canonical shell |

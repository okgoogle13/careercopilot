# Design-to-Code Workflow: Terminology Reference

This guide clarifies the key concepts and terms used across the 6 design-to-code automation skills to ensure consistency and eliminate ambiguity.

## Core Concepts

| Term | Meaning | Primary Skill/Source |
|------|---------|----------------------|
| **Orchestration Tokens** | Machine-readable design variables (colors, typography, spacing, motion) in JSON/CSS format. | `design-system-doc-generator` |
| **Design Identity Brief** | The foundational directive that establishes the "soul" of the project, including visual metaphors and anti-patterns. | `design-system-doc-generator` |
| **Anti-Slop Protocol** | Explicit prohibitions on generic SaaS aesthetics (e.g., no Inter alone, no 8px radius, no generic blue). | `design-system-doc-generator` |
| **Annotated Wireframe Protocol** | A structured specification for screens using ASCII wireframes and XML-wrapped annotations (`<layout>`, `<tokens>`, etc.). | `wireframe-annotator` |
| **Kerala Rage kr-solidarity** | The project-specific design system implementation, blending M3 Expressive with Australian botanical aesthetics. | `CLAUDE.md` |
| **M3 Expressive** | Material Design 3 Expressive. The foundation of the visual system, emphasizing drama, energy, and individual expression. | `m3-expressive-ui-evaluator` |
| **Solidarity Mode** | A high-contrast, warm, and emotional aesthetic mode (contrasted with the more clinical "Laboratory Mode"). | `component-builder` |

## Mapping & Alignment

- **Kerala Rage kr-solidarity** = The specific implementation of **M3 Expressive** for CareerCopilot.
- **Orchestration Tokens** = The technical manifestation of the **Design Identity Brief**.
- **Solidarity Mode** = The primary aesthetic target enforced by the `component-builder`.

## Workflow Role of Key Terms

1.  **Identity Brief** sets the spirit.
2.  **Orchestration Tokens** encode the rules.
3.  **Wireframe Protocol** applies the rules to a specific layout.
4.  **Anti-Slop** ensures the output remains unique and expressive.

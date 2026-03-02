---
name: design-skills
description: Collection of design-focused skills for visual validation, asset generation,
  and design system compliance
metadata:
  legacy_frontmatter:
    version: 1.0.0
    tags:
    - design
    - design-system
    - visual-validation
---

# Design Skills Collection

## Purpose

Coordinate design-related skills for visual validation, asset generation, and design system compliance. This skill acts as a central router for specialized design workflows.

## Process

1. **Identify Task Type**: Determine if the request is about visual validation, typography, backgrounds, or system generation.
2. **Route to Skill**:
   - **M3 Anti-Slop**: Use `m3-anti-slop-validator/` for cleaning up generic AI design patterns.
   - **Typography**: Use `m3-expressive-typography-enhancer/` for refining type scales and pairings.
   - **Atmospheric Backgrounds**: Reference `m3-atmospheric-backgrounds.md` for generating M3-compliant backgrounds.
   - **System Generation**: Reference `m3-design-system-generator.md` for scaffolding new design systems.
3. **Execute**: Delegate to the appropriate sub-skill or Apply the legacy reference logic.

## When to Use

- When mapping a general design request to a specific executable skill.
- When you need to coordinate between multiple design-focused skills (e.g., Audit + Fix).
- When looking for legacy M3 design patterns not yet fully skill-ified.

## Catalog

### Executable Sub-Skills

- [m3-anti-slop-validator](file:///.claude/skills/design-skills/m3-anti-slop-validator/SKILL.md): Ensures designs match the kerala-rage Contemporary Australian aesthetic.
- [m3-expressive-typography-enhancer](file:///.claude/skills/design-skills/m3-expressive-typography-enhancer/SKILL.md): Advanced typography orchestration.

### Legacy Design References

- `design-critique-vision.md`: High-level principles for visual audits.
- `m3-atmospheric-backgrounds.md`: Formulas for bioluminescent and urban textures.
- `m3-design-system-generator.md`: Logic for M3 Expressive token scaffolding.
- `m3-spring-motion-choreography.md`: Easing curves and physics tokens.
- `ux-heuristic-audit.md`: Checklist for formal UX reviews.

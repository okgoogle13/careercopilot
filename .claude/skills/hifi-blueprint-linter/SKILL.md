---
name: hifi-blueprint-linter
description: Validates hi-fi wireframe blueprints against KR Solidarity v6.0 design system rules. Catches aesthetic drift, technical token violations, and lexical tone issues in markdown wireframe documents.
metadata:
  version: 2.0.0
  tags:
    - design-system
    - linting
    - wireframes
    - kr-solidarity
    - v6
---

# Hi-Fi Blueprint Linter (v2.0)

## Purpose

Keeps wireframe blueprint documents (`consolidated-hifi-wireframes.md`, per-screen `*-screen-hifi.md` files) aligned with the KR Solidarity v6.0 design canon. Prevents documentation drift as the system evolves.

Violations are categorised and tagged with `[DESIGN-DRIFT]` for traceability.

> **Design system**: KR Solidarity v6.0
> **Reference docs**: `references/tokens.md`, `references/archetypes.md`

---

## When to Use

- Before finalising or merging a new wireframe document
- After a design system version bump — to check for drift in existing blueprints
- When reviewing community-contributed design drafts
- Before implementation handoff — to confirm the schema is complete for developers

---

## Capabilities

- **Token validation**: Flag hardcoded hex values, deprecated token names, undefined tokens, and incorrect inline `rgba()` usage
- **Archetype enforcement**: Verify every component has a valid KR Solidarity archetype (Seed/Pebble/Lens/Jar/Cabinet/Stone)
- **Mode font rules**: Detect forbidden fonts per screen mode (`kr-dark`, `kr-expressive`, `kr-industrial`)
- **Shape compliance**: Flag uniform `border-radius` values where asymmetric archetype shapes are required
- **Asset token mapping**: Verify every `{KR-SOLID-XXX}` / `{KR-UI-XXX}` reference has a Motif Slots entry with z-index
- **Structural integrity**: Check required sections exist in each screen spec
- **ARIA/accessibility**: Flag invalid ARIA compound roles, missing focus states, colour-only indicators
- **Lexical tone**: Flag passive/corporate language, embedded self-scores, misspelled brand name
- **Anti-slop protocol**: Enforce hard bans (white backgrounds, `border-radius: 50%`, linear easing, etc.)

---

## Process

1. **Load references**: Read `references/tokens.md` and `references/archetypes.md` before scanning the target
2. **Parse screens**: If the target is a consolidated file (`consolidated-hifi-wireframes.md`), identify each `# SOURCE_FILE:` block and lint each screen separately
3. **Large file strategy**: For files over 2,000 lines, process in 800-line chunks. Track which screens have been covered.
4. **Run checks** in order:
   - Structural completeness (required sections present?)
   - Token audit (all `--sys-color-*` valid? any hardcoded hex/rgba?)
   - Archetype audit (all elements assigned? archetypes valid? shapes match?)
   - Mode font check (does screen mode match the fonts used?)
   - Asset token audit (every inline `{KR-*}` has a Motif Slots entry?)
   - ARIA/accessibility audit
   - Lexical audit (tone, brand name, embedded scores)
   - Anti-slop protocol (hard bans)
5. **Generate report**: Output a `[DESIGN-DRIFT]`-tagged markdown report categorised by Aesthetic / Technical / Lexical, with severity levels

---

## Violation Severity Levels

| Level | Meaning | Action required |
|---|---|---|
| 🔴 **High** | Blocks implementation handoff | Must fix before dev begins |
| 🟡 **Medium** | Significant drift from canon | Fix before final review |
| 🟢 **Low** | Minor inconsistency or tone issue | Fix in next revision pass |

---

## Violation Categories

### Aesthetic (AE)
Shape drift, archetype misassignment, mode font violations, overuse of uniform radii, hardcoded colours in CSS specs.

### Technical (TC)
Undefined or deprecated token names, missing asset token tables, invalid ARIA roles, missing structural `<h1>`, structural sections absent, `rgba()` instead of step tokens.

### Lexical (LX)
Passive/corporate language in screen copy or section headings, embedded self-assessment compliance scores inside blueprints, misspelled brand name (`Career Copilot` vs `CareerCopilot`), unapproved UI copy.

---

## Lint Rules Quick Reference

### Token rules
- ❌ Hardcoded hex (`#D4A84B`) → use `--sys-color-inkGold-base`
- ❌ `rgba(212, 168, 75, 0.2)` → use `--sys-color-inkGold-steps-20` (or equivalent step token)
- ❌ `color: white` → use `--sys-color-paperWhite-base`
- ❌ `--sys-color-error` → use `--sys-color-kr-charcoalRed-base` (not defined in tokens.json)
- ❌ Old names (`--sys-color-waratahRed`, `--sys-color-gumLeafGreen`) → see `references/tokens.md`
- ✅ All used tokens must appear in the screen's Color Palette table with hex value

### Shape rules
- ❌ `border-radius: 50%` → **Hard ban** (use `--sys-shape-sentryAvatar` = `98%` for avatars)
- ❌ Uniform radius (`border-radius: 16px`) on an archetype container → use asymmetric archetype value
- ❌ Invalid archetype label → must be one of: Seed / Pebble / Lens / Jar / Cabinet / Stone

### Mode font rules
- ❌ `Caveat` in any `kr-dark` screen (any sub-mode) → 🔴 High
- ❌ `Nabla` anywhere except documented hero accent moments → 🔴 High
- ❌ No variable font axes (`font-variation-settings`) on Fraunces → 🟡 Medium

### Asset rules
- ❌ `{KR-SOLID-XXX}` or `{KR-UI-XXX}` inline without a Motif Slots section entry → 🔴 High
- ❌ Motif asset at Z-3+ without documented exception → 🟡 Medium
- ❌ Asset referenced as prose description only (no token) → 🟡 Medium

### Structural rules
- ❌ Missing `## Motif Slots` section when assets are referenced → 🔴 High
- ❌ Missing `## Accessibility` section → 🟡 Medium
- ❌ Missing `## Shape Language` section → 🟡 Medium
- ❌ No `<h1>` declared in component structure → 🟡 Medium
- ❌ Compliance score table inside blueprint → 🟡 Medium (LX)

### Lexical rules
- ❌ `## Improvements (None Required)` → use `## Status: PRODUCTION READY — No Drift Detected`
- ❌ `Career Copilot` (spaced) → `CareerCopilot`
- ❌ Self-assessed 400/400 score blocks inside wireframe → move to `compliance-report.md`
- ❌ Passive corporate copy in subtitle/description fields → rewrite in active Solidarity register

---

## References

- [`references/tokens.md`](references/tokens.md) — Canonical token list, deprecated name mapping, mode font rules, anti-slop bans
- [`references/archetypes.md`](references/archetypes.md) — Archetype definitions, shape values, decision tree, valid blueprint schema, common misassignments
- [`shared-references/`](../shared-references/) — Shared canon documents (LANGUAGE_PROTOCOLS, BRAND_BRIEF)

---

## Output Format

```markdown
# Hi-Fi Blueprint Lint Report
**Skill**: `hifi-blueprint-linter`
**Target**: [filename]
**Design System**: KR Solidarity v6.0
**Date**: [date]

---

## Summary — Full File ([N] lines · [N] screens)

| Category | Total | Highest |
|---|---|---|
| Aesthetic | N | 🔴/🟡/🟢 |
| Technical | N | 🔴/🟡/🟢 |
| Lexical | N | 🟡/🟢 |
| **Total** | **N** | |

---

## Aesthetic Violations

### [DESIGN-DRIFT] AE-01 · [Description] · 🔴/🟡/🟢 [Severity]
> **Location**: `screen-name.md → Section → Element`
> **Found**: [what was found]
> **Expected**: [what should be there]
> **Fix**: [specific corrective action]

---

## Technical Violations
[same format]

## Lexical Violations
[same format]

## Coverage
[Table of all screens linted with pass/status]
```

---

## Integration

**Upstream** (what this linter reads):
- `ui-design-evaluator` → produces hi-fi wireframe screen files
- `wireframe-annotator` → produces annotated wireframes (pre-HiFi stage)

**Downstream** (what uses linter output):
- `component-spec-generator` → implementation blocked until linter passes
- `component-builder` → blocked on passing lint report

**Pipeline position**:
```
wireframe-annotator
  → ui-design-evaluator (generates HiFi blueprints)
    → hifi-blueprint-linter (this skill — validates blueprints) ← YOU ARE HERE
      → component-spec-generator (only if lint passes)
        → component-builder
```

---

**Version**: 2.0.0 | **Last Updated**: 2026-03-07 | **Mode**: KR Solidarity v6.0 Only
**Breaking changes from v1.0**: Brand name updated (Kerala Rage → KR Solidarity v6.0), archetype list updated (Slab/Banner removed), mode font rules added, severity levels added, references directory added.

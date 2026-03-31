---
title: Figma MCP Visual Sync Strategy
date: 2026-03-31
---

## Context
We want a custom MCP skill that mirrors the KR Solidarity design system inside the canonical Figma file. Rather than re-creating every page sequentially, the skill should learn from the most expressive pages (living style guide + a few complex workflows) and turn those learnings into a reusable rule set.

## Objective
Deliver a spec for a multi-phase sync flow that:

- establishes token/variable foundations by mining the living style guide
- maps component primitives and variants before tackling entire pages
- applies the learned patterns holistically across the remaining file
- finishes with a page-by-page verification sweep and exception register

## Phases

### 1. Discovery Debug
- Identify canonical token sources in code (tokens.json, CSS vars, TypeScript theme objects).
- Inspect the Figma file for existing naming conventions, components, mode scopes, and the page roster.
- Choose 3–5 “golden” pages (style guide, busy workflow, dashboard, motion/validation, hero) that expose broad visual vocabulary.
- Document the naming/scope rules gleaned from those pages to feed the rule engine.

### 2. Rule Extraction
- Translate tokens into Figma variable names, scopes, code syntax, and semantic alias hierarchy.
- Capture typography, spacing, shapes, and effect recipes that reappear across the chosen page samples.
- Catalog each reusable component primitive, its variant axes, and binding expectations (Strike buttons, March selects, etc.).
- Treat living style guide sections as system documentation, not literal screen clones.

### 3. System Build (Foundations → Components → Sections)
- Build or reconcile primitives first (variables, styles, effects, color modes) using the figma-generate-library rules.
- Create components/variants one at a time, validating structure/screenshots after each.
- Assemble layout patterns (headers, cards, tables, forms) using those components, binding to the tokens.
- Record any bespoke visuals as exceptions instead of forcing them into the system.

### 4. Holistic Application
- Apply the same rule set across the rest of the file by targeting recurrent section types rather than page order.
- Keep an exception register for page-specific art or layout breakpoints.
- Maintain a delta tracker so future syncs can diff token/component changes and revalidate selectively.

### 5. Validation Sweep
- Perform a per-page audit once the system is in place (metadata, screenshots, token bindings).
- Flag mismatches (missing components, drifted spacing, color mismatches) and resolve them using the recorded rules.
- Capture final screenshots + state register for the completed run and pack into artifact logs for user checkpoints.

## Next Steps
- Build the sync skill to follow these phases in sequential checkpoints (discovery -> foundations -> components -> sections -> validation).
- Surface decisions about the system (token map, exception register) during the user approval gates described in the Figma skill guides.
- Keep all generated state ledgers and IDs to enable idempotent resumes in subsequent runs.

---
name: m3-aesthetic-creator
description: Create comprehensive Material 3 Expressive aesthetic systems with explicit anti-slop safeguards, implementation tokens, and validation criteria.
metadata:
  version: 2.1.0
  tags:
    - design-system
    - m3-expressive
    - aesthetics
    - visual-language
---

# M3 Aesthetic Creator

## Purpose

Design a complete visual language using Material 3 Expressive principles, from concept through implementation notes.

Outputs should be expressive, intentional, and production-usable, not generic template aesthetics.

## When to Use

- User asks for a design aesthetic or visual direction.
- Team needs a new product/page-level visual language.
- Existing UI needs expressiveness uplift with M3 structure.
- You need a token-ready spec that engineers can implement.

## Scope

This skill covers:
- concept and emotional intent
- color, typography, shape, depth, and motion systems
- anti-slop quality gates
- implementation-ready token guidance

This skill does not cover:
- final production code for entire apps
- image generation prompts as the primary deliverable
- replacement of project-specific design canon

## Required References

Read before producing output:
- `references/anti-slop-guide.md`
- `references/m3-color-roles.md`
- `references/typography-guidelines.md`

## Core Principles

1. Emotional resonance first
- Every system needs a clear metaphor and intended emotional tone.

2. Distinctiveness over defaults
- Avoid generic font/color/layout choices that flatten brand identity.

3. Structured expressiveness
- Use M3 role architecture; do not improvise random tokens.

4. Accessibility is non-negotiable
- Meet WCAG AA minimum contrast in practical usage.

## Anti-Slop Guardrails

Never ship output with:
- generic default font stacks
- purple-on-white cliche gradients
- low-saturation timid palettes without intent
- symmetric, flat, center-only layouts for all contexts
- no depth/layering strategy

Must include:
- one explicit visual metaphor
- dominant color strategy
- hierarchy with strong type contrast
- differentiated shape language
- meaningful motion system

## Process

1. Discovery
- Define product context, user profile, and emotional target.

2. Concept framing
- Name the aesthetic and write a one-line metaphor.

3. Color system
- Define M3 color roles and tonal structure.
- Include rationale for emotional impact.

4. Typography system
- Choose display/body/supporting families.
- Specify role-based scale, weight ranges, and variable axes.

5. Shape language
- Define corner strategy, asymmetry policy, and component shape rules.

6. Depth and texture
- Define elevation/layer model and background texture guidance.

7. Motion language
- Define durations, easing, and interaction feedback patterns.

8. Validation
- Run anti-slop checklist and accessibility checks.

## Output Contract

Deliver sections in this order:

1. Aesthetic Overview
- name
- visual metaphor
- emotional intent
- audience/context

2. Color System
- M3 semantic roles
- tonal values
- contrast notes

3. Typography System
- font families and fallbacks
- type scale and hierarchy
- variable axis policy

4. Shape Language
- core geometry rules
- component archetype mapping

5. Depth and Texture
- elevation model
- layering map
- texture guidance

6. Motion Language
- easing curves
- duration scale
- interaction patterns

7. Implementation Notes
- CSS variable structure
- token mapping guidance
- rollout sequence

8. Validation Summary
- anti-slop pass/fail notes
- identified risks and mitigations

## Edge Cases & Fallbacks

- No brand direction provided:
  Propose 2 contrasting concepts and request decision.

- Existing design system constraints conflict with proposal:
  Preserve existing semantics and map expressiveness within constraints.

- Accessibility conflicts with high-expression palette:
  Keep metaphor, adjust tone/value to restore contrast compliance.

- Team cannot adopt variable fonts immediately:
  Provide static fallback weights while retaining hierarchy logic.

## Troubleshooting

### Output feels generic
- Increase contrast between display/body type.
- Reduce palette sprawl to stronger dominant/accent roles.
- Add asymmetric layout rules and depth patterns.

### Output looks expressive but hard to implement
- Convert prose rules into explicit tokens and role mappings.
- Add component-level examples for buttons/cards/forms.

### Contrast failures in dark surfaces
- Rebalance on-colors and container tones.
- Retest critical states (hover/focus/disabled/error).

### Motion feels noisy
- Reduce animated properties per interaction.
- Limit expressive easing to high-value transitions.

## Best Practices

- Keep concept narrative short and actionable.
- Use explicit constraints, not stylistic adjectives alone.
- Tie every expressive choice to user impact.
- Prefer tokenized decisions over one-off visual tweaks.

## Related Skills

- `m3-anti-slop-validator`
- `m3-expressive-ui-evaluator`
- `kerala-rage-typography-strategy`

---
name: kr-shapes
description: Enforce KR Solidarity shape tokens and archetype-safe morph behavior across React, CSS, Tailwind, and design specs.
metadata:
  version: 6.2.0
  tags:
    - shapes
    - design-tokens
    - m3-expressive
    - compliance
---

# KR Shapes

## Purpose

Canonical guidance for shape token usage in KR Solidarity UI.

This skill prevents generic geometry drift by enforcing:
- semantic shape tokens (no hardcoded radius values)
- asymmetric archetype geometry
- controlled morph states
- accessibility-safe interaction behavior

## When to Use

Invoke for any change that touches:
- `border-radius` in CSS/TSX
- Tailwind `rounded-*` classes
- component state morphing
- wireframe/component shape specs
- shape-related PR review

## Scope

This skill covers:
- shape token selection by archetype
- state morph rules
- code-level enforcement patterns
- reviewer checks and failure conditions

This skill does not cover:
- color palette decisions
- typography strategy
- asset generation workflows

## Canon Rules

Required:
- Use semantic `--shape-*` variables or approved helper functions.
- Preserve asymmetric geometry where archetype defines it.
- Keep Scaffold archetype immutable across states.

Banned:
- Hardcoded values like `8px`, `12px`, `50%` for component corners.
- Generic Tailwind `rounded-md|lg|xl` in production UI.
- Uniform corner geometry when asymmetric token exists.

## Archetype Mapping

1. Strike (decisive actions)
- Primary tokens: `blockRiot03`, `blockRiot03-pressed`, `blockRiot02`
- Typical components: primary buttons, urgent actions

2. March (navigation/expansion)
- Primary tokens: `pillMarch01`, `pillMarch01-pressed`, `pebbleSurge01`
- Typical components: nav chips, accordions, expanding controls

3. Placard (content surfaces)
- Primary tokens: `placardTorn01`, `placardTorn01-selected`
- Typical components: cards, panels, item containers

4. Megaphone (interruptive surfaces)
- Primary tokens: `megaphoneCut01`, `megaphoneCut01-loading`
- Typical components: modals, alerts, overlays

5. Scaffold (form infrastructure)
- Primary token: `scaffoldSlab01`
- Rule: no morphing, no alternate state radius

## Implementation Patterns

### React

```tsx
import { shapeVar } from '@/design/tokens/archetypes';

<button style={{ borderRadius: shapeVar('blockRiot03') }}>
  Apply
</button>
```

### Framer Motion

```tsx
<motion.button
  style={{ borderRadius: shapeVar('blockRiot03') }}
  whileTap={{ borderRadius: shapeVar('blockRiot03-pressed') }}
/>
```

### Tailwind-compatible pattern

```tsx
<button data-shape="blockRiot03" className="kr-shape-token" />
```

```css
.kr-shape-token[data-shape='blockRiot03'] {
  border-radius: var(--shape-blockRiot03);
}
```

## Review Checklist

- No hardcoded `border-radius` values.
- No banned generic `rounded-*` classes in production components.
- Scaffold remains invariant.
- Morph chain follows archetype states only.
- Component docs mention shape archetype explicitly.

## Failure Conditions

Flag as non-compliant when:
- any hardcoded radius appears in UI component code
- component uses circle geometry via `50%` without approved token
- morph transitions jump between unrelated archetypes
- shape tokens are referenced by deprecated names

## Process

1. Identify component intent (action, navigation, content, interruption, form).
2. Map to archetype.
3. Apply base token.
4. Apply allowed state tokens.
5. Validate against checklist.
6. Record compliance notes in PR/spec.

## Edge Cases & Fallbacks

- Unknown component intent:
  Use Placard as temporary default and add review note.

- Missing token helper import:
  Use direct CSS variable reference (`var(--shape-...)`) and schedule helper migration.

- Legacy component with many `rounded-*` classes:
  Replace incrementally by interaction-critical surfaces first (buttons, modals, forms).

## Troubleshooting

### Generic Tailwind radius keeps reappearing
- Add lint rule/search check for banned `rounded-*` classes.
- Introduce a codemod or targeted replacement checklist.

### Shape changes break interaction polish
- Verify morph chain is archetype-local.
- Reduce transitions to base/pressed/active first.

### Inputs visually drift from system
- Re-apply immutable Scaffold token.
- Remove hover/focus shape mutations from form controls.

## File References

- Token source: `frontend/src/design/tokens/tokens.json`
- Archetype helpers: `frontend/src/design/tokens/archetypes.ts`
- Generated CSS vars: `frontend/src/design/styles/design-tokens.css`
- Canon docs: `docs/design/01_CANON.md`, `docs/design/02_SYSTEM.md`, `docs/design/03_COMPONENTS.md`

## References

- Detailed legacy spec: `references/full-spec-v6.1.md`

## Related Skills

- `token-orchestrator`
- `kerala-rage-brand-enforcer`
- `m3-expressive-ui-evaluator`

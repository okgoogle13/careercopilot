# Style Guide Rubric v1

This rubric distills the benchmark expectations derived from the main frontend style guide and its M3 expressive validator panels.

## Derived From

- `frontend/src/features/style-guide/StyleGuide.tsx`
- `frontend/src/features/style-guide/M3ExpressiveComponents.tsx`

## Purpose

Use this rubric as the shared quality source for migration-kit benchmark bundles. It is not a route benchmark by itself. Route benchmarks translate these expectations into route-specific score floors, evidence, and rationale.

## Dimension Mapping

### Typography

Derived from `TYPE_SAMPLES` and the typography validator panels:
- display copy must create visible hierarchy, not flat enterprise defaults
- display/editorial usage should feel intentional without reducing trust
- utility and field text must remain readable, stable, and operational
- generic placeholder phrasing or visually timid type treatment should score down

### Shapes and Archetypes

Derived from `ARCHETYPE_MATRIX`:
- `Strike` should feel decisive and action-forward
- `March` should feel sequential and guided
- `Placard` should frame narrative content without becoming a generic card
- `Scaffold` should remain structural and static
- asymmetry is expected; perfect geometry or flattened defaults score down

### Colour

Derived from style-guide semantic token coverage:
- only semantic token intent carries into benchmarks
- demo swatch hex values in the style guide are documentation aids, not enforcement inputs
- contrast and emphasis should reflect KR Solidarity dark-mode expectations

### Motion

Derived from motion contract panels:
- motion must support emphasis, reveal, or state change
- auth and dashboard routes should show intent without theatrical overload
- reduced-motion-safe behavior is required for production use

### M3 Expressive Quality

Derived from the style guide gallery and expressive validator panels:
- screens should feel authored, not generic
- layout and emphasis should have memorable rhythm
- visual hierarchy must be legible at a glance

### Asset Usage

Derived from manifest-backed placement expectations:
- assets are optional unless a route benchmark requires them
- if used, they must be canonical, intentional, and compositionally justified
- decorative filler or manifest drift scores down immediately

### Proportions

Derived from the style guide’s shell and component composition:
- shell, headings, and supporting regions should balance at the current density
- spacing rhythm should feel deliberate rather than utility-default
- forms and dashboard cards should not collapse into uniform boxes

### Anti-Slop

Derived from M3 expressive and layout-slop validators:
- avoid generic SaaS composition
- avoid default font stacks and predictable spacing grids
- avoid emotionally flat screens that technically pass lint and token checks

### UX Copy

Derived from the route benchmark rationale rather than the style guide page itself:
- labels and helper copy must be direct
- CTAs must be specific
- status and error copy must feel intentional, not filler

## Benchmark Translation Rules

- Auth routes inherit the same benchmark family unless their interaction model diverges materially.
- Route-specific benchmark bundles must keep the common dimension names and score-floor shape.
- Benchmarks may use justified asset absence; they do not force decorative assets onto screens that do not need them.

# KR Solidarity: Typography Standards (v1.0)

> **Status:** Canonical Supplement
> **Depends On:** [01_CANON.md](01_CANON.md), [02_SYSTEM.md](02_SYSTEM.md), [03_COMPONENTS.md](03_COMPONENTS.md)
> **Implementation Sources:** `frontend/src/design/tokens/tokens.json`, `frontend/src/design/styles/design-tokens.css`

---

## Purpose

This document bridges two needs:

- the **repo-specific KR Solidarity typography system** already defined in canon, tokens, and CSS
- a **portable implementation standard** for hierarchy, variable axes, readability, and audit checks

When docs disagree:

1. `tokens.json` and `design-tokens.css` are implementation truth
2. `01_CANON.md` and `02_SYSTEM.md` are design-policy truth
3. this file is the operational bridge for designers, frontend engineers, and AI agents

Rule:
- use this file for typography decisions
- use [02_SYSTEM.md](02_SYSTEM.md) for the system-level rationale
- use tokens, not ad hoc font declarations, in production code

---

## 1. Font Stack Policy

### Approved Primary Families

| Role | Canonical Family | Primary Use |
| :--- | :--- | :--- |
| Primary UI | `Work Sans` | body, labels, form copy, navigation, helper text |
| Display | `Fraunces` | display headlines, section emphasis, expressive contrast |
| Technical | `JetBrains Mono` | metadata, measurements, IDs, score labels, technical annotations |

### Conditional Families

These are allowed only when the screen concept and benchmark explicitly justify them.

| Family | Use Constraint |
| :--- | :--- |
| `Libre Bodoni` | proclamation moments, editorial hero lines, rare high-authority headings |
| `Caveat` | curator notes, human annotation accents, not core UI copy |
| `Nabla` | one-word hero accent only, never default UI text |

### Banned Families

- `Inter`
- `Roboto`
- `Arial`
- `Sora`
- `Plus Jakarta Sans`

Rule:
- default to `Work Sans`
- escalate to `Fraunces` for expressive hierarchy
- use `JetBrains Mono` only when the content is genuinely technical, numeric, or evidentiary

---

## 2. Type Role System

KR Solidarity does not use the full Material 3 role table directly in code. The canonical implementation uses a smaller tokenized scale:

| KR Token | Size | Typical Role |
| :--- | :--- | :--- |
| `--sys-type-scale-micro` | `8px` | micro metadata, tiny hints |
| `--sys-type-scale-small` | `12px` | captions, quiet labels, dense supporting text |
| `--sys-type-scale-body` | `16px` | default body copy and form content |
| `--sys-type-scale-subhead` | `24px` | card titles, section headers |
| `--sys-type-scale-headline` | `48px` | page-level headers |
| `--sys-type-scale-display` | `72px` | large display statements |
| `--sys-type-scale-hero` | `144px` | manifesto hero lines, extremely rare |

### M3 Role Mapping Bridge

Use this when translating generic specs into KR Solidarity.

| Generic Role | KR Default Mapping |
| :--- | :--- |
| Display Large / Medium | `display` or `hero` |
| Display Small / Headline Large | `headline` |
| Headline Medium / Small | `subhead` |
| Title Large / Medium | `subhead` or strong `body` depending on density |
| Title Small / Label Large | `small` with stronger weight |
| Body Large | `body` |
| Body Medium / Label Medium | `small` |
| Body Small / Label Small | `micro` or `small` |

Rule:
- do not force all 15 M3 type roles into the product
- map them into the smaller KR scale unless a screen-specific benchmark requires more granularity

---

## 3. Hierarchy Rules

### Required Contrast

- heading-to-body size contrast should usually be at least `3x`
- hero-to-metadata contrast should usually be at least `6x`
- weight contrast should be deliberate, not incremental
- avoid weak steps like `400` to `500` as the only visible distinction in a major hierarchy

### Recommended Contrast Modes

| Pattern | Recommended Use |
| :--- | :--- |
| `900` vs `400` | bold declaration vs stable explanation |
| `700` vs `400` | standard product hierarchy |
| `900` vs `100` | extreme variable contrast in hero/editorial moments only |
| `600` vs `400` | compact UI hierarchy where clarity matters more than drama |

### Spacing Rules

- display text may tighten tracking slightly
- body text should remain neutral to slightly open
- small technical labels may open tracking for clarity

Default guidance:

| Context | Letter Spacing |
| :--- | :--- |
| display | `-0.02em` to `0em` |
| subhead | `-0.01em` to `0em` |
| body | `0em` to `0.01em` |
| small / mono | `0.01em` to `0.03em` when clarity improves |

---

## 4. Variable Axis Strategy

KR Solidarity uses variable typography as a controlled expressive system, not a novelty layer.

### Canonical Variable Patterns

From tokens:

| Pattern | Canonical Axis Intent | Typical Use |
| :--- | :--- | :--- |
| `solidarityProtest` | `wght: 900`, `wdth: 120` | declarative collective headers |
| `laborExploitationPressure` | `wght: 900`, `wdth: 75` | pressure, scarcity, compression |
| `melancholyLonging` | `wght: 475`, `wdth: 98` | reflective or in-between states |
| `identityAssertion` | `wght: 700`, `wdth: 110` | identity, confidence, stance |
| `scrollPressure` | `wght: 300`, `wdth: 100` | interaction-driven escalation |
| `extremeVariableContrast` | `wght: 900` with `wghtSecondary: 100` | poster tension, hero contrast |

### Axis Usage Rules

- `wght` is the primary expressive lever
- `wdth` is allowed when it clarifies emotional stance or spatial pressure
- `opsz` should remain enabled globally via `font-optical-sizing: auto`
- decorative axes like `SOFT`, `WONK`, or handwritten instability should remain headline-only and benchmark-justified
- body copy must not depend on expressive axes for readability

### Route Safety

- trust-heavy or transactional routes should use restrained axis changes
- forms, auth, settings, and profile surfaces must stay readability-first
- dashboards and technical views should prefer weight and family contrast over theatrical axis motion

---

## 5. Emotional Register Rules

Typography intensity is controlled by route family, not designer whim.

| Register | Typography Policy |
| :--- | :--- |
| `Possibility` | assertive display use allowed at headline level |
| `Direct Action` | moderate contrast, CTA clarity first |
| `Revelation` | diagnostic hierarchy, restrained body styling |
| `Craft` | editorial hierarchy with high legibility in drafting surfaces |
| `Reflection` | calm, restrained, trust-heavy, minimal flourish |

Rule:
- the route register overrides generic typography instincts
- expressive typography belongs mainly in headings, summaries, and state markers
- body text remains stable in every register

---

## 6. Pairing Patterns

### Canonical Pairings

| Pairing | Use |
| :--- | :--- |
| `Fraunces` + `Work Sans` | default expressive editorial pairing |
| `Work Sans` + `JetBrains Mono` | dashboards, evidence, metrics, technical detail |
| `Libre Bodoni` + `Work Sans` | proclamation or hero framing only |

### Pairing Rules

- prefer strong family contrast between display and body
- avoid decorative-on-decorative pairings
- avoid monotype systems unless the screen is intentionally restrained
- reserve `JetBrains Mono` for evidence, not paragraphs

---

## 7. Accessibility and Density Constraints

- body copy should remain within comfortable reading density
- helper text must prioritize trust and comprehension over style
- small text should not rely on ultra-light weight
- decorative typography must never carry essential meaning by itself
- if a hierarchy choice lowers task clarity, it fails even if it is visually interesting

### Density Defaults

| Content Type | Recommended Line Height |
| :--- | :--- |
| display | `1.0` to `1.2` |
| headline / subhead | `1.2` to `1.35` |
| body | `1.5` to `1.6` |
| dense UI / mono labels | `1.3` to `1.5` |

---

## 8. Implementation Rules

### Do

- use `--sys-type-*` tokens for font families, scale, and emotional patterns
- prefer shared typography classes or component-level token mapping over one-off font declarations
- keep public docs in plain UI language even when internal archetypes inform emphasis
- audit typography by route family and register

### Do Not

- introduce new font families without canon approval
- use banned fonts as “temporary” placeholders
- apply expressive axes to body text by default
- treat legacy CSS as stronger authority than tokens
- use typography theatrics to compensate for weak layout hierarchy

### Authority Note

If `kerala-rage.css` or older generated docs conflict with tokens and current canon:

1. follow `tokens.json`
2. follow `design-tokens.css`
3. treat older stylesheet conventions as legacy until reconciled

---

## 9. Audit Checklist

- [ ] Uses approved font families only
- [ ] Maps generic type roles into the KR scale instead of inventing a parallel scale
- [ ] Preserves readable body typography
- [ ] Uses variable axes intentionally, not decoratively
- [ ] Matches route emotional register
- [ ] Maintains strong heading-to-body contrast
- [ ] Uses `JetBrains Mono` only for technical/evidentiary content
- [ ] Keeps conditional families rare and justified
- [ ] Uses tokens as implementation truth
- [ ] Avoids legacy or banned font drift

---

## 10. Default Recommendations

When no stronger benchmark exists, use:

- `Work Sans` for UI and body
- `Fraunces` for section or page emphasis
- `JetBrains Mono` for metrics and metadata only
- `body` for reading text
- `subhead` for local section headers
- `headline` for page titles
- restrained typography on trust-heavy surfaces
- expressive contrast only where hierarchy or emotional stance benefits from it

---

**Last Updated:** 2026-03-25
**Applies To:** Product UI, wireframes, design docs, AI prompting, typography audits

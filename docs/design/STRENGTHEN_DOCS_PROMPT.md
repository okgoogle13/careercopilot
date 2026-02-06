# Design Reset: Validate & Strengthen with M3 Expressive Skills

## Design Direction (Critical Context)

**Northcote Design System** = **Political Street Art + M3 Expressive**

**Goal:** Use this prompt to **reset and refine** the design system away from Victorian/colonial aesthetics.

**Inspiration:** Peter Drew's "AUSSIE" poster series demonstrates the aesthetic direction:
- Bold wheat-paste portraits on weathered urban surfaces
- Sepia/ochre tones, high contrast silhouettes
- Dignified representation of historical migrants
- Street-level placement (brick walls, corrugated iron, peeling paint)

**Design Principles to Validate:**
- ✅ **Political street art aesthetic** — bold, unapologetic, solidarity-driven
- ✅ **Urban textures** — weathered surfaces, lived-in environments, NOT pristine galleries
- ✅ **Material 3 Expressive** — semantic tokens, spring physics motion, accessible dark UI
- ✅ **Migrant-centered** — built for people navigating systems not built for them
- ✅ **Contemporary, not nostalgic** — present-tense solidarity, not museum framing

**What to AVOID (Critical for Reset):**
- ❌ Victorian/colonial framing (specimens, cabinets, naturalist aesthetics)
- ❌ Australian flora/fauna as primary motif (Kookaburra, Waratah, Banksia, Wattle)
- ❌ Generic street art (graffiti tags, abstract murals without political message)
- ❌ Decorative botanical motifs

---

## Goal: Reset & Validate Design with M3 Expressive

Use cleaned-up M3 skills to:
1. **Reset design direction** away from Victorian/colonial/botanical aesthetics
2. **Validate M3 Expressive compliance** (typography, motion, tokens)
3. **Ensure docs provide clear, actionable guidance** for political street art aesthetic

---

## Critical Validations Needed

### 1. Typography Doc (`02-typography.md`)

**Current fonts:** Bebas Neue (display), Space Grotesk (headers), Inter (body), JetBrains Mono (data)

**M3 Expressive compliance check:**

| Requirement | Current State | Action Needed |
|-------------|---------------|---------------|
| **No forbidden fonts alone** | ⚠️ Inter used for body | Verify Inter is paired with distinctive display (Bebas Neue) OR replace with Plus Jakarta Sans Variable |
| **Variable fonts** | ❌ Not specified | Add variable font implementation guidance |
| **Weight contrast ratios** | ❌ Not documented | Specify 3x+ ratio (e.g., Bebas Neue 700 vs Inter 300) |
| **Optical sizing** | ❌ Not mentioned | Add `font-optical-sizing: auto` requirement |
| **Emotional tone** | ❌ Not mapped | Specify "confident-professional" or "bold-contemporary" for CareerCopilot |
| **M3 type scale** | ⚠️ Partial (mentions sizes) | Add full M3 type scale table (Display Large 57px → Body Small 12px) |
| **Spring physics motion** | ⚠️ Generic transitions | Replace weight shift (500→600) with M3 spring easing `cubic-bezier(0.34, 1.56, 0.64, 1)` |

**Skills to apply:** `m3-expressive-typography-enhancer` + `m3-anti-slop-validator`

---

### 2. Overview Doc (`00-overview.md`)

**Current state:** May contain Victorian/colonial/botanical references that need reset

**Design reset validation:**

| Issue | Description | Action Needed |
|-------|-------------|---------------|
| **Victorian/colonial remnants** | Check for "Curio", "specimen", "cabinet", "naturalist" framing | Remove all Victorian/colonial language and framing |
| **Botanical motif overuse** | Endemic species (Kookaburra, Waratah, Banksia) as primary visual identity | Replace with political street art aesthetic (inspired by AUSSIE posters) |
| **Vague guidance** | "Organic asymmetry" lacks concrete examples | Add specific radius token examples (pebble: `20px 6px 16px 28px` vs uniform `8px`) |
| **Urban context missing** | Needs positive guidance on "street-level placement" | Add examples: weathered brick, corrugated iron, peeling paint, lived-in surfaces |
| **Density tier clarity** | "Bold contrast" vs "High Clarity" tension unclear | Define when to use bold political imagery vs minimal functional UI |
| **Dark mode warmth** | Not addressed | Specify how to preserve warmth in Asphalt Black `#1A1714` + Paper White `#F5F0E8` with ochre/sepia tones |

**Skill to apply:** `brand-brief-optimizer`

---

### 3. Voice Doc (`04-voice.md`)

**Current state:** Well-structured 3-tier system (T1 functional, T2 personality, T3 depth)

**Brand brief applicability check:**

| Issue | Description | Action Needed |
|-------|-------------|---------------|
| **Tier clarity** | ✅ T1/T2/T3 system is clear | No action needed |
| **Humor boundaries** | ⚠️ Says "never joke in errors" but T2 examples show wry tone | Add decision tree: when is wry tone OK vs when to be purely functional? |
| **Accessibility** | ❌ No guidance for screen readers or non-English speakers | Add voice guidelines for ARIA labels, alt text, plain language requirements |
| **Migrant-centered language** | ✅ Strong examples (Centrelink, selection criteria) | Verify consistency across all tiers |

**Skill to apply:** `brand-brief-optimizer`

---

### 4. Components Doc (`03-components.md`)

**Current state:** Token-aligned component catalog (Pebble, Lens, Stone, Leaf, Seed, Sentry)

**M3 Expressive motion check:**

| Component | Current Motion | M3 Expressive Requirement | Action Needed |
|-----------|----------------|---------------------------|---------------|
| **Pebble (Button)** | ✅ Bloom effect (lift + scale) | Spring physics on hover | Verify easing curve is `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| **Stone (Card)** | ✅ Unfold (lift + shadow + weight) | Multi-property transitions | Verify duration tokens (250-400ms) |
| **Hero Reveal** | ✅ Overshoot animation | Emphasized decelerate easing | Verify matches M3 motion tokens |

**Skill to apply:** `m3-anti-slop-validator` (motion validation)

---

## Token-Efficient Execution Prompt

```
Using m3-anti-slop-validator, m3-expressive-typography-enhancer, and brand-brief-optimizer:

DESIGN RESET GOAL: Validate docs have moved away from Victorian/colonial/botanical aesthetics
toward political street art + M3 Expressive (inspired by Peter Drew AUSSIE posters).

1. Validate docs/design/02-typography.md
   - Check: Inter pairing, variable fonts, weight contrasts, optical sizing, M3 type scale
   - Output: Violations only + specific additions needed (diff format)

2. Validate docs/design/00-overview.md (CRITICAL FOR RESET)
   - Check: Victorian/colonial language remnants ("Curio", "specimen", "cabinet")
   - Check: Botanical motif overuse (Kookaburra, Waratah, Banksia as primary identity)
   - Check: Vague "organic asymmetry", urban texture guidance, density tier clarity
   - Output: Coherence score + design reset gaps (what needs removing/replacing)

3. Validate docs/design/04-voice.md
   - Check: Humor boundaries, accessibility voice, tier system edge cases
   - Output: Coherence score + decision framework gaps

4. Validate docs/design/03-components.md
   - Check: M3 spring physics easing, duration tokens, motion principles
   - Output: Motion violations + M3 compliance gaps

Format: Line-specific recommendations. Focus on gaps and what needs resetting.
```

**Expected token usage:** ~12-15k total

---

## Success Criteria (Design Reset Complete)

- ✅ **Overview doc has NO Victorian/colonial language** ("Curio", "specimen", "cabinet" removed)
- ✅ **Overview doc has NO botanical motifs as primary identity** (Kookaburra, Waratah, Banksia replaced)
- ✅ **Overview doc defines political street art aesthetic** (inspired by AUSSIE posters, NOT centered on them)
- ✅ **Overview doc scores 80+ coherence** with concrete examples and decision frameworks
- ✅ **Typography doc includes M3 type scale** + variable font guidance + weight contrast ratios
- ✅ **Voice doc has decision frameworks** for humor boundaries + accessibility
- ✅ **Components doc uses M3 spring physics** easing consistently
- ✅ **All docs align with political street art + M3 Expressive** direction

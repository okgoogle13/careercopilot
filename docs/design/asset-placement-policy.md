# Asset Placement Strategy in Design Automation Workflow

**Version**: 1.1.0
**Last Updated**: 2026-03-07
**Canonical Reference**: Design Workflow 2026 > Asset Placement

---

## Overview

This document defines **when** and **how** Kerala Rage (kr-solidarity) assets are selected and placed during the automated design workflow. Asset placement is a **deterministic, scored process** that occurs in Phase 4 (UI Specification) of the Design Workflow 2026, ensuring consistency, token compliance, and manifest integrity.

**Key Principles:**
- **Deterministic scoring** (100-point rubric) ensures predictable, repeatable asset selection
- **Semantic token compliance** (`--sys-color-*` variables only, never hardcoded hex)
- **Manifest integrity** (all asset_id values must exist in manifest)
- **Cultural sensitivity** (restricted use of devotional, resistance, and Aboriginal Flag elements)
- **Responsive degradation** (mobile removes decorative assets, retains structural layers)

---

## When Assets Are Placed (Workflow Timeline)

Asset placement happens in **Phase 4 (UI Specification)** — not during wireframing. Wireframes create placeholder slots; HiFi specs resolve them deterministically.

### Phase 1: Research & Briefing
- **NO asset selection**
- Establish emotional register for screens (Defiance, Trust, Possibility, etc.)
- Define page purposes and success metrics

### Phase 2: Ideation & Flows
- **NO asset selection**
- Define page purposes and user journeys
- Identify key interaction points

### Phase 3: Wireframing (LOW-FIDELITY)
**Tool**: `wireframe-annotator` skill or `prompts/library/wireframes-lowfi.md`

**Action**: Generate `<assets>` XML blocks with `TODO[asset]` markers:

```xml
<assets>
hero_background [Z-0]:
  - TODO[asset]: Select from KR-SOLID-021 to KR-SOLID-030 (devotional/16:9)
  - token: --sys-color-asphaltBlack (fallback)
  - layer: substrate

hero_overlay [Z-1]:
  - TODO[asset]: Abstract motif overlay
  - token: --sys-color-primary-40
  - opacity: 0.6
  - layer: atmospheric

hero_accent [Z-3]:
  - asset_id: KR-UI-016 (corner accent SVG)
  - token: --sys-color-kr-ink-gold
  - placement: top-right corner
  - layer: ui-kit
</assets>
```

**Output**: Wireframes with layer intent only (Z-index, placement hints, semantic purpose) — **NO final asset_id assignments yet**

**Z-Index Layer Convention**:
- **Z-0**: Substrate/base texture (background canvas)
- **Z-1–2**: Atmospheric/motif overlays
- **Z-3+**: UI foreground accents and focal cues

---

### Phase 4: UI Specification (HIGH-FIDELITY)
**Tool**: `asset-placement-strategy` skill

**Action**: Resolve all `TODO[asset]` markers using deterministic scoring rubric (see Section 3)

**Input Sources**:
1. Wireframe `<assets>` block (layer intent, z-index, placement hints)
2. Page-by-page asset guide (`docs/design/06b-asset-placement.md`): emotional register, asset density
3. Kerala Rage manifest (`kerala-rage-kr-solidarity-manifest.json`): available assets, categories, aspect ratios
4. Hero registry (`kr-solidarity-hero-registry.json`): pre-composed hero stacks

**Output**: Fully specified asset_id assignments with:
- Valid manifest asset_id (e.g., `KR-SOLID-033`)
- Semantic color token (e.g., `--sys-color-solidarityRed`)
- Opacity value (e.g., `0.25`)
- Blend mode (e.g., `screen`, `overlay`, `color-dodge`)
- Z-index (e.g., `2`)
- Position (e.g., `center`, `cover`, `left`)

**Pass Threshold**: ≥90 points on 100-point rubric (see Section 3)

---

### Phase 5: Accessibility Audit
- Validate asset color contrast (WCAG 2.2 AA)
- Ensure decorative assets don't interfere with focus indicators
- Verify symbolic anchors have 24px clearance from interactive elements

---

### Phase 6: Handoff
**Tools**:
- `component-builder` skill: Consumes resolved asset specs, generates React components
- `ui-design-evaluator` skill: Validates token compliance post-build

**Actions**:
1. Export design tokens to Figma (via `sync-tokens-to-figma-vars.mjs`)
2. Convert design to React via `figma-to-page` skill
3. Generate SVG primitives via `kr-svg` skill
4. Validate component compliance via `ui-design-evaluator` + `m3-expressive-ui-evaluator`

---

## How Assets Are Selected (Deterministic Scoring)

Asset selection uses a **100-point scoring rubric** to ensure deterministic, repeatable results.

### Scoring Algorithm

| Criterion | Max Points | Evaluation Logic |
|-----------|------------|------------------|
| **Wireframe Alignment** | 35 | • Z-index matches layer intent (10 pts)<br>• Aspect ratio fits slot dimensions (10 pts)<br>• All TODO[asset] markers resolved (10 pts)<br>• No layer conflicts (e.g., 2 substrates at Z-0) (5 pts) |
| **Token Compliance** | 25 | • Zero hardcoded hex colors (15 pts)<br>• Semantic correctness (e.g., `--sys-color-solidarityRed` for CTA, not backgrounds) (10 pts) |
| **Manifest Validity** | 20 | • All asset_id values exist in manifest (10 pts)<br>• Category alignment (ui-kit vs. devotional vs. abstract) (10 pts) |
| **Hero Depth Intent** | 20 | • Composition uses 3+ layers (10 pts)<br>• Lighting/halo logic (accent + opacity create depth) (10 pts) |

**Pass/Fail**: ≥90 points = PASS, <90 = FAIL (requires manual review)

---

## Full Manifest Coverage Policy (Hard Rule)

This rule is **mandatory** for all runs of `asset-placement-strategy`.

1. Every asset in `frontend/public/assets/kerala-rage-kr-solidarity-manifest.json` must be accounted for.
2. An asset is accounted for only if it is either:
   - placed in at least one `<slot>` across the 11 wireframes, or
   - listed in `unused_assets` with an explicit reason.
3. `TODO[asset]` resolution must prioritize compatible assets that have not yet been used.
4. If unused assets still have compatible slots, the report must propose:
   - additional placements in existing slots, or
   - extra slot proposals for relevant wireframes.
5. A run fails policy if any manifest asset is in neither `used_assets` nor `unused_assets`.

Valid `unused_assets.reason` examples:
- `No compatible slot at current scope`
- `Compatible slot(s) exist but slot capacity is limited at current scope`
- `Semantic mismatch with current wireframe intents`

### Required Placement Report Fields

The aggregate report must include:

```json
{
  "total_assets": 87,
  "used_assets": [{ "asset_id": "KR-SOLID-021", "placed_in": ["01_landing.xml::hero_background"] }],
  "unused_assets": [{ "asset_id": "KR-SOLID-045", "reason": "No compatible slot at current scope" }],
  "proposed_additional_placements": [{ "asset_id": "KR-SOLID-045", "candidate_slots": ["02_auth.xml::background_accent"] }]
}
```

### Compliance Gate
- Progressive manifest target: `Batch N: slots_filled * 1.44` (rounded) for interim batch pass checks.

- `all_assets_accounted_for` must be `true`.
- `used_assets.length + unused_assets.length` must equal `total_assets`.
- If `all_assets_accounted_for=false`, placement output is non-compliant and cannot pass automation gates.

---

### Hard Constraints

**1. Semantic Tokens Only**
- Use `--sys-color-*` and `--sys-type-*` variables exclusively
- **NEVER** use hardcoded hex values (e.g., `#1A1A1A`, `#F14714`)

**2. Respect Z-Index Layer Conventions**
- **Z-0**: Substrate/base texture (KR-SOLID-021 to KR-SOLID-040)
- **Z-1–2**: Atmospheric/motif overlays (KR-SOLID-002 to KR-SOLID-009, KR-SOLID-036 to KR-SOLID-037)
- **Z-3+**: UI foreground accents (KR-UI-001 to KR-UI-038)

**3. Cultural Sensitivity Constraints**

| Asset Type | Restriction | Allowed Context |
|------------|-------------|-----------------|
| **Devotional** (KR-SOLID-010 to KR-SOLID-014) | Limited to spiritual/cultural layers | Hero compositions on Landing, Analysis Dashboard, Dashboard Overview |
| **Resistance** (KR-SOLID-019 to KR-SOLID-032) | Hero compositions only | Cannot be used as UI accents or small-scale elements |
| **Aboriginal Flag Colors** (`aboriginalFlagRed`, `aboriginalFlagYellow`, `aboriginalFlagBlack`) | **Restricted** to First Nations solidarity contexts | Explicit First Nations content only (e.g., KR-SOLID-030: First Nations placard) |

**4. Responsive Degradation**

| Viewport | Strategy | Asset Behavior |
|----------|----------|----------------|
| **Desktop (≥1440px)** | Full asset presence | All substrate, atmospheric, and UI accent layers visible |
| **Tablet (768-1439px)** | Moderate degradation | Substrate opacity reduced 50%, grit particle count reduced 50%, symbolic anchor opacity reduced 30% |
| **Mobile (<768px)** | Aggressive simplification | **Remove** all decorative substrate layers (KR-SOLID-*), **Retain** structural UI accents (KR-UI-004 grid, KR-UI-005 grain) at 50% opacity, **Remove** symbolic anchors entirely |

**Implementation Example**:
```css
/* Desktop (default) */
.substrate-layer {
  opacity: var(--substrate-opacity, 0.25);
}

/* Tablet */
@media (max-width: 1439px) {
  .substrate-layer {
    opacity: calc(var(--substrate-opacity, 0.25) * 0.5);
  }
  .atmospheric-layer {
    --grit-particle-count: 50%;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .substrate-layer,
  .symbolic-anchor {
    display: none;
  }
  .structural-ui-accent {
    opacity: 0.5;
  }
}
```

---

## Page-Specific Asset Rules

Reference from `docs/design/06b-asset-placement.md`:

| Page | Emotional Register | Asset Density | Substrate | Atmospheric | UI Accents | Symbolic Anchors |
|------|-------------------|--------------|-----------|-------------|------------|------------------|
| **Landing** | Defiance | Maximum | KR-SOLID-033 (22-25%) | KR-SOLID-011 (12-18%) | KR-UI-001, KR-UI-002, KR-UI-003 | ✅ Allowed (Z-1 only) |
| **Auth** | Trust | Minimal | KR-SOLID-033 (15%) | None | KR-UI-002 (halo, subtle) | ❌ Forbidden |
| **Onboarding** | Possibility | Structural | None | KR-UI-005 (charcoal paper) | KR-UI-004, KR-UI-035 | ❌ Forbidden |
| **Ingestion** | Gravity | Structural + Functional | None | KR-UI-006 (blueprint) | KR-UI-007 (stamp), KR-UI-021 | ❌ Forbidden |
| **Analysis Dashboard** | Revelation | Structural | None | KR-UI-004 (grid) | KR-UI-002 (gauge), KR-UI-024, KR-UI-022 | ✅ Allowed (Z-2) |
| **Opportunity Feed** | Discovery | Moderate | KR-SOLID-033 (18%) | None | KR-UI-001, KR-UI-020 | ❌ Forbidden |
| **Kanban Board** | Control | Structural | None | KR-UI-005 | KR-UI-001, KR-UI-023, KR-UI-016 | ❌ Forbidden |
| **Editor** | Craft | Minimal | None | KR-UI-005 (subtle grain) | KR-UI-004 (grid, 5%) | ❌ Forbidden |
| **Studio Designer** | Refinement | Structural + Functional | None | KR-UI-005 (grain), KR-UI-004 (toggles red) | KR-UI-007, KR-UI-022 | ❌ Forbidden |
| **Settings** | Storage | Structural | None | KR-UI-005, KR-UI-006 | KR-UI-029 (avatar), KR-UI-028 (divider) | ❌ Forbidden |
| **Dashboard Overview** | Altitude | Maximum | KR-SOLID-033, KR-SOLID-011 | KR-SOLID-029 | KR-UI-001 (parallax), KR-UI-002, KR-UI-022 | ✅ Allowed (Z-1/Z-2) |
| **404 Error** | Disorientation | Hero Illustration | None | KR-UI-005, KR-UI-009 | KR-UI-034 (404 illustration) | ❌ Forbidden |

### Symbolic Anchor Rules

**Allowed Pages**: Landing, Analysis Dashboard, Dashboard Overview
**Z-Layer Constraint**: Z-1 or Z-2 only (never Z-0 substrate or Z-3 UI layer)
**Minimum Clearance**: 24px from interactive elements
**Preferred Positions**: Corners, sidebars, headers (not center blocking content)

**Example**:
```xml
<assets>
symbolic_anchor [Z-1]:
  - asset_id: KR-SOLID-010 (Devotional cultural anchor)
  - token: --sys-color-inkGold
  - opacity: 0.35
  - placement: top-left corner
  - clearance: 24px
  - layer: spiritual
</assets>
```

---

## Hero Composition Patterns

Three standardized patterns from `assets/gemini_hero_composition_brief.md`:

### Pattern A: Industrial Resistance (3 layers)

```
[Z-0] Substrate: rusted iron / weathered brick
      Asset IDs: KR-SOLID-038 (Melbourne laneway), KR-SOLID-040 (woven linen)
      Opacity: 1.0
      Blend: normal

[Z-1] Resistance focal: activist silhouette / collective hands
      Asset IDs: KR-SOLID-019 (collective uprising), KR-SOLID-020 (resistance portrait), KR-SOLID-041 (industrial collective)
      Opacity: 1.0
      Blend: normal

[Z-2] Atmospheric glue: wet pavement / film grain
      Asset IDs: KR-SOLID-036 (asphalt grain), KR-SOLID-037 (wet pavement)
      Opacity: 0.15-0.30
      Blend: screen / overlay
```

---

### Pattern B: Landmark Identity (4 layers)

```
[Z-0] Substrate: Melbourne landmark
      Asset IDs: KR-SOLID-021 (Flinders Street night), KR-SOLID-022 (Flinders Street solidarity)
      Opacity: 1.0
      Blend: normal

[Z-1] Atmospheric fog: urban steam / asphalt grain
      Asset IDs: KR-SOLID-036 (asphalt grain), KR-SOLID-037 (wet pavement)
      Opacity: 0.25-0.35
      Blend: overlay

[Z-2] Cultural element: elephant / devotional
      Asset IDs: KR-SOLID-010 (devotional anchor), KR-SOLID-033 (Kerala elephant)
      Opacity: 1.0
      Blend: normal

[Z-3] Resistance element: subtle overlay
      Asset IDs: KR-SOLID-027 (activist fist), KR-SOLID-028 (collective hands)
      Opacity: 0.40-0.60
      Blend: multiply / normal
```

---

### Pattern C: Tricolor Solidarity (4 layers)

```
[Z-0] Substrate: texture base
      Asset IDs: KR-SOLID-038 (Melbourne laneway), KR-SOLID-039 (night pylon), KR-SOLID-040 (woven linen)
      Opacity: 1.0
      Blend: normal

[Z-1] waratahRed resistance: left position
      Asset IDs: KR-SOLID-041 (industrial collective), KR-SOLID-042 (digital sovereignty)
      Token: --sys-color-solidarityRed
      Opacity: 0.65
      Blend: normal
      Position: left

[Z-2] kr-ink-gold cultural: right position
      Asset IDs: KR-SOLID-033 (Kerala elephant), KR-SOLID-034 (Kerala landscape)
      Token: --sys-color-inkGold
      Opacity: 0.55
      Blend: normal
      Position: right

[Z-3] gumLeafGreen atmospheric: full cover
      Asset IDs: KR-SOLID-006 (abstract solidarity), KR-SOLID-008 (light burst)
      Token: --sys-color-kr-activistSmokeGreen
      Opacity: 0.12
      Blend: screen / overlay
      Position: cover
```

---

### Blend Mode Standards

| Layer Type | Z-Index | Blend Mode | Opacity Range |
|------------|---------|------------|---------------|
| **Substrate** | Z-0 | `normal` | 1.0 (full opacity) |
| **Resistance/Cultural/Spiritual** | Z-1–2 | `multiply` or `normal` | 0.55-1.0 |
| **Atmospheric** | Z-2–3 | `screen`, `overlay`, or `color-dodge` | 0.10-0.30 |

**Hero Depth Ratio Target**: ≥50% of compositions must have 4+ layers

---

## Toolchain Integration

Skills execute in sequence to resolve asset placement:

### 1. wireframe-annotator (Phase 3)
**Purpose**: Generate `<assets>` XML block in wireframe markdown
**Output**: TODO[asset] markers with layer intent
**No asset resolution yet**

**Example**:
```bash
# Invoked via skill or prompt template
/wireframe-annotator --page=Landing --emotional-register=Defiance
```

---

### 2. asset-placement-strategy (Phase 4)
**Purpose**: Resolve TODO[asset] markers using deterministic scoring
**Input**: Wireframe `<assets>` block
**Output**: Resolved asset_id + token + opacity specifications

**Scoring Process**:
1. Read wireframe `<assets>` block
2. Query manifest for matching assets (category, aspect ratio, z-index compatibility)
3. Apply 100-point scoring rubric
4. Select highest-scoring asset for each slot
5. Validate ≥90 points threshold

**Example**:
```bash
# Invoked via skill
/asset-placement-strategy --wireframe=landing-wireframe.md --output=landing-assets.json
```

---

### 3. component-builder (Phase 6)
**Purpose**: Generate React components with CSS variable references
**Input**: Resolved asset specs from Phase 4
**Output**: React `.tsx` file with token compliance

**Token Enforcement**:
```tsx
// ✅ CORRECT: Semantic token usage
<div style={{
  backgroundImage: `url(${getAssetPath('KR-SOLID-033')})`,
  backgroundColor: 'var(--sys-color-charcoalBackground-base)',
  opacity: 0.25
}} />

// ❌ INCORRECT: Hardcoded hex
<div style={{
  backgroundColor: '#1A1A1A', // NEVER do this
  opacity: 0.25
}} />
```

---

### 4. ui-design-evaluator (Phase 6)
**Purpose**: Validate visual compliance post-build
**Input**: Built component screenshot or code
**Output**: Visual score + semantic color compliance report

**Validation Checks**:
- Token usage (zero hardcoded hex values)
- Asset layer correctness (substrate at Z-0, UI accents at Z-3+)
- Kerala Rage standards (≥95/100 = PASS)

**Example**:
```bash
# Invoked via skill
/ui-design-evaluator --screenshot=landing-page.png --output=compliance-report.json
```

---

## Manifest Sync Tools

| Tool | Purpose | When to Use |
|------|---------|-------------|
| **manifest-reconciler** | Validates filesystem vs. manifest alignment, hero registry integrity | After adding/removing assets, before deployment |
| **asset-metadata-enricher** | Appends semantic metadata (alt-text, political significance) | After Gemini asset generation |
| **kerala-rage-asset-cataloger** | Triages uncategorized assets into 5 categories | When new assets are added without manifest entries |
| **hero-composition-injector** | Adds validated hero compositions to hero-registry.json | After creating new hero compositions |

**Example Workflow**:
```bash
# 1. Reconcile manifest after asset changes
python3 .temp-manifest-reconcile.py

# 2. Enrich new assets with metadata
/asset-metadata-enricher --assets=new-heroes/*.png

# 3. Inject new hero composition
/hero-composition-injector --composition=hero-005.json

# 4. Re-validate manifest
python3 .temp-manifest-reconcile.py
```

---

## Validation Gates

**Pre-Handoff Checklist** (must all be TRUE):

- [ ] All TODO[asset] markers resolved to valid manifest asset_id values
- [ ] Zero hardcoded hex colors (only `--sys-color-*` variables)
- [ ] Z-index layer conventions followed (substrate at Z-0, UI accents at Z-3+)
- [ ] Hero compositions have ≥3 layers (target: 4+ for ≥50% of compositions)
- [ ] Symbolic anchors only on allowed pages (Landing, Analysis Dashboard, Dashboard Overview)
- [ ] Symbolic anchors at Z-1 or Z-2 only (never Z-0 or Z-3)
- [ ] Responsive degradation rules applied (mobile removes decorative assets)
- [ ] WCAG 2.2 AA color contrast achieved (≥4.5:1 for text, ≥3:1 for UI components)
- [ ] Asset placement scoring ≥90 points
- [ ] Manifest reconciliation PASS (zero orphans, zero broken references)

---

### Automated Validation Tools

```bash
# Manifest integrity check
cd frontend && npm run kr:validate

# Asset placement scoring
python3 scripts/score-asset-placement.py --screen Landing --output .claude/placement-scores.json

# Component token compliance (custom ESLint rule to detect hardcoded colors)
yarn lint:tokens

# Manifest reconciliation
python3 .temp-manifest-reconcile.py
```

**Expected Output**:
```
KERALA RAGE MANIFEST RECONCILIATION REPORT
================================================================================
Status: PASS
Manifest entries: 87
Filesystem assets: 87
Hero compositions: 7
Hero depth ratio: 86% (layers >= 4)
Unique hero assets: 15

Layer Distribution:
  atmospheric: 11
  spiritual: 5
  resistance: 15
  substrate: 6
  cultural: 4
  ui-kit: 46
================================================================================
```

---

### Manual Review Triggers

**Requires human designer approval when**:

- Asset placement score <90 points
- Manifest reconciliation FAIL (orphans or broken references detected)
- Symbolic anchor placement violates cultural sensitivity constraints
- WCAG 2.2 AA contrast failure

---

## Critical Files Referenced

**Read-only (for reference)**:

1. `/.agent/workflows/design-workflow-2026.md` — Current 6-phase workflow
2. `/.claude/skills/wireframe-annotator/SKILL.md` — TODO[asset] marker generation
3. `/.claude/skills/asset-placement-strategy/SKILL.md` — Deterministic scoring logic
4. `/docs/design/06b-asset-placement.md` — Page-by-page asset specs
5. `/assets/gemini_hero_composition_brief.md` — Hero patterns A/B/C
6. `/frontend/public/assets/kr-solidarity-hero-registry.json` — Hero composition data
7. `/.claude/placement-scores.json` — Example scoring output

**Manifest sources of truth**:

- `/frontend/public/assets/kerala-rage-kr-solidarity-manifest.json` (v6.0.0, 87 assets)
- `/frontend/public/assets/kr-solidarity-hero-registry.json` (v2.0.0, 7 compositions)

---

## Summary: When and How

| Question | Answer |
|----------|--------|
| **When are assets selected?** | **Phase 4 (UI Specification)** of Design Workflow 2026 |
| **How are assets selected?** | **Deterministic 100-point scoring rubric** via `asset-placement-strategy` skill |
| **Who performs selection?** | **Automated skill** (asset-placement-strategy) with manual review if score <90 |
| **What determines selection?** | Wireframe layer intent, page emotional register, manifest availability, aspect ratio fit, z-index constraints |
| **Where are constraints defined?** | Page-by-page asset guide (06b-asset-placement.md), hero composition patterns (gemini_hero_composition_brief.md) |
| **Why deterministic?** | Ensures consistency, repeatability, token compliance, cultural sensitivity, and manifest integrity |

---

**Version History**:
- **1.0.0** (2026-03-02): Initial unified reference document consolidating 15+ source files

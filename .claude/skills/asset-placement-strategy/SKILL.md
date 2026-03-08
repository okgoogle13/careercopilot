---
name: asset-placement-strategy
description: Wireframe-driven placement strategy for KR Solidarity assets. Takes wireframe XML from wireframe-annotator, resolves TODO[asset] slots using manifest and hero registries, validates layering and tokens, and emits updated wireframes alongside a placement report with deterministic 100-point scoring.
metadata:
  version: 6.3.0
  tags:
    - design-system
    - asset-management
    - kr-solidarity
    - wireframe-automation
---


# KR Solidarity: Asset Placement Strategy (v6.3.0)

**Deterministic, wireframe-driven asset placement validation for the KR Solidarity design system.**

## Purpose

This skill automates the transition from wireframes to high-fidelity assets. It takes **wireframe XML** produced by `wireframe-annotator` (which contains `<assets>` blocks mapped to `<slot>` elements). Each `<slot>` defines the layering (`z_layer`), brand token (`token`), and asset hints (`TODO[asset]...`).

The skill resolves these `TODO[asset]` hints to concrete `asset:<id>` strings based on the manifest or hero registries. It ensures strict semantic token compliance, z-index validation, and enforces the Zero-Flora Lockdown, outputting both the updated wireframe XML and a detailed JSON placement report.

## When to Use

- Resolving asset placeholders into concrete manifest IDs during the automated design handoff.
- Implementing KR Solidarity assets from screen matrix into React components.
- Validating asset placement decisions against [04_ASSETS.md](../../docs/design/04_ASSETS.md).
- Ensuring z-index and layering intent matches [05_FLOWS.md](../../docs/design/05_FLOWS.md) specifications.
- Auditing existing implementations for "Flora" violations or hardcoded colors.

## Capabilities

- **Wireframe Slot Parsing**: Extract asset placement slots directly from `wireframe-annotator` XML output.
- **Manifest Validation**: Verify all `asset_id` references exist in canonical manifest
- **Token Compliance Checking**: Enforce `--sys-*` semantic variable usage only
- **Z-Index Validation**: Verify layer assignments (Z-0 through Z-3+) match wireframe intent
- **Hero Composition Analysis**: Validate depth and lighting logic for hero surfaces
- **Deterministic Scoring**: 100-point scale with clear rubric and ≥90 pass threshold
- **Machine-Readable Output**: Both JSON placement report and updated Wireframe XML
- **Unresolved Tracking**: Flag missing asset mappings and unresolvable slots
- **Full Manifest Coverage Validation** (**HARD RULE**): Ensure EVERY asset in `kerala-rage-kr-solidarity-manifest.json` is either (1) placed in at least one `<slot>` across all 11 wireframes OR (2) explicitly listed in `unused_assets` with a clear reason (e.g., "Incompatible scale", "Semantic mismatch", "Reserved for future use"). Zero assets left unaccounted for.
- **Unused-First Placement Priority** (**HARD RULE**): While resolving `TODO[asset]`, rank compatible candidates so not-yet-used assets are selected before previously-used assets.
- **Compatible-Slot Escalation** (**HARD RULE**): If assets remain unused and compatible slots exist, report must include proposed additional placements (or extra slot proposals) instead of defaulting to unused-only status.

## Inputs

```json
{
  "wireframe_xml": "path/to/wireframe.xml",
  "canon_doc": "docs/design/01_CANON.md",
  "flows_doc": "docs/design/05_FLOWS.md",
  "assets_doc": "docs/design/04_ASSETS.md",
  "asset_root": "frontend/public/assets/kr-solidarity",
  "manifest": "frontend/public/assets/kerala-rage-kr-solidarity-manifest.json",
  "hero_registry": "frontend/public/assets/kr-solidarity-hero-registry.json",
  "token_map": "frontend/public/assets/kr-solidarity-hero-token-map.v2.json"
}
```

## Wireframe Slot Contract

The skill consumes the `<assets>` block within the wireframe.

### Example `<assets>` Block

```xml
<assets>
  <slot
    name="hero_background"
    z_layer="Z-0"
    token="--sys-color-charcoalBackground-base"
    status="todo"
  >
    TODO[asset] category=spiritual;scale=hero-only;aspect=16:9;priority=CRITICAL
  </slot>

  <slot
    name="hero_overlay"
    z_layer="Z-1"
    token="--sys-color-primary-70"
    status="todo"
  >
    TODO[asset] category=atmospheric;scale=hero;aspect=1:1;layering_role=overlay
  </slot>

  <slot
    name="hero_accent"
    z_layer="Z-3"
    token="--sys-color-inkGold-base"
    status="resolved"
  >
    asset:KR-UI-016
  </slot>
</assets>
```

### TODO Hint Format
- Hints are passed as a semicolon-separated list of key-value pairs: `TODO[asset] key1=value1;key2=value2;...`
- **Keys that match against manifest fields:**
  - `category`
  - `layer`
  - `scale` (maps to `usage_rules.scale_suitability`)
  - `aspect` (maps to `aspect_ratio`)
  - `priority`
  - `semantic_weight` (maps to `semantics.semantic_weight`)
  - `functional_role`
  - `layering_role`

## Process

1. **Parse Wireframe XML**: Read all 11 wireframe XMLs and identify all `<slot>` elements inside the `<assets>` block.
2. **Resolve Slots**:
   - For `status="todo"` or inner text starting with `TODO[asset]`:
     - Strip the prefix, parse `key=value` pairs split by `;`.
     - Filter `manifest.assets` (and hero registries) by these constraints, combined with `z_layer` and layer compatibility rules.
     - **Prioritize assets not yet used in any wireframe** to maximize coverage.
     - Choose the best candidate (e.g. highest priority, closest aspect ratio, not-yet-placed).
     - Rewrite the slot's inner text to `asset:<id>` and set `status="resolved"`.
3. **Track Decisions**:
   - Save the choice in a `placements` array (per slot, per screen).
   - Track `used_assets` (manifest IDs placed in at least one slot across all wireframes).
   - Track `unused_assets` (manifest IDs NOT placed anywhere) with explicit reasons (incompatible scale, semantic mismatch, reserved for future, etc.).
   - Track `unresolved_slots` (when no suitable asset is found matching constraints).
4. **Full Manifest Coverage Validation** (**HARD RULE**):
   - Verify that every asset in the manifest is either (a) in `used_assets` OR (b) in `unused_assets` with documented reason.
   - **Zero assets should be left unaccounted for.**
   - If any asset falls into neither category, flag as validation failure and mark the run as `pass=false`.
5. **Compute Placement Score**: Generate the 100-point score matrix against the **resolved** slots (layer intent, token matching, depth logic, manifest validity).
6. **Generate Aggregate Report**: Produce summary of all placements, used vs unused assets, coverage percentage, and compliance status.
   - Report MUST include:
     - `total_assets` (integer from manifest)
     - `used_assets` (array of objects)
     - `unused_assets` (array of objects with reasons)
     - `proposed_additional_placements` (array when compatible slots exist for unused assets)

## Hard Placement Rules
1. Use semantic tokens only:
- Color: `--sys-color-*`
- Typography: `--sys-type-*`
- Do not introduce hardcoded hex in implementation scope.
2. Respect wireframe layer intent:
- `Z-0`: substrate/base texture
- `Z-1..Z-2`: atmospheric/motif overlays
- `Z-3+`: foreground highlights and hero focal cues
3. Every placed asset must map to a valid manifest entry.
4. If wireframes include `TODO[asset]`, produce explicit tokenized replacements.
5. Hero surfaces must include intentional depth and lighting/halo logic where specified.
6. **Scale Hierarchy Compliance**: Hero focal text MUST use `text-display` or `text-hero` with `font-black` (900) and be paired with `text-micro` or `text-small` (300) for sub-captions/metadata to maintain the system's 9× contrast mandate.

## Placement Scoring (100)
- Wireframe alignment and z-order correctness: 35
- Token compliance (`--sys-*` only): 25
- Manifest-valid asset mapping: 20
- Hero depth and halo/lighting intent: 20

Pass threshold: `>= 90`.

## Output Contract

The skill produces **THREE** outputs upon completion:

**(1) Updated Wireframe XML**
With all successfully handled `<slot>` inner texts changed to `asset:<id>` and updated to `status="resolved"`.

**(2) JSON Placement Report (Per-Screen)**
```json
{
  "screen": "Landing",
  "score": 93,
  "placements": [
    {
      "slot": "hero_background",
      "asset_id": "KR-SOLID-022",
      "z_index": 0,
      "layer": "substrate",
      "aspect_ratio": "16:9",
      "token_refs": ["--sys-color-charcoalBackground-base"],
      "status": "applied",
      "rationale": "Aspect ratio matches; category=spiritual maps to devotional intent"
    },
    {
      "slot": "hero_overlay",
      "asset_id": "KR-SOLID-003",
      "z_index": 1,
      "layer": "atmospheric",
      "opacity": 0.8,
      "token_refs": ["--sys-color-primary-70"],
      "status": "applied",
      "rationale": "Matches layering_role=overlay and aspect_ratio=1:1"
    },
    {
      "slot": "hero_accent",
      "asset_id": "KR-UI-016",
      "z_index": 3,
      "layer": "ui-kit",
      "placement": "corner-accent",
      "token_refs": ["--sys-color-inkGold-base"],
      "status": "applied",
      "rationale": "UI-kit layer doesn't conflict with hero composition"
    }
  ],
  "unused_assets_on_screen": [
    "KR-UI-042", "KR-SOLID-099"
  ],
  "unresolved_slots": [],
  "notes": [
    "All placements pass token compliance check",
    "Z-index layering aligns with wireframe intent"
  ]
}
```

**(3) Aggregate Placement Report (Full Manifest Coverage)**
```json
{
  "metadata": {
    "timestamp": "2026-03-07T14:32:00Z",
    "wireframes_processed": ["01_landing.xml", "02_auth.xml", "...", "11_dashboard.xml"],
    "total_slots": 12,
    "total_resolved_slots": 12,
    "coverage_status": "COMPLETE"
  },
  "total_assets": 87,
  "manifest_coverage": {
    "used_assets_count": 12,
    "unused_assets_count": 75,
    "coverage_percentage": 13.8
  },
  "used_assets": [
    {
      "asset_id": "KR-SOLID-022",
      "placed_in": ["01_landing.xml::hero_background"],
      "category": "devotional",
      "z_layer": "Z-0",
      "aspect_ratio": "16:9"
    },
    {
      "asset_id": "KR-UI-016",
      "placed_in": ["01_landing.xml::hero_accent"],
      "category": "ui-kit",
      "z_layer": "Z-3",
      "aspect_ratio": "1:1"
    }
  ],
  "unused_assets": [
    {
      "asset_id": "KR-SOLID-045",
      "reason": "Incompatible scale (hero-only); no hero slots require this exact aspect ratio",
      "category": "abstract",
      "proposed_use": "Available for future dashboard refresh"
    },
    {
      "asset_id": "KR-UI-042",
      "reason": "Semantic mismatch; design system uses different icon treatment",
      "category": "ui-kit",
      "proposed_use": "Legacy component; consider deprecating"
    },
    {
      "asset_id": "KR-SOLID-099",
      "reason": "Reserved for future A/B testing; not included in current roadmap",
      "category": "experimental",
      "proposed_use": "On-hold for Q2 2026"
    }
  ],
  "proposed_additional_placements": [
    {
      "asset_id": "KR-SOLID-045",
      "candidate_slots": ["03_onboarding.xml::step1_accent", "02_auth.xml::background_accent"],
      "proposal_type": "reuse_existing_slot",
      "reason": "Compatible atmospheric slot exists but was not selected in primary pass"
    },
    {
      "asset_id": "KR-SOLID-099",
      "candidate_slots": ["11_dashboard.xml::hero_overlay_extra"],
      "proposal_type": "add_extra_slot",
      "reason": "No current slot in dashboard wireframe; optional atmospheric slot can absorb unused asset"
    }
  ],
  "compliance": {
    "all_assets_accounted_for": true,
    "no_unresolved_slots": true,
    "all_placed_assets_valid": true,
    "zero_flora_lockdown": true,
    "token_compliance": "100%",
    "pass": true
  }
}
```

## Verification Steps

1. ✅ **Token Compliance**: All assets reference only `--sys-color-*` variables
2. ✅ **Manifest Validation**: Selected asset IDs all present in canonical JSON
3. ✅ **Z-Index Ordering**: Substrate (0) → Atmospheric (1) → Accents (3) respects wireframe layer hierarchy
4. ✅ **Hero Depth**: Substrate + atmospheric overlay creates intentional depth
5. ✅ **Score**: Passes ≥90 threshold

---

## Scoring Rubric (100 Points)

### Wireframe Alignment & Z-Order Correctness (35 points)

- **Z-Index Hierarchy** (10 pts): Layers follow wireframe intent
  - Z-0: Substrate/base texture ✓
  - Z-1–2: Atmospheric/motif overlays ✓
  - Z-3+: Foreground highlights, hero cues ✓

- **Asset Fit** (10 pts): Aspect ratio and dimensions match slot
  - Portrait slot → portrait asset ✓
  - Landscape slot → landscape asset ✓
  - Square → square or flexible ✓

- **TODO[asset] Resolution** (10 pts): All placeholders assigned
  - No unresolved markers ✓
  - Each mapped to valid manifest entry ✓
  - Confidence levels documented ✓

- **Layer Separation** (5 pts): No layer conflicts
  - No overlapping same-layer assets ✓
  - Intentional depth relationships ✓

### Token Compliance (25 points)

- **No Hardcoded Colors** (15 pts): Only `--sys-color-*` variables
  - Zero hex values in token_refs ✓
  - Zero RGB values in implementation ✓
  - All variables exist in tokens.json ✓

- **Semantic Correctness** (10 pts): Tokens match asset intent
  - Primary for hero focal points ✓
  - Secondary for accents ✓
  - Neutral for backgrounds ✓

### Manifest-Valid Asset Mapping (20 points)

- **Asset Existence** (10 pts): All asset_id entries present
  - IDs found in manifest ✓
  - File paths verified ✓
  - No orphaned references ✓

- **Category Alignment** (10 pts): Asset category matches slot
  - ui-kit for interface elements ✓
  - Devotional for spiritual heroes ✓
  - Abstract for atmospheric overlays ✓

### Hero Depth & Lighting Intent (20 points)

- **Layered Composition** (10 pts): Multi-layer depth strategy
  - Substrate foundation ✓
  - Atmospheric middle layer ✓
  - UI-kit foreground ✓

- **Lighting & Halo** (10 pts): Intentional focal hierarchy
  - Accent positioning creates visual weight ✓
  - Opacity overlays create depth ✓
  - Contrast supports content legibility ✓

---

## Troubleshooting

### Issue: Placement Score Below 90

**Symptoms**: Validation fails with score 72–89

**Root Causes**:
1. Hardcoded hex/RGB in token_refs (Token compliance failure)
2. Asset not found in manifest (Manifest validation failure)
3. Incorrect z-index or layer assignment (Wireframe alignment failure)
4. Unresolved TODO[asset] markers (Unresolved slots)

**Solution Steps**:

1. **Check Token Refs**
   ```json
   // ❌ Wrong
   "token_refs": ["#D4A84B", "--sys-color-kr-ink-gold"]

   // ✅ Correct
   "token_refs": ["--sys-color-inkGold-base"]
   ```

2. **Verify Manifest Entry**
   ```bash
   # Check if asset exists
   grep "KR-SOLID-022" frontend/public/assets/kerala-rage-kr-solidarity-manifest.json
   ```

3. **Review Z-Index Ordering**
   ```json
   // Verify layers don't skip or conflict
   z_index: [0, 1, 3]  // ✓ Valid progression
   z_index: [0, 2, 1]  // ❌ Out of order
   ```

4. **Re-score After Fixes**
   - Expected improvement: +5–10 points per fix
   - Target: ≥90 for production approval

### Issue: Asset Aspect Ratio Mismatch

**Symptoms**: Asset doesn't fill slot, creates dead space or scales poorly

**Solutions**:

1. **Check Wireframe Aspect Constraints inside TODO[asset]**
   - Did the `TODO` explicitly ask for `aspect=16:9`?
   - Is asset flexible or fixed?

2. **Select Matching Asset**
   ```json
   // Hero slot asks for 16:9
   // Available assets:
   // - KR-SOLID-022: 16:9 ✓
   // - KR-SOLID-026: 1:1 ✗
   "asset_id": "KR-SOLID-022"
   ```

3. **Document Scaling**
   ```json
   "rationale": "Asset 16:9 matches hero container; no cropping needed"
   ```

### Issue: Unresolved TODO[asset] Markers

**Symptoms**: `unresolved_slots` array contains pending assignments

**Causes**:
- Multiple valid candidates (ambiguous choice)
- No matching asset in manifest for the given constraints (gap)
- Wireframe slot under-specified

**Solutions**:

1. **For Ambiguous Choices**: Resolve via highest appropriate priority
   ```json
   // Among candidates KR-SOLID-022 and KR-SOLID-021, choose highest priority relative to layout
   "status": "applied", "asset_id": "KR-SOLID-022"
   ```

2. **For Missing Assets**: Flag gap in the resulting JSON
   ```json
   "unresolved_slots": [
     {
       "slot": "hero_decorative",
       "reason": "No asset in manifest matched criteria: aspect=2:1, category=abstract",
       "action": "Needs new asset design"
     }
   ]
   ```

3. **For Under-Specified Slots**: Return with notes to update the wireframe upstream
   - The `<slot>` needs more specific `TODO[asset]` hints.

### Issue: Token Variable Not Found

**Symptoms**: `--sys-color-custom-value` doesn't exist in tokens.json

**Solutions**:

1. **Check tokens.json**
   ```bash
   grep "custom-value" frontend/src/design/tokens/tokens.json
   ```

2. **Use Valid Semantic Token**
   ```json
   // ❌ Wrong
   "token_refs": ["--sys-color-custom-value"]

   // ✅ Correct
   "token_refs": ["--sys-color-primary-70"]
   ```

---

## Best Practices

### 1. Start with Substrate Layer
Always place Z-0 substrate first, then build atmospheric overlays (Z-1–2), then UI accents (Z-3+).

### 2. Match Constraints Carefully
Use the hint string to find highly accurate asset pairings rather than dropping random assets into slots.

### 3. Progressive Disclosure
Build layered depth intentionally—each layer should add value without obscuring content.

### 4. Manifest as Source of Truth
If an asset isn't in the manifest or hero registry, don't invent it. Output it into `unresolved_slots`.

### 5. Document Rationale
Always include rationale for placement choices in the report. This aids design review and future updates.

### 6. Test at Multiple Breakpoints
Ensure the placement strategy works at mobile, tablet, and desktop scales, or specify scale overrides in the XML mapping.

---

## Integration

**Workflow chain:**
`wireframe-annotator` → `asset-placement-strategy` → `ui-design-evaluator` → `component-builder`

- **Upstream (`wireframe-annotator`)**: Provides the initial `wireframe_xml` with `<assets>` blocks, containing `<slot>` items and `TODO[asset]` hints.
- **This Skill (`asset-placement-strategy`)**: Resolves the hints using the manifest and hero registries, validates tokens/layering, computes the compliance score, and emits the **updated wireframe_xml** + **placement_report**.
- **Downstream (`ui-design-evaluator`, `component-builder`, etc.)**: Consumes the resolved wireframe XML directly without ambiguity.

## Related Skills

- [wireframe-annotator](../wireframe-annotator/SKILL.md) – Upstream skill that generates the annotated wireframes and `<slot>` markers
- [manifest-reconciler](../manifest-reconciler/SKILL.md) – Audits asset manifest for gaps/orphans
- [ui-design-evaluator](../ui-design-evaluator/SKILL.md) – Visual compliance audits scoring
- [component-builder](../component-builder/SKILL.md) – Production component generator

---

**Last Updated**: 2026-03-07 | **Version**: 6.3.0

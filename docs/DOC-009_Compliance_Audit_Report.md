# DOC-009: DOC-008 Compliance Audit Report

**Audit Date**: February 3, 2026
**Scope**: Pages 1-7 (Landing through Kanban Board)
**Status**: 🔴 **NON-COMPLIANT** (Blocking Issues Identified)

---

## Executive Summary

A comprehensive forensic audit of the CareerCopilot frontend execution against the `DOC-008_Detailed_wireframe_asset_summary.md` specification reveals significant alignment in overall structural intent but critical deviations in **token system application**, **asset fidelity**, and **interactive behaviors**.

While the "Gallery" (Mode A) implementation captures the poetic intent of the design, several high-severity violations threaten the coherence of the "Laboratory" (Mode B) and the strict separation of concerns required by the Northcote Design System.

### Compliance Scorecard

| Compliance Category         | Score   | Status                              |
| :-------------------------- | :------ | :---------------------------------- |
| **1. Token Compliance**     | **40%** | 🔴 BREAKING (Mode Contaminations)   |
| **2. Asset Placement**      | **65%** | 🟠 HIGH (Missing/Substitute Assets) |
| **3. Layout Architecture**  | **85%** | 🟢 PASS (Structurally Sound)        |
| **4. Behavioral Details**   | **50%** | 🟡 APPROXIMATE (Missing Animations) |
| **5. Content & Typography** | **70%** | 🟠 HIGH (Wrong Weights/Scales)      |
| **OVERALL**                 | **62%** | 🟠 **HIGH RISK**                    |

---

## Top 5 Critical Issues (Must Fix Before Launch)

1.  **Page 4 (Ingestion) Mode Contamination**: The Drop Zone currently uses `concrete-grey` (Gallery) or generic border tokens. The specification strictly requires `color.semantic.surface.laboratory.slateSmoke` and `charcoalSlate` borders to demarcate the "Laboratory" mode. **This compromises the core Mode A/B separation.**
2.  **Page 1 (Landing) Hero Typography**: Implementation uses `text-bloom-ultra` (Fraunces). Specification mandates `typography.scale.displayHero` (Libre Bodoni) for the "Resurrection" proclamation. This fundamentally alters the first impression.
3.  **Page 2 (Auth) Asset Substitution**: The `motif-laboratory-compass` is replaced with a generic `specimenGrid` (fern) or `paper-whiteGrid`. This removes the "Navigation/Entry" metaphor central to the wireframe.
4.  **Page 5 (Analysis) Metric Weight Violation**: The key metrics utilize `text-wattle-gold font-bold` (700 weight). Specification explicitly calls for a `200` (Thin) weight `metricDisplay` token to convey "Scientific Precision" rather than "Marketing Loudness".
5.  **Page 6 (Opportunity) Sentry Behavior**: The Kookaburra Sentry is implemented as a static image with entrance animation, missing the required "Head Tilt" idle loop (8-12s) that gives the page its "living" quality.

---

## Detailed Findings by Page

### PAGE 1: Landing - "The Resurrection"

- 🔴 **Typography**: `typography.scale.displayHero` (Libre Bodoni 96px) is missing. Implementation uses Fraunces 800.
  - _Fix_: Add token or override `LandingPage.tsx` to use Libre Bodoni.
- 🟡 **Background**: `pattern-nocturnal-canopy` is implemented via `wallpaper` asset, but opacity tuning (25% spec) may need verifying against final asset render.

### PAGE 2: Authentication - "The Entry Gate"

- 🔴 **Asset Mismatch**: `motif-laboratory-compass` is missing. Replaced with `specimenGrid` (Fern).
  - _Fix_: Replace image source with correct compass asset.
- 🟠 **Background**: Uses `paper-whiteGrid` (Lab texture) in a Gallery Mode page. Spec requires `pattern-nocturnal-canopy`.
  - _Impact_: Confuses the user's sense of "Place" (Gallery vs Lab).

### PAGE 3: Onboarding - "Choosing the Soil"

- 🔴 **Assets**: Missing botanical anchors (`waratah`, `wattle`, `banksia`) in CSS.
- 🟡 **Content**: Title "Choosing the Soil" differs slightly from spec "Choose Your Habitat".

### PAGE 4: Ingestion - "The Mulch & Mineral Setup"

- 🔴 **Token Violation (Breaking)**: Drop Zone uses generic or Gallery-adjacent tokens (`concrete-grey`). MUST use Laboratory semantic tokens (`slateSmoke`, `charcoalSlate`).
- 🟡 **Behavior**: "Stamp" animation logic exists but asset fidelity needs verification (`naturesClockwork`).

### PAGE 5: Analysis - "The Audit Microscope"

- 🔴 **Typography**: `metricDisplay` uses `font-bold` (700) instead of correct `200` weight.
- 🟠 **Layout**: "Compass Gauge" visualization is replaced by a static icon/card. The dynamic "needle" behavior is absent.

### PAGE 6: Opportunity - "The Sentry Lookout"

- 🟠 **Behavior**: Kookaburra Sentry lacks idle animation loop.
- 🟢 **Layout**: Sidebar/Feed split is well structured.

### PAGE 7: Kanban - "The Command Center Greenhouse"

- 🟠 **Assets**: Missing specific "Eucalyptus Hanging" sway at column tops.
- 🟡 **Empty State**: "Empty..." handwritten text is a nice touch, aligns with "Poetic" intent even if not explicitly in wireframe.

---

## Systemic Patterns & Recommendations

### 1. Token System Gaps

The audit revealed gaps in `tokens.json` where the wireframes "hallucinated" or required new tokens:

- `typography.scale.displayHero` (Libre Bodoni, 96px)
- `typography.scale.metricDisplay` (Work Sans/JetBrains, 200 weight)

**Recommendation**: Formally add these tokens to `tokens.json` rather than hacking hardcoded values.

### 2. Mode Contamination

There is a recurring issue of `paper-white` (Lab) textures leaking into Gallery pages (Auth) and Gallery colors (`concrete-grey`) leaking into Lab pages (Ingestion).

**Recommendation**: Enforce a strict linting rule or manual check:

- `GalleryShell` pages MUST NOT use `laboratory.*` tokens.
- `LaboratoryShell` pages MUST NOT use `gallery.*` tokens.

### 3. Asset "Placeholder" Fatigue

Many unique assets (Compass, Specific Botanicals) are currently represented by the same 2-3 available assets (Fern, Wallpaper).

**Recommendation**: Execute the "Asset Acquisition" phase immediately to fill the `src/assets/specimens` directory with the specific DOC-008 requirements.

---

## Conclusion

The application is functionally robust but **aesthetically misaligned** with the specific "Naturalist/Scientific" duality designated in DOC-008. Bringing the tokens and assets into compliance is critical to achieving the intended "Northcote Curio" atmosphere.

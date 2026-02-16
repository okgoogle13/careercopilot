# Figma Make AI Prompt Guide

**Last Updated:** 2026-02-16

## Model Recommendation
**Primary Model: Claude 4.6 Opus**
*   **Why:** Best for structural logic, consistency with Design System rules, and strict adherence to the spec sheet.
*   **Use Cases:** Spec implementation, page updates, token enforcement.

**Secondary Model: Gemini 3 Pro**
*   **Why:** Stronger on visual/multimodal exploration.
*   **Use Cases:** Mood boarding, asset generation, rapid conceptual variations.

---

## Optimized Prompt (For Copying into Figma Make)
paste the content below into the Figma Make prompt window.

```markdown
# TASK
Update the Figma file so that **all 12 pages** (from /landing. /dashboard‑overview, through the **new** /styleguide) visually and behaviorally match the spec sheet below. 
You may:
- Create new frames/components using existing Kerala Rage tokens.
- Move or re‑style existing elements to align with the provided high-fidelity specs (Motion, Color, Typography).
- Add or update variants and interactions where specified (e.g., Viscous Spring motion).

You must **not**:
- Change global color/style tokens or typestyles that are already defined in the file (e.g., Do NOT change `solidarityRed` or `Libre Bodoni`).
- Add new pages or delete existing pages unless explicitly implied by the spec.

**CRITICAL CONSTRAINT:**
- **ASSETS ARE NOT PROVIDED.** I am not uploading the image files yet. You MUST use simple colored rectangles/frames with text labels (e.g., "KR-SOLID-033") for all assets. Do NOT attempt to generate images. Use the "Role" and "Aspect" from the Asset Library to size the placeholders correctly.

---

# CONTEXT

- **Execution Priority (CRITICAL):** Process pages in this order to ensure complexity is handled early:
  1. **Tier 1 (High Complexity/Hero):** `/kanban` (Complex Grid), `/dashboard-overview` (Data Layout), `/landing` (Hero Editorial).
  2. **Tier 2 (System Governance):** `/styleguide` (Capture all tokens/components).
  3. **Tier 3 (Functional Flux):** All remaining pages (e.g., `/auth`, `/onboarding`, etc.).
- **Design System Tokens:**
  - **Typography**: `Libre Bodoni` (Hero), `Fraunces` (Bloom), `Work Sans` (Body), `JetBrains Mono` (Data), `Caveat` (Curator), `Nabla` (Accent).
  - **Color**: `#1A1A1A` (Asphalt), `#F14714` (Red), `#DAF674` (Gold), `#DAF6B3` (Ash).
  - **Shapes**: `Stone` (16/4/12/24), `Leaf` (24/8/20/4), `Pebble` (20/6/16/28).
- **Strategy:**
  - If a page already exists, **update it** matching the priority sequence.
  - If a page does not exist, **build it**.
  - **Do not** proceed to Tier 3 until Tiers 1 & 2 are structurally sound.

---

# ACID TEST INSTRUCTION

Before updating anything, output:
1. The **list of pages you intend to change** in prioritized order (Must follow the Tier 1 > Tier 2 > Tier 3 sequence).
2. For **/kanban** specifically:
   - A **short description** of how you plan to update layout/columns to match the spec.
   - One **explicit change** you would make (e.g., "apply Fraunces Restrained 24px to column headers").
3. Confirm you will use **Placeholders** for assets and reflect the full **Federation Stack** (including Libre Bodoni and Nabla).

Once I confirm “go ahead”, then:
- Apply the **full page‑by‑page update**.
- For each page, describe the **major changes** in one short paragraph.

---

# SPEC SHEET (Paste Full Content Below)

[PASTE CONTENT OF docs/design/FIGMA_SPEC_SHEET.md HERE]
```

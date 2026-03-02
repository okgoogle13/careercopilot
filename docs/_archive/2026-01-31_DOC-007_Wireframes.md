<<<<<<< HEAD
# Wireframe Summary: Northcote Curio (v2.0)
=======
# Wireframe Summary: kerala-rage kr-solidarity (v2.0)
>>>>>>> restoration-KR-Rage-Figma-v2.0

**Document ID:** WIRE-001 (Expanded)
**Status:** DEFINITIVE
**Context:** Annotated wireframe specifications for the CareerCopilot application, covering the full 11-page user journey across "Nocturnal Canopy" (Mode A) and "Field Journal" (Mode B) biomes.

---

## 0. System Indices (The Physics Engine)

**Reference:** DOC-004 / Tokens V7

### A. The Dual Modes

<<<<<<< HEAD
- **Mode A (Gallery):** `#0A0F0D` void, `pattern-nocturnal-canopy.png`, Glassmorphism, `#D4A84B` Gold.
- **Mode B (Laboratory):** `#F5F2EB` paper, `img-skeleton-etch` watermark, Solid Cardstock, `#2C2723` Slate.
=======
- **Mode A (kr-dark):** `#0A0F0D` void, `pattern-kr-wheat-paste.png`, kr-screenprint, `#D4A84B` Gold.
- **Mode B (kr-dark):** `#F5F2EB` paper, `img-skeleton-etch` watermark, Solid Cardstock, `#2C2723` Slate.
>>>>>>> restoration-KR-Rage-Figma-v2.0

### B. Atomic Radii (Strict)

- **Pebble (Buttons):** `20px 6px 16px 28px`
- **Stone (Cards):** `16px 4px 12px 24px`
- **Leaf (Hero):** `24px 8px 20px 4px`
- **Seed (Badges):** `8px 4px 10px 6px`

### C. Typography (Federation Stack)

<<<<<<< HEAD
- **Display:** `Libre Bodoni` (Italic)
=======
- **Display:** `kr-serif-bold` (Italic)
>>>>>>> restoration-KR-Rage-Figma-v2.0
- **Body:** `Work Sans`
- **Data:** `JetBrains Mono`

---

## 1. Landing Page ("The Resurrection")

<<<<<<< HEAD
**Mode:** A (Gallery) - _Emotional, Discovery._

- **Background (Z-0):** `#0A0F0D` w/ `pattern-nocturnal-canopy.png` (25%). Bottom-up gradient overlay.
- **Header (Z-2):** Top-Right `img-wattle-hanging` anchor.
- **Hero (Center):** "FUTURE SPECIMEN" headline in `Libre Bodoni Italic` (96px, Gold). Wrapped in Glassmorphic `Core/Leaf` container (`radius-leaf`).
=======
**Mode:** A (kr-dark) - _Emotional, Discovery._

- **Background (Z-0):** `#0A0F0D` w/ `pattern-kr-wheat-paste.png` (25%). Bottom-up gradient overlay.
- **Header (Z-2):** Top-Right `img-wattle-hanging` anchor.
- **Hero (Center):** "FUTURE kr-motif" headline in `kr-serif-bold Italic` (96px, Gold). Wrapped in Glassmorphic `Core/Leaf` container (`radius-leaf`).
>>>>>>> restoration-KR-Rage-Figma-v2.0
- **Features:** Horizontal row of 3 `Glassmorphic Stone` cards: "Fig. A (Discovery)", "Fig. B (Analysis)", "Fig. C (Application)".
- **Nav (Bottom):** Floating Dock w/ 3 `Core/Pebble` buttons.

## 2. Authentication ("The Entry Gate")

<<<<<<< HEAD
**Mode:** A (Gallery) - _Security, Gateway._
=======
**Mode:** A (kr-dark) - _Security, Gateway._
>>>>>>> restoration-KR-Rage-Figma-v2.0

- **Background:** Deep Void (`#0A0F0D`) with subtle "Firefly" particles (`img-firefly-sprite`).
- **Card (Center):** Single `Core/Stone` (`radius-stone`) container.
  - **Width:** 480px.
<<<<<<< HEAD
  - **Surface:** High-blur Glassmorphism (`backdrop-blur: 32px`).
=======
  - **Surface:** High-blur kr-screenprint (`backdrop-blur: 32px`).
>>>>>>> restoration-KR-Rage-Figma-v2.0
- **Input fields:** `Core/Lens` style (Transparent bg, bottom border `#D4A84B`).
- **Primary Action:** "Sign In" - `Core/Pebble` (Solid Gold).

## 3. Onboarding ("Choosing the Soil")

<<<<<<< HEAD
**Mode:** A (Gallery) - _Selection, Habitat._
=======
**Mode:** A (kr-dark) - _Selection, Habitat._
>>>>>>> restoration-KR-Rage-Figma-v2.0

- **Layout:** 3x3 Grid of large selection cards.
- **Cards:** `Core/Leaf` shape (`radius-leaf`).
  - **Default:** Glassmorphic.
  - **Selected:** Wattle Gold "Filament" border (`3px solid #D4A84B`) + Glow.
<<<<<<< HEAD
- **Content:** Industry sectors (e.g., "Tech", "Health") represented by vintage botanical icons.

## 4. Ingestion ("The Mulch & Mineral Setup")

**Mode:** B (Laboratory) - _Scientific, Precision._
=======
- **Content:** Industry sectors (e.g., "Tech", "Health") represented by vintage [DEPRECATED_STYLE] icons.

## 4. Ingestion ("The Mulch & Mineral Setup")

**Mode:** B (kr-dark) - _Scientific, Precision._
>>>>>>> restoration-KR-Rage-Figma-v2.0

- **Background:** `#F5F2EB` (Cream) w/ `img-skeleton-etch` watermark (6% opacity).
- **Headline:** "HISTORY" sliced by text "SHRED" (Anatomical metaphor).
- **Drop Zone (Center):** Huge `Core/Stone` container (900px width).
  - **Style:** Sunken Matte (Inner Shadow).
  - **Border:** dashed `#2C2723`.
<<<<<<< HEAD
  - **Label:** "DEPOSIT SPECIMEN (PDF)" in `JetBrains Mono`.

## 5. Analysis Dashboard ("The Audit Microscope")

**Mode:** B (Laboratory) - _Analytical, Grid._
=======
  - **Label:** "DEPOSIT kr-motif (PDF)" in `JetBrains Mono`.

## 5. Analysis Dashboard ("The Audit Microscope")

**Mode:** B (kr-dark) - _Analytical, Grid._
>>>>>>> restoration-KR-Rage-Figma-v2.0

- **Layout:** Split View (40% Left / 60% Right).
- **Left Column:**
  - **The Gauge:** Huge `img-compass` (Brass) pointing to "Match Score".
- **Right Column:**
  - **Grid:** 2x2 grid of solid `Core/Stone` cards.
  - **Content:** Skill metrics in `JetBrains Mono`. Each card labelled "FIG. [X]".

## 6. Opportunity Feed ("The Sentry Lookout")

<<<<<<< HEAD
**Mode:** A (Gallery) - _Browsing, Canopy._
=======
**Mode:** A (kr-dark) - _Browsing, Canopy._
>>>>>>> restoration-KR-Rage-Figma-v2.0

- **Layout:** Split View.
  - **Sidebar (Left - 280px):** Filters. `Core/Pebble` ghost toggles.
  - **Feed (Right):** Vertical list.
<<<<<<< HEAD
- **Header Anchor:** `img-kookaburra-sentry` perched on top nav.
=======
- **Header Anchor:** `img-kr-shiva-sentry` perched on top nav.
>>>>>>> restoration-KR-Rage-Figma-v2.0
- **Job Cards:** `Glassmorphic Stone` cards revealing lush background.
  - **Badges:** `Core/Seed` tags for "98% Match" (Gold).

## 7. Kanban Board ("The Command Center Greenhouse")

<<<<<<< HEAD
**Mode:** A (Gallery) - _Growth, Lifecycle._
=======
**Mode:** A (kr-dark) - _Growth, Lifecycle._
>>>>>>> restoration-KR-Rage-Figma-v2.0

- **Layout:** Horizontal Columns (Trellises).
- **Columns:** Glassmorphic panels.
- **Cards:** "Leaf" tickets hanging on the trellis.
- **Metrics (Top):** Massive `200 Thin` font numbers (e.g., "12 ACTIVE").
<<<<<<< HEAD
- **Deco:** Hanging Eucalyptus vines (`img-gum-hanging`) anchoring corners.

## 8. Split-Screen Editor ("The Writing Workbench")

**Mode:** B (Laboratory) - _Crafting, Drafting._
=======
- **Deco:** Hanging kr-leafus vines (`img-gum-hanging`) anchoring corners.

## 8. Split-Screen Editor ("The Writing Workbench")

**Mode:** B (kr-dark) - _Crafting, Drafting._
>>>>>>> restoration-KR-Rage-Figma-v2.0

- **Layout:** 50/50 Vertical Split.
- **Left (Editor):** Solid Matte writing area (`#EBE8E1`).
  - **Focus:** Wattle Gold border when typing.
<<<<<<< HEAD
- **Right (Evidence):** "Specimen Drawer" of past history.
  - **Items:** Draggable `Core/Stone` cards.

## 9. Studio Designer ("The Specimen Finalization")

**Mode:** B (Laboratory) - _Refining, Architecture._

- **Background:** Aged Parchment Grain (`img-paper-texture`).
=======
- **Right (Evidence):** "kr-motif Drawer" of past history.
  - **Items:** Draggable `Core/Stone` cards.

## 9. Studio Designer ("The kr-motif Finalization")

**Mode:** B (kr-dark) - _Refining, Architecture._

- **Background:** Aged Paper White Grain (`img-paper-texture`).
>>>>>>> restoration-KR-Rage-Figma-v2.0
- **Layout:** Preview (Left) / Controls (Right).
- **Toggle:** "Bot View" switch (Turns preview into Red Anatomical Wireframe).

## 10. Settings ("The Archive Vault")

<<<<<<< HEAD
**Mode:** B (Laboratory) - _Storage, Configuration._
=======
**Mode:** B (kr-dark) - _Storage, Configuration._
>>>>>>> restoration-KR-Rage-Figma-v2.0
**Note:** Primary nav label is "Settings" with subtitle "The Archive Vault"

- **Layout:** Single column, centered.
- **Cards:** Solid Archival `Core/Stone` cards.
  - **Icons:** Brass Gears (`img-brass-gear`).
- **Typography:** Labels etched in `JetBrains Mono`.

## 11. Dashboard Overview ("The Canopy View")

<<<<<<< HEAD
**Mode:** A (Gallery) - _High-level, Status._
=======
**Mode:** A (kr-dark) - _High-level, Status._
>>>>>>> restoration-KR-Rage-Figma-v2.0
**Note:** Primary nav label is "Dashboard" with subtitle "Your Field Station"

- **Layout:** Hero Metric Bar + 4 Secondary Cards.
- **Hero:** "Ceiling Gum" asset hanging top-left.
- **Metrics:** Huge `Thin 200` numbers.
- **Cards:** `Glassmorphic Stone` (2x2 Grid).
  - **Interaction:** "Blur Bloom" on hover.

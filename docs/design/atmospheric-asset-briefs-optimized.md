# Northcote Curio: Atmospheric Asset Briefs (Optimized)

**Phase 3: UI & Atmospheric Elements**

> **Optimization Protocol:** These briefs have been processed through the Brand Brief Optimizer to ensure **Clarity** (specific visual direction), **Coherence** (alignment with Victorian Naturalist values), and **Applicability** (clear UI usage rules).

---

## ASSET-07: The Bioluminescent Sprite (Firefly)

**Category:** UI / Atmospheric | **Mode:** Gallery (Nocturnal)

### 1. Visual Definition

**Concept:** Not a generic "glow dot," but a distinctive _Lampyridae_ specimen in flight.
**Materiality:** "Living Amber." A warm, pulsating organic light (#FFD700 to #E6A817) with a visible, translucent insect body core when close.
**The Void:** The glow must bleed naturally into the specific #1A1714 charcoal background, not just a radial gradient.
**Motion:** "Drunken organic drift." Never moves in a straight line. It loiters, pulses, and darts.

### 2. Usage Rules

- **Placement:** Sparse distribution (max 3-5 visible at once). Concentrated near "active" UI elements (buttons, inputs) as if drawn to the heat of user interaction.
- **Scale:** High variance. foreground (blurred, large), mid-ground (sharp, small), background (bokeh dot).
- **Prohibited:** Never use as a specific status indicator (e.g., "online"). It is atmospheric _only_.

---

## ASSET-08: The Glossopteris Stamp (Verification)

**Category:** UI / Feedback | **Mode:** Laboratory

### 1. Visual Definition

**Concept:** The definitive archival seal of approval. A prehistoric fossil leaf, not a rubber stamp.
**Materiality:** "Fossilized Gold." Combining the texture of a heavy brass signet ring pressing into gold leaf. Crisp, etched ridges of the Glossopteris venation.
**Aesthetic:** It shouldn't look "inked"—it should look _embossed_ or _gilded_ onto the parchment.
**Animation:** A heavy, satisfying "Thud." Impact drives a dust cloud (particle effect) and a slight screen shake.

### 2. Usage Rules

- **Trigger:** Only on _definitive_ success (e.g., "Upload Complete," "Application Sent").
- **Edge Case:** On dark mode (Gallery), it glows like molten metal. On light mode (Lab), it is a dark, heavy ink impression.

---

## ASSET-09: The Waratah Macro (Hero)

**Category:** Plate / Hero | **Mode:** Gallery

### 1. Visual Definition

**Concept:** The "Heart of the Collection." An extreme macro closeup of the _Telopea speciosissima_ inflorescence.
**Materiality:** "Velvet & Magma." The bracts should look like plush crimson velvet, while the florets look like cooling embers.
**Lighting:** "Chiaroscuro Drama." Lit from the top-left, deep shadows in the crevices.
**Framing:** **Off-center.** The subject should occupy the right 2/3rds, bleeding off-screen, leaving the left void open for Headline typography ("THE RESURRECTION").

### 2. Usage Rules

- **Application:** Landing Page Hero ONLY.
- **Blending:** Use `luminosity` blend mode at low opacity for "Ghost" state, clear layout for "Full Specimen" state.

---

## ASSET-10: The Banksia Spinner (Loading)

**Category:** UI / Loading | **Mode:** Shared

### 1. Visual Definition

**Concept:** Nature’s geometric engine. A top-down view of a Banksia pod cross-section.
**Geometry:** The Fibonacci spiral of the follicles.
**Materiality:** "Burnished Wood." Dark, aged timber textures with brass highlights on the follicle lips.
**Animation:** Rotates at a constant, heavy speed. Not a dizzying spin—a grinding, gear-like rotation.

### 2. Usage Rules

- **Context:** System-level loading (page transitions).
- **Scale:** Small (32-48px) for localized loading, Large (128px) for initial boot.

---

## ASSET-14: The Osteological Etching (Watermark)

**Category:** Specimen / Background | **Mode:** Laboratory

### 1. Visual Definition

**Concept:** The structure beneath the skin. A precise distinctive etching of Australian megafauna skeletal anatomy (e.g., _Diprotodon_ vertebrae or _Thylacine_ jaw).
**Style:** "Lithographic Plate." Fine, black ink lines on parchment. Cross-hatching for depth. NO gradients.
**Integration:** It functions as a watermark. High transparency (4-6% opacity).
**Blend:** `multiply` against the Field Paper background.

### 2. Usage Rules

- **Placement:** Centered behind heavy input zones (Drop Zones, Text Areas).
- **Metaphor:** "We analyze the bones of your career."

---

## ASSET-15: The Navigator's Compass

**Category:** UI / Navigation | **Mode:** Shared

### 1. Visual Definition

**Concept:** An instrument of precision, not a pirate prop. A 19th-century surveyor's compass.
**Materiality:** "Machined Brass & Glass." Scratched glass face, heavy brass housing with patina. The needle is blued steel.
**Reflections:** Visible "studio light" reflection on the glass curving surface to sell the 3D volume.
**Behavior:** The needle is "live." It reacts to mouse movement (sluggishly) or snaps to "North" (active content) on focus.

### 2. Usage Rules

- **Laboratory:** Acts as a data gauge (0-100 score).
- **Gallery:** Acts as a whimsical orientation marker (points to "Next" button).

---

## ASSET-16: The Wattle Proscenium (Hanging Branch)

**Category:** Specimen / Frame | **Mode:** Gallery

### 1. Visual Definition

**Concept:** The "Greenhouse Ceiling." A heavy branch of _Acacia pycnantha_ drooping into the frame from the top-right.
**Detail:** Fuzzy, spherical yellow blooms (pollen texture visible) and phyllode leaves.
**Depth:** Deep depth-of-field. The closest leaves are slightly blurred (foreground), main leaves sharp.
**Lighting:** Backlit by "Moonlight" (cool rim light) to separate it from the void.

### 2. Usage Rules

- **Anchoring:** MUST look attached to the viewport edge. No floating branches.
- **Parallax:** Moves slower than the scroll, creating an intense sensation of depth.

---

## ASSET-17: The Eucalyptus Canopy (Ceiling)

**Category:** Specimen / Frame | **Mode:** Gallery

### 1. Visual Definition

**Concept:** Looking UP into the crown of a _Eucalyptus regnans_.
**Perspective:** Worm's eye view. Leaves foreshortened.
**Atmosphere:** "Dappled Moonlight." Shadows of leaves cast onto other leaves.
**Integration:** A full-width "header" element. It replaces the concept of a solid nav bar with a living, breathing canopy.

### 2. Usage Rules

- **Navigation:** Navigation items nest _within_ the negative space of the leaves.
- **Z-Index:** Always the topmost organic layer.

---

## ASSET-19: The Eucalyptus Column (Structural)

**Category:** Specimen / Structural | **Mode:** Gallery

### 1. Visual Definition

**Concept:** The "Tree Trunk" as architectural pillar. A vertical study of _Eucalyptus_ bark texture (peeling, scribbly, or ironbark).
**Texture:** High-contrast, tactile bark.
**Geometry:** Perfectly vertical, but with organic edge variation (knots, peeling strips) that breaks the strict CSS box model line.

### 2. Usage Rules

- **Function:** Replaces vertical dividers in Kanban/Grid layouts.
- **Tiling:** Must vertically tile or stretch gracefully without obvious repetition. Note: Organic variation makes distinct top/middle/bottom segments preferred over simple tiling.

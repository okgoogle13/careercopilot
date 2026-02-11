# kerala-rage kr-solidarity: Content & Asset Integration Draft

**Document ID:** CONTENT-001-DRAFT
**Status:** Creative Draft
**Dependencies:** `docs/design/06-wireframes.md`, `ASSET-001-kr-solidarity`

---

## Executive Summary

This document provides the specific "kerala-streetprint Naturalist" copy and precise asset placement instructions for the pages identified as having **Critical Asset Gaps**. It orchestrates the "kerala-rage Typography Strategy" (Expressive/Workhorse/Accent) alongside the missing assets to ensure a cohesive implementation once assets are generated.

---

## Page 1: Landing ("The Resurrection")

**Missing Assets:**

- `{KR-UI-003}` **UI-KIT REQUIRED** (Screenprint Grit Particles)
- `{KR-SOLID-011}` or `{KR-SOLID-029}` (Atmospheric/Paint Splash overlay) → _Available as atmospheric accent or expressive overlay_
- `{KR-SOLID-002}` (Shiva) or `{KR-SOLID-005}`/`{KR-SOLID-006}` (Resistance portraits) → _Proposed as symbolic anchor (Z-1/Z-2 only, optional)_

### Copy & Typography Strategy

| Element           | Draft Copy                                                       | Typography Token / Settings                                                                                  |
| :---------------- | :--------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| **Hero Headline** | THE<br>RESURRECTION                                              | **Font:** kr-serif-bold Italic<br>**Size:** 96px (Display Hero)<br>**Color:** `kr-ink-gold`                    |
| **Subhead**       | _Your professional history, re-catalogued as a living kr-motif._ | **Font:** Fraunces Variable<br>**Settings:** `opsz`=144, `WONK`=1, `SOFT`=50<br>**Color:** `paper-white` (80%) |
| **CTA Primary**   | COMMENCE EXCAVATION                                              | **Font:** JetBrains Mono<br>**Settings:** Uppercase, tracking 0.2em                                          |
| **CTA Secondary** | VIEW THE CATALOGUE                                               | **Font:** Work Sans (Body)<br>**Weight:** 400                                                                |

### Asset Integration Guide (Gap Fill)

> **[DEFINED: ASSET-16 Ink Hanging Branch]**
>
> - **Location:** Top-Right Viewport Corner (`position: absolute; top: -15%; right: -5%`).
> - **Dimensions:** ~600x400px (Natural aspect ratio).
> - **Z-Index:** 2 (Content Layer).
> - **Interaction:** Parallax factor 0.15 (slower than scroll). Subtle mouse-reactive sway (max 2deg rotation).
> - **Context:** Organic Frame - drapes over the "Login" utility, softening the digital edge with "kerala-streetprint Greenhouse" aesthetics.

> **[DEFINED: ASSET-7 Firefly Sprite]**
>
> - **Count:** 12-16 instances.
> - **Logic:** `will-change: transform, opacity`.
> - **Animation:** `float-pulse` (4s ease-in-out infinite alternate).
> - **Opacity:** Randomize between 0.4 and 0.8.
> - **Scale:** Randomize between 0.8 and 1.2.
> - **Context:** Bioluminescent Atmospherics - eliminates "flat black" by adding depth and life to "The Void".

> **[DEFINED: ASSET-9 Solidarity Hero Closeup]**
>
> - **Location:** Absolute center of `kr-screenprint.hero-container`.
> - **Blend Mode:** `luminosity` at 40% opacity (Ghosted) OR `normal` at 100% if used as main subject.
> - **Animation:** Fade-in from black on load (1.5s duration).
> - **Context:** The "Future kr-motif" - the vibrant potential of the user's career, captured in macro detail.

---

## Page 2: Authentication ("The Entry Gate")

**Missing Assets:**

- `{KR-UI-003}` **UI-KIT REQUIRED** (Screenprint Grit Particles)
- `{KR-UI-002}` **UI-KIT REQUIRED** (Halo Disk / Compass Navigation) -> _Critical Gap_

### Copy & Typography Strategy

| Element         | Draft Copy                           | Typography Token / Settings                                                  |
| :-------------- | :----------------------------------- | :--------------------------------------------------------------------------- |
| **Card Header** | IDENTIFY YOURSELF                    | **Font:** Fraunces Variable<br>**Settings:** `WONK`=0, `SOFT`=100 (Inviting) |
| **Helper Text** | _Access the kerala-rage Conservatory._ | **Font:** Lora Variable (Italic)                                             |

### Asset Integration Guide (Gap Fill)

> **[DEFINED: ASSET-15 Brass Compass Navigation]**
>
> - **Location:** Centered _beneath_ the Auth Card (`bottom: -90px`).
> - **Dimensions:** 180x180px.
> - **Opacity:** 60% (Brass texture must remain visible).
> - **State:** Static (North = 0deg).
> - **Interaction:**
>   - **Input Focus:** Rotate +15deg (Spring: stiffness 100, damping 10).
>   - **Input Blur:** Return to 0deg.
> - **Metaphor:** "Finding one's bearing" - confirms user intent before entering the collection.

---

## Page 4: Ingestion ("The Mulch & Mineral Setup")

**Missing Assets:**

- `{KR-UI-005}` **UI-KIT REQUIRED** (Charcoal Paper Base)
- `{KR-UI-007}` **UI-KIT REQUIRED** (Verification Stamp) -> _The "Success" State_
- `{KR-UI-002}` **UI-KIT REQUIRED** (Halo Disk / Compass)

### Copy & Typography Strategy

| Element             | Draft Copy                                        | Typography Token / Settings                                                |
| :------------------ | :------------------------------------------------ | :------------------------------------------------------------------------- |
| **Headline**        | DEPOSIT kr-motif                                  | **Font:** Fraunces Variable<br>**Settings:** `WONK`=0, `SOFT`=0 (Clinical) |
| **Drop Zone Label** | DROP PDF HERE<br>FOR DISSECTION                   | **Font:** JetBrains Mono<br>**Style:** Dashed border context               |
| **Success Message** | _kr-motif Verified. Organic integrity confirmed._ | **Font:** Lora Variable<br>**Color:** `kr-ink-gold`                         |

### Asset Integration Guide (Gap Fill)

> **[DEFINED: ASSET-14 Skeleton Anatomical Etching]**
>
> - **Location:** Centered strictly behind the Drop Zone.
> - **Opacity:** 4-6% (Watermark).
> - **Blend Mode:** `multiply` against Paper White background.
> - **Subject:** Osteologically accurate ribcage or vertebrae.
> - **Context:** Analysis Depth - suggests the resume is being X-rayed and analyzed down to its structural bones.
>
> **[DEFINED: ASSET-8 Fossil Verification Mark]**
>
> - **Location:** Overlapping Bottom-Right corner of Drop Zone.
> - **Trigger:** `onUploadSuccess`.
> - **Animation:** Scale (2.0 -> 1.0), Rotate (-30deg -> -5deg).
> - **Timing:** 0.4s `cubic-bezier(0.34, 1.56, 0.64, 1)` (Viscous Breeze/Bounce).
> - **Context:** The "Glossopteris" Stamp - definitive, official, archival approval.

---

## Page 5: Analysis Dashboard ("The Audit Microscope")

**Missing Assets:**

- `{KR-UI-004}` **UI-KIT REQUIRED** (Blueprint Grid Major)
- `{KR-UI-002}` **UI-KIT REQUIRED** (Halo Disk - Functioning Gauge)

### Copy & Typography Strategy

| Element         | Draft Copy      | Typography Token / Settings                         |
| :-------------- | :-------------- | :-------------------------------------------------- |
| **Gauge Label** | ALIGNMENT SCORE | **Font:** JetBrains Mono (Annotation)               |
| **Score Value** | 94.2%           | **Font:** Work Sans (Thin/Light)<br>**Size:** 120px |

### Asset Integration Guide (Gap Fill)

> **[DEFINED: ASSET-12 kr-dark Grid Major]**
>
> - **Type:** SVG Pattern coverage.
> - **Style:** 1px stroke, Spacing 100px.
> - **Color:** `#2C2723` @ 5% opacity.
> - **Behavior:** Static. Fixed to viewport.
> - **Context:** "The Lens" - transforms the screen into a measurement surface/graph paper for quantification.
>
> **[DEFINED: ASSET-15 Compass (As Gauge)]**
>
> - **Location:** Left Column Dashboard Widget.
> - **Function:** Data Visualization (Gauge).
> - **Logic:** Needle angle mapped to Analysis Score (0% = -90deg, 100% = +90deg).
> - **Transition:** 1.2s ease-out settle.
> - **Context:** Instrument of Measurement - recontextualizing the navigation tool as a precise analytic device.

---

## Page 7: Kanban ("The Command Center Greenhouse")

**Missing Assets:**

- `{KR-UI-001}` **UI-KIT REQUIRED** (Wheat Paste Tear - Column Headers) -> _Critical for visual aesthetic_
- `{KR-UI-003}` **UI-KIT REQUIRED** (Screenprint Grit Particles)

### Copy & Typography Strategy

| Element           | Draft Copy               | Typography Token / Settings                                      |
| :---------------- | :----------------------- | :--------------------------------------------------------------- |
| **Board Title**   | THE CULTIVATION<br>CYCLE | **Font:** Fraunces Variable<br>**Settings:** `WONK`=1, `SOFT`=25 |
| **Column Header** | OFFER STAGE              | **Font:** JetBrains Mono<br>**Decoration:** Underline double     |

### Asset Integration Guide (Gap Fill)

> **[DEFINED: ASSET-17 kr-activist Hanging Ceiling Gum]**
>
> - **Location:** Spanning entire Top Viewport Edge (`width: 100vw`).
> - **Height:** ~25vh.
> - **Z-Index:** 10 (Foreground Layer - above content).
> - **Effect:** Parallax Factor 0.25 (Faster than background). Blur: 2px (Depth of Field).
> - **Context:** "Canopy Immersion" - places the user physically _under_ the tree, looking up/out at their work.
>
> **[DEFINED: ASSET-19 kr-activist Kanban Column]**
>
> - **Location:** Vertical separator between columns.
> - **Width:** ~40-60px (Natural stem width).
> - **Opacity:** 100% (Solid biome element).
> - **Context:** Structural Vegetation - replaces sterile CSS borders with organic verticality to frame the "Garden" of tasks.

---

## Page 11: Dashboard Overview ("The Canopy View")

**Missing Assets:**

- `{KR-SOLID-011}` or `{KR-SOLID-029}` (Atmospheric/Paint Splash overlay) → _Available for expressive overlay_
- `{KR-UI-003}` **UI-KIT REQUIRED** (Screenprint Grit Particles)

### Copy & Typography Strategy

| Element           | Draft Copy                   | Typography Token / Settings                     |
| :---------------- | :--------------------------- | :---------------------------------------------- |
| **Hero Greeting** | _The ecosystem is thriving._ | **Font:** kr-serif-bold Italic<br>**Size:** 48px |

### Asset Integration Guide (Gap Fill)

> **[DEFINED: ASSET-17 kr-activist Hanging]**
>
> - **Location:** Dramatic Top-Left Foreground.
> - **Z-Index:** 4 (Highest).
> - **Blur:** 2-4px (Depth of Field).
> - **Context:** Voyeuristic Framing - peering through the foliage at the "Ecosystem" of career data below.

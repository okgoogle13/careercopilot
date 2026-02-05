# Northcote Curio: Consolidated Design Implementation Guide

> **Purpose**: This document acts as the definitive instruction set for generating the CareerCopilot UI. It merges layout architecture, token specifications, content strategy, and asset integration into a single "prompt-ready" format for AI implementation.

---

## 🎨 Global Design Tokens (The "Non-Negotiables")

### 1. Atmosphere (The Void)

- **Background**: `color.semantic.surface.shared.specimenNight` (#1A1714) - NEVER pure black.
- **Lighting**: Ambient "Firefly" glows, not hard spotlights.
- **Depth**: Glassmorphism (`color.glassmorphism.gallery.surface`) over Paper White (`fieldPaper` #F5F2EB).

### 2. Typography (The Voice)

- **Proclamation (Headlines)**: _Libre Bodoni_ (Italic). For wonder, invitation, and major status updates.
- **Annotation (Labels)**: `JETBRAINS MONO` (Uppercase, 0.1em tracking). For data, measurement, and scientific classification.
- **Narrative (Body)**: Work Sans. For sustained reading and interfaces.

### 3. Motion (The Viscous Breeze)

- **Physics**: `cubic-bezier(0.34, 1.56, 0.64, 1)` - Slow overshoot and gentle settle.
- **Micro-interactions**: Hovering lifts elements (`translateY(-4px)`), buttons "bloom" (scale + glow).

---

## 📄 Page Integration Specs

### PAGE 1: Landing ("The Resurrection")

_Mode: Gallery (Wonder/Appeal)_

**Layout & Assets:**

- **Hero**: `glassmorphism.hero-container` (Leaf Shape).
  - _Anchor_: `ASSET-16` (Wattle Branch) draping from Top-Right (Parallax 0.15).
  - _Atmosphere_: `ASSET-7` (Fireflies) scattered, breathing opacity (40-80%).
- **Bottom Anchor**: `ASSET-10` (Banksia Pot) grounding the Bottom-Left.

**Copy Strategy:**

- **Headline**: "THE RESURRECTION" (_Libre Bodoni Italic_, 96px, Wattle Gold).
- **Subhead**: "Your professional history, re-catalogued as a living specimen."
- **CTA**: "COMMENCE EXCAVATION" (_JetBrains Mono_, Uppercase).

### PAGE 2: Authentication ("The Entry Gate")

_Mode: Gallery (Trust/Threshold)_

**Layout & Assets:**

- **Card**: Central `stone` container, deep blur (32px).
- **Navigation**: `ASSET-15` (Brass Compass) centered _below_ the card.
  - _Interaction_: Rotates +15° on input focus.
- **Atmosphere**: `pattern-nocturnal-canopy` background (15% opacity).

**Copy Strategy:**

- **Header**: "IDENTIFY YOURSELF" (_Fraunces_, Inviting).
- **Helper**: "Access the Northcote Conservatory." (_Lora Italic_).

### PAGE 4: Ingestion ("The Mulch & Mineral Setup")

_Mode: Laboratory (Precision/Deposit)_

**Layout & Assets:**

- **Background**: `texture-laboratory-paper-white` (Solid #F5F2EB).
- **Drop Zone**: `stone` container with dashed etchings.
  - _Watermark_: `ASSET-14` (Skeleton Etching) centered behind drop zone (4% opacity, Multiply blend).
- **Success State**: `ASSET-8` (Fossil Stamp) slams onto Bottom-Right corner.

**Copy Strategy:**

- **Status**: "DEPOSIT SPECIMEN" (Strikethrough "HISTORY").
- **Instruction**: "DROP PDF HERE FOR DISSECTION".
- **Success**: "Specimen Verified. Organic integrity confirmed."

### PAGE 5: Analysis Dashboard ("The Audit Microscope")

_Mode: Laboratory (Revelation/Metric)_

**Layout & Assets:**

- **Grid**: `ASSET-12` (Major Grid) overlay entire screen (5% opacity).
- **Widget**: Left Column Gauge using `ASSET-15` (Compass).
  - _Logic_: Needle rotation maps to Score (0-100 deg).
- **Cards**: `stone` metric cards ("FIG. A", "FIG. B") with etched dividers.

**Copy Strategy:**

- **Label**: "ALIGNMENT SCORE" (_JetBrains Mono_).
- **Value**: "94.2%" (_Work Sans Thin_, 120px).

### PAGE 6: Opportunity Feed ("The Sentry Lookout")

_Mode: Gallery (Discovery/Watch)_

**Layout & Assets:**

- **Guide**: `ASSET-6` (Kookaburra Sentry) perched on the Sticky Sidebar header.
  - _Behavior_: Head tilts randomly every 8-12s.
- **List**: Glassmorphic job cards (Stone shape) revealing background through blur.

**Copy Strategy:**

- **Title**: "JOB FEED (THE SENTRY LOOKOUT)".
- **Badge**: "98% MATCH" (_Wattle Gold Seed_).

### PAGE 7: Kanban ("The Cultivation Cycle")

_Mode: Gallery (Growth/Garden)_

**Layout & Assets:**

- **Structure**: `ASSET-19` (Eucalyptus Stems) acting as vertical column separators.
- **Canopy**: `ASSET-17` (Hanging Gum) spanning top viewport (Foreground, Blur 2px).
- **Cards**: "Leaf" shaped task cards hanging on the structural stems.

**Copy Strategy:**

- **Title**: "THE CULTIVATION CYCLE".
- **Columns**: "OFFER STAGE" (Double Underline).

---

## 🛠 Asset mapping Table

| Asset ID   | Description         | Context Usage          | Behavior                        |
| :--------- | :------------------ | :--------------------- | :------------------------------ |
| `ASSET-6`  | Kookaburra Sentry   | Sidebar / Nav Anchor   | Idle animation (Head tilt)      |
| `ASSET-7`  | Firefly Sprite      | Gallery Atmosphere     | Float & Pulse (Bioluminescence) |
| `ASSET-8`  | Fossil Verification | Success State Stamp    | Scale + Slam animation          |
| `ASSET-12` | Lab Grid Major      | Lab Background Overlay | Static Quantification           |
| `ASSET-14` | Skeleton Etching    | Lab Watermark          | 4% Opacity, Multiply Blend      |
| `ASSET-15` | Brass Compass       | Navigation / Gauge     | Rotates on interaction/data     |
| `ASSET-16` | Wattle Branch       | Top-Right Frame        | Parallax Sway                   |
| `ASSET-17` | Eucalyptus Ceiling  | Top-Foreground Canopy  | Deep Parallax + Blur            |

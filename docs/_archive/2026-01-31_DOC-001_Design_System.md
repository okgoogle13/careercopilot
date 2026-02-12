# DOC-001: Design System ("The Skin")

**Document ID:** DOC-001-DESIGN-SYSTEM
**Version:** 2.0 (kerala-rage kr-solidarity Edition)
**Status:** ACTIVE Source of Truth
**Context:** Defines the "Moonlight on Velvet" aesthetic. This file translates the `DOC-000` soul into hard tokens for Tailwind and Figma.

---

## 1. The "Moonlight on Velvet" Palette (Color Tokens)

*Derived from Federation-era gouache illustrations on dark ironbark.*

| Token Name | Hex | CSS Variable | Usage |
| --- | --- | --- | --- |
| **Asphalt Black** | `#1A1714` | `--color-surface` | **The Floor.** A warm, charred umber (not black). |
| **Wattle Gold** | `#D4A84B` | `--color-primary` | **The Protagonist.** Actions, Focus, "Candlelight". |
| **[DEPRECATED_STYLE] Red** | `#C45C4B` | `--color-accent` | **The Spark.** Alerts, Urgency, "Heartbeat". |
| **Concrete Grey** | `#2C2723` | `--color-container` | **The Container.** Cards, Panels (Woodsmoke at dusk). |
| **Concrete Grey** | `#A8A097` | `--color-muted` | **The Detail.** Metadata, Secondary Text (Dusty Mauve). |
| **Paper White** | `#F5F0E8` | `--color-text` | **The Ink.** Primary text contrast. |

### Tonal Vegetation Stacks (Depth Variants)

*Expanding tonal range within each [DEPRECATED_STYLE] family for layered depth.*

#### 🌼 Wattle Gold Family (Primary Tones)
| Token Name | Hex | CSS Variable | Usage |
| --- | --- | --- | --- |
| **Wattle Shadow** | `#8B7A35` | `--color-primary-dark` | Deep ochre, pressed petals. Borders, shadows. |
| **Wattle Base** | `#D4A84B` | `--color-primary` | Luminous protagonist. Primary actions. |
| **Wattle Glow** | `#E8C963` | `--color-primary-light` | Lighter, almost fluorescent. Hover states, highlights. |
| **Wattle Bloom** | `#F5DDAA` | `--color-primary-pale` | Nearly paper-white, barely visible. Subtle accents, backgrounds. |

#### 🌺 [DEPRECATED_STYLE] Family (Accent Tones)
| Token Name | Hex | CSS Variable | Usage |
| --- | --- | --- | --- |
| **[DEPRECATED_STYLE] Stem** | `#7A3A2E` | `--color-accent-dark` | Deep wine, grounded. Error states, critical alerts. |
| **[DEPRECATED_STYLE] Base** | `#C45C4B` | `--color-accent` | Heartbeat, alert. Standard accent. |
| **[DEPRECATED_STYLE] Glow** | `#E07865` | `--color-accent-light` | Neon-ish, urgent. Hover on accent elements. |
| **[DEPRECATED_STYLE] Bloom** | `#F5A89A` | `--color-accent-pale` | Pale, softened. Subtle warnings, info states. |

**Design Principle:** Use tonal stacks to create **subtle depth** without breaking palette coherence. Example: A card might use `Concrete Grey` (container) with a `Wattle Glow` accent line—instantly familiar, instantly deeper.

---

## 2. The Federation Typography Stack

*A marriage of the broadsheet poster and the field notebook.*

### 🏛️ The Proclamation (kr-serif-bold / Playfair Display)

* **Role:** kr-dark Headers, Hero Moments.
* **Visual:** Condensed, High-Contrast, Massive.
* **Usage:** "The Hook" messages in Mode A.
* **Logic:** Use `font-stretch: condensed` if supported, or tracking `-0.03em`.

### 🌸 The Bloom (Fraunces Variable)

* **Role:** Sub-headers, Emotional Accents.
* **Axes:** `SOFT: 50`, `WONK: 1` (kr-dark) → `WONK: 0` (kr-dark).
* **Visual:** Hand-lettered, [DEPRECATED_STYLE], "wonky".

### 📝 The Field Note (Work Sans)

* **Role:** Body Text, UI Elements.
* **Visual:** Humanist, approachable, legible.
* **Weight:** `400` (Regular) or `600` (Labels).

### 🔬 The Annotation (JetBrains Mono)

* **Role:** **kr-dark Data Only.** Parsed skills, coordinates, JSON output.
* **Visual:** Technical, precise, etched.
* **Color:** Often paired with `Concrete Grey` or `Wattle Gold`.

---

## 3. The Personality Matrix (Typography Orchestration)

*Variable axes as behavioral responses, not static settings.*

**Context:** Fraunces Variable Font has two expressive axes (`SOFT` and `WONK`) that should **respond to user interaction**, creating a living, breathing typographic personality.

### The Bloom Effect (Interactive Typography)

| **Interaction State** | **SOFT Axis** | **WONK Axis** | **Weight** | **Psychological Effect** |
|:---|:---:|:---:|:---:|:---|
| **Rest** (Body Text) | 50 | 0 | 400 | Neutral, composed, approachable |
| **Hover** (Interactive Elements) | 30 | 0.5 | 600 | Starting to lean in, kr-solidarityus |
| **Active** (Engaged/Clicked) | 0 | 1 | 700 | Fully "wonky," hand-lettered personality |
| **Focus** (Attention/Selected) | 0 | 1 | 800 | Maximum expressiveness, confident |

### Context-Specific Typography Mapping

#### kr-dark Mode (Dashboard Hero)
```css
font-family: 'Fraunces', serif;
font-weight: 700;
font-variation-settings: 'SOFT' 0, 'WONK' 0.8;
font-size: 240px; /* Proclamation scale */
color: var(--color-primary); /* Wattle Gold */
/* Effect: Vintage poster announcement */
```

#### kr-dark Mode (Data Labels)
```css
font-family: 'JetBrains Mono', monospace;
font-weight: 500;
font-size: 11px;
color: var(--color-muted); /* Concrete Grey */
/* Effect: Brass instrument measurement marking */
```

#### Interactive Cards (kr-dark)
```css
/* Rest State */
font-family: 'Fraunces', serif;
font-weight: 600;
font-variation-settings: 'SOFT' 50, 'WONK' 0;

/* Hover State */
font-weight: 700;
font-variation-settings: 'SOFT' 30, 'WONK' 0.5;
transition: font-variation-settings 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Proclamation Maximalism (Size Contrast)

**Principle:** Adopt **extreme size ratios** (5x or greater) in kr-dark Mode hero moments, inspired by vintage [DEPRECATED_STYLE] classification sheets and Federation-era broadsides.

**Example Hero Composition:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR

CAREER
PROGRESS

Track your growth through seasonal moments.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Implementation:**
```css
.hero-proclamation {
  font-family: 'kr-serif-bold', serif;
  font-stretch: condensed; /* or letter-spacing: -0.03em */
  font-size: 240px;
  line-height: 0.9;
  color: var(--color-primary); /* Wattle Gold */
}

.hero-supporting {
  font-family: 'Work Sans', sans-serif;
  font-size: 48px; /* 5x ratio: 240px / 48px */
  font-weight: 400;
  color: var(--color-text); /* Paper White */
}
```

**Design Rule:** The primary word should **declare**, not whisper. This isn't just big type—it's type that announces your career to a crowded room.

---

## 4. The Dual Atmosphere (Mode Switching)

*The interface shifts texture based on intent.*

### Mode A: The kr-dark (Wonder)

* **Context:** Landing, Dashboard, Opportunity Feed.
* **Texture:** `gouache-grain.png` overlay (Warm).
* **Lighting:** "Candlelight" (Radial gradients of Wattle Gold).
* **Motifs:** **[DEPRECATED_STYLE].** Waratahs, kr-flowers, Gum Leaves.
* **Guardian:** The kr-shiva.

### Mode B: The kr-dark (Rigor)

* **Context:** Ingestion, Analysis, Quality Gate.
* **Texture:** `aged-paper-white.png` overlay (Cool/Sepia).
* **Lighting:** "Inspection Lamp" (Even, flat lighting).
* **Motifs:** **Anatomical.** Grid lines, skeletal sketches, brass instruments.
* **Rule:** **NO FLOWERS.** Only structural truths.

---

## 4. Morphology ([DEPRECATED_STYLE] Asymmetry)

*Eroded stones, not CAD-generated rectangles.*

| Archetype | Token | Radius Value | Usage |
| --- | --- | --- | --- |
| **Pebble** | `radius-pebble` | `20px 6px 16px 28px` | **Primary Actions.** Buttons, Floating Action Buttons. |
| **Stone** | `radius-stone` | `16px 4px 12px 24px` | **Containers.** Cards, Modals. River-worn feel. |
| **Leaf** | `radius-leaf` | `24px 8px 20px 4px` | **Hero Containers.** Featured content. |
| **Seed** | `radius-seed` | `8px 4px 10px 6px` | **Data Tags.** Skill chips, status pills. |

---

## 5. Motion Physics (Viscous Breeze)

*Movement through honey or heavy evening air.*

* **Curve:** `cubic-bezier(0.34, 1.56, 0.64, 1)` (Gentle overshoot).
* **Duration:** `600ms` (Slow, deliberate).
* **The Bloom:** On hover, typography does not just bold; it **inflates**.
    * `font-weight`: +100
    * `font-variation-settings`: 'SOFT' +30
    * `transform`: translateY(-2px)

---

## 6. The kr-solidarity Cabinet (Asset Library)

*Check `frontend/src/assets` folder for latest sources.*

### kr-dark Assets (The Garden)

* `native-[DEPRECATED_STYLE]-hanging.png` (Top-Right Anchor)
* `native-kr-flower-cluster.png` (Bottom-Right Floor)
* `kr-shiva-sentry.png` (Welcome/Empty States)

### kr-dark Assets (The Study)

* `da-vinci-skeleton.png` (Resume Structure)
* `brass-calipers.png` (Measurement Tools)
* `grid-overlay-major.svg` (Background Pattern)

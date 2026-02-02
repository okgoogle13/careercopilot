# Design Tokens

> Part of [Northcote Curio Design System](00-overview.md)

---

## Color Palette

_Derived from Federation-era gouache illustrations on dark ironbark._

### Core Tokens

| Token               | Hex       | CSS Variable        | Usage                                               |
| ------------------- | --------- | ------------------- | --------------------------------------------------- |
| **Specimen Night**  | `#1A1714` | `--color-surface`   | **The Floor** — warm charred umber (not black)      |
| **Wattle Gold**     | `#D4A84B` | `--color-primary`   | **The Protagonist** — actions, focus, "candlelight" |
| **Waratah Crimson** | `#C45C4B` | `--color-accent`    | **The Spark** — alerts, urgency, "heartbeat"        |
| **Eucalypt Smoke**  | `#2C2723` | `--color-container` | **The Container** — cards, panels                   |
| **Flannel Flower**  | `#A8A097` | `--color-muted`     | **The Detail** — metadata, secondary text           |
| **Parchment**       | `#F5F0E8` | `--color-text`      | **The Ink** — primary text contrast                 |

### Tonal Stacks

#### Wattle Gold Family (Primary)

| Token         | Hex       | Variable                | Usage             |
| ------------- | --------- | ----------------------- | ----------------- |
| Wattle Shadow | `#8B7A35` | `--color-primary-dark`  | Borders, shadows  |
| Wattle Base   | `#D4A84B` | `--color-primary`       | Primary actions   |
| Wattle Glow   | `#E8C963` | `--color-primary-light` | Hover, highlights |
| Wattle Bloom  | `#F5DDAA` | `--color-primary-pale`  | Subtle accents    |

#### Waratah Family (Accent)

| Token         | Hex       | Variable               | Usage           |
| ------------- | --------- | ---------------------- | --------------- |
| Waratah Stem  | `#7A3A2E` | `--color-accent-dark`  | Error states    |
| Waratah Base  | `#C45C4B` | `--color-accent`       | Standard accent |
| Waratah Glow  | `#E07865` | `--color-accent-light` | Hover on accent |
| Waratah Bloom | `#F5A89A` | `--color-accent-pale`  | Subtle warnings |

---

## Border Radius (Organic Asymmetry)

_Eroded stones, not CAD-generated rectangles._

| Archetype  | Token           | Value                | Usage           |
| ---------- | --------------- | -------------------- | --------------- |
| **Pebble** | `radius-pebble` | `20px 6px 16px 28px` | Buttons, FABs   |
| **Stone**  | `radius-stone`  | `16px 4px 12px 24px` | Cards, Modals   |
| **Leaf**   | `radius-leaf`   | `24px 8px 20px 4px`  | Hero containers |
| **Seed**   | `radius-seed`   | `8px 4px 10px 6px`   | Tags, pills     |

---

## Motion (Viscous Breeze)

| Property     | Value                               | Purpose          |
| ------------ | ----------------------------------- | ---------------- |
| **Curve**    | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Gentle overshoot |
| **Duration** | `600ms`                             | Slow, deliberate |
| **Lift**     | `translateY(-2px)`                  | Hover elevation  |

### The Bloom Effect

On hover, elements don't just change color — they _inflate_:

- `font-weight`: +100
- `font-variation-settings`: 'SOFT' +30
- `transform`: translateY(-2px)

---

## Dual Atmosphere (Mode Switching)

### Gallery Mode (Wonder)

- **Texture**: `gouache-grain.png` overlay (warm)
- **Lighting**: "Candlelight" — radial gradients of Wattle Gold
- **Motifs**: Botanical — Waratahs, Banksias, Gum Leaves

### Laboratory Mode (Rigor)

- **Texture**: `aged-parchment.png` overlay (cool/sepia)
- **Lighting**: "Inspection Lamp" — even, flat
- **Motifs**: Anatomical — grid lines, skeletal sketches, brass instruments
- **Rule**: **NO FLOWERS**

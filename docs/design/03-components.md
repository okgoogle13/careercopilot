<<<<<<< HEAD
# Component Catalog

> Part of [Northcote Curio Design System](00-overview.md)

---

## Interactive Objects ("The Tools")

### The Pebble (Button)

| Property | Value                                           |
| -------- | ----------------------------------------------- |
| Token    | `radius-pebble` (`20px 6px 16px 28px`)          |
| Texture  | Matte finish, "Worn River Stone"                |
| Rest     | Wattle Gold (solid) or Specimen Night (outline) |
| Hover    | **The Bloom** — inflates, lifts                 |
| Active   | Pressed into sand (`scale(0.98)`)               |

```css
.btn-pebble:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 16px rgba(212, 168, 75, 0.4);
  transition: all 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
=======
# Component Catalog: The Solidarity Kit

> Part of [Kerala Rage Design System – Contemporary Australian](00-overview.md)

---

## 1. Interactive Objects (“The Tools”)

### The Pebble (Action Anchor)

High-contrast pill buttons that anchor the user's primary journey.

| Property | Value                                                     |
| -------- | --------------------------------------------------------- |
| Token    | `radius-pebble` (`100px`)                                 |
| Surface  | `inkGold` or `solidarityRed` with `charcoalBackground` text |
| Rest     | Solid color block.                                        |
| Hover    | **Bloom** — lifts slightly, gains emphasis weight (+100). |
| Active   | Pressed into surface (`scale(0.98)`).                     |

```css
.btn-pebble {
  border-radius: var(--kr-radius-pebble);
  background: var(--kr-ink-gold);
  color: var(--kr-charcoal-bg);
  transition: transform 0.2s cubic-bezier(0.3, 0, 0.2, 1);
>>>>>>> restoration-KR-Rage-Figma-v2.0
}
```

### The Lens (Input Field)

<<<<<<< HEAD
| Property   | Value                                         |
| ---------- | --------------------------------------------- |
| Token      | `radius-stone` (inverted)                     |
| Texture    | Glass and Brass                               |
| Background | Eucalypt Smoke with `border-b` Flannel Flower |
| Focus      | Border lights up Wattle Gold ("The Filament") |

---

## Containers ("The Cases")

### The Stone (Card)

| Property   | Value                                 |
| ---------- | ------------------------------------- |
| Token      | `radius-stone` (`16px 4px 12px 24px`) |
| Texture    | Dark Ironbark or Velvet               |
| Background | Eucalypt Smoke                        |
| Shadow     | "Ink Pool" — diffuse, bottom-heavy    |
| Usage      | Job Cards, Skill Groups               |

### The Leaf (Hero Wrapper)

| Property | Value                               |
| -------- | ----------------------------------- |
| Token    | `radius-leaf` (`24px 8px 20px 4px`) |
| Vibe     | Organic, sweeping                   |
| Usage    | Page Headers, Main Dashboards       |

---

## Informational ("The Labels")

### The Seed (Badge/Tag)

| Property   | Value                                            |
| ---------- | ------------------------------------------------ |
| Token      | `radius-seed` (`8px 4px 10px 6px`)               |
| Typography | JetBrains Mono                                   |
| Colors     | Flannel Flower (muted), Waratah Crimson (alerts) |

### The Sentry (Avatar)

| Property | Value                         |
| -------- | ----------------------------- |
| Shape    | Imperfect Circle (98% radius) |
| Border   | Gold leaf (`border-primary`)  |

---

## Motion Patterns

### The Unfolding (Card Hover)

Three-phase cascade when hovering:

1. **Phase 1** (0-200ms): Card lifts `translateY(-12px)`
2. **Phase 2** (100-400ms): Background glow expands
3. **Phase 3** (200-600ms): Typography blooms

```css
.card:hover {
  transform: translateY(-12px);
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card:hover .card-title {
  font-weight: 700;
  font-variation-settings:
    "SOFT" 0,
    "WONK" 0.7;
  transition: all 400ms ease 200ms; /* delayed start */
}
```

### Hero Reveal (Page Load)

```css
@keyframes heroReveal {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  60% {
    opacity: 1;
    transform: translateY(-4px) scale(1.01);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}

.hero-leaf {
  animation: heroReveal 1200ms cubic-bezier(0.34, 1.56, 0.64, 1);
=======
Tactical input surfaces that feel like drawing through a stencil.

| Property | Value                                                     |
| -------- | --------------------------------------------------------- |
| Token    | `radius-slab`                                             |
| Surface  | `charcoalBackground` with `blueprintGrey` borders.        |
| Focus    | Border and label shift to `inkGold` (the "reveal" glow). |

```css
.input-lens {
  border-radius: var(--kr-radius-slab);
  background: var(--kr-charcoal-bg);
  border: 1px solid var(--kr-blueprint-grey);
  color: var(--kr-paper-white);
>>>>>>> restoration-KR-Rage-Figma-v2.0
}
```

---

<<<<<<< HEAD
## Motion Principles

1. **Staggered timing** — overlapping start times
2. **Multiple properties** — transform + shadow + typography together
3. **Organic easing** — gentle overshoot, not linear
4. **Meaningful duration** — 600ms+, not instant

This creates **natural unfolding**, not mechanical state changes.
=======
## 2. Containers (“The Cases”)

### The Stone (Action Card)

Asymmetric containers for dynamic content like job listings or analysis.

| Property | Value                                           |
| -------- | ----------------------------------------------- |
| Token    | `radius-stone` (`16px 4px 12px 24px`)           |
| Surface  | `charcoalBackground` with layered grit texture. |
| Shadow   | Sharp, high-contrast elevation.                 |
| Usage    | Opportunity feed cards, Kanban items.           |

```css
.card-stone {
  border-radius: var(--kr-radius-stone);
  background: var(--kr-charcoal-bg);
  box-shadow: 4px 4px 0px var(--kr-blueprint-grey);
}
```

### The Slab (Structural Panel)

Minimal, low-radius containers for layout organization.

| Property | Value                              |
| -------- | ---------------------------------- |
| Token    | `radius-slab` (`4px`)              |
| Usage    | Dashboard widgets, sidebar panels. |

---

## 3. Informational (“The Marks”)

### The Stamp (Status / Badge)

Monospaced indicators of state or category.

| Property   | Value                                                |
| ---------- | ---------------------------------------------------- |
| Token      | `radius-slab`                                        |
| Typography | JetBrains Mono                                       |
| Colors     | `blueprintGrey` for neutral, `solidarityRed` for alerts |

---

## 4. Motion Patterns

### The Press (Hover)

Elements "press" back or lift forward with a tactile click.

- `transform: translateY(-4px)`
- `box-shadow` increases in opacity, not just blur.

### The Stencil Slam (Page Load)

Headers and major assets "slam" into position (600ms) with a dramatic overshoot, suggesting a physical screenprint press hitting the paper.
>>>>>>> restoration-KR-Rage-Figma-v2.0

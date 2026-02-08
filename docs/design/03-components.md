# Component Catalog: The Solidarity Kit

> Part of [Kerala Rage Design System – Contemporary Australian](00-overview.md)

---

## 1. Interactive Objects (“The Tools”)

### The Pebble (Action Anchor)

High-contrast pill buttons that anchor the user's primary journey.

| Property | Value                                                     |
| -------- | --------------------------------------------------------- |
| Token    | `radius-pebble` (`100px`)                                 |
| Surface  | `baruGold` or `waratahRed` with `charcoalBackground` text |
| Rest     | Solid color block.                                        |
| Hover    | **Bloom** — lifts slightly, gains emphasis weight (+100). |
| Active   | Pressed into surface (`scale(0.98)`).                     |

```css
.btn-pebble {
  border-radius: var(--kr-radius-pebble);
  background: var(--kr-baru-gold);
  color: var(--kr-charcoal-bg);
  transition: transform 0.2s cubic-bezier(0.3, 0, 0.2, 1);
}
```

### The Lens (Input Field)

Tactical input surfaces that feel like drawing through a stencil.

| Property | Value                                                     |
| -------- | --------------------------------------------------------- |
| Token    | `radius-slab`                                             |
| Surface  | `charcoalBackground` with `blueprintGrey` borders.        |
| Focus    | Border and label shift to `baruGold` (the "reveal" glow). |

```css
.input-lens {
  border-radius: var(--kr-radius-slab);
  background: var(--kr-charcoal-bg);
  border: 1px solid var(--kr-blueprint-grey);
  color: var(--kr-paper-white);
}
```

---

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
| Colors     | `blueprintGrey` for neutral, `waratahRed` for alerts |

---

## 4. Motion Patterns

### The Press (Hover)

Elements "press" back or lift forward with a tactile click.

- `transform: translateY(-4px)`
- `box-shadow` increases in opacity, not just blur.

### The Stencil Slam (Page Load)

Headers and major assets "slam" into position (600ms) with a dramatic overshoot, suggesting a physical screenprint press hitting the paper.

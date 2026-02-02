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
}
```

### The Lens (Input Field)

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
}
```

---

## Motion Principles

1. **Staggered timing** — overlapping start times
2. **Multiple properties** — transform + shadow + typography together
3. **Organic easing** — gentle overshoot, not linear
4. **Meaningful duration** — 600ms+, not instant

This creates **natural unfolding**, not mechanical state changes.

Here’s a contemporary, token-aligned rewrite of that components doc.

---

# Component Catalog

> Part of [kerala-rage Design System – Contemporary Australian](00-overview.md) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/kerala-rage-design-principles.md)

---

## Interactive Objects (“The Tools”)

### The Pebble (Button)

| Property | Value                                                               |
| -------- | ------------------------------------------------------------------- |
| Token    | `radius-pebble` (`20px 6px 16px 28px`)                              |
| Surface  | Asphalt Black or Concrete Grey, with strong contrast text           |
| Rest     | Wattle Gold (solid primary) or Asphalt Black outline on Paper White |
| Hover    | **Bloom** — lifts slightly, gains emphasis                          |
| Active   | Pressed into surface (`scale(0.98)`)                                |

```css
.btn-pebble {
  border-radius: var(--radius-button, 24px);
  background: var(--color-primary); /* Wattle Gold */
  color: var(--color-surface); /* Asphalt Black */
  transition:
    transform var(--duration-medium-2) var(--easing-standard),
    box-shadow var(--duration-medium-2) var(--easing-standard);
}

.btn-pebble:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--elevation-3); /* Use semantic token instead of hardcoded */
}
```

### The Lens (Input Field)

| Property | Value                                                       |
| -------- | ----------------------------------------------------------- |
| Token    | `radius-stone`                                              |
| Surface  | Concrete Grey container on Asphalt Black background         |
| Border   | Subtle 1px Concrete Grey by default                         |
| Focus    | Border and label shift to Wattle Gold (the “filament” glow) |

```css
.input-lens {
  border-radius: var(--radius-card, 16px);
  background: var(--color-container); /* Concrete Grey */
  border: 1px solid var(--color-muted); /* Muted neutral */
  color: var(--color-text); /* Paper White */
}

.input-lens:focus-visible {
  outline: none;
  border-color: var(--color-primary); /* Wattle Gold */
  box-shadow: 0 0 0 1px var(--color-primary);
}
```

---

## Containers (“The Cases”)

### The Stone (Card)

| Property | Value                                   |
| -------- | --------------------------------------- |
| Token    | `radius-stone` (`16px 4px 12px 24px`)   |
| Surface  | Concrete Grey on Asphalt Black          |
| Shadow   | Soft, bottom-biased elevation tokens    |
| Usage    | Job cards, skill groups, summary blocks |

```css
.card-stone {
  border-radius: var(--radius-card, 28px);
  background: var(--color-container);
  box-shadow: var(--elevation-2);
  padding: var(--card-padding, 24px);
}
```

### The Leaf (Hero Wrapper)

| Property | Value                               |
| -------- | ----------------------------------- |
| Token    | `radius-leaf` (`24px 8px 20px 4px`) |
| Vibe     | Long, sweeping container            |
| Usage    | Page headers, primary dashboards    |

```css
.hero-leaf {
  border-radius: var(--radius-hero, 24px 8px 20px 4px);
  background: var(--color-surface-container-high);
  box-shadow: var(--elevation-3);
}
```

---

## Informational (“The Labels”)

### The Seed (Badge / Tag)

| Property   | Value                                             |
| ---------- | ------------------------------------------------- |
| Token      | `radius-seed` (`8px 4px 10px 6px`)                |
| Typography | JetBrains Mono                                    |
| Colors     | Concrete Grey for neutral, Waratah Red for alerts |

```css
.badge-seed {
  border-radius: var(--radius-badge, 8px);
  padding: 0 0.5rem;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
}

.badge-seed--neutral {
  background: var(--color-container);
  color: var(--color-muted);
}

.badge-seed--alert {
  background: var(--color-accent); /* Waratah Red */
  color: var(--color-surface); /* Asphalt Black */
}
```

### The Sentry (Avatar)

| Property | Value                                          |
| -------- | ---------------------------------------------- |
| Shape    | Imperfect circle (border-radius ~48–50%)       |
| Border   | Wattle Gold ring (`border-color: primary`)     |
| Usage    | kr-shiva or user avatar anchor in navigation |

```css
.avatar-sentry {
  border-radius: 48%;
  border: 2px solid var(--color-primary);
  background: var(--color-surface-container-high);
}
```

---

## Motion Patterns

### Unfold (Card Hover)

Three-phase feel (implemented with simple transitions):

1. Card lifts (`translateY(-4px)` to `-8px`).
2. Shadow deepens.
3. Title weight increases slightly. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json)

```css
.card-stone {
  transition:
    transform var(--duration-medium-2) var(--easing-standard),
    box-shadow var(--duration-medium-2) var(--easing-standard);
}

.card-stone:hover {
  transform: translateY(-8px);
  box-shadow: var(--elevation-3);
}

.card-stone:hover .card-title {
  font-weight: 700;
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
  animation: heroReveal var(--duration-long-4) var(--easing-emphasized-decelerate);
}
```

---

## Motion Principles

1. **Staggered timing** – overlapping but not chaotic; use delays for child elements. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/efa04425-d50c-4611-bc01-ab05d271c694/annotated-wireframes.md)
2. **Multi-property changes** – combine transform + elevation + subtle color shifts. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/3c4a620b-da4a-462e-bacc-412a0775f24c/01-tokens.md)
3. **Organic easing** – use the "viscous breeze" curves, avoid linear transitions. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json)
4. **Intentional duration** – 250–600ms; fast enough for work, slow enough to feel calm.

The goal is **natural unfolding**, like posters and plants responding to the environment, not mechanical state flips.

---

## M3 Spring Physics Validation

Our motion curves match M3 Expressive spring physics:

| Token                      | Bezier                                | Overshoot | Use Case                    |
|----------------------------|---------------------------------------|-----------|-----------------------------|
| `--easing-standard`        | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | 12.75%    | Subtle bounce (buttons, cards) |
| `--easing-emphasized`      | `cubic-bezier(0.68, -0.55, 0.265, 1.55)`  | 55%       | Playful bounce (notifications) |
| `--easing-decelerate`      | `cubic-bezier(0.05, 0.7, 0.1, 1)`         | 0%        | Smooth page enters          |

**Verify tokens.json contains these exact curves.**

---

## M3 Duration Scale Validation

Material 3 Expressive duration scale:

| Token                | Value  | Use Case                   |
|----------------------|--------|----------------------------|
| `--duration-short`   | 50ms   | Micro-interactions         |
| `--duration-medium-2`| 250ms  | Standard transitions       |
| `--duration-long-4`  | 500ms  | Page load animations       |

**Maximum duration: 600ms** (per M3 accessibility guidelines)

---

## Accessibility: prefers-reduced-motion

All animations MUST respect user motion preferences:

```css
.card-stone {
  transition: transform var(--duration-medium-2) var(--easing-standard);
}

@media (prefers-reduced-motion: reduce) {
  .card-stone {
    transition: transform 200ms ease; /* Simple fade instead of spring */
  }
}

@media (prefers-reduced-motion: reduce) {
  .skip-animation {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

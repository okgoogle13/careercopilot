-# DOC-004: Component Catalog ("The Cabinet")

**Document ID:** DOC-004-CATALOG
**Version:** 2.0 (kerala-rage kr-solidarity Edition)
**Status:** DEFINITIVE
**Context:** The physical artifacts of the interface. Each component is a handcrafted object in the kr-solidarity Cabinet.

---

## 1. Interactive Objects ("The Tools")

### The Pebble (Button)
*   **Token:** `radius-pebble` (`20px 6px 16px 28px`)
*   **Texture:** Matte finish, "Worn River Stone."
*   **State:**
    *   *Rest:* Wattle Gold (Solid) or Asphalt Black (Outline).
    *   *Hover:* "The Bloom" (Inflates, Lifts).
    *   *Active:* Pressed into the sand (Scale 0.98).
*   **Usage:** Primary Actions (Save, Analyze, Apply).

### The Lens (Input Field)
*   **Token:** `radius-stone` (Inverted)
*   **Texture:** Glass and Brass.
*   **Style:** `bg-surface-container` (Concrete Grey) with a `border-b` of Concrete Grey.
*   **Focus:** Border lights up with Wattle Gold ("The Filament").
*   **Usage:** Text inputs, Search bars.

---

## 2. Containers ("The Cases")

### The Stone (Card)
*   **Token:** `radius-stone` (`16px 4px 12px 24px`)
*   **Texture:** Dark Ironbark or Velvet.
*   **Style:** `bg-surface-container` (Concrete Grey).
*   **Shadow:** "Ink Pool" (Diffuse, bottom-heavy).
*   **Usage:** Job Cards, Skill Groups.

### The Leaf (Hero Wrapper)
*   **Token:** `radius-leaf` (`24px 8px 20px 4px`)
*   **Vibe:** [DEPRECATED_STYLE], sweeping.
*   **Style:** Often holds the "kr-flower Composition" pattern.
*   **Usage:** Page Headers, Main Dashboards.

---

## 3. Informational ("The Labels")

### The Seed (Badge/Tag)
*   **Token:** `radius-seed` (`8px 4px 10px 6px`)
*   **Texture:** Small, precise, [DEPRECATED_STYLE].
*   **Style:** `bg-muted` (Concrete Grey) or `bg-accent` ([DEPRECATED_STYLE] Red) for alerts.
*   **Typography:** JetBrains Mono (The Annotation).
*   **Usage:** Skill tags, Status indicators.

### The Sentry (Avatar)
*   **Shape:** Imperfect Circle (98% radius).
*   **Border:** Gold leaf (`border-primary`).
*   **Usage:** User profile image, System agent status.

---

## 4. Motion Primer (\"The Unfolding\")

*Compound, staggered animations that separate premium from functional.*

**Philosophy:** Material 3 expressiveness demands **motion complexity**—not just a single easing curve, but layered, staggered, multi-axis movement. Each interaction should feel like a natural phenomenon unfolding.

### The Unfolding Pattern (Card Hover)

When a user hovers over a Job Card in kr-dark Mode, trigger a **three-phase cascade**:

```css
/* Phase 1: Card Lifts (0-200ms) */
.card:hover {
  transform: translateY(-12px);
  opacity: 1.0;
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Phase 2: Background Glow Expands (100-400ms, overlapped) */
.card:hover::before {
  box-shadow: 0 24px 48px rgba(212, 168, 75, 0.2); /* Wattle Gold glow */
  transition: box-shadow 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 100ms;
}

/* Phase 3: Typography Blooms (200-600ms, overlapped) */
.card:hover .card-title {
  font-weight: 700;
  font-variation-settings: 'SOFT' 0, 'WONK' 0.7;
  transition: font-variation-settings 400ms cubic-bezier(0.34, 1.56, 0.64, 1) 200ms,
              font-weight 400ms cubic-bezier(0.34, 1.56, 0.64, 1) 200ms;
}
```

**Effect:** The card doesn't just highlight; it **unfolds like a flower opening to sunlight**. Each phase starts at a slightly different time, creating a cascade of awakening.

### Pebble Button Interaction

```css
/* Rest State */
.btn-pebble {
  transform: scale(1);
  box-shadow: 0 4px 8px rgba(26, 23, 20, 0.3);
}

/* Hover: The Bloom */
.btn-pebble:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 16px rgba(212, 168, 75, 0.4);
  font-variation-settings: 'SOFT' 30;
  transition: all 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Active: Pressed into Sand */
.btn-pebble:active {
  transform: scale(0.98);
  box-shadow: 0 2px 4px rgba(26, 23, 20, 0.2);
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Mode Switch Animation (kr-dark ↔ kr-dark)

```css
/* kr-dark to kr-dark Transition */
@keyframes modeSwitch {
  0% {
    background-image: url('gouache-grain.png');
    filter: hue-rotate(0deg) saturate(1);
  }
  50% {
    opacity: 0.5;
    filter: blur(4px);
  }
  100% {
    background-image: url('aged-paper-white.png');
    filter: hue-rotate(-15deg) saturate(0.8);
  }
}

.mode-transition {
  animation: modeSwitch 800ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Seed Badge Interaction

```css
/* Rest State */
.badge-seed {
  transform: scale(1);
  opacity: 0.9;
}

/* Hover: Subtle Pulse */
.badge-seed:hover {
  transform: scale(1.05);
  opacity: 1;
  box-shadow: 0 2px 8px rgba(212, 168, 75, 0.3);
  transition: all 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Leaf Hero Appearance (Page Load)

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

**Key Principle:** Each animation phase should have:
1. **Staggered timing** (overlapping start times)
2. **Multiple properties animating** (transform + shadow + typography)
3. **[DEPRECATED_STYLE] easing** (gentle overshoot, not linear)
4. **Meaningful duration** (600ms+, not instant)

This creates the sensation of **natural unfolding**, not mechanical state changes.

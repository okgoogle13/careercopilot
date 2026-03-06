# HiFi Mockup: Auth Screen (Landing)

**Design System**: kerala-rage kr-solidarity V3.1
**Mode**: kr-dark (Expressive, Gateway)
**Target Score**: ≥360/400 (90% — Excellent)
**Generated**: 2026-02-16

---

## Layout Specification

```
┌─────────────────────────────────────────────────────────────┐
│  Header Rail (Slim)                                          │
│  Height: 60px                                               │
│  [Logo Mark] (Left)                                         │
│  [Sign In] [Join] (Right)                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Manifesto Hero (Top Half)                                   │
│  Height: 50vh                                               │
│  Padding: 64px                                              │
│                                                             │
│  "WORKERS OF THE DIGITAL WORLD"                             │
│  Font: Fraunces Energetic 72px                              │
│  Color: Solidarity Red                                      │
│                                                             │
│  [Search / Email Input] (Lens Archetype)                    │
│  "Enter your email to begin..."                             │
│  [Button: Get Started (Pebble)]                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Content Grid (Bottom Half)                                  │
│  Cols: 3 (Desktop)                                          │
│  Gap: 24px                                                  │
│  Padding: 48px                                              │
│                                                             │
│  [Card: Why Join?] [Card: Feature 1] [Card: Feature 2]      │
│  Style: Stone Archetype                                     │
│  Bg: Asphalt Black/50                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Footer Bar (Minimal)                                        │
│  Links: Legal · Help                                        │
│  Color: Muted Ash                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Typography Hierarchy

| Element | Font Stack | Size/Weight | Color | Styling |
|---------|-----------|-------------|-------|---------|
| **Hero Title** | Fraunces | 72px / 800 | `--sys-color-solidarityRed-base` | Energetic |
| **Hero Sub** | Work Sans | 20px / 400 | `--sys-color-paperWhite` | Normal |
| **Card Heading** | Fraunces | 28px / 700 | `--sys-color-paperWhite` | Restrained |
| **Utility Label** | JetBrains Mono | 12px / 700 | `--sys-color-inkGold-base` | Uppercase |

---

## Color Palette (Semantic Tokens)

| Usage | Token | Hex |
|-------|-------|-----|
| **Background** | `--sys-color-charcoalBackground-base` | `#1A1714` |
| **Hero Texture-Overlay** | `--sys-color-surface-charcoal` (30%) | `rgba(42,36,32,0.3)` |
| **Primary CTA** | `--sys-color-inkGold-base` | `#D4A84B` |
| **Error/Alert** | `--sys-color-solidarityRed-base` | `#C45C4B` |

---

## Component Specifications

### ManifestoCard (Stone Archetype)

**Props:**
```typescript
interface ManifestoCardProps {
  title: string;
  content: string;
  icon?: React.ReactNode;
}
```

**Styles:**
```css
.manifesto-card {
  background: var(--sys-color-asphaltBlack);
  border: 1px solid var(--sys-color-white-steps-5);
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: transform 0.2s;
}

.manifesto-card:hover {
  transform: translateY(-4px);
  border-color: var(--sys-color-inkGold-base); /* Hint */
}
```

### LensInput (Hero Archetype)

**Styles:**
```css
.hero-input-group {
  display: flex;
  gap: 16px;
  max-width: 600px;
  margin-top: 32px;
}

.hero-input {
  flex: 1;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--sys-color-white-steps-10);
  border-radius: 32px; /* Lens shape */
  padding: 0 24px;
  height: 64px;
  font-size: 18px;
  color: white;
}
```

---

## Motion & Interaction

### Hero Arrival
- **Target**: Headline & Input
- **Animation**: `y: 36px -> 0`, `opacity: 0 -> 1`.
- **Spring**: Heavy/Slow (Mass 2).

### Focus Glow
- **Target**: Hero Input
- **Effect**: `box-shadow: 0 0 24px rgba(212,168,75,0.2)`.

---

## Motif Slots

### 1. Screenprint Grit (Overlay)
- **Asset**: `{KR-UI-003}`
- **Opacity**: 15%
- **Blend Mode**: Overlay

### 2. Halo Disk (Hero Backing)
- **Asset**: `{KR-UI-002}`
- **Position**: Center-Right
- **Opacity**: 30%

---

## Accessibility (WCAG 2.2 AA)

### Requirements
- **Contrast**: Hero Red text must be large enough (72px) to pass ratio requirements on dark bg.
- **Labels**: Hero input needs visible label or `aria-label`.
- **Landmarks**: `<header>`, `<main>`, `<footer>` structure.

---

**Status**: Ready for Implementation
**Evaluator**: ui-design-evaluator

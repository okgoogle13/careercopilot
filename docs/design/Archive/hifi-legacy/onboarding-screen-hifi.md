# HiFi Mockup: Onboarding Screen

**Design System**: kerala-rage kr-solidarity V3.1
**Mode**: kr-dark (Welcoming, Choice-Driven)
**Target Score**: ≥360/400 (90% — Excellent)
**Generated**: 2026-02-16

---

## Layout Specification

```
┌─────────────────────────────────────────────────────────────┐
│  Layout Region: Path Selection (Centered)                    │
│  Height: 100vh                                              │
│  Align: Center/Center                                       │
│                                                             │
│  [Page Headline]                                            │
│  "Choose Your Role"                                         │
│  Font: Fraunces Energetic 72px                              │
│  Margin-Bottom: 96px                                        │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Developer   │  │  Organizer   │  │  Analyst     │      │
│  │              │  │              │  │              │      │
│  │  [Icon]      │  │  [Icon]      │  │  [Icon]      │      │
│  │              │  │              │  │              │      │
│  │  Title       │  │  Title       │  │  Title       │      │
│  │  Desc...     │  │  Desc...     │  │  Desc...     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│   (Grid Gap: 48px)                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Typography Hierarchy

| Element | Font Stack | Size/Weight | Color | Styling |
|---------|-----------|-------------|-------|---------|
| **Page Headline** | Fraunces | 72px / 800 | `--sys-color-paperWhite` | Energetic (-2px) |
| **Card Title** | Fraunces | 32px / 700 | `--sys-color-paperWhite` | Restrained |
| **Card Body** | Work Sans | 16px / 400 | `--sys-color-paperWhite` (70%) | Leading 1.6 |
| **Secondary** | JetBrains Mono | 12px / 500 | `--sys-color-worker-ash-steps-6` | Uppercase |

---

## Color Palette (Semantic Tokens)

| Usage | Token | Hex |
|-------|-------|-----|
| **Background** | `--sys-color-charcoalBackground-base` | `#1A1714` |
| **Card Surface** | `--sys-color-asphaltBlack` | `#1A1714` (Solid) |
| **Card Border** | `--sys-color-white-steps-5` | `rgba(255,255,255,0.05)` |
| **Active Border** | `--sys-color-inkGold-base` | `#D4A84B` |
| **Hover Lift** | `--sys-color-surface-charcoal` | `#2A2420` |

---

## Component Specifications

### SelectionCard (SolidarityCard Archetype)

**Props:**
```typescript
interface SelectionCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onSelect: (id: string) => void;
}
```

**Styles:**
```css
.selection-card {
  background: var(--sys-color-charcoalBackground-base);
  border: 1px solid var(--sys-color-white-steps-5);
  border-radius: 24px;
  padding: 40px;
  width: 320px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3); /* shadow-viscous */
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  position: relative;
  overflow: hidden;
}

.selection-card:hover {
  transform: translateY(-8px);
  border-color: var(--sys-color-inkGold-base); /* 40% opac */
  box-shadow: 0 12px 32px rgba(212, 168, 75, 0.15); /* shadow-ink-glow */
}

.selection-card::before {
  /* Inner glow on hover */
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, var(--sys-color-inkGold-steps-10), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.selection-card:hover::before {
  opacity: 1;
}
```

---

## Motion & Interaction

### Path Entry Animation
- **Trigger**: Page Load
- **Target**: Cards
- **Behavior**: Staggered rise and fade in.
- **Properties**: `y: 20px -> 0`, `opacity: 0 -> 1`.
- **Stagger**: 100ms between cards.

### Blueprint Fade (Background)
- **Target**: `{KR-UI-004}` Blueprint Grid
- **Behavior**: Slow fade in.
- **Properties**: `opacity: 0 -> 0.08` over 2s.
- **Effect**: Subtle technical context appears *after* the primary choices.

---

## Motif Slots

### 1. Blueprint Grid (Overlay)
- **Asset**: `{KR-UI-004}`
- **Opacity**: 8%
- **Z-Index**: -1

### 2. Halo Disk (Decorative)
- **Asset**: `{KR-UI-002}`
- **Position**: Behind the center card (Organizer/Primary path).
- **Opacity**: 20%
- **Behavior**: Slow pulse.

---

## Accessibility (WCAG 2.2 AA)

### Requirement Checklist
- **Tab Order**: Cards must be focusable (`tabindex="0"`).
- **Selection**: Enter/Space key triggers selection.
- **Focus Ring**: Visible gold outline (`3px solid InkGold`) on focus.
- **Headings**: Card titles should be `<h3>`.

---

**Status**: Ready for Implementation
**Evaluator**: ui-design-evaluator

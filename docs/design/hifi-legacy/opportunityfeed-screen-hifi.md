# HiFi Mockup: Opportunity Feed Screen

**Design System**: kerala-rage kr-solidarity V3.1
**Mode**: kr-dark (Dynamic, High-Volume)
**Target Score**: ≥360/400 (90% — Excellent)
**Generated**: 2026-02-16

---

## Layout Specification

```
┌─────────────────────────────────────────────────────────────┐
│  Feed Headline (Sticky)                                      │
│  Height: 80px                                               │
│  "Opportunity Stream"                                       │
│  Font: Fraunces Energetic 48px                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Filter Bar (Floating/Sticky)                                │
│  [Chip: All] [Chip: High Priority] [Chip: Solidarity]       │
│  Style: Pebble Archetype (Capsule)                          │
│  Gap: 12px                                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Mission Stream (List)                                       │
│  Width: 800px (Centered on Desktop)                         │
│  Gap: 16px                                                  │
│                                                             │
│  [Opportunity Item: Stone]                                  │
│  Start: "Union Organizer - Local 22"                        │
│  Tags: [Full-time] [Urgent]                                 │
│  Border: Red/40 (Priority)                                  │
│                                                             │
│  [Opportunity Item: Stone]                                  │
│  Start: "React Dev - Co-op"                                 │
│  Tags: [Contract]                                           │
│  Border: White/5                                            │
│                                                             │
│  ... (Infinite Scroll)                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Typography Hierarchy

| Element | Font Stack | Size/Weight | Color | Styling |
|---------|-----------|-------------|-------|---------|
| **Feed Headline** | Fraunces | 48px / 800 | `--sys-color-paperWhite` | Energetic |
| **Role Title** | Fraunces | 20px / 700 | `--sys-color-paperWhite` | Restrained |
| **Organization** | Work Sans | 14px / 500 | `--sys-color-paperWhite` (60%) | Uppercase |
| **Badge Label** | JetBrains Mono | 12px / 700 | `--sys-color-asphaltBlack` | Monospace |
| **Date Stamp** | JetBrains Mono | 12px / 400 | `--sys-color-worker-ash-steps-6` | Monospace |

---

## Color Palette (Semantic Tokens)

| Usage | Token | Hex |
|-------|-------|-----|
| **Background** | `--sys-color-charcoalBackground-base` | `#1A1714` |
| **Filter Chip (Off)** | `--sys-color-surface-charcoal` | `#2A2420` |
| **Filter Chip (On)** | `--sys-color-inkGold-base` | `#D4A84B` |
| **Item Surface** | `--sys-color-asphaltBlack` (50%) | `rgba(26,23,20,0.5)` |
| **High Priority** | `--sys-color-solidarityRed-base` | `#C45C4B` |
| **Divider** | `--sys-color-white-steps-5` | `rgba(255,255,255,0.05)` |

---

## Component Specifications

### OpportunityItem (Stone Archetype)

**Props:**
```typescript
interface OpportunityItemProps {
  title: string;
  organization: string;
  tags: string[];
  isPriority?: boolean;
  postedDate: string;
}
```

**Styles:**
```css
.opportunity-item {
  background: rgba(26, 23, 20, 0.5);
  border: 1px solid var(--sys-color-white-steps-5);
  border-radius: 16px;
  padding: 24px;
  display: grid;
  grid-template-areas: "header date" "tags tags";
  gap: 12px;
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
  position: relative;
}

.opportunity-item.priority {
  border-color: rgba(196, 92, 75, 0.4); /* Solidarity Red 40% */
  background: linear-gradient(90deg, rgba(196, 92, 75, 0.05), transparent);
}

.opportunity-item:hover {
  transform: translateY(-4px);
  background: var(--sys-color-surface-charcoal);
  z-index: 10;
}
```

### ActionButton (Pebble Archetype) — Used for Filters

**Styles:**
```css
.filter-chip {
  height: 32px;
  padding: 0 16px;
  border-radius: 16px;
  background: var(--sys-color-surface-charcoal);
  border: 1px solid var(--sys-color-white-steps-5);
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--sys-color-worker-ash-steps-4);
  cursor: pointer;
  transition: all 0.2s;
}

.filter-chip.active {
  background: var(--sys-color-inkGold-base);
  color: var(--sys-color-asphaltBlack);
  border-color: transparent;
  font-weight: 700;
}
```

---

## Motion & Interaction

### Stream Entry
- **Behavior**: Sequence of items entering viewport.
- **Animation**: `opacity: 0 -> 1`, `transform: scale(0.95) -> scale(1)`.
- **Stagger**: 50ms per item.

### Priority Pulse
- **Target**: High Priority Items (`.priority`)
- **Property**: `border-color`
- **Animation**: Oscillate between red/40% and red/80% over 3s.

### Hover Lift
- **Target**: Any Item
- **Effect**: `y: -4px` (Small jump), Shadow increases.

---

## Motif Slots

### 1. Halo Disk (Background)
- **Asset**: `{KR-UI-002}`
- **Position**: Top Left (Header area)
- **Opacity**: 15%

### 2. Verified Stamp (Overlay)
- **Asset**: `{KR-UI-007}`
- **Target**: Verified Organization items
- **Position**: Absolute Top Right of card
- **Opacity**: 80%
- **Blend Mode**: Multiply

---

## Accessibility (WCAG 2.2 AA)

### Validation
- **Color Coding**: Priority items use Red border BUT must also have a "High Priority" text badge or aria-label enhancement so color isn't the only indicator.
- **Infinite Scroll**: Requires a "Load More" button backup for keyboard users or focus management to ensure users don't get trapped.
- **Contrast**: Tags must maintain 4.5:1 ratio against card background.

---

**Status**: Ready for Implementation
**Evaluator**: ui-design-evaluator

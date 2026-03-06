# HiFi Mockup: Profile Settings Screen

**Design System**: KR Solidarity v6.0
> **Part of the [KR Solidarity Design Canon](../../01_CANON.md)**
**Mode**: kr-dark (Personal, Informative)
**Target Score**: ≥360/400 (90% — Excellent)
**Generated**: 2026-02-16

---

## Layout Specification

```
┌─────────────────────────────────────────────────────────────┐
│  Identity Header                                             │
│  Avatar Size: 128px                                         │
│  "User Name" (Fraunces 48px)                                │
│  "Bio text..." (Work Sans 16px Italic)                      │
│  Backing: Halo Glow {KR-UI-002}                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Engagement Stats (Horizontal Row)                           │
│  gap-6                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ InfoStone    │  │ InfoStone    │  │ InfoStone    │      │
│  │ "Applied"    │  │ "Earned"     │  │ "Streak"     │      │
│  │ 12           │  │ $420         │  │ 5 Days       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Badge Archive (Grid)                                        │
│  cols-4 (Desktop) / cols-2 (Mobile)                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                        │
│  │Badge │ │Badge │ │Badge │ │Badge │                        │
│  └──────┘ └──────┘ └──────┘ └──────┘                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Typography Hierarchy

| Element | Font Stack | Size/Weight | Color | Styling |
|---------|-----------|-------------|-------|---------|
| **Identity Name** | Fraunces | 48px / 800 | `--sys-color-paperWhite` | Energetic |
| **Stat Value** | JetBrains Mono | 32px / 800 | `--sys-color-inkGold-base` | Monospace |
| **Stat Label** | Work Sans | 14px / 500 | `--sys-color-paperWhite` (50%) | Uppercase |
| **Bio Text** | Work Sans | 16px / 400 | `--sys-color-paperWhite` (70%) | Italic |

---

## Color Palette (Semantic Tokens)

| Usage | Token | Hex |
|-------|-------|-----|
| **Background** | `--sys-color-charcoalBackground-base` | `#1A1714` |
| **Stat Block** | `--sys-color-asphaltBlack` (50%) | `rgba(26,23,20,0.5)` |
| **Badge Border** | `--sys-color-inkGold-base` (40%) | `rgba(212,168,75,0.4)` |
| **Halo Glow** | `--sys-color-inkGold-base` (20%) | Gradient |

---

## Component Specifications

### InfoStone (Stone Archetype)

**Props:**
```typescript
interface InfoStoneProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}
```

**Styles:**
```css
.info-stone {
  background: rgba(26, 23, 20, 0.5);
  border: 1px solid var(--sys-color-white-steps-5);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2); /* shadow-viscous */
}
```

### BadgePebble (Pebble Archetype)

**Structure:**
```tsx
<div className="badge-pebble" title={badgeName}>
  <img src={badgeIcon} alt="" />
  <span className="badge-name">{badgeName}</span>
</div>
```

**Styles:**
```css
.badge-pebble {
  background: var(--sys-color-surface-charcoal);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 50%;
  width: 96px; height: 96px;
  display: flex;
  align-items: center; justify-content: center;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.badge-pebble:hover {
  transform: scale(1.1) rotate(5deg);
  border-color: var(--sys-color-inkGold-base);
  box-shadow: 0 0 16px rgba(212, 168, 75, 0.4); /* shadow-ink-glow */
}
```

---

## Motion & Interaction

### Avatar Scale
- **Trigger**: Page Enter
- **Animation**: `scale: 0.8 -> 1.0` (Spring).

### Stats Count-up
- **Trigger**: Page Enter
- **Behavior**: Numbers increment from 0 to value over 1.5s.

### Badge Tilt
- **Trigger**: Hover
- **Behavior**: 3D tilt effect (`perspective: 500px`).

---

## Motif Slots

### 1. Halo Disk (Avatar Backing)
- **Asset**: `{KR-UI-002}`
- **Position**: Behind Avatar
- **Size**: 200px
- **Opacity**: 100% (Blend mode Screen)

### 2. Verified Stamp (Profile)
- **Asset**: `{KR-UI-007}`
- **Position**: Next to Name
- **Size**: 24px

---

## Accessibility (WCAG 2.2 AA)

### Checklist
- **Alt Text**: Avatar needs `alt="Profile picture of [Name]"`. Badges need descriptions.
- **Headings**: Structure must be `h1` (Name) -> `h2` (Stats) -> `h2` (Badges).

---

**Status**: Ready for Implementation
**Evaluator**: ui-design-evaluator

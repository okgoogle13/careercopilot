# HiFi Mockup: Settings Screen

**Design System**: kerala-rage kr-solidarity V3.1
**Mode**: kr-dark (Administrative, Control)
**Target Score**: ≥360/400 (90% — Excellent)
**Generated**: 2026-02-16

---

## Layout Specification

```
┌─────────────────────────────────────────────────────────────┐
│  System Parameter Header                                     │
│  "Configuration" (Fraunces 48px)                            │
│  "Manage your preferences and visibility"                   │
│  marginBottom: 48px                                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Categorical Groups (Vertical Stack)                         │
│  gap-8                                                      │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  SettingsGroup: "NOTIFICATIONS"                        │ │
│  │  Title: Fraunces Restrained 24px                       │ │
│  │                                                         │ │
│  │  [Setting Item]                                        │ │
│  │  Label: "Email Alerts"                                 │ │
│  │  Control: [Toggle: ON]                                 │ │
│  │                                                         │ │
│  │  [Setting Item]                                        │ │
│  │  Label: "Push Notifications"                           │ │
│  │  Control: [Toggle: OFF]                                │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  SettingsGroup: "PRIVACY"                              │ │
│  │  ...                                                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Action Footer (Sticky Bottom)                               │
│  [Button: Save Changes (Primary)]                           │
│  [Button: Reset (Ghost)]                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Typography Hierarchy

| Element | Font Stack | Size/Weight | Color | Styling |
|---------|-----------|-------------|-------|---------|
| **Page Headline** | Fraunces | 48px / 800 | `--sys-color-paperWhite` | Energetic |
| **Group Title** | Fraunces | 24px / 700 | `--sys-color-paperWhite` | Uppercase |
| **Label** | Work Sans | 16px / 600 | `--sys-color-paperWhite` | Normal |
| **Description** | Work Sans | 14px / 400 | `--sys-color-paperWhite` (50%) | Normal |
| **State Text** | JetBrains Mono | 12px / 700 | `--sys-color-inkGold-base` | Monospace |

---

## Color Palette (Semantic Tokens)

| Usage | Token | Hex |
|-------|-------|-----|
| **Background** | `--sys-color-charcoalBackground-base` | `#1A1714` |
| **Group Surface** | `--sys-color-asphaltBlack` (50%) | `rgba(26,23,20,0.5)` |
| **Toggle Track (On)** | `--sys-color-inkGold-base` | `#D4A84B` |
| **Toggle Track (Off)** | `--sys-color-white-steps-10` | `rgba(255,255,255,0.1)` |
| **Destructive** | `--sys-color-solidarityRed-base` | `#C45C4B` |

---

## Component Specifications

### SettingsGroup (Stone Archetype)

**Props:**
```typescript
interface SettingsGroupProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}
```

**Styles:**
```css
.settings-group {
  background: rgba(26, 23, 20, 0.5);
  border: 1px solid var(--sys-color-white-steps-5);
  border-radius: 12px;
  padding: 24px;
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--sys-color-white-steps-5);
}

.settings-item:last-child {
  border-bottom: none;
}
```

### PebbleToggle (Interactive)

**Structure:**
```tsx
<button
  role="switch"
  aria-checked={isOn}
  onClick={toggle}
  className={`pebble-toggle ${isOn ? 'on' : 'off'}`}
>
  <div className="toggle-thumb" />
</button>
```

**Styles:**
```css
.pebble-toggle {
  width: 48px; height: 24px;
  border-radius: 12px;
  position: relative;
  transition: background 0.3s;
}

.pebble-toggle.on { background: var(--sys-color-inkGold-base); }
.pebble-toggle.off { background: rgba(255,255,255,0.1); }

.toggle-thumb {
  width: 20px; height: 20px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px; left: 2px;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pebble-toggle.on .toggle-thumb { transform: translateX(24px); }
```

---

## Motion & Interaction

### Page Entrance
- **Target**: Settings Groups
- **Animation**: Slide up (`y: 20 -> 0`) + Fade in.
- **Stagger**: 50ms delay per group.

### Toggle Flip
- **Physics**: High tension spring (stiffness: 400).

---

## Motif Slots

### 1. Melbourne Laneway (Global)
- **Asset**: `{KR-SOLID-033}`
- **Opacity**: 20%

### 2. Blueprint Grid (Background)
- **Asset**: `{KR-UI-004}`
- **Opacity**: 5%

---

## Accessibility (WCAG 2.2 AA)

### Validation
- **Switches**: Must use `role="switch"` and `aria-checked`.
- **Labels**: Every toggle must have a visual label adjacent to it.
- **Focus**: Toggles need visible focus ring (`outline: 2px solid InkGold`).

---

**Status**: Ready for Implementation
**Evaluator**: ui-design-evaluator

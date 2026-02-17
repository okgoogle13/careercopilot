# HiFi Mockup: Ingestion Screen

**Design System**: kerala-rage kr-solidarity V3.1
**Mode**: kr-dark (Technical, Industrial)
**Target Score**: ≥360/400 (90% — Excellent)
**Generated**: 2026-02-16

---

## Layout Specification

```
┌─────────────────────────────────────────────────────────────┐
│  Ingestion Slab (Header)                                     │
│  - "DATA INGESTION" (Fraunces 72px)                         │
│  - Context: "Upload resumes, portfolios, or raw text data"  │
│  Padding: 64px 48px                                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Blueprint Dropzone (Interactive Area)                       │
│  Height: 400px (min)                                        │
│  Border: Dashed, 2px --sys-color-inkGold-steps-30           │
│  Background: --sys-color-surface-charcoal (Opacity 0.4)     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  [Icon: Upload Cloud / File Stack]                     │ │
│  │                                                         │ │
│  │  "Drag & Drop files here"                              │ │
│  │  Font: Work Sans 18px Medium                           │ │
│  │                                                         │ │
│  │  OR                                                    │ │
│  │                                                         │ │
│  │  [Button: Browse Files]                                │ │
│  │  bg: --sys-color-inkGold-base                          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Tactical Progress Bar (Sticky Bottom)                       │
│  Width: 100% · Height: 8px                                  │
│  Track: --sys-color-white-steps-10                          │
│  Fill: --sys-color-inkGold-base (Animated Stripe)           │
└─────────────────────────────────────────────────────────────┘
```

---

## Typography Hierarchy

| Element | Font Stack | Size/Weight | Color | Styling |
|---------|-----------|-------------|-------|---------|
| **Page Headline** | Fraunces | 72px / 800 | `--sys-color-paperWhite` | Energetic (-1px) |
| **Dropzone Text** | Work Sans | 18px / 500 | `--sys-color-paperWhite` (60%) | Normal |
| **Action Label** | JetBrains Mono | 14px / 700 | `--sys-color-asphaltBlack` | Uppercase |
| **Status Text** | JetBrains Mono | 12px / 400 | `--sys-color-inkGold-base` | Monospace |

---

## Color Palette (Semantic Tokens)

| Usage | Token | Hex |
|-------|-------|-----|
| **Background** | `--sys-color-charcoalBackground-base` | `#1A1714` |
| **Dropzone Bg** | `--sys-color-asphaltBlack` (40%) | `rgba(26,23,20,0.4)` |
| **Dropzone Border** | `--sys-color-inkGold-base` (30%) | `rgba(212,168,75,0.3)` |
| **Active Highlight** | `--sys-color-inkGold-base` | `#D4A84B` |
| **Active Glow** | `--sys-color-ink-glow` | Custom Shadow |
| **Progress Track** | `--sys-color-white-steps-10` | `rgba(255,255,255,0.1)` |

---

## Component Specifications

### DropzoneArea (Mechanic Archetype)

**Props:**
```typescript
interface DropzoneAreaProps {
  onFilesAccepted: (files: File[]) => void;
  isProcessing: boolean;
  maxSizeMB?: number;
}
```

**Styles:**
```css
.dropzone-area {
  background: rgba(26, 23, 20, 0.4);
  border: 2px dashed rgba(212, 168, 75, 0.3);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.dropzone-area.active {
  background: rgba(212, 168, 75, 0.05);
  border-color: var(--sys-color-inkGold-base);
  box-shadow: 0 0 24px rgba(212, 168, 75, 0.15); /* shadow-ink-glow */
  transform: scale(1.005);
}

.dropzone-area::after {
  /* Grid pattern overlay */
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--sys-color-worker-ash-steps-6) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.05;
  pointer-events: none;
}
```

### TacticalProgressBar

**Structure:**
```tsx
<div className="progress-container">
  <div className="progress-track">
    <div 
      className="progress-fill" 
      style={{ width: `${percentage}%` }}
    />
  </div>
  <span className="progress-label">{statusMessage}</span>
</div>
```

**Styles:**
```css
.progress-fill {
  background: var(--sys-color-inkGold-base);
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* Barber pole animation for active processing */
.progress-fill.processing::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(255,255,255,0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255,255,255,0.15) 50%,
    rgba(255,255,255,0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 24px 24px;
  animation: stripemove 1s linear infinite;
}

@keyframes stripemove {
  0% { background-position: 0 0; }
  100% { background-position: 24px 24px; }
}
```

---

## Motion & Interaction

### Entry Pulse (Idle State)
- **Target**: Dropzone Border
- **Behavior**: "Breathing" opacity
- **Keyframes**: Opacity `0.3` -> `0.5` -> `0.3` over 4s ease-in-out infinite.

### Drag Interaction (Active State)
- **Trigger**: `onDragEnter`
- **Effect**:
  - Scale: `1.0` -> `1.02` (Spring: Stiffness 300)
  - Shadow: None -> `shadow-ink-glow`
  - Border: Dashed -> Solid (optional, or just brighter)

### Progress Lurch
- **Target**: Progress Bar Fill
- **Behavior**: Updates are not linear; they "lurch" forward using a viscous spring (`mass: 1, tension: 170, friction: 26`).

---

## Motif Slots

### 1. Blueprint Grid (Overlay)
- **Asset**: `{KR-UI-004}`
- **Z-Index**: 0 (Behind dropzone content)
- **Opacity**: 10%
- **Effect**: Adds technical precision feel to the data ingestion context.

### 2. Halo Disk (Background)
- **Asset**: `{KR-UI-002}`
- **Position**: Bottom Right, clipped
- **Opacity**: 10%

---

## Accessibility (WCAG 2.2 AA)

### Validation
- **Drag & Drop**: Must be keyboard accessible. Users should be able to tab to a "Browse" button and select files via system dialog.
- **Progress Announcements**: Use `aria-live="polite"` for status updates ("Uploading... 50%", "Upload Complete").
- **Contrast**: Dropzone text on charcoal background passes AA.

### Semantic Structure
```html
<main>
  <h1>Data Ingestion</h1>
  <div role="region" aria-label="File Upload Area">
    <button>Select Files</button>
  </div>
  <div role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100"></div>
</main>
```

---

**Status**: Ready for Implementation
**Evaluator**: ui-design-evaluator

# HiFi Mockup: Studio Designer Screen

**Design System**: kerala-rage kr-solidarity V3.1
**Mode**: kr-dark (Creative, Tool-Dense)
**Target Score**: ≥360/400 (90% — Excellent)
**Generated**: 2026-02-16

---

## Layout Specification

```
┌─────────────────────────────────────────────────────────────┐
│  Design Bar (Top Toolbar)                                    │
│  Height: 56px (h-14)                                        │
│  [Tools: Select, Draw, Text, Export]                        │
│  Background: --sys-color-surface-charcoal                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Workspace (Split)                                           │
│  Height: calc(100vh - 56px)                                 │
│                                                             │
│  ┌──────────────┐  ┌──────────────────────────────────────┐ │
│  │ Asset Res.   │  │ Assembly Canvas (Infinite Pan/Zoom)  │ │
│  │ (Sidebar)    │  │                                      │ │
│  │ Width: 280px │  │ [Motif: Elephant]                    │ │
│  │ [Draggables] │  │ [Text Block]                         │ │
│  │              │  │                                      │ │
│  └──────────────┘  │ [Grid Overlay: Blueprint]            │ │
│                    └──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Typography Hierarchy

| Element | Font Stack | Size/Weight | Color | Styling |
|---------|-----------|-------------|-------|---------|
| **Tool Tooltip** | JetBrains Mono | 11px / 500 | `--sys-color-paperWhite` (50%) | Uppercase |
| **Asset Name** | Work Sans | 14px / 500 | `--sys-color-paperWhite` | Normal |
| **Canvas Meta** | JetBrains Mono | 12px / 400 | `--sys-color-inkGold-base` (60%) | Monospace |

---

## Color Palette (Semantic Tokens)

| Usage | Token | Hex |
|-------|-------|-----|
| **Background** | `--sys-color-charcoalBackground-base` | `#1A1714` |
| **Canvas** | `--sys-color-asphaltBlack` | `#1A1714` |
| **Grid Lines** | `--sys-color-inkGold-base` (10%) | `rgba(212,168,75,0.1)` |
| **Selection** | `--sys-color-inkGold-base` | `#D4A84B` |
| **Toolbar** | `--sys-color-surface-charcoal` | `#2A2420` |

---

## Component Specifications

### AssetReservoir (Sidebar)

**Styles:**
```css
.asset-reservoir {
  width: 280px;
  background: var(--sys-color-surface-charcoal);
  border-right: 1px solid var(--sys-color-white-steps-5);
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
}

.draggable-item {
  background: rgba(255,255,255,0.05);
  padding: 12px;
  border-radius: 8px;
  cursor: grab;
  transition: background 0.2s;
}

.draggable-item:hover {
  background: rgba(255,255,255,0.1);
}
```

### BlueprintCanvas

**Styles:**
```css
.studio-canvas {
  flex: 1;
  background-color: var(--sys-color-charcoalBackground-base);
  background-image:
    linear-gradient(var(--sys-color-inkGold-steps-10) 1px, transparent 1px),
    linear-gradient(90deg, var(--sys-color-inkGold-steps-10) 1px, transparent 1px);
  background-size: 20px 20px; /* Dynamic based on zoom */
  position: relative;
  overflow: hidden;
  cursor: grab;
}

.studio-canvas:active {
  cursor: grabbing;
}
```

---

## Motion & Interaction

### Motif Drag
- **Trigger**: Drag Start
- **Effect**: Ghost image appearing at pointer (`opacity: 0.5`).
- **Drop**: Snaps to nearest grid point (Spring: High Stiffness).

### Zoom/Pan
- **Behavior**: Smooth inertial panning.
- **Grid**: Lines fade in/out based on zoom level (LOD - Level of Detail).

### Grit Ambient
- **Target**: `{KR-UI-003}` Screenprint Grit
- **Animation**: "Living Texture" - fractal noise pattern shifts slowly (60s loop).

---

## Motif Slots

### 1. Blueprint Grid (Dynamic)
- **Asset**: `{KR-UI-004}`
- **Role**: Functional grid for alignment.

### 2. Screenprint Grit (Overlay)
- **Asset**: `{KR-UI-003}`
- **Opacity**: 10%
- **Blend Mode**: Overlay

### 3. Abstract Solidarity (Decorative)
- **Asset**: `{KR-SOLID-011}`
- **Position**: Edges of canvas bounds.

---

## Accessibility (WCAG 2.2 AA)

### Requirements
- **Keyboard Pan**: Arrow keys moves canvas view.
- **Zoom**: +/- keys or Ctrl+Scroll.
- **Tool Selection**: Toolbar traversable via Tab.
- **Shortcuts**: "V" for Select, "T" for Text, "Space" for Pan. Show "Keyboard Shortcuts" modal ? key.

---

**Status**: Ready for Implementation
**Evaluator**: ui-design-evaluator

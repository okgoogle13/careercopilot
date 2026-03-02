# HiFi Mockup: Job Search Flow Screen

**Design System**: kerala-rage kr-solidarity V3.1
**Mode**: kr-dark (Exploratory, Dense)
**Target Score**: ≥360/400 (90% — Excellent)
**Generated**: 2026-02-16

---

## Layout Specification

```
┌─────────────────────────────────────────────────────────────┐
│  Search Header (Sticky)                                      │
│  Height: 64px                                               │
│  [Logo Icon]                                                │
│  [Search Bar: "Search roles, skills, orgs..."]              │
│  Font: Work Sans 16px                                       │
│  Width: 40% (Centered)                                      │
│  [User Avatar]                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Split Exploration Area (Main)                               │
│  Gap: 32px                                                  │
│  Padding: 32px                                              │
│                                                             │
│  ┌────────────────────┐  ┌────────────────────────────────┐ │
│  │ Filter Sidebar     │  │ Results Area (Infinite Scroll) │ │
│  │ (Stone Archetype)  │  │                                │ │
│  │ Width: 320px       │  │ [Result Item: Stone]           │ │
│  │                    │  │ "Senior Organizer"             │ │
│  │ [Category Group]   │  │                                │ │
│  │ - Tech (12)        │  │ [Result Item: Stone]           │ │
│  │ - Campaigns (8)    │  │ "Data Analyst"                 │ │
│  │                    │  │                                │ │
│  │ [Location Group]   │  │ [Result Item: Stone]           │ │
│  │ - Remote           │  │ "React Developer"              │ │
│  │ - On-site          │  │                                │ │
│  └────────────────────┘  └────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Typography Hierarchy

| Element | Font Stack | Size/Weight | Color | Styling |
|---------|-----------|-------------|-------|---------|
| **Search Label** | JetBrains Mono | 12px / 700 | `--sys-color-paperWhite` (40%) | Uppercase |
| **Section Title** | Fraunces | 20px / 700 | `--sys-color-paperWhite` | Restrained |
| **Result Title** | Work Sans | 18px / 600 | `--sys-color-inkGold-base` | Normal |
| **Metadata** | Work Sans | 14px / 400 | `--sys-color-worker-ash-steps-6` | Normal |
| **Empty State** | Fraunces | 24px / 400 | `--sys-color-paperWhite` (20%) | Italic |

---

## Color Palette (Semantic Tokens)

| Usage | Token | Hex |
|-------|-------|-----|
| **Background** | `--sys-color-charcoalBackground-base` | `#1A1714` |
| **Sidebar Surface** | `--sys-color-asphaltBlack` (50%) | `rgba(26,23,20,0.5)` |
| **Result Card** | `--sys-color-surface-charcoal` | `#2A2420` |
| **Highlight** | `--sys-color-inkGold-base` | `#D4A84B` |
| **Border Divider** | `--sys-color-white-steps-5` | `rgba(255,255,255,0.05)` |
| **Hover Effect** | `--sys-color-white-steps-5` | `rgba(255,255,255,0.05)` |

---

## Component Specifications

### FilterSidebar (Stone Archetype)

**Props:**
```typescript
interface FilterSidebarProps {
  filters: FilterGroup[];
  activeFilters: string[];
  onToggle: (id: string) => void;
  isOpenMobile: boolean;
}
```

**Styles:**
```css
.filter-sidebar {
  background: rgba(26, 23, 20, 0.5);
  border-right: 1px solid var(--sys-color-white-steps-5);
  height: calc(100vh - 64px);
  overflow-y: auto;
  backdrop-filter: blur(12px);
}

/* Mobile Drawer Behavior */
@media (max-width: 768px) {
  .filter-sidebar {
    position: fixed;
    left: 0; bottom: 0; top: 0;
    width: 280px;
    transform: translateX(-100%);
    transition: transform 0.3s ease-out;
    z-index: 100;
  }
  .filter-sidebar.open {
    transform: translateX(0);
  }
}
```

### ResultItem (Stone Archetype)

**Structure:**
```tsx
<article className="result-item">
  <div className="result-header">
    <h3>{roleTitle}</h3>
    <span className="org-label">{organization}</span>
  </div>
  <div className="result-meta">
    <span>{location}</span>
    <span>{postedDate}</span>
  </div>
  <div className="skills-row">
    {skills.map(s => <span className="skill-chip">{s}</span>)}
  </div>
</article>
```

**Styles:**
```css
.result-item {
  background: var(--sys-color-surface-charcoal);
  border: 1px solid var(--sys-color-white-steps-5);
  border-radius: 12px; /* Slight Stone rounding */
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease-out;
}

.result-item:hover {
  transform: translateY(-2px);
  border-color: var(--sys-color-inkGold-base); /* Hint of gold */
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
```

---

## Motion & Interaction

### Sidebar Slide (Mobile)
- **Trigger**: Filter Toggle Button
- **Behavior**: Drawer slides from left.
- **Timing**: 300ms cubic-bezier(0.4, 0, 0.2, 1).

### Result Stagger
- **Trigger**: Search/Filter Update
- **Behavior**: Results cascade in.
- **Delay**: `index * 50ms`.
- **Property**: `opacity: 0 -> 1` + `y: 10px -> 0`.

### Search Focus
- **Target**: Search Bar (Header)
- **Behavior**:
  - Width expands slightly (if constrained).
  - Border glows: `0 0 0 2px rgba(212, 168, 75, 0.2)`.

---

## Motif Slots

### 1. Blueprint Grid (Overlay)
- **Asset**: `{KR-UI-004}`
- **Z-Index**: 0
- **Effect**: Covers the entire "Results Area" background to suggest a workspace/planning table.

### 2. Melbourne Laneway (Substrate)
- **Asset**: `{KR-SOLID-033}`
- **Role**: Global texture providing the "grit".

---

## Accessibility (WCAG 2.2 AA)

### Requirements
- **Skip Links**: "Skip to Results" button at top of tab order.
- **Filter Semantics**: Sidebar should use `aside` role. Filter groups should be `fieldset` with `legend`.
- **Live Regions**: "Showing 24 results" announcement on filter change.
- **Focus Indicators**: High visibility gold outline on active result items.

---

**Status**: Ready for Implementation
**Evaluator**: ui-design-evaluator

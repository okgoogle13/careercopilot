# Kerala Rage Wireframes: The Solidarity System

> Part of [Kerala Rage Design System – Contemporary Australian](00-overview.md)

---

## Document Control

| Field                       | Value                        |
| --------------------------- | ---------------------------- |
| **Document ID**             | WIRE-003-SOLIDARITY          |
| **Version**                 | 4.0                          |
| **Status**                  | Implementation Ready         |
| **Last Updated**            | February 9, 2026             |
| **Token Reference**         | tokens.json V3.2             |
| **Asset Library Reference** | See `06b-asset-placement.md` |

---

## Design Philosophy: The Manifesto Press

These wireframes embody the **Solidarity Mode** design system—a high-contrast, screenprint-inspired interface that rejects bureaucratic neutrality in favor of tactical, human-centered design. Every page is a canvas for resistance, where career development becomes collective documentation rather than individual optimization.

### Core Principles

1. **Charcoal Substrate**: Every interface uses `#1A1A1A` as the foundational canvas—matte, tactile, non-reflective.
2. **Screenprint Logic**: Visual elements behave like ink layers on paper—high contrast, visible texture, deliberate registration.
3. **Street Art Geometry**: Asymmetric radii (Stone, Slab, Pebble) replace perfect circles and uniform corners.
4. **Tactical Typography**: Recursive Variable for manifesto headlines, Inter Variable for precision UI, JetBrains Mono for data.
5. **Anti-Slop Protocol**: No light mode, no perfect circles, no bureaucratic imagery (passports/forms/borders).

---

## System Constants

### Solidarity Palette

Based on **Kerala Rage — Solidarity Mode** (`tokens.json` V3.2).

- **Substrate:** `charcoalBackground` (#1A1A1A). Matte charcoal, weathered brick texture.
- **Primary Ink:** `baruGold` (#DAF674). Temple radiance, optimistic defiance.
- **Secondary Ink:** `parrotGreen` (#48F0E5). Hybrid identity pop.
- **Accent Ink:** `waratahRed` (#F14714). Resistance heat, urgency.
- **Typography Ink:** `kr-leafusAsh` (#DAF6B3). High-contrast readable text.
- **Background Texture:** `{kr-asset-screenprint-substrate}` at 15-25% opacity.

### Shape Tokens (Border Radius)

| Token           | Value              | Application                  |
| --------------- | ------------------ | ---------------------------- |
| `radius-pebble` | 20px 6px 16px 28px | Buttons, primary actions     |
| `radius-stone`  | 16px 4px 12px 24px | Cards, containers            |
| `radius-slab`   | 4px                | Structural panels, low-drama |
| `radius-seed`   | 8px 4px 10px 6px   | Badges, tags, small elements |

### Typography Scale

| Role          | Font Family        | Weight           | Size  | Use Case                        |
| ------------- | ------------------ | ---------------- | ----- | ------------------------------- |
| Display Hero  | Recursive Variable | 900 (Slam)       | 144px | Manifesto lines, big statements |
| Display Large | Recursive Variable | 800 (Solidarity) | 72px  | Page titles, poster headlines   |
| Headline      | Sora Variable      | 700              | 48px  | Section headers                 |
| Subhead       | Inter Variable     | 500              | 24px  | Card titles, group labels       |
| Body          | Inter Variable     | 400              | 16px  | Paragraph text                  |
| Metadata      | JetBrains Mono     | 400              | 12px  | Technical detail, annotations   |

---

## Page Specifications

### PAGE 1: Landing ("The Solidarity Manifesto")

**Classification:** Solidarity Mode | Entry Point | Emotional Register: Defiance

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Z-2: {kr-asset-wheat-paste-tear} (top-right)                │
│                                                             │
│  Z-3: {kr-asset-screenprint-grit} (scattered particles)     │
│                                                             │
│         ┌─────────────────────────────────┐                │
│         │    "THE SOLIDARITY"             │  Z-1           │
│         │    "MANIFESTO"                  │                │
│         │    Slab Container               │                │
│         └─────────────────────────────────┘                │
│                                                             │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│    │ Build    │  │ Archive  │  │ Resist   │  Z-1          │
│    │ Stone    │  │ Stone    │  │ Stone    │               │
│    └──────────┘  └──────────┘  └──────────┘               │
│                                                             │
│                  ┌─────────────────┐                       │
│                  │ Enter / Pebble  │  Z-2                  │
│                  └─────────────────┘                       │
│                                                             │
│ Z-2: {kr-asset-halo-disk} (bottom-left, baruGold)          │
│                                                             │
│ Z-0: {kr-asset-screenprint-substrate} (25% opacity)         │
└─────────────────────────────────────────────────────────────┘
```

#### Functional Annotations

| Element              | Specification                        | Token Reference                    |
| -------------------- | ------------------------------------ | ---------------------------------- |
| **Background**       | `{kr-asset-screenprint-substrate}`   | Custom asset + charcoalBackground  |
| **Opacity**          | 25%                                  | Custom (not tokenized)             |
| **Gradient Overlay** | Bottom-up, `charcoal` to transparent | `color.charcoalBackground.steps.0` |

#### Content Annotations

| Element           | Content                                                 | Typography Token                 |
| ----------------- | ------------------------------------------------------- | -------------------------------- |
| **Headline**      | "THE SOLIDARITY<br>MANIFESTO"                           | Display Hero (Recursive, 144px)  |
| **Subhead**       | "Your career, re-documented for the collective future." | Headline (Sora, 48px)            |
| **Feature Cards** | "Build Your Story", "Archive Evidence", "Resist Slop"   | Subhead (Inter, 24px) for titles |

#### Design Annotations

| Element            | Shape           | Surface              | Border                    |
| ------------------ | --------------- | -------------------- | ------------------------- |
| **Hero Container** | `radius-slab`   | `charcoalBackground` | 2px solid `blueprintGrey` |
| **Feature Cards**  | `radius-stone`  | `charcoalBackground` | 1px solid `blueprintGrey` |
| **Nav Buttons**    | `radius-pebble` | `baruGold`           | None                      |

#### Interaction Annotations

| Element            | Trigger | Animation                       | Token Reference                  |
| ------------------ | ------- | ------------------------------- | -------------------------------- |
| **Feature Cards**  | Hover   | translateY(-4px), shadow deepen | `motion.m3Expressive`            |
| **Nav Buttons**    | Hover   | translateY(-2px), glow increase | `motion.patterns.typeSpringSlam` |
| **Grit Particles** | Ambient | Float + opacity pulse, 8s loop  | Custom CSS animation             |

#### Asset Placement

See `06b-asset-placement.md` for detailed asset integration specifications.

**Symbolic Anchor (Optional)**: This page MAY include ONE Symbolic Anchor (e.g., `shiva-statue-reference.png`, `bhagat-singh-reference.png`) at Z-1, positioned in bottom-left or top-right corner, minimum 96px. Must align with defiant emotional register.

---

### PAGE 2: Authentication ("The Verification")

**Classification:** Solidarity Mode | Security Gateway | Emotional Register: Trust

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Z-3: {kr-asset-screenprint-grit} (card-adjacent)           │
│                                                             │
│              ┌─────────────────────────┐                   │
│              │                         │                   │
│              │    "VERIFY IDENTITY"    │  Z-2              │
│              │    Stone Container      │                   │
│              │    480px width          │                   │
│              │                         │                   │
│              └─────────────────────────┘                   │
│                                                             │
│              ┌─────────────────────────┐                   │
│              │  {kr-asset-halo-disk}   │  Z-1              │
│              │  (60% opacity)          │                   │
│              └─────────────────────────┘                   │
│                                                             │
│ Z-0: {kr-asset-screenprint-substrate} (15% opacity)         │
└─────────────────────────────────────────────────────────────┘
```

#### Content Annotations

| Element              | Content                | Typography Token          |
| -------------------- | ---------------------- | ------------------------- |
| **Card Title**       | "VERIFY IDENTITY"      | Display Large (Recursive) |
| **Input Labels**     | "Email", "Password"    | Metadata (JetBrains Mono) |
| **Primary Action**   | "Enter Archive"        | Subhead (Inter, 24px)     |
| **Secondary Action** | "Create Collective ID" | Body (Inter, 16px)        |

**Symbolic Anchor (Forbidden)**: Authentication pages must NOT include Symbolic Anchors. Focus is on security and trust, not cultural narrative.

---

### PAGE 3: Onboarding ("The Collective Choice")

**Classification:** Solidarity Mode | Selection Flow | Emotional Register: Possibility

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         "CHOOSE YOUR SOLIDARITY PATH"                       │
│         Display Large (Recursive, 72px)                     │
│                                                             │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│    │ Tech     │  │ Care     │  │ Creative │               │
│    │ Worker   │  │ Worker   │  │ Worker   │               │
│    │ Stone    │  │ Stone    │  │ Stone    │               │
│    └──────────┘  └──────────┘  └──────────┘               │
│                                                             │
│ Z-0: {kr-asset-blueprint-grid} (8% opacity)                 │
└─────────────────────────────────────────────────────────────┘
```

---

### PAGE 4: Ingestion ("The Deposition")

**Classification:** Solidarity Mode | Data Ingestion | Emotional Register: Gravity

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         "DEPOSIT HISTORY"                                   │
│         Display Large (Recursive, 72px, baruGold)           │
│                                                             │
│              ┌─────────────────────────┐                   │
│              │                         │                   │
│              │   DROP PDF HERE         │  Z-2              │
│              │   FOR ANALYSIS          │                   │
│              │   Slab Container        │                   │
│              │   Dashed border         │                   │
│              │                         │                   │
│              └─────────────────────────┘                   │
│                                                             │
│ Z-1: {kr-asset-blueprint-layout} (6% opacity, watermark)    │
│                                                             │
│ Z-0: {kr-asset-charcoal-paper}                              │
└─────────────────────────────────────────────────────────────┘
```

#### Content Annotations

| Element             | Content                                  | Typography Token          |
| ------------------- | ---------------------------------------- | ------------------------- |
| **Headline**        | "DEPOSIT HISTORY"                        | Display Large (Recursive) |
| **Drop Zone Label** | "DROP PDF HERE<br>FOR ANALYSIS"          | Metadata (JetBrains Mono) |
| **Success Message** | "History Verified. Integrity confirmed." | Subhead (Inter, baruGold) |

#### Interaction Annotations

| Element                 | Trigger          | Animation                                  |
| ----------------------- | ---------------- | ------------------------------------------ |
| **Drop Zone**           | File drag-over   | Border shifts to `waratahRed`, glow effect |
| **Verification Stamp**  | Upload success   | Scale from 2.0→1.0, rotate -30deg→-5deg    |
| **Blueprint Watermark** | Upload in-flight | Opacity fade 6%→12%                        |

---

### PAGE 5: Analysis Dashboard ("The Audit Microscope")

**Classification:** Solidarity Mode | Data Review | Emotional Register: Revelation

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌──────────────┐  ┌─────────────────────────────────┐    │
│  │              │  │                                 │    │
│  │  Score Gauge │  │  Skill Breakdown Grid           │    │
│  │  (Halo Disk) │  │  2x3 Stone Cards                │    │
│  │              │  │                                 │    │
│  └──────────────┘  └─────────────────────────────────┘    │
│                                                             │
│ Z-1: {kr-asset-blueprint-grid} (8% opacity, full viewport)  │
│                                                             │
│ Z-0: {kr-asset-charcoal-paper}                              │
└─────────────────────────────────────────────────────────────┘
```

**Symbolic Anchor (Optional)**: This page MAY include ONE Symbolic Anchor (e.g., `kerala-elephant-reference.png`, `shiva-statue-reference.png`) at Z-1, positioned in sidebar or header area, minimum 96px. Must align with revelation emotional register.

---

### PAGE 6: Opportunity Feed ("The Lookout")

**Classification:** Solidarity Mode | Content Browse | Emotional Register: Discovery

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Sidebar (240px)          │  Feed Area                      │
│  ┌─────────────┐          │                                 │
│  │ Filters     │          │  ┌──────────────────────┐       │
│  │ Pebble      │          │  │ Opportunity Card     │       │
│  │ Toggles     │          │  │ Stone Container      │       │
│  └─────────────┘          │  └──────────────────────┘       │
│                           │                                 │
│                           │  ┌──────────────────────┐       │
│                           │  │ Opportunity Card     │       │
│                           │  └──────────────────────┘       │
│                                                             │
│ Z-0: {kr-asset-screenprint-substrate} (22% opacity)         │
└─────────────────────────────────────────────────────────────┘
```

---

### PAGE 7: Kanban Board ("The Command Center")

**Classification:** Solidarity Mode | Task Management | Emotional Register: Control

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  "THE CULTIVATION CYCLE"                                    │
│  Display Large (Recursive, 72px)                            │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │ Applied │  │ Screen  │  │ Interview│ │ Offer   │       │
│  │         │  │         │  │         │  │         │       │
│  │ [Card]  │  │ [Card]  │  │ [Card]  │  │ [Card]  │       │
│  │ [Card]  │  │         │  │         │  │         │       │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │
│                                                             │
│ Z-0: {kr-asset-charcoal-paper}                              │
└─────────────────────────────────────────────────────────────┘
```

---

### PAGE 8: Split-Screen Editor ("The Writing Workbench")

**Classification:** Solidarity Mode | Content Creation | Emotional Register: Craft

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Evidence Panel (30%)     │  Editor Panel (70%)             │
│  ┌─────────────┐          │                                 │
│  │ Evidence    │          │  ┌──────────────────────┐       │
│  │ Card 1      │          │  │                      │       │
│  │ Stone       │          │  │  Text Editor         │       │
│  └─────────────┘          │  │  Slab Container      │       │
│                           │  │                      │       │
│  ┌─────────────┐          │  └──────────────────────┘       │
│  │ Evidence    │          │                                 │
│  │ Card 2      │          │                                 │
│  └─────────────┘          │                                 │
│                                                             │
│ Z-1: {kr-asset-blueprint-grid} (5% opacity, editor only)    │
│                                                             │
│ Z-0: {kr-asset-charcoal-paper}                              │
└─────────────────────────────────────────────────────────────┘
```

---

### PAGE 9: Studio Designer ("The Manifesto Finalization")

**Classification:** Solidarity Mode | Document Review | Emotional Register: Refinement

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Controls (25%)           │  Preview Panel (75%)            │
│  ┌─────────────┐          │                                 │
│  │ Format      │          │  ┌──────────────────────┐       │
│  │ Toggles     │          │  │                      │       │
│  │ Pebble      │          │  │  Document Preview    │       │
│  └─────────────┘          │  │  Stone Container     │       │
│                           │  │                      │       │
│  ┌─────────────┐          │  └──────────────────────┘       │
│  │ Finalize    │          │                                 │
│  │ Button      │          │                                 │
│  └─────────────┘          │                                 │
│                                                             │
│ Z-0: {kr-asset-charcoal-paper} (increased grain)            │
└─────────────────────────────────────────────────────────────┘
```

---

### PAGE 10: Settings ("The Archive Vault")

**Classification:** Solidarity Mode | Configuration | Emotional Register: Storage

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         "ARCHIVE CONFIGURATION"                             │
│         Display Large (Recursive, 72px)                     │
│                                                             │
│    ┌──────────────────┐  ┌──────────────────┐             │
│    │ Profile Settings │  │ Privacy Controls │             │
│    │ Stone Container  │  │ Stone Container  │             │
│    └──────────────────┘  └──────────────────┘             │
│                                                             │
│    ┌──────────────────┐  ┌──────────────────┐             │
│    │ Data Management  │  │ Export Options   │             │
│    │ Stone Container  │  │ Stone Container  │             │
│    └──────────────────┘  └──────────────────┘             │
│                                                             │
│ Z-1: {kr-asset-blueprint-grid} (6% opacity, behind cards)   │
│                                                             │
│ Z-0: {kr-asset-charcoal-paper}                              │
└─────────────────────────────────────────────────────────────┘
```

---

### PAGE 11: Dashboard Overview ("The Collective")

**Classification:** Solidarity Mode | Status Overview | Emotional Register: Altitude

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Z-2: {kr-asset-wheat-paste-tear} (top-left, dramatic)      │
│                                                             │
│         "THE COLLECTIVE IS THRIVING"                        │
│         Display Large (Recursive, 72px, baruGold)           │
│                                                             │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│    │ Active   │  │ Skills   │  │ Progress │               │
│    │ Apps     │  │ Tracked  │  │ Metrics  │               │
│    │ Stone    │  │ Stone    │  │ Stone    │               │
│    └──────────┘  └──────────┘  └──────────┘               │
│                                                             │
│ Z-2: {kr-asset-halo-disk} (bottom-right, baruGold)          │
│                                                             │
│ Z-0: {kr-asset-screenprint-substrate} (25% opacity)         │
└─────────────────────────────────────────────────────────────┘
```

---

## Asset Library Reference

**Symbolic Anchor (Optional)**: This page MAY include ONE Symbolic Anchor (e.g., `bhagat-singh-reference.png`, `treaty-now-laneway.png`) at Z-1, positioned in top-left or bottom-right corner, minimum 96px. Must align with altitude/collective emotional register.

For detailed asset placement specifications, opacity values, animation behaviors, and responsive considerations, see:

- **[06b-asset-placement.md](06b-asset-placement.md)** - Complete asset integration guide

---

## Implementation Notes

### Z-Index Layering

| Layer  | Z-Index | Contents                                    |
| ------ | ------- | ------------------------------------------- |
| Base   | Z-0     | Background textures, substrate patterns     |
| Grid   | Z-1     | Blueprint grids, watermark elements         |
| UI     | Z-2     | Cards, containers, primary interface        |
| Accent | Z-3     | Grit particles, floating elements, overlays |

### Responsive Considerations

- **Desktop (1440px+)**: Full asset presence, maximum atmospheric density.
- **Tablet (768-1439px)**: Reduce grit particle count by 50%, simplify wheat-paste tears.
- **Mobile (<768px)**: Remove decorative assets, retain only structural elements (blueprint grids at 4% opacity).

### Performance Guidelines

- All background textures must be optimized WebP format, <100KB.
- Grit particles use CSS `will-change: transform, opacity` for GPU acceleration.
- Parallax effects disabled on mobile and when `prefers-reduced-motion: reduce`.

---

**Last Updated**: February 9, 2026  
**Next Review**: Asset generation phase completion

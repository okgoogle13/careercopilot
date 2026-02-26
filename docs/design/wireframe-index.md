# Kerala Rage Wireframe Index — Unified Documentation

> **Purpose**: Central navigation hub mapping low-fidelity wireframes to high-fidelity specifications  
> **Version**: 1.0  
> **Last Updated**: February 12, 2026  
> **Status**: 🟢 Active

---

## 📋 Quick Reference

| Document | Purpose | Audience |
|----------|---------|----------|
| **[06-wireframes.md](06-wireframes.md)** | Hi-Fi Implementation Specs | Developers, Design Engineers |
| **[wireframe-status.md](wireframe-status.md)** | Status Dashboard & Tracking | Product, Leadership |
| **generated/wireframes/*.md** | Lo-Fi Screen Definitions | UX, Early Validation |

---

## 🎯 Design Philosophy (from Hi-Fi Spec)

The **Solidarity Mode** design system embodies:
- **Charcoal Substrate**: `#1A1A1A` as foundational canvas
- **Screenprint Logic**: High-contrast ink layers with visible texture
- **Street Art Geometry**: Asymmetric radii (Stone, Slab, Pebble)
- **Tactical Typography**: Recursive Variable for manifestos, Inter for UI, JetBrains Mono for data
- **Anti-Slop Protocol**: No light mode, no perfect circles, no bureaucratic imagery

**Core Tokens**: See [tokens.json V3.2](../../design-system/tokens.json)

---

## 🗺️ Screen-by-Screen Mapping

### 1. Landing Page ("The Solidarity Manifesto")

| Aspect | Details |
|--------|---------|
| **Lo-Fi Spec** | [solidaritylanding-screen.md](generated/wireframes/solidaritylanding-screen.md) |
| **Hi-Fi Spec** | [06-wireframes.md](06-wireframes.md#page-1-landing-the-solidarity-manifesto) (PAGE 1, Lines 71-141) |
| **Emotional Register** | Defiance |
| **Key Components** | ManifestoCard (slab), Feature Cards (stone), Nav Buttons (pebble) |
| **Primary Assets** | `kr-asset-wheat-paste-tear`, `kr-asset-screenprint-grit`, `kr-asset-halo-disk`, `KR-UI-008`, `KR-UI-018`, `KR-UI-019` |
| **Symbolic Anchor** | ✅ Optional (Shiva/Bhagat Singh, bottom-left/top-right, ≥96px) |
| **Implementation Status** | 🟢 Ready |

**Key Differences Lo-Fi → Hi-Fi**:
- Hi-fi adds specific Z-index layering (Z-0 through Z-3)
- Hi-fi specifies exact asset opacity values (25%, 60%)
- Hi-fi includes comprehensive motion tokens for hover states

---

### 2. Authentication ("The Verification")

| Aspect | Details |
|--------|---------|
| **Lo-Fi Spec** | [authentication-screen.md](generated/wireframes/authentication-screen.md) |
| **Hi-Fi Spec** | [06-wireframes.md](06-wireframes.md#page-2-authentication-the-verification) (PAGE 2, Lines 144-182) |
| **Emotional Register** | Trust |
| **Key Components** | AuthContainer (stone, 480px), TextInput (pebble), SignButton (pebble) |
| **Primary Assets** | `kr-asset-screenprint-grit`, `kr-asset-halo-disk`, `KR-UI-027`, `KR-UI-030` |
| **Symbolic Anchor** | ❌ Forbidden (security/trust focus) |
| **Implementation Status** | 🟢 Ready |

**Key Differences Lo-Fi → Hi-Fi**:
- Both specs align closely on container width (480px)
- Lo-fi includes detailed input state annotations (default, focus, error)
- Hi-fi emphasizes security-centered design (no cultural anchors)

---

### 3. Onboarding ("The Collective Choice")

| Aspect | Details |
|--------|---------|
| **Lo-Fi Spec** | [onboarding-screen.md](generated/wireframes/onboarding-screen.md) |
| **Hi-Fi Spec** | [06-wireframes.md](06-wireframes.md#page-3-onboarding-the-collective-choice) (PAGE 3, Lines 185-207) |
| **Emotional Register** | Possibility |
| **Key Components** | PathSelectionCard (stone, 3 variants: Tech/Care/Creative) |
| **Primary Assets** | `kr-asset-blueprint-grid`, `KR-UI-035`, `KR-UI-008–019` (domain icons) |
| **Symbolic Anchor** | ⚠️ Not specified |
| **Implementation Status** | 🟢 Ready |

**Key Differences Lo-Fi → Hi-Fi**:
- Hi-fi uses blueprint grid instead of screenprint substrate
- Lo-fi may include more detailed card interaction states

---

### 4. Ingestion ("The Deposition")

| Aspect | Details |
|--------|---------|
| **Lo-Fi Spec** | [ingestion-screen.md](generated/wireframes/ingestion-screen.md) |
| **Hi-Fi Spec** | [06-wireframes.md](06-wireframes.md#page-4-ingestion-the-deposition) (PAGE 4, Lines 209-251) |
| **Emotional Register** | Gravity |
| **Key Components** | IngestionSlab (slab), DropZone (pebble, dashed border), PrimaryAction (pebble) |
| **Primary Assets** | `kr-asset-charcoal-paper`, `kr-asset-blueprint-layout`, `kr-asset-screenprint-grit`, `KR-UI-021`, `KR-UI-026`, `KR-UI-027`, `KR-UI-030` |
| **Symbolic Anchor** | ⚠️ Not specified |
| **Implementation Status** | 🟢 Ready |

**Key Differences Lo-Fi → Hi-Fi**:
- Lo-fi: "FEED THE ARCHIVE" / Hi-fi: "DEPOSIT HISTORY" (headline variation)
- Lo-fi includes detailed upload state machine (default, dragOver, uploading)
- Hi-fi adds verification stamp animation (scale 2.0→1.0, rotate -30deg→-5deg)

---

### 5. Analysis Dashboard ("The Audit Microscope")

| Aspect | Details |
|--------|---------|
| **Lo-Fi Spec** | [analysisdashboard-screen.md](generated/wireframes/analysisdashboard-screen.md) |
| **Hi-Fi Spec** | [06-wireframes.md](06-wireframes.md#page-5-analysis-dashboard-the-audit-microscope) (PAGE 5, Lines 254-277) |
| **Emotional Register** | Revelation |
| **Key Components** | SkillTile (stone, 2x3 grid), MasteryVisualizer (complex), Score Gauge (halo disk) |
| **Primary Assets** | `kr-asset-charcoal-paper`, `kr-asset-blueprint-grid`, `KR-UI-013`, `KR-UI-022`, `KR-UI-024`, `KR-UI-025`, `KR-UI-033` |
| **Symbolic Anchor** | ✅ Optional (Kerala elephant/Shiva, sidebar/header, ≥96px) |
| **Implementation Status** | 🟢 Ready |

**Key Differences Lo-Fi → Hi-Fi**:
- Lo-fi has 2x3 skill grid; hi-fi shows sidebar + grid layout
- Lo-fi uses 12% opacity for blueprint; hi-fi uses 8%
- Both reference [DEPRECATED_STYLE] motif for elite skills (>90% mastery)

---

### 6. Opportunity Feed ("The Lookout")

| Aspect | Details |
|--------|---------|
| **Lo-Fi Spec** | [opportunityfeed-screen.md](generated/wireframes/opportunityfeed-screen.md) |
| **Hi-Fi Spec** | [06-wireframes.md](06-wireframes.md#page-6-opportunity-feed-the-lookout) (PAGE 6, Lines 280-302) |
| **Emotional Register** | Discovery |
| **Key Components** | OpportunityItem (stone), PriorityBadge (pebble), Sidebar Filters (240px, pebble toggles) |
| **Primary Assets** | `kr-asset-screenprint-substrate`, `kr-asset-halo-disk`, `KR-UI-016`, `KR-UI-020`, `KR-UI-025`, `KR-UI-028` |
| **Symbolic Anchor** | ⚠️ Not specified |
| **Implementation Status** | 🟢 Ready |

**Key Differences Lo-Fi → Hi-Fi**:
- Lo-fi: "OPEN FRONT LINES" / Hi-fi: Not explicitly titled
- Lo-fi uses 10% substrate opacity; hi-fi uses 22%
- Hi-fi specifies 240px sidebar with filter toggles

---

### 7. Kanban Board ("The Command Center")

| Aspect | Details |
|--------|---------|
| **Lo-Fi Spec** | [kanbanboard-screen.md](generated/wireframes/kanbanboard-screen.md) |
| **Hi-Fi Spec** | [06-wireframes.md](06-wireframes.md#page-7-kanban-board-the-command-center) (PAGE 7, Lines 305-326) |
| **Emotional Register** | Control |
| **Key Components** | KanbanColumn (stone, 4 columns), KanbanCard (stone, draggable) |
| **Primary Assets** | `kr-asset-charcoal-paper`, `KR-UI-016`, `KR-UI-020`, `KR-UI-023`, `KR-UI-025` |
| **Symbolic Anchor** | ⚠️ Not specified |
| **Implementation Status** | 🟢 Ready |

**Key Differences Lo-Fi → Hi-Fi**:
- Lo-fi: "CAMPAIGN PROGRESS" (TO-DO/ACTIVE/BLOCKED/RESOLVED)
- Hi-fi: "THE CULTIVATION CYCLE" (Applied/Screen/Interview/Offer)
- Both use stone-shaped columns with drag-and-drop

---

### 8. Split-Screen Editor ("The Writing Workbench")

| Aspect | Details |
|--------|---------|
| **Lo-Fi Spec** | [splitscreeneditor-screen.md](generated/wireframes/splitscreeneditor-screen.md) |
| **Hi-Fi Spec** | [06-wireframes.md](06-wireframes.md#page-8-split-screen-editor-the-writing-workbench) (PAGE 8, Lines 329-354) |
| **Emotional Register** | Craft |
| **Key Components** | Evidence Panel (30%, stone cards), Editor Panel (70%, slab container) |
| **Primary Assets** | `kr-asset-charcoal-paper`, `kr-asset-blueprint-grid`, `KR-UI-014`, `KR-UI-026`, `KR-UI-030` |
| **Symbolic Anchor** | ⚠️ Not specified |
| **Implementation Status** | 🟢 Ready |

**Key Differences Lo-Fi → Hi-Fi**:
- Hi-fi specifies exact panel split ratio (30/70)
- Hi-fi applies blueprint grid only to editor panel, not evidence panel

---

### 9. Studio Designer ("The Manifesto Finalization")

| Aspect | Details |
|--------|---------|
| **Lo-Fi Spec** | [studiodesigner-screen.md](generated/wireframes/studiodesigner-screen.md) |
| **Hi-Fi Spec** | [06-wireframes.md](06-wireframes.md#page-9-studio-designer-the-manifesto-finalization) (PAGE 9, Lines 357-380) |
| **Emotional Register** | Refinement |
| **Key Components** | Controls Panel (25%, pebble toggles), Preview Panel (75%, stone container) |
| **Primary Assets** | `kr-asset-charcoal-paper`, `KR-UI-022`, `KR-UI-027` |
| **Symbolic Anchor** | ⚠️ Not specified |
| **Implementation Status** | 🟢 Ready |

**Key Differences Lo-Fi → Hi-Fi**:
- Hi-fi specifies exact panel split ratio (25/75)
- Hi-fi notes "increased grain" on charcoal-paper texture

---

### 10. Settings ("The Archive Vault")

| Aspect | Details |
|--------|---------|
| **Lo-Fi Spec** | [settings-screen.md](generated/wireframes/settings-screen.md) |
| **Hi-Fi Spec** | [06-wireframes.md](06-wireframes.md#page-10-settings-the-archive-vault) (PAGE 10, Lines 383-410) |
| **Emotional Register** | Storage |
| **Key Components** | 4 Setting Cards (stone): Profile/Privacy/Data/Export |
| **Primary Assets** | `kr-asset-charcoal-paper`, `kr-asset-blueprint-grid`, `KR-UI-014`, `KR-UI-028`, `KR-UI-029` |
| **Symbolic Anchor** | ⚠️ Not specified |
| **Implementation Status** | 🟢 Ready |

**Key Differences Lo-Fi → Hi-Fi**:
- Both use 2x2 card grid layout
- Hi-fi adds blueprint grid behind cards for depth

---

### 11. Dashboard Overview ("The Collective")

| Aspect | Details |
|--------|---------|
| **Lo-Fi Spec** | [dashboardoverview-screen.md](generated/wireframes/dashboardoverview-screen.md) |
| **Hi-Fi Spec** | [06-wireframes.md](06-wireframes.md#page-11-dashboard-overview-the-collective) (PAGE 11, Lines 413-445) |
| **Emotional Register** | Altitude |
| **Key Components** | 3 Metric Cards (stone): Active Apps/Skills Tracked/Progress Metrics |
| **Primary Assets** | `kr-asset-screenprint-substrate`, `kr-asset-wheat-paste-tear`, `kr-asset-halo-disk`, `KR-UI-022`, `KR-UI-023`, `KR-UI-024`, `KR-UI-032`, `KR-UI-033` |
| **Symbolic Anchor** | ✅ Optional (Bhagat Singh/Treaty Now, top-left/bottom-right, ≥96px) |
| **Implementation Status** | 🟢 Ready |

**Key Differences Lo-Fi → Hi-Fi**:
- Hi-fi uses dramatic wheat-paste tear at top-left
- Hi-fi includes gold halo disk at bottom-right for visual balance

---

### 12. 404 Not Found ("The Removed Poster")

| Aspect | Details |
|--------|---------|
| **Lo-Fi Spec** | N/A (standard error page) |
| **Hi-Fi Spec** | [06b-asset-placement.md](06b-asset-placement.md#page-12-404-not-found-the-removed-poster) (PAGE 12) |
| **Emotional Register** | Disorientation + Urban Decay |
| **Key Components** | Error container (slab), Navigation links (pebble) |
| **Primary Assets** | `kr-asset-charcoal-paper`, `KR-UI-009`, `KR-UI-031`, `KR-UI-034` |
| **Symbolic Anchor** | N/A (error state) |
| **Implementation Status** | 🟢 Ready |

**Key Features**:
- KR-UI-034: Hero 404 illustration (wheat-paste removal + W-class tram)
- KR-UI-031: Fractured frame error state context
- KR-UI-009: Laneway brick pattern atmospheric texture
- Charcoal paper substrate maintains system consistency

---

## 🎨 Global Design System Reference

### Shape Tokens (Border Radius)
| Token | Value | Usage |
|-------|-------|-------|
| `radius-pebble` | 20px 6px 16px 28px | Buttons, primary actions |
| `radius-stone` | 16px 4px 12px 24px | Cards, containers |
| `radius-slab` | 4px | Structural panels, low-drama |
| `radius-seed` | 8px 4px 10px 6px | Badges, tags, small elements |

### Typography Scale
| Role | Font Family | Weight | Size | Use Case |
|------|-------------|--------|------|----------|
| Display Hero | Recursive Variable | 900 (Slam) | 144px | Manifesto lines |
| Display Large | Recursive Variable | 800 (Solidarity) | 72px | Page titles |
| Headline | Sora Variable | 700 | 48px | Section headers |
| Subhead | Inter Variable | 500 | 24px | Card titles |
| Body | Inter Variable | 400 | 16px | Paragraph text |
| Metadata | JetBrains Mono | 400 | 12px | Technical detail |

### Solidarity Palette
- **Substrate**: `charcoalBackground` (#1A1A1A)
- **Primary Ink**: `inkGold` (#DAF674)
- **Secondary Ink**: `signalGreen` (#48F0E5)
- **Accent Ink**: `solidarityRed` (#F14714)
- **Typography Ink**: `worker-ash` (#DAF6B3)

---

## 📦 Asset Library

### Core Textures
- `{KR-SOLID-033}` — Melbourne Laneway substrate (Z-0, 15-25% opacity)
- `{KR-UI-005}` **UI-KIT REQUIRED** — Charcoal paper (Z-0, neutral base)
- `{KR-UI-004}` **UI-KIT REQUIRED** — Blueprint grid overlay (Z-1, 4-12% opacity)
- `{KR-UI-006}` **UI-KIT REQUIRED** — Blueprint layout watermark (Z-1)

### Atmospheric Overlays
- `{KR-SOLID-011}` — Abstract Solidarity ink atmosphere (Z-1, 6-18% opacity)
- `{KR-SOLID-029}` — Paint Splash dynamic overlay (Z-2, 35-60% opacity)

### Decorative Motifs
- `{KR-UI-002}` **UI-KIT REQUIRED** — Halo disk radiant circle (Z-1, 60% opacity typical)
- `{KR-UI-003}` **UI-KIT REQUIRED** — Screenprint grit particles (Z-2/Z-3)
- `{KR-UI-001}` **UI-KIT REQUIRED** — Wheat paste tear street poster (Z-2)
- `{KR-UI-007}` **UI-KIT REQUIRED** — Screenprint stamp verification (inline, functional)

### Symbolic Anchors (Optional Cultural References)
- `{KR-SOLID-002}` — Shiva Statue (≥96px, defiance/revelation contexts)
- `{KR-SOLID-005}` / `{KR-SOLID-006}` — Bhagat Singh / Tipu Sultan (≥96px, defiance/altitude contexts)
- `{KR-SOLID-009}` — Kerala Elephant (≥96px, revelation context)
- `{KR-SOLID-030}` / `{KR-SOLID-031}` — First Nations placards / Treaty Now (≥96px, altitude/collective context)

**Usage Rules**:
- Maximum ONE per screen
- Forbidden on Authentication screens
- Minimum 96px dimension
- Must align with emotional register

---

## 🔧 Implementation Guidelines

### Z-Index Layering
| Layer | Z-Index | Contents |
|-------|---------|----------|
| Base | Z-0 | Background textures, substrate patterns |
| Grid | Z-1 | Blueprint grids, watermark elements |
| UI | Z-2 | Cards, containers, primary interface |
| Accent | Z-3 | Grit particles, floating elements, overlays |

### Responsive Breakpoints
- **Desktop (1440px+)**: Full asset presence, maximum density
- **Tablet (768-1439px)**: 50% grit particles, simplified tears
- **Mobile (<768px)**: Structural only (4% opacity grids)

### Performance Requirements
- Background textures: WebP format, <100KB
- Grit particles: `will-change: transform, opacity`
- Parallax effects: Disabled on `prefers-reduced-motion: reduce`

---

## 📊 Related Documentation

- **[wireframe-status.md](wireframe-status.md)** — Implementation tracking dashboard
- **[06b-asset-placement.md](06b-asset-placement.md)** — Detailed asset integration specs with KR-SOLID mappings
- **[kr-solidarity-ui-token-map.json](../../frontend/public/assets/kr-solidarity-ui-token-map.json)** — Central asset token resolution
- **[tokens.json](../../design-system/tokens.json)** — Design token source of truth

---

**Maintained by**: Design Systems Team  
**Questions?**: See [CONTRIBUTING.md](../../CONTRIBUTING.md)

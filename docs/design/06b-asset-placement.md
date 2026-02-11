# Kerala Rage Asset Placement Guide

> Part of [Kerala Rage Design System – Contemporary Australian](00-overview.md)  
> Companion to [06-wireframes.md](06-wireframes.md)

---

## Document Control

| Field               | Value                |
| ------------------- | -------------------- |
| **Document ID**     | ASSET-PLACE-001      |
| **Version**         | 1.0                  |
| **Status**          | Implementation Ready |
| **Last Updated**    | February 9, 2026     |
| **Parent Document** | 06-wireframes.md     |

---

## Asset Integration Philosophy

Every asset in the Solidarity system serves a tactical purpose—breaking the mechanical grid, reinforcing the screenprint narrative, and providing memorable visual anchors. Assets are not decoration; they are structural elements that communicate the anti-bureaucratic, human-centered ethos of the system.

### Core Principles

1. **Substrate First**: All pages begin with `{KR-UI-005}` (Charcoal Paper) or `{KR-SOLID-033}` (Melbourne Laneway) at Z-0.
2. **Tactical Placement**: Assets appear at structural points (corners, edges, headers) to frame content, not compete with it.
3. **Controlled Density**: High-drama pages (Landing, Dashboard) use maximum asset presence; data-focused pages (Analysis, Settings) use minimal decorative assets.
4. **Responsive Degradation**: Mobile removes decorative assets entirely, retaining only structural grids at reduced opacity.

---

## Page-by-Page Asset Specifications

### PAGE 1: Landing ("The Solidarity Manifesto")

**Emotional Register:** Defiance | **Asset Density:** Maximum

| Asset ID                           | Position                     | Size                        | Z-Index | Opacity | Behavior                                                  |
| ---------------------------------- | ---------------------------- | --------------------------- | ------- | ------- | --------------------------------------------------------- |
| `{KR-SOLID-033}` (Melbourne Laneway) | Full viewport background     | 100% cover                  | Z-0     | 22-25%  | Static substrate                                          |
| `{KR-SOLID-011}` (Abstract Solidarity) | Full viewport overlay      | 100% cover                  | Z-1     | 12-18%  | Ink atmosphere overlay                                    |
| `{KR-SOLID-029}` (Paint Splash)    | Accent overlay               | Flexible                    | Z-2     | 35-60%  | Dynamic expressive overlay                                |
| `{KR-UI-001}` **UI-KIT REQUIRED** (Wheat Paste Tear) | `top: -20px; right: 0` | 320px width, natural height | Z-2 | 100% | Parallax (translateY at 0.1x scroll speed) |
| `{KR-UI-002}` **UI-KIT REQUIRED** (Halo Disk) | `bottom: -60px; left: -40px` | 280px diameter | Z-2 | 100% | Static anchor, `inkGold` tint |
| `{KR-UI-003}` **UI-KIT REQUIRED** (Screenprint Grit) | Scattered, viewport-relative | 8-16px particles | Z-3 | 40-80% | CSS animation: float + opacity pulse (8s loop, staggered) |

**Spatial Logic:** The wheat-paste tear suggests a poster ripped from a wall, framing the hero content. The halo disk anchors the bottom-left, radiating `inkGold` optimism. Grit particles provide tactile atmosphere without competing with typography.

**Responsive Behavior:**

- **Desktop (1440px+)**: Full asset presence as specified.
- **Tablet (768-1439px)**: Reduce grit particle count to 6-8 instances.
- **Mobile (<768px)**: Remove wheat-paste tear and grit particles; retain substrate at 15% opacity.

---

### PAGE 2: Authentication ("The Verification")

**Emotional Register:** Trust | **Asset Density:** Minimal

| Asset ID                           | Position                  | Size           | Z-Index | Opacity | Behavior                                                  |
| ---------------------------------- | ------------------------- | -------------- | ------- | ------- | --------------------------------------------------------- |
| `{KR-SOLID-033}` (Melbourne Laneway) | Full viewport           | 100% cover     | Z-0     | 12-15%  | Static substrate (darker than landing for focus)          |
| `{KR-SOLID-011}` (Abstract Solidarity) | Full viewport overlay | 100% cover     | Z-1     | 8-12%   | Very subtle atmospheric overlay                           |
| `{KR-UI-002}` **UI-KIT REQUIRED** (Halo Disk) | Centered, 40px below card | 180px diameter | Z-1 | 60% | Subtle rotation on input focus (±5°, 0.4s ease) |
| `{KR-UI-003}` **UI-KIT REQUIRED** (Screenprint Grit) | Card-adjacent, sparse | 8-12px | Z-3 | 30-60% | Slower animation (12s loop), suggesting watchful presence |

**Spatial Logic:** The gate is quieter than the landing—fewer distractions, more focus. The halo disk beneath the card suggests that authentication is a matter of finding one's bearing before entering the archive.

**Responsive Behavior:**

- **Mobile (<768px)**: Remove halo disk and grit particles entirely.

---

### PAGE 3: Onboarding ("The Collective Choice")

**Emotional Register:** Possibility | **Asset Density:** Structural

| Asset ID                    | Position      | Size       | Z-Index | Opacity | Behavior       |
| --------------------------- | ------------- | ---------- | ------- | ------- | -------------- |
| `{KR-UI-005}` **UI-KIT REQUIRED** (Charcoal Paper) | Full viewport | 100% cover | Z-0 | 100% | Base substrate |
| `{KR-UI-004}` **UI-KIT REQUIRED** (Blueprint Grid) | Full viewport | 100% cover | Z-1 | 8% | Static grid overlay |

**Spatial Logic:** The field grid transforms the selection interface into a measurement surface, suggesting that the user's choice is being documented with precision. No decorative assets—the focus is entirely on the selection cards.

**Responsive Behavior:**

- **Mobile (<768px)**: Reduce field grid opacity to 4%.

---

### PAGE 4: Ingestion ("The Deposition")

**Emotional Register:** Gravity | **Asset Density:** Structural + Functional

| Asset ID                       | Position                               | Size           | Z-Index | Opacity | Behavior                                                                  |
| ------------------------------ | -------------------------------------- | -------------- | ------- | ------- | ------------------------------------------------------------------------- |
| `{KR-UI-005}` **UI-KIT REQUIRED** (Charcoal Paper) | Full viewport background | 100% cover | Z-0 | 100% | Base substrate |
| `{KR-UI-006}` **UI-KIT REQUIRED** (Blueprint Layout) | Centered behind drop zone | 600px width | Z-1 | 6% | Static watermark |
| `{KR-UI-007}` **UI-KIT REQUIRED** (Screenprint Stamp) | Bottom-right of drop zone (on success) | 120px diameter | Z-3 | 100% | Slam animation: scale from 2.0→1.0, rotate -30deg→-5deg (0.4s overshoot) |
| `{KR-UI-002}` **UI-KIT REQUIRED** (Halo Disk) | Top-right corner | 160px diameter | Z-2 | 30% | Static orientation marker, `inkGold` tint |

**Spatial Logic:** The field grid watermark transforms document upload into tactical analysis—the user isn't just uploading a file, they're depositing evidence for examination. The ink slam mark provides satisfying feedback that echoes solidarity documentation processes.

**Interaction Triggers:**

- **File drag-over**: Drop zone border shifts to `solidarityRed`, field grid opacity increases to 12%.
- **Upload success**: Ink slam mark animates in with overshoot easing, field grid fades back to 6%.

**Responsive Behavior:**

- **Mobile (<768px)**: Remove halo disk; reduce field grid opacity to 4%.

---

### PAGE 5: Analysis Dashboard ("The Audit Microscope")

**Emotional Register:** Revelation | **Asset Density:** Structural

| Asset ID                    | Position                           | Size           | Z-Index | Opacity | Behavior                                                     |
| --------------------------- | ---------------------------------- | -------------- | ------- | ------- | ------------------------------------------------------------ |
| `{KR-UI-005}` **UI-KIT REQUIRED** (Charcoal Paper) | Full viewport | 100% cover | Z-0 | 100% | Base substrate |
| `{KR-UI-004}` **UI-KIT REQUIRED** (Blueprint Grid) | Overlay across entire viewport | 100% cover | Z-1 | 8% | Static, reinforcing measurement context |
| `{KR-UI-002}` **UI-KIT REQUIRED** (Halo Disk) | Left column (functioning as gauge) | 200px diameter | Z-2 | 100% | Needle rotation animated based on score value (0-100° range) |

**Spatial Logic:** The halo disk becomes functional here—not mere decoration but an actual data visualization instrument. The grid overlay reinforces that everything is being measured, assessed, catalogued.

**Responsive Behavior:**

- **Mobile (<768px)**: Reduce field grid opacity to 4%; halo disk gauge remains functional.

---

### PAGE 6: Opportunity Feed ("The Lookout")

**Emotional Register:** Discovery | **Asset Density:** Moderate

| Asset ID                           | Position                     | Size                        | Z-Index | Opacity | Behavior                                |
| ---------------------------------- | ---------------------------- | --------------------------- | ------- | ------- | --------------------------------------- |
| `{KR-SOLID-033}` (Melbourne Laneway) | Full viewport              | 100% cover                  | Z-0     | 18-22%  | Static substrate                        |
| `{KR-SOLID-011}` (Abstract Solidarity) | Full viewport overlay    | 100% cover                  | Z-1     | 10-15%  | Atmospheric overlay                     |
| `{KR-UI-001}` **UI-KIT REQUIRED** (Wheat Paste Tear) | Top-right corner of feed | 240px width, natural height | Z-2 | 100% | Static anchor |
| `{KR-UI-003}` **UI-KIT REQUIRED** (Screenprint Grit) | Sparse distribution, sidebar | 8-12px particles | Z-3 | 40-70% | Ambient movement (slow float, 10s loop) |

**Spatial Logic:** The wheat-paste tear frames the feed area, suggesting opportunities are being discovered on a community bulletin board. Grit particles in the sidebar add tactile depth without competing with content.

**Responsive Behavior:**

- **Mobile (<768px)**: Remove wheat-paste tear and grit particles.

---

### PAGE 7: Kanban Board ("The Command Center")

**Emotional Register:** Control | **Asset Density:** Structural

| Asset ID                      | Position                  | Size        | Z-Index | Opacity | Behavior                                 |
| ----------------------------- | ------------------------- | ----------- | ------- | ------- | ---------------------------------------- |
| `{KR-UI-005}` **UI-KIT REQUIRED** (Charcoal Paper) | Full viewport | 100% cover | Z-0 | 100% | Base substrate |
| `{KR-UI-001}` **UI-KIT REQUIRED** (Wheat Paste Tear) | Top of each Kanban column | 60px height | Z-2 | 100% | Static column header decoration |
| `{KR-UI-003}` **UI-KIT REQUIRED** (Screenprint Grit) | Concentrated near "Offer" | 8-12px | Z-3 | 50-90% | Increased density suggesting culmination |

**Spatial Logic:** The wheat-paste tears frame each column header like torn posters, reinforcing the street art aesthetic. Grit particles cluster toward the "Offer" column, suggesting that successful applications attract light.

**Responsive Behavior:**

- **Mobile (<768px)**: Remove wheat-paste tears and grit particles.

---

### PAGE 8: Split-Screen Editor ("The Writing Workbench")

**Emotional Register:** Craft | **Asset Density:** Minimal

| Asset ID                      | Position              | Size        | Z-Index | Opacity | Behavior                                    |
| ----------------------------- | --------------------- | ----------- | ------- | ------- | ------------------------------------------- |
| `{KR-UI-005}` **UI-KIT REQUIRED** (Charcoal Paper) | Full viewport | 100% cover | Z-0 | 100% | Base substrate |
| `{KR-UI-004}` **UI-KIT REQUIRED** (Blueprint Grid) | Editor panel only | Panel size | Z-1 | 5% | Suggests ruled paper for writing |
| `{KR-UI-006}` **UI-KIT REQUIRED** (Blueprint Layout) | Evidence panel header | 200px width | Z-1 | 8% | Fragmentary, connecting to earlier analysis |

**Spatial Logic:** The workbench is deliberately spare—craft requires focus. The grid overlay on the editor suggests the precision of manuscript preparation. Evidence cards feel like artifacts retrieved from a drawer, their field grid motif connecting them to the analysis that produced them.

**Responsive Behavior:**

- **Mobile (<768px)**: Reduce field grid opacity to 3%.

---

### PAGE 9: Studio Designer ("The Manifesto Finalization")

**Emotional Register:** Refinement | **Asset Density:** Structural + Functional

| Asset ID                       | Position              | Size           | Z-Index | Opacity | Behavior                                                      |
| ------------------------------ | --------------------- | -------------- | ------- | ------- | ------------------------------------------------------------- |
| `{KR-UI-005}` **UI-KIT REQUIRED** (Charcoal Paper) | Full viewport | 100% cover | Z-0 | 100% | Increased grain texture |
| `{KR-UI-004}` **UI-KIT REQUIRED** (Blueprint Grid) | Preview panel | Panel size | Z-1 | 10% | When "Bot View" active: shifts to `solidarityRed` at 15% opacity |
| `{KR-UI-007}` **UI-KIT REQUIRED** (Screenprint Stamp) | Appears on "Finalize" | 140px diameter | Z-3 | 100% | Slam animation as on Ingestion |
| `{KR-UI-002}` **UI-KIT REQUIRED** (Halo Disk) | Control panel header | 120px diameter | Z-2 | 40% | Static, `inkGold` tint |

**Spatial Logic:** The aged charcoal grain intensifies here—the document is being prepared for permanent archival. The "Bot View" toggle transforms the preview into a tactical diagram, revealing the document's structural skeleton. The ink slam mark provides ceremonial closure.

**Responsive Behavior:**

- **Mobile (<768px)**: Remove halo disk; ink slam mark remains functional.

---

### PAGE 10: Settings ("The Archive Vault")

**Emotional Register:** Storage | **Asset Density:** Structural

| Asset ID                      | Position                              | Size        | Z-Index | Opacity | Behavior                      |
| ----------------------------- | ------------------------------------- | ----------- | ------- | ------- | ----------------------------- |
| `{KR-UI-005}` **UI-KIT REQUIRED** (Charcoal Paper) | Full viewport | 100% cover | Z-0 | 100% | Base substrate |
| `{KR-UI-006}` **UI-KIT REQUIRED** (Blueprint Layout) | Large, centered behind settings cards | 800px width | Z-1 | 4% | Static architectural presence |
| `{KR-UI-004}` **UI-KIT REQUIRED** (Blueprint Grid) | Behind individual settings cards | Card size | Z-1 | 6% | Per-card overlay |

**Spatial Logic:** The vault is institutional—the field grid looms large as architectural element rather than decorative motif. Settings feel etched into the very structure of the archive. The grid behind each card reinforces precision and documentation.

**Responsive Behavior:**

- **Mobile (<768px)**: Remove large field layout; reduce card grid opacity to 3%.

---

### PAGE 11: Dashboard Overview ("The Collective")

**Emotional Register:** Altitude | **Asset Density:** Maximum

| Asset ID                           | Position            | Size                        | Z-Index | Opacity | Behavior                          |
| ---------------------------------- | ------------------- | --------------------------- | ------- | ------- | --------------------------------- |
| `{KR-SOLID-033}` (Melbourne Laneway) | Full viewport     | 100% cover                  | Z-0     | 22-25%  | Static substrate                  |
| `{KR-SOLID-011}` (Abstract Solidarity) | Full viewport overlay | 100% cover            | Z-1     | 10-15%  | Atmospheric overlay               |
| `{KR-SOLID-029}` (Paint Splash)    | Accent overlay      | Flexible                    | Z-2     | Selectively | Dynamic overlay (desktop only) |
| `{KR-UI-001}` **UI-KIT REQUIRED** (Wheat Paste Tear) | Top-left, dramatic | 400px width, natural height | Z-2 | 100% | Parallax on scroll (0.15x speed) |
| `{KR-UI-002}` **UI-KIT REQUIRED** (Halo Disk) | Bottom-right corner | 300px diameter | Z-2 | 100% | Static grounding, `inkGold` tint |
| `{KR-UI-003}` **UI-KIT REQUIRED** (Screenprint Grit) | Ambient throughout | 8-16px particles | Z-3 | 40-80% | Standard animation (8s loop) |

**Spatial Logic:** The overview is the collective itself—the user looks at their career ecosystem from above. The wheat-paste tear returns dramatically, suggesting that the journey has brought user and system to the same vantage point. Maximum asset presence reinforces that this is a living system, not a static report.

**Responsive Behavior:**

- **Desktop (1440px+)**: Full asset presence as specified.
- **Tablet (768-1439px)**: Reduce grit particle count to 8-10 instances.
- **Mobile (<768px)**: Remove wheat-paste tear and grit particles; retain substrate at 15% opacity.

---

## Global Asset Guidelines

### Performance Optimization

- **Format**: All textures must be WebP format, optimized for web delivery.
- **Size Limits**: Background textures <100KB; decorative assets <50KB.
- **GPU Acceleration**: Grit particles use `will-change: transform, opacity` for smooth animation.
- **Lazy Loading**: Assets below the fold should lazy-load on scroll proximity.

### Animation Specifications

#### Grit Particle Float Animation

```css
@keyframes gritFloat {
  0%,
  100% {
    transform: translate(0, 0);
    opacity: 0.4;
  }
  50% {
    transform: translate(var(--drift-x), var(--drift-y));
    opacity: 0.8;
  }
}

.grit-particle {
  animation: gritFloat 8s ease-in-out infinite;
  animation-delay: calc(var(--particle-index) * 0.3s);
  --drift-x: calc(var(--random-x) * 20px);
  --drift-y: calc(var(--random-y) * 30px);
}
```

#### Ink Slam Mark Animation

```css
@keyframes inkSlamMark {
  0% {
    transform: scale(2) rotate(-30deg);
    opacity: 0;
  }
  60% {
    transform: scale(0.95) rotate(-3deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(-5deg);
    opacity: 1;
  }
}

.ink-slam-mark {
  animation: inkSlamMark 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## Symbolic Anchor Placement Rules

**Definition**: Symbolic Anchors are low-frequency, high-meaning cultural motifs (devotional, resistance, First Nations solidarity) that require strict placement and usage constraints.

### Z-Layer Constraints

Symbolic Anchors MUST be placed at **Z-1 or Z-2 only**:

- **Z-1**: Behind UI elements, as background narrative elements
- **Z-2**: Adjacent to UI elements, as framing devices

**Forbidden**: Never place Symbolic Anchors at Z-3 (would compete with interactive overlays) or Z-0 (would be obscured by substrate).

### Spatial Constraints

1. **No Overlap with Critical Zones**:
   - Form fields and input areas
   - Primary reading zones (body text, headlines)
   - Navigation elements
   - Call-to-action buttons

2. **Minimum Clearance**: 24px from any interactive element edge.

3. **Preferred Positions**:
   - **Corners**: Bottom-left, top-right (for framing)
   - **Sidebar**: Left column header area (for contextual anchoring)
   - **Header**: Top-left or top-right (for narrative presence)

### Responsive Behavior

| Breakpoint              | Treatment                                             |
| :---------------------- | :---------------------------------------------------- |
| **Desktop (1440px+)**   | Full presence at specified opacity (typically 40-60%) |
| **Tablet (768-1439px)** | Reduce opacity by 50% (e.g., 40% becomes 20%)         |
| **Mobile (<768px)**     | **Remove entirely**                                   |

**Rationale**: Symbolic Anchors require space and contemplation. Mobile interfaces prioritize functional clarity over narrative depth.

### Page-Specific Allowances

| Page               | Symbolic Anchor Allowed? | Preferred Motifs                               |
| :----------------- | :----------------------- | :--------------------------------------------- |
| Landing            | ✅ Yes                   | Resistance figures (Bhagat Singh, Tipu Sultan) |
| Authentication     | ❌ **Forbidden**         | N/A                                            |
| Onboarding         | ❌ **Forbidden**         | N/A                                            |
| Ingestion          | ❌ **Forbidden**         | N/A                                            |
| Analysis Dashboard | ✅ Yes                   | Devotional (Shiva), Cultural (Kerala Elephant) |
| Opportunity Feed   | ❌ **Forbidden**         | N/A                                            |
| Kanban Board       | ❌ **Forbidden**         | N/A                                            |
| Editor             | ❌ **Forbidden**         | N/A                                            |
| Studio Designer    | ❌ **Forbidden**         | N/A                                            |
| Settings           | ❌ **Forbidden**         | N/A                                            |
| Dashboard Overview | ✅ Yes                   | Resistance figures, First Nations placards     |

### Cultural Safety Rules

1. **Devotional Motifs (Shiva, Kerala Elephant)**:
   - Never appear on the same screen as protest text ("INQUILAB ZINDABAD", "TREATY NOW")
   - Use on reflective, analytical pages only
   - Minimum opacity: 30%

2. **Resistance Figures (Tipu Sultan, Bhagat Singh)**:
   - Only appear with anti-colonial text context
   - Use on defiant, action-oriented pages only
   - Minimum size: 96px

3. **First Nations Solidarity (Treaty Now, Placards)**:
   - **In-situ use only**: Must appear as part of a placard/poster visual, never as standalone UI decoration
   - Only on Dashboard Overview or Landing pages
   - Must be accompanied by appropriate solidarity text in content guide

### Accessibility Considerations

- **Reduced Motion**: All animations disabled when `prefers-reduced-motion: reduce`.
- **Decorative Assets**: All decorative assets have `aria-hidden="true"`.
- **Functional Assets**: Functional assets (halo disk gauge, ink slam mark) have appropriate ARIA labels.

---

## Asset File Naming Convention

All assets follow the pattern: `kr-asset-{category}-{descriptor}.webp`

**Categories:**

- `screenprint` - Substrate textures and grit
- `field` - Grid and layout overlays
- `halo` - Disk and radiance elements
- `wheat-paste` - Torn poster edges
- `charcoal` - Paper and substrate textures

**Examples:**

- `kr-asset-screenprint-substrate.webp`
- `kr-asset-field-grid.webp`
- `kr-asset-halo-disk.webp`
- `kr-asset-wheat-paste-tear.webp`
- `kr-asset-charcoal-paper.webp`

---

## Asset Token Resolution

This section maps asset tokens to their resolved paths in the kr-solidarity system. Assets are divided into two categories: **Ready** (KR-SOLID assets from the manifest) and **Planned** (KR-UI assets requiring generation).

### Ready Assets (KR-SOLID)

| Token | KR-SOLID ID | File Path | Layer |
|-------|------------|-----------|-------|
| `{KR-SOLID-033}` | Melbourne Laneway | `/assets/kr-solidarity/texture/kr-solidarity__texture__kr-solidarity--texture--melbourne-laneway--v1__v1.png` | substrate |
| `{KR-SOLID-011}` | Abstract Solidarity | `/assets/kr-solidarity/abstract/kr-solidarity__abstract__abstract---solidarity-chatgpt-image-f__v1.png` | atmospheric |
| `{KR-SOLID-029}` | Paint Splash | `/assets/kr-solidarity/abstract/kr-solidarity__abstract__kr-solidarity--abstract--paint-splash--v1__v1.png` | atmospheric |

**Usage Notes:**
- **KR-SOLID-033** replaces `{kr-asset-screenprint-substrate}` — Use at 15-25% opacity for background substrate
- **KR-SOLID-011** provides atmospheric overlay — Use at 6-18% opacity for ink atmosphere effects
- **KR-SOLID-029** provides dynamic overlay — Use at 35-60% opacity for expressive pages (Landing, Dashboard Overview)

### Planned Assets (KR-UI Kit Gaps)

The following UI-kit primitives are marked as **planned** and require generation:

| KR-UI ID | Name | Description | Status |
|----------|------|-------------|--------|
| **KR-UI-001** | Wheat Paste Tear | Torn poster edge decoration (large + small variants) | Planned |
| **KR-UI-002** | Halo Disk | Radiant circle element (plain + gauge version) | Planned |
| **KR-UI-003** | Screenprint Grit Particles | Floating texture particles (tile + sprite set) | Planned |
| **KR-UI-004** | Blueprint Grid Overlay | Technical grid overlay (transparent) | Planned |
| **KR-UI-005** | Charcoal Paper Substrate | Neutral charcoal paper base texture | Planned |
| **KR-UI-006** | Blueprint Layout Watermark | Technical layout overlay (transparent) | Planned |
| **KR-UI-007** | Screenprint Stamp | Verification stamp (VERIFIED) | Planned |

**Implementation Note:** These UI-kit assets are system primitives (not cultural/identity motifs) and won't violate the layered identity rules. A central token mapping file is available at `frontend/public/assets/kr-solidarity-ui-token-map.json`.

---

**Last Updated**: February 12, 2026  
**Next Review**: Asset generation phase completion


# HiFi Design Specifications (Legacy Archive)

This directory contains **valuable HiFi design specifications** that were retrieved from the `KR-Rage-Figma` branch before being permanently lost.

## Why These Files Are Here

During the investigation of the KR-Rage-Figma branch corruption, we discovered that the `restoration-KR-Rage-Figma-v2.0` branch (which has the complete git history and new features) had **deleted** these HiFi specifications.

To prevent permanent data loss, these files were retrieved from the `KR-Rage-Figma` branch and preserved here as a legacy archive.

## File Categories

### Brief HiFi Specs (14 files)
Concise implementation blueprints for each screen:
- AnalysisDashboard-hifi.md
- ApplicationFormFlow-hifi.md
- Authentication-hifi.md
- DashboardOverview-hifi.md
- Ingestion-hifi.md
- JobSearchFlow-hifi.md
- KanbanBoard-hifi.md
- Onboarding-hifi.md
- OpportunityFeed-hifi.md
- ProfileSettings-hifi.md
- Settings-hifi.md
- SolidarityLanding-hifi.md
- SplitScreenEditor-hifi.md
- StudioDesigner-hifi.md

### Detailed Screen Specs (15 files)
Comprehensive implementation guides with full details:
- analysisdashboard-screen-hifi.md (30KB)
- applicationformflow-screen-hifi.md (9KB)
- authentication-screen-hifi.md (8KB)
- authscreen-screen-hifi.md (6KB)
- dashboardoverview-screen-hifi.md (28KB)
- ingestion-screen-hifi.md (8KB)
- jobsearchflow-screen-hifi.md (7KB)
- kanbanboard-screen-hifi.md (30KB)
- onboarding-screen-hifi.md (5KB)
- opportunityfeed-screen-hifi.md (7KB)
- profilesettings-screen-hifi.md (6KB)
- settings-screen-hifi.md (7KB)
- solidaritylanding-screen-hifi.md (21KB)
- splitscreeneditor-screen-hifi.md (31KB)
- studiodesigner-screen-hifi.md (5KB)

### Test File
- test-hifi-sample.md (1KB) - Sample/test file

**Total: 30 files**

## What These Files Contain

Each HiFi specification includes:

### Layout Regions
- Component structure and hierarchy
- Grid systems (mobile and desktop)
- Visual accents and overlays

### Typography
- Font families (Fraunces, Work Sans, JetBrains Mono)
- Exact sizes and weights (e.g., "Fraunces Energetic, 48px, font-weight: 800")
- Text colors and opacity values

### Color
- Substrate colors (backgrounds)
- Component colors with semantic tokens
- Accent and highlight colors
- Exact CSS variable references (e.g., `bg-asphalt-black`, `text-ink-gold`)

### Spacing
- Padding and margin specifications
- Grid gutters and gaps
- Responsive breakpoints

### Motion
- Animation specifications
- Transition timing and curves
- Stagger delays
- Reduced motion fallbacks

### Motif Slots
- Asset placeholders with exact references
- Examples: `{KR-UI-004}`, `{KR-SOLID-029}`, `{KR-UI-002}`
- Generation requirements for missing assets

## Example Content

From `AnalysisDashboard-hifi.md`:

```markdown
## Typography
- Page Headline: Fraunces Energetic, 48px, font-weight: 800
- Skill Title: Fraunces Restrained, 20px, font-weight: 700
- Mastery Percentage: JetBrains Mono, 12px, font-weight: 700

## Color
- Substrate: bg-asphalt-black
- Tiles: bg-asphalt-black/50 with border-white/10 and shadow-viscous
- Mastery Accent: text-ink-gold (Status) or text-solidarity-green

## Motif Slots
- {KR-UI-004} Blueprint grid overlay (transparent)
- {KR-SOLID-029} Paint splash - dynamic expressive overlay
- {KR-UI-002} Halo disk (plain + gauge version)
```

## Why These Are Valuable

1. **Detailed Implementation Guidance**: Exact typography specs, color values, spacing measurements
2. **Design Token References**: Shows how to use Kerala Rage design tokens correctly
3. **Motif Asset Mappings**: Documents which design assets belong on which screens
4. **Motion Specifications**: Precise animation timing and curves
5. **Historical Record**: Documents the original design intent for each screen

## Usage

**For Developers:**
- Reference these specs when implementing UI components
- Use the exact typography and spacing values
- Follow the motion specifications for animations

**For Designers:**
- Use as reference for design system implementation
- Ensure new designs maintain consistency with original specs
- Check motif asset usage patterns

**For Documentation:**
- Reference when writing component documentation
- Link to specific specs in implementation guides
- Preserve as historical design records

## Related Documentation

- **New Design Documentation**: `docs/design/00-overview.md` through `docs/design/07-*`
- **Design System Canon**: `docs/design/DESIGN_SYSTEM_CANON.md`
- **Kerala Rage Brand Brief**: `docs/design/KERALA_RAGE_BRAND_BRIEF.md`
- **Restoration Analysis**: `KR_RAGE_FIGMA_RESTORATION_ANALYSIS.md` (in repo root)

## Status

✅ **Retrieved**: 2026-02-17
✅ **Source**: KR-Rage-Figma branch (commit 59e4deb5)
✅ **Files**: 30 HiFi specifications preserved
✅ **Content Verified**: All files contain complete, valid markdown

---

**Note**: These files were deliberately preserved to prevent data loss during the restoration process. They complement (not replace) the newer documentation structure in the parent `design/` directory.

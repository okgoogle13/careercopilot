# UI Primitive Prompt Library — Kerala Rage kr-solidarity

**Version**: 1.0.0
**Date**: 2026-02-24
**Brand Rules**: kerala-rage-asset-prompter + kr-svg combined spec
**Motif Language**: Melbourne laneway grit, industrial solidarity, activist resistance, Kerala diaspora, urban infrastructure
**BANNED**: Australian native flora, eucalyptus/wattle/gum-leaf motifs, and Northcote Curio botanical specimen styling

---

## How to Use

Each prompt below is a complete `/kr-svg` input specification. Execute by passing the `asset_id`, `name`, and `intent` fields to the kr-svg skill. The `base`, `content`, and `accent` descriptions guide the SVG group composition.

**kr-svg constraints (all prompts pre-validated):**
- `viewBox="0 0 512 512"`
- Groups: `<g id="base">`, `<g id="content">`, `<g id="accent">`
- Colors: `var(--sys-color-charcoalBackground-base)`, `var(--sys-color-worker-ash-steps-6)`, `var(--sys-color-worker-ash-base)`, `var(--sys-color-solidarityRed-base)`, `var(--sys-color-inkGold-base)`
- Stroke-width: 2 | 3 | 4 | 6 only
- No hex, no rgb, no `<text>`, no `<filter>`, no perfect circles, no symmetry

---

## Tier 1: Replace Placeholders (KR-UI-008 → KR-UI-019)

### KR-UI-008: Corrugated Iron Corner Motif

- **asset_id**: KR-UI-008
- **name**: Corrugated Iron Corner Motif
- **intent**: Decorative corner accent for cards and containers. Industrial warehouse texture reference.
- **base**: Outer boundary frame with uneven stroke weight (thicker bottom-left stroke-width 4, thinner top-right stroke-width 2), slightly rotated -2deg. Asymmetric corner radii.
- **content**: Corrugated iron sheet pattern — 5-6 vertical parallel lines with slight wave/ripple, uneven spacing (gaps range 18-26px). One line interrupted/broken mid-way suggesting rust damage. Two small rectangular rivet patches at offset corners.
- **accent**: Single diagonal scratch line in solidarityRed across corner. Small offset pebble-shaped rivet head in inkGold near top.

---

### KR-UI-009: Laneway Brick Repeat Pattern

- **asset_id**: KR-UI-009
- **name**: Laneway Brick Repeat Pattern
- **intent**: Tileable background texture for card surfaces and empty states. Melbourne laneway wall reference.
- **base**: 512x512 frame with subtle irregular border (uneven stroke-width, thicker on bottom).
- **content**: Melbourne laneway brick grid — 4 rows of offset rectangles with varying rx/ry (3-8px range), mortar gaps as negative space. One brick slightly displaced from alignment. Weathering cracks through 2 bricks as thin angular paths.
- **accent**: One brick highlighted with solidarityRed stroke (stroke-width 3). Diagonal crack line through bottom-right corner in inkGold.

---

### KR-UI-010: Tram Wire Intersection Motif

- **asset_id**: KR-UI-010
- **name**: Tram Wire Intersection Motif
- **intent**: Decorative motif for section dividers and badge backgrounds. Melbourne W-class tram overhead wire infrastructure reference.
- **base**: Organic boundary path (not rectangular) — catenary wire sweep shape, wider at top, tapered at sides.
- **content**: Two crossing overhead wire lines at slight angle (8-12deg). Pantograph contact point at intersection (small angular bracket shape). Support bracket arm extending from one side — angular, geometric, built from 3-4 path segments. Small insulator shapes at crossing point.
- **accent**: Spark/arc mark at wire crossing in solidarityRed (3 short radiating lines). Small rivet dot in inkGold at bracket mount point.

---

### KR-UI-011: Wheat-Paste Tear Pattern

- **asset_id**: KR-UI-011
- **name**: Wheat-Paste Tear Pattern
- **intent**: Decorative overlay for card edges and torn-paper transitions. Melbourne street poster aesthetic.
- **base**: Full-frame container with thin border.
- **content**: Irregular torn paper edge running vertically — jagged path with organic curves, different densities top (tight tears) vs bottom (wider rips). Layered paper fragments at different opacities (0.2, 0.4, 0.6) suggesting depth/layers of old posters.
- **accent**: Small paint drip shape at one tear point in solidarityRed. Thin line visible beneath torn layer in inkGold suggesting the poster underneath.

---

### KR-UI-012: Solidarity Fist Badge

- **asset_id**: KR-UI-012
- **name**: Solidarity Fist Badge
- **intent**: Brand badge for activism/resistance themed sections. Workers' solidarity symbol.
- **base**: Asymmetric rounded rectangle frame, slightly rotated (-3deg), uneven corner radii (top-left sharp, others softened).
- **content**: Simplified raised fist silhouette — geometric angular paths, not photorealistic. Built from 4-5 blocky rectangular segments suggesting fingers and forearm. Woodcut/linocut aesthetic with slight registration offset between fill and stroke.
- **accent**: 3 radiating lines from fist top in inkGold (unequal lengths: 24px, 36px, 20px). Small seed-shaped mark at wrist in solidarityRed.

---

### KR-UI-013: Industrial Bolt Grid Motif

- **asset_id**: KR-UI-013
- **name**: Industrial Bolt Grid Motif
- **intent**: Structural accent for data-heavy panels and technical sections. Warehouse hardware reference.
- **base**: Slightly skewed rectangular frame (1-2deg rotation). Uneven border stroke-width (thicker left/bottom).
- **content**: Grid of 9 bolt-head shapes — NOT perfect circles. Use offset ellipses with varying rx/ry (range 12-18px). Arranged in imperfect 3x3 with slight position jitter (2-6px offset). Hex-head suggestion via 6-sided angular paths on 3 bolts.
- **accent**: One bolt highlighted solidarityRed fill. Diagonal scratch/weld line across grid in worker-ash (stroke-width 2).

---

### KR-UI-014: Stencil Stripe Divider

- **asset_id**: KR-UI-014
- **name**: Stencil Stripe Divider
- **intent**: Horizontal section divider. Spray-paint stencil aesthetic, hand-cut quality.
- **base**: Thin horizontal line spanning full width, slightly wavy (2-3px undulation).
- **content**: Stencil-cut stripe pattern — alternating thick (stroke-width 4) and thin (stroke-width 2) dashes with overspray bleed edges (slightly fuzzy path outlines). Interrupted at center by a small geometric block (diamond/angular notch shape). Uneven dash lengths (30-60px range).
- **accent**: Center notch diamond filled in solidarityRed. One overspray dot in inkGold slightly above line at left third position.

---

### KR-UI-015: Protest Placard Frame

- **asset_id**: KR-UI-015
- **name**: Protest Placard Frame
- **intent**: Container frame for callout boxes, alert messages, and quotation blocks. Hand-held protest sign aesthetic.
- **base**: Placard shape — rectangle with a stick/handle extending below. Asymmetric top corners (left: angular/sharp, right: slightly rounded rx 8). Handle slightly off-center to the left.
- **content**: Inner frame with slight margin (8-12px). 3 horizontal lines suggesting text at varying widths (80%, 65%, 40%). Staple marks at top where placard meets handle (2 small rectangular notches).
- **accent**: Diagonal tape strips at two corners in inkGold (thin rectangles, rotated 45deg). Small tear at one edge in solidarityRed (jagged path, 3 points).

---

### KR-UI-016: Status Marker Set (Multi-State)

- **asset_id**: KR-UI-016
- **name**: Status Marker Set
- **intent**: Status indicator icons (active/pending/error/success) for application tracker. 4-state system.
- **base**: 4 separate indicator zones arranged in 2x2 grid with 24px gutters.
- **content**: 4 distinct shapes — NO circles. Active: pebble-shaped elongated ellipse (rx 18, ry 12). Pending: diamond (rotated square, 45deg). Error: angular asymmetric triangle (scalene). Success: angular checkmark built from 2 thick strokes. Each at slightly different scale for hierarchy.
- **accent**: Each has a small halo ring at slight offset. Active halo in solidarityRed. Success halo in inkGold. Others in worker-ash.

---

### KR-UI-017: Navigation Chevron Set

- **asset_id**: KR-UI-017
- **name**: Navigation Chevron Set
- **intent**: Directional indicators for sidebar navigation and breadcrumbs. 4 directions.
- **base**: 4 chevron zones (up/down/left/right) in quadrant layout with divider lines.
- **content**: Angular chevrons with uneven stroke weight — leading edge stroke-width 4, trailing edge stroke-width 2. Hand-cut stencil quality with slight angle imperfections (1-2deg off-true). Each chevron 48x48px zone.
- **accent**: Small pebble-dot marker at chevron apex in inkGold (offset ellipse rx 6 ry 4). Right-facing chevron has solidarityRed fill at opacity 0.3.

---

### KR-UI-018: Chain Link Cluster Motif

- **asset_id**: KR-UI-018
- **name**: Chain Link Cluster Motif
- **intent**: Decorative motif for profile sections and card backgrounds. Solidarity/collective strength/workers' unity reference.
- **base**: Organic boundary, roughly oval but asymmetric (wider left, tapered right). Thin border stroke-width 2.
- **content**: 3-4 interlocking chain links — each an elongated rounded rectangle (rx 16, ry 8) with 3px stroke, overlapping at different angles (0deg, 15deg, -10deg, 25deg). Links vary in size (large, medium, small, medium). Slight gap in one link suggesting breakage/freedom.
- **accent**: Broken link gap highlighted in solidarityRed (short arc stroke). One complete link has inkGold stroke highlight on its upper edge.

---

### KR-UI-019: Spray-Paint Splatter Motif

- **asset_id**: KR-UI-019
- **name**: Spray-Paint Splatter Motif
- **intent**: Decorative overlay for hero sections and emphasis moments. Melbourne street art aerosol aesthetic.
- **base**: No visible border (transparent frame).
- **content**: 8-12 scattered irregular blob paths of varying sizes (radii 4px to 40px) — organic shapes, NOT circles. Use cubic bezier paths for each splatter. Opacities range 0.15 to 0.7. Scattered across canvas with density concentration toward center-left.
- **accent**: Largest splatter (40px radius) in solidarityRed at center-left. Cluster of 3 smaller splatters in worker-ash at top-right. Single drip-trail path in inkGold descending 60px from largest blob.

---

## Tier 2: Critical Feature Primitives (KR-UI-020 → KR-UI-027)

### KR-UI-020: Empty State — No Results

- **asset_id**: KR-UI-020
- **name**: Empty State — No Results
- **intent**: Illustration for empty list/search states across all features. "Nothing found" moment.
- **base**: Large asymmetric container with faded border (opacity 0.4), slightly rotated (-1deg). Uneven corner radii.
- **content**: Simplified magnifying glass shape — angular handle (thick rectangle), lens as irregular ellipse (NOT circle) with a crack/fracture line through it. 4-5 angular shards scattered below suggesting broken/empty results.
- **accent**: Question-mark-shaped path in inkGold (built from angular segments — a bent rectangle + diamond dot, not curves). Small industrial rivet dot at bottom-right in solidarityRed.

---

### KR-UI-021: Empty State — Upload Prompt

- **asset_id**: KR-UI-021
- **name**: Empty State — Upload Prompt
- **intent**: Dropzone/file upload empty state for ingestion page. "Drop files here" visual.
- **base**: Dashed-border irregular rectangle, slightly rotated (-2deg). Dashes are uneven lengths (20-40px). Asymmetric corner radii.
- **content**: Upward arrow built from 3 stacked angular chevron paths (NOT smooth curves) — each progressively smaller toward top. Document silhouette beneath (rectangle with asymmetric corner fold at top-right).
- **accent**: Small angular cloud-puff shape at arrow tip in inkGold (3-4 angular path segments). Red accent dot at document corner fold in solidarityRed.

---

### KR-UI-022: Progress Ring (Industrial Gauge)

- **asset_id**: KR-UI-022
- **name**: Progress Ring — Industrial Gauge
- **intent**: Application stage progress indicator. Industrial pressure gauge aesthetic.
- **base**: Thick outer track — NOT a perfect circle. Slightly irregular ellipse path (rx 180, ry 172) with one flat edge at bottom. Track in worker-ash at opacity 0.3, stroke-width 6.
- **content**: Progress arc segment in solidarityRed covering ~65% of track (partial fill). Notch cut into track at progress endpoint. Small tick marks at quarter points (4 ticks, uneven length 8-16px).
- **accent**: Stage milestone pebble-marker at 12-o'clock position in inkGold (offset ellipse). Small 2 radiating lines from current progress tip in solidarityRed.

---

### KR-UI-023: Timeline Connector Segment

- **asset_id**: KR-UI-023
- **name**: Timeline Connector Segment
- **intent**: Vertical connector between timeline events in dashboard TimelineView. Hand-drawn quality.
- **base**: Vertical line running full height, slightly wavy/organic (2-4px undulation) — not perfectly straight. Stroke-width 2 in worker-ash.
- **content**: 3 node markers along the line — pebble-shaped stops (offset ellipses, NOT circles). Sizes: small (rx 8, ry 6), medium (rx 12, ry 9), large (rx 16, ry 11) from top to bottom.
- **accent**: Bottom node (current position) filled solidarityRed with 3 small radiating lines. Top 2 nodes in worker-ash. Line thickens to stroke-width 4 near bottom node.

---

### KR-UI-024: Metric Score Card Frame

- **asset_id**: KR-UI-024
- **name**: Metric Score Card Frame
- **intent**: Container for ATS score and metric displays on analysis page. Brutalist data display.
- **base**: Heavy slab-shaped outer frame — stroke-width 6 on bottom edge, stroke-width 2 on top edge. Asymmetric corners (bottom-left angular, others slightly rounded).
- **content**: Large irregular ellipse score zone at center (rx 80, ry 72). Horizontal line divider below center (full width, stroke-width 2). 3 small rectangular stat blocks beneath divider at different widths (60px, 80px, 50px).
- **accent**: Corner triangle accent in solidarityRed at top-left (right triangle, 32px legs). Small pebble-seed marker at bottom-right in inkGold (ellipse rx 8, ry 5).

---

### KR-UI-025: Company Logo Placeholder

- **asset_id**: KR-UI-025
- **name**: Company Logo Placeholder
- **intent**: Placeholder when company logos unavailable in job listings. Melbourne CBD skyline.
- **base**: Asymmetric rounded square frame (stone-radius: rx 12/ry 8 top-left, rx 4/ry 16 bottom-right, etc.).
- **content**: Simplified Melbourne CBD skyline — 3 rectangles of different heights (160px, 220px, 120px) and widths (60px, 40px, 70px) suggesting buildings. Angular rooflines, not smooth. One building has a small 2x3 window grid (6 tiny rectangles).
- **accent**: Small window-dot accents in inkGold on tallest building (3 dots). Red pennant/flag angular shape at top of middle building in solidarityRed.

---

### KR-UI-026: Document Type Badge (PDF)

- **asset_id**: KR-UI-026
- **name**: Document Type Badge — PDF
- **intent**: Document format indicator for resume/document management section.
- **base**: Document silhouette with asymmetric corner fold at top-right. Slightly off-square proportions (wider than tall by 8px).
- **content**: Bold geometric block shapes suggesting "PDF" letterforms — NOT `<text>` elements. P: vertical rectangle + half-ellipse. D: vertical rectangle + curved path. F: vertical rectangle + 2 horizontal arms. Horizontal line separator below letterforms.
- **accent**: Corner fold triangle in solidarityRed (fill). Small irregular ellipse stamp/seal shape at bottom-center in inkGold (rx 16, ry 12).

---

### KR-UI-027: Validation Checkmark

- **asset_id**: KR-UI-027
- **name**: Validation Checkmark
- **intent**: Success/validation indicator for onboarding steps and form fields. Stencil verification stamp.
- **base**: Organic shield/badge shape — asymmetric, wider at top, tapered bottom. Uneven left/right edges (left slightly concave, right convex).
- **content**: Bold angular checkmark path — stroke-width 6, hand-cut quality with slight angle variation on each segment. Short arm 30deg, long arm -55deg (not standard 45deg). Stencil-stamp aesthetic.
- **accent**: 3 radiating lines from checkmark tip in inkGold (lengths: 16px, 24px, 12px). Small dot at shield top-center in solidarityRed (ellipse rx 6, ry 5).

---

## Tier 3: Enhancement Primitives (KR-UI-028 → KR-UI-033)

### KR-UI-028: Sidebar Section Divider

- **asset_id**: KR-UI-028
- **name**: Sidebar Section Divider
- **intent**: Decorative horizontal divider between navigation groups in sidebar. Industrial rivet detail.
- **base**: Thin horizontal line spanning full width, stroke-width 2, slightly wavy (1-2px undulation).
- **content**: Small industrial interruption at center — tiny bolt-head/rivet shape (hexagonal, ~12px) breaking the line. Thicker line segment (stroke-width 4) on right side of rivet, thinner (stroke-width 2) on left (asymmetric weight).
- **accent**: Rivet head filled in inkGold. Slightly thicker line segment endpoint in solidarityRed (small pebble-dot at right terminus).

---

### KR-UI-029: Avatar Frame (Sentry)

- **asset_id**: KR-UI-029
- **name**: Avatar Frame — Sentry
- **intent**: User avatar border/frame for profile sections and sidebar. NOT circular.
- **base**: Asymmetric rounded shape — sentry-style, ~98% roundness with one flattened edge at bottom (6px flat segment). Stroke-width 3 in worker-ash.
- **content**: Inner cutout zone (slightly smaller concentric shape offset 8px inward). Thin inset border in worker-ash-steps-6 at opacity 0.4.
- **accent**: Small status dot position at bottom-right in solidarityRed (offset ellipse rx 8, ry 6, NOT circle). Corner nick/notch cut at top-left in inkGold (small triangular cutout).

---

### KR-UI-030: Loading Skeleton Block

- **asset_id**: KR-UI-030
- **name**: Loading Skeleton Block
- **intent**: Skeleton loading placeholder for cards and content areas. Ghost content indicator.
- **base**: Card-shaped outer frame with stone-radius (asymmetric: rx 8/ry 12 top-left, rx 12/ry 6 bottom-right). Stroke-width 2 at opacity 0.3.
- **content**: 3 horizontal bars at different widths simulating text lines (70%, 50%, 85% of frame width). One square-ish block (100x80px) at top-right simulating image area. All fills at opacity 0.15-0.25 in worker-ash-steps-6.
- **accent**: Subtle diagonal line suggesting shimmer direction (stroke-width 2, opacity 0.1, 45deg). One corner accent pebble-dot in worker-ash (ellipse rx 5, ry 4).

---

### KR-UI-031: Error State Illustration

- **asset_id**: KR-UI-031
- **name**: Error State Illustration
- **intent**: Error/failure state illustration for API errors and broken states. Shattered concrete slab aesthetic.
- **base**: Cracked/fractured frame — split into 2 offset halves with 8-12px gap between. Left half shifted 4px down. Suggests broken poster or shattered concrete slab.
- **content**: Exclamation mark built from geometric angular paths (rectangle body 20x80px + diamond dot 16x16px below). 4-5 angular fragment shards scattered around the crack (triangles and trapezoids of varying size).
- **accent**: SolidarityRed glow line along the crack gap (stroke-width 3, opacity 0.8). Small repair-tape strip crossing the gap in inkGold (thin rectangle 40x8px, rotated 30deg).

---

### KR-UI-032: Notification Bell Accent

- **asset_id**: KR-UI-032
- **name**: Notification Bell Accent
- **intent**: Notification indicator for header/nav area. Melbourne tram bell reference.
- **base**: Bell silhouette — angular geometric interpretation. Trapezoid body (wider at bottom), triangular crown at top, small rectangular clapper arm. NOT smooth curves. Built from straight-line paths.
- **content**: Clapper inside bell as offset pebble-shape (ellipse rx 10, ry 7, off-center). 2-3 sound wave arcs radiating from top — angular (polyline segments), not smooth curves. Uneven spacing between arcs.
- **accent**: Notification dot at top-right (offset ellipse rx 9, ry 7, NOT perfect circle) in solidarityRed. InkGold stroke highlight on bell's right edge (partial stroke on outer path).

---

### KR-UI-033: Data Chart Frame

- **asset_id**: KR-UI-033
- **name**: Data Chart Frame
- **intent**: Decorative frame/container for analysis charts and data visualizations. Engineering blueprint aesthetic.
- **base**: Rectangular frame with hand-drawn quality grid lines — slightly irregular spacing (not uniform). Frame border thicker on left (stroke-width 4) and bottom (stroke-width 4) for axis emphasis, thinner on top/right (stroke-width 2).
- **content**: Axis lines with tick marks (5 ticks on x-axis, 4 on y-axis, uneven spacing). Subtle 3x3 coordinate grid in worker-ash at opacity 0.15.
- **accent**: Corner label zone rectangle in solidarityRed at top-left (small rectangle 40x16px, opacity 0.6). Small data-point marker in inkGold at one grid intersection (pebble-dot, rx 6, ry 4).

---

## Tier 4: Brand Extension (KR-UI-034 → KR-UI-035)

### KR-UI-034: 404 Page Illustration

- **asset_id**: KR-UI-034
- **name**: 404 Page Illustration
- **intent**: Full illustration for the Not Found page. Wheat-paste removal / missing poster aesthetic.
- **base**: Large asymmetric frame — ragged/torn edges on left and bottom (jagged paths), clean straight edges on top and right. Suggesting a poster that's been partially ripped away.
- **content**: "404" suggested by geometric block shapes — large angular forms using rectangles and negative space to evoke the numbers. NOT `<text>` elements. 4: rectangle + vertical bar + horizontal bar. 0: irregular rounded rectangle (not ellipse). 4: same as first. Scattered small angular search fragments below.
- **accent**: Small Melbourne W-class tram silhouette in inkGold at bottom (simplified to 5-6 angular paths: body rectangle, roof trapezoid, 2 window rectangles, pantograph line). SolidarityRed angular "X" mark over the center area.

---

### KR-UI-035: Onboarding Step Marker

- **asset_id**: KR-UI-035
- **name**: Onboarding Step Marker
- **intent**: Step indicator for multi-stage onboarding flow. Journey/progress waypoints.
- **base**: Horizontal track line with 5 node positions, slightly wavy (1-2px undulation). Stroke-width 2 in worker-ash.
- **content**: 5 markers along track: positions 1-2 completed (filled pebble-shapes in worker-ash, rx 10 ry 7), position 3 current (larger highlighted pebble, rx 16 ry 11), positions 4-5 future (outline-only pebble shapes, stroke-width 2). Track thickens between completed nodes.
- **accent**: Small angular arrow between position 3 and 4 in solidarityRed (2 chevron strokes). Radiating lines (3 lines, unequal) at current position in inkGold.

---

## Brand Compliance Checklist

- [ ] No Australian native plant motifs or Northcote Curio botanical specimen references
- [ ] All colors: only `var(--sys-color-*)` approved variables
- [ ] All shapes: asymmetric radii, no `border-radius: 50%`, no perfect circles
- [ ] All stroke-widths: 2 | 3 | 4 | 6 only
- [ ] All SVGs: `viewBox="0 0 512 512"`, `<title>`, `<desc>`, 3 groups (base/content/accent)
- [ ] No forbidden elements: `<text>`, `<filter>`, `<mask>`, `<pattern>`, `<image>`
- [ ] Motif vocabulary: corrugated iron, tram wires, chain links, bolt grids, wheat-paste, spray-paint, brickwork, fists, placards, rivets, concrete

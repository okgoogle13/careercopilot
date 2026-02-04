# The Northcote Curio Wireframe Audit

## A Critical Assessment & Asset Integration Manifest

---

# PART 1: THE CRITIQUE

## The Creative Soul Assessment

Reading through these wireframes, I find myself standing at the threshold of something genuinely distinctive—yet not quite arrived. The bones are Victorian Naturalist; the flesh occasionally lapses into SaaS Dashboard Purgatory. Let me illuminate where the specimen thrives and where it requires further cultivation.

### What Sings

The dual-mode architecture is philosophically sound. Mode A (Gallery) and Mode B (Laboratory) aren't merely color swaps—they represent fundamentally different emotional contracts with the user. The Gallery promises wonder and discovery; the Laboratory promises rigor and revelation. This biome thinking elevates the system beyond "dark mode / light mode" into something with genuine narrative weight.

The naming conventions carry authentic poetry. "The Resurrection" for a landing page, "The Audit Microscope" for analysis, "The Sentry Lookout" for opportunity browsing—these aren't arbitrary labels. They're invitations into a world where career development becomes specimen collection, where job applications transform into botanical cataloguing. This linguistic commitment matters.

The wireframe's understanding of Z-index as stage-craft demonstrates sophisticated spatial thinking. Background textures at Z-0, content at Z-1, floating anchors at Z-2—this layered approach creates the depth that separates a cabinet of curiosities from a flat interface.

### What Requires Intervention

**The Dryness Problem.** Several page descriptions read like technical specifications rather than design intentions. "Single Core/Stone container" tells an engineer what to build but doesn't tell a designer what to _feel_. Compare these:

| Current Description                             | Supercharged Alternative                                                                                                                                    |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Drop Zone (Center): Huge Core/Stone container" | "The Specimen Deposit: A sunken examination tray awaiting organic material, its dashed borders suggesting the careful incision lines of a dissection plate" |
| "Grid: 2x2 grid of solid Core/Stone cards"      | "The Quadrant Display: Four specimen cases arranged with museum precision, each revealing a different facet of the candidate's professional anatomy"        |
| "Filters. Core/Pebble ghost toggles"            | "The Sorting Apparatus: River-worn controls that filter the stream of opportunities like a gold prospector's sieve"                                         |

**The Organic Anchor Deficit.** While the wireframes mention assets in passing, they don't commit to placement. "Header Anchor: img-kookaburra-sentry perched on top nav" is directionally correct but lacks the spatial precision needed for implementation. Where exactly? At what scale? How does it interact with responsive breakpoints?

**Token Compliance Gaps.** I notice several potential violations:

1. **Page 4 (Ingestion)** specifies "dashed #2C2723" for the drop zone border, but our token system defines this as `color.semantic.surface.laboratory.charcoalSlate` which is actually #16141A. The #2C2723 value corresponds to `eucalyptSmoke`—a Gallery mode surface token being used in Laboratory mode. This cross-contamination undermines modal coherence.

2. **Page 1 (Landing)** calls for "96px, Gold" typography, but our scale defines `displayLarge` at 48px. Either we need a new `displayHero` token or this specification needs recalibration.

3. **Page 7 (Kanban)** mentions "200 Thin font" for metrics, but our typography tokens don't define this weight variant. Work Sans supports 100-900 weights, so this is technically possible but needs formal tokenization.

### Font Usage Compliance

| Context                | Specified Font      | Token Alignment                      | Verdict               |
| ---------------------- | ------------------- | ------------------------------------ | --------------------- |
| Landing headline       | Libre Bodoni Italic | `typography.fontFamily.proclamation` | ✓ Correct             |
| Drop zone label        | JetBrains Mono      | `typography.fontFamily.mono`         | ✓ Correct             |
| Skill metrics          | JetBrains Mono      | `typography.fontFamily.mono`         | ✓ Correct             |
| Body text              | Work Sans           | `typography.fontFamily.body`         | ✓ Correct             |
| Card labels "FIG. [X]" | Not specified       | Should be `monoAnnotation`           | ⚠ Needs clarification |

The emotional/technical font division is correctly observed: Libre Bodoni for moments of aspiration and invitation (Gallery mode headlines), JetBrains Mono for precision and parsing (Laboratory mode data), Work Sans for sustained reading. This tripartite system works.

---

# PART 2: THE ASSET INTEGRATION PLAN

## The Organic Anchor Mandate

Every page must breathe. No interface should feel entirely constructed—somewhere, a vine must creep, a bird must perch, a compass must orient. These organic anchors serve three functions: they break the mechanical grid, they reinforce the Victorian Naturalist narrative, and they provide memorable landmarks for user orientation.

## Page-by-Page Asset Mapping

### Page 1: Landing ("The Resurrection")

**Mode:** Gallery | **Emotional Register:** Wonder, Invitation

| Asset                          | Placement                                       | Z-Index | Behavior                                                         |
| ------------------------------ | ----------------------------------------------- | ------- | ---------------------------------------------------------------- |
| `pattern-nocturnal-canopy`     | Full viewport background                        | Z-0     | Static, 25% opacity, CSS `background-size: cover`                |
| `motif-gallery-wattle-hanging` | Top-right corner, extending 180px into viewport | Z-2     | Subtle parallax on scroll (translateY at 0.1x scroll speed)      |
| `motif-gallery-firefly-sprite` | Scattered across hero section (12-16 instances) | Z-3     | CSS animation: gentle float + opacity pulse (8s loop, staggered) |
| `motif-gallery-banksia-pot`    | Bottom-left corner, grounding the composition   | Z-2     | Static anchor, 40% extends beyond viewport edge                  |

**Spatial Logic:** The wattle hangs from above like specimens in a naturalist's drying room. Fireflies provide bioluminescent atmosphere without competing with the headline. The banksia pot grounds the floating elements, suggesting a working conservatory rather than an empty void.

---

### Page 2: Authentication ("The Entry Gate")

**Mode:** Gallery | **Emotional Register:** Security, Threshold

| Asset                          | Placement                                                         | Z-Index | Behavior                                                     |
| ------------------------------ | ----------------------------------------------------------------- | ------- | ------------------------------------------------------------ |
| `pattern-nocturnal-canopy`     | Full viewport, 15% opacity (darker than landing)                  | Z-0     | Static                                                       |
| `motif-gallery-firefly-sprite` | Sparse distribution (6-8 instances), concentrated near card edges | Z-3     | Slower animation (12s loop), suggesting watchful presence    |
| `motif-laboratory-compass`     | Centered below the auth card, 60% opacity                         | Z-1     | Subtle rotation on input focus (±5°), suggesting orientation |

**Spatial Logic:** The gate is quieter than the landing—fewer distractions, more focus. The compass beneath the card suggests that authentication is a matter of finding one's bearing before entering the collection.

---

### Page 3: Onboarding ("Choosing the Soil")

**Mode:** Gallery | **Emotional Register:** Selection, Possibility

| Asset                             | Placement                              | Z-Index | Behavior                     |
| --------------------------------- | -------------------------------------- | ------- | ---------------------------- |
| `pattern-nocturnal-canopy`        | Full viewport, 20% opacity             | Z-0     | Static                       |
| `motif-gallery-botanical-waratah` | Top-left corner, partially cropped     | Z-2     | Static anchor                |
| `motif-gallery-botanical-wattle`  | Bottom-right corner, partially cropped | Z-2     | Static anchor                |
| `motif-gallery-botanical-banksia` | Mid-right edge, subtle                 | Z-1     | 40% opacity, decorative only |

**Spatial Logic:** The three botanicals frame the selection grid without overwhelming it. Each industry sector card should feature a unique botanical icon (to be specified in icon library), but the page-level anchors establish that the user is selecting _within_ the natural world, not apart from it.

---

### Page 4: Ingestion ("The Mulch & Mineral Setup")

**Mode:** Laboratory | **Emotional Register:** Precision, Deposit

| Asset                             | Placement                                               | Z-Index | Behavior                                                                   |
| --------------------------------- | ------------------------------------------------------- | ------- | -------------------------------------------------------------------------- |
| `texture-laboratory-parchment`    | Full viewport background                                | Z-0     | Static, color-matched to #F5F2EB                                           |
| `motif-laboratory-skeleton-etch`  | Centered behind drop zone, 6% opacity                   | Z-1     | Static watermark                                                           |
| `motif-laboratory-stamp-verified` | Appears on successful upload, bottom-right of drop zone | Z-3     | Stamp animation: scale from 150% with rotation, settles with bounce easing |
| `motif-laboratory-compass`        | Top-right corner, 30% opacity                           | Z-2     | Static orientation marker                                                  |

**Spatial Logic:** The skeleton watermark transforms document upload into anatomical examination—the user isn't just uploading a file, they're depositing a specimen for dissection. The stamp provides satisfying feedback that echoes archival verification processes.

---

### Page 5: Analysis Dashboard ("The Audit Microscope")

**Mode:** Laboratory | **Emotional Register:** Revelation, Measurement

| Asset                            | Placement                                           | Z-Index | Behavior                                                     |
| -------------------------------- | --------------------------------------------------- | ------- | ------------------------------------------------------------ |
| `texture-laboratory-parchment`   | Full viewport                                       | Z-0     | Static                                                       |
| `texture-laboratory-grid-major`  | Overlay across entire viewport                      | Z-1     | 8% opacity, reinforcing measurement context                  |
| `motif-laboratory-compass`       | Left column, functioning as the "Match Score Gauge" | Z-2     | Needle rotation animated based on score value (0-100° range) |
| `motif-laboratory-skeleton-etch` | Fragmentary appearance in empty grid cells          | Z-1     | 4% opacity, decorative continuity                            |

**Spatial Logic:** The compass becomes functional here—not mere decoration but an actual data visualization instrument. The grid overlay reinforces that everything is being measured, assessed, catalogued. The skeleton fragments maintain visual continuity from the Ingestion page.

---

### Page 6: Opportunity Feed ("The Sentry Lookout")

**Mode:** Gallery | **Emotional Register:** Discovery, Watchfulness

| Asset                             | Placement                                    | Z-Index | Behavior                                                  |
| --------------------------------- | -------------------------------------------- | ------- | --------------------------------------------------------- |
| `pattern-nocturnal-canopy`        | Full viewport, 22% opacity                   | Z-0     | Static                                                    |
| `motif-gallery-sentry-kookaburra` | Top of sidebar, perched on navigation header | Z-3     | Subtle idle animation: head tilt every 8-12s (randomized) |
| `motif-gallery-wattle-hanging`    | Top-right corner of feed area                | Z-2     | Static anchor                                             |
| `motif-gallery-firefly-sprite`    | Sparse distribution in sidebar area          | Z-3     | Ambient movement                                          |

**Spatial Logic:** The Kookaburra earns its name here—the Sentry watching over the opportunity feed. Its occasional head movement suggests alertness without demanding attention. The user browses opportunities under the watchful eye of their guide.

---

### Page 7: Kanban Board ("The Command Center Greenhouse")

**Mode:** Gallery | **Emotional Register:** Growth, Progress

| Asset                              | Placement                         | Z-Index | Behavior                                       |
| ---------------------------------- | --------------------------------- | ------- | ---------------------------------------------- |
| `pattern-nocturnal-canopy`         | Full viewport, 18% opacity        | Z-0     | Static                                         |
| `motif-gallery-eucalyptus-hanging` | Top corners of each Kanban column | Z-2     | Subtle sway animation (CSS transform, 6s loop) |
| `motif-gallery-banksia-pot`        | Bottom-left corner                | Z-2     | Static grounding element                       |
| `motif-gallery-firefly-sprite`     | Concentrated near "Offer" column  | Z-3     | Increased density suggesting culmination       |

**Spatial Logic:** The greenhouse metaphor comes alive through hanging foliage that frames each column like a garden trellis. Fireflies cluster toward the "Offer" column, suggesting that successful applications attract light. The potted banksia grounds the floating columns.

---

### Page 8: Split-Screen Editor ("The Writing Workbench")

**Mode:** Laboratory | **Emotional Register:** Craft, Assembly

| Asset                            | Placement                             | Z-Index | Behavior                                   |
| -------------------------------- | ------------------------------------- | ------- | ------------------------------------------ |
| `texture-laboratory-parchment`   | Full viewport                         | Z-0     | Static                                     |
| `texture-laboratory-grid-minor`  | Editor panel only, 5% opacity         | Z-1     | Suggests ruled paper                       |
| `motif-laboratory-compass`       | Bottom-right corner of Evidence panel | Z-2     | 25% opacity, static orientation            |
| `motif-laboratory-skeleton-etch` | Fragmentary in Evidence panel header  | Z-1     | 8% opacity, connecting to earlier analysis |

**Spatial Logic:** The workbench is deliberately spare—craft requires focus. The grid overlay on the editor suggests the precision of manuscript preparation. Evidence cards feel like specimens retrieved from a drawer, their skeleton motif connecting them to the anatomical analysis that produced them.

---

### Page 9: Studio Designer ("The Specimen Finalization")

**Mode:** Laboratory | **Emotional Register:** Refinement, Presentation

| Asset                             | Placement                    | Z-Index | Behavior                                                       |
| --------------------------------- | ---------------------------- | ------- | -------------------------------------------------------------- |
| `texture-laboratory-parchment`    | Full viewport                | Z-0     | Increased grain texture                                        |
| `texture-laboratory-grid-major`   | Preview panel, 10% opacity   | Z-1     | When "Bot View" active: shifts to red (#B85450) at 15% opacity |
| `motif-laboratory-stamp-verified` | Appears on "Finalize" action | Z-3     | Stamp animation as on Ingestion                                |
| `motif-laboratory-compass`        | Control panel header         | Z-2     | Static, 40% opacity                                            |

**Spatial Logic:** The aged parchment grain intensifies here—the specimen is being prepared for permanent archival. The "Bot View" toggle transforms the preview into an anatomical diagram, revealing the document's structural skeleton. The verification stamp provides ceremonial closure.

---

### Page 10: Settings ("The Archive Vault")

**Mode:** Laboratory | **Emotional Register:** Configuration, Storage

| Asset                            | Placement                                         | Z-Index | Behavior                      |
| -------------------------------- | ------------------------------------------------- | ------- | ----------------------------- |
| `texture-laboratory-parchment`   | Full viewport                                     | Z-0     | Static                        |
| `motif-laboratory-skeleton-etch` | Large, centered behind settings cards, 4% opacity | Z-1     | Static architectural presence |
| `motif-laboratory-compass`       | Header area, integrated with navigation           | Z-2     | Static                        |
| `texture-laboratory-grid-minor`  | Behind individual settings cards                  | Z-1     | 6% opacity                    |

**Spatial Logic:** The vault is institutional—the skeleton looms large as architectural element rather than specimen. Settings feel etched into the very structure of the building. The compass in the header reminds users they can always find their way back.

---

### Page 11: Dashboard Overview ("The Canopy View")

**Mode:** Gallery | **Emotional Register:** Status, Altitude

| Asset                              | Placement                                 | Z-Index | Behavior                             |
| ---------------------------------- | ----------------------------------------- | ------- | ------------------------------------ |
| `pattern-nocturnal-canopy`         | Full viewport, 25% opacity                | Z-0     | Static                               |
| `motif-gallery-eucalyptus-hanging` | Top-left, dramatic "Ceiling Gum" presence | Z-2     | Parallax on scroll                   |
| `motif-gallery-sentry-kookaburra`  | Perched within eucalyptus arrangement     | Z-3     | Idle animation, watching the metrics |
| `motif-gallery-firefly-sprite`     | Ambient throughout                        | Z-3     | Standard animation                   |
| `motif-gallery-banksia-pot`        | Bottom-right corner                       | Z-2     | Static grounding                     |

**Spatial Logic:** The overview is the canopy itself—the user looks down at their career ecosystem from above. The Kookaburra returns, now nested in the eucalyptus, suggesting that the journey has brought user and guide to the same vantage point. Maximum organic presence reinforces that this is a living system, not a static report.

---

# PART 3: CONSOLIDATED WIREFRAME & ASSET MAP

## Document Control

| Field                       | Value                 |
| --------------------------- | --------------------- |
| **Document ID**             | WIRE-002-CONSOLIDATED |
| **Version**                 | 3.0                   |
| **Status**                  | Implementation Ready  |
| **Last Updated**            | January 14, 2026      |
| **Token Reference**         | DOC-004 / Tokens V7   |
| **Asset Library Reference** | ASSET-001-CURIO       |

---

## System Constants

### Modal Biomes

**Mode A: The Nocturnal Canopy (Gallery)**

- **Stage:** `color.semantic.surface.gallery.charcoalBark` (#141210)
- **Atmosphere:** Glassmorphic surfaces, bioluminescent accents, botanical anchors
- **Primary Accent:** `color.semantic.primary.wattleGold` (#D4A84B)
- **Typography Mood:** Aspirational, inviting (Fraunces with WONK=1, Libre Bodoni Italic for proclamations)
- **Permitted Motifs:** Flowers, leaves, birds, fireflies, brass instruments
- **Background Pattern:** `pattern-nocturnal-canopy` at 18-25% opacity

**Mode B: The Field Journal (Laboratory)**

- **Stage:** `color.semantic.surface.laboratory.fieldPaper` (#F5F2EB)
- **Atmosphere:** Solid cardstock surfaces, etched overlays, measurement grids
- **Primary Accent:** `color.semantic.primary.wattleGold` (#D4A84B) with `clinicalSlate` (#2C2723) support
- **Typography Mood:** Precise, documentary (JetBrains Mono for data, Work Sans for annotation)
- **Permitted Motifs:** Skeletons, grids, compasses, stamps, measurement tools
- **Prohibited Motifs:** Flowers, decorative fauna, organic flourishes
- **Background Texture:** `texture-laboratory-parchment` with optional `texture-laboratory-grid-major` overlay

### Shape Tokens (Border Radius)

| Token                           | Value              | Application                  |
| ------------------------------- | ------------------ | ---------------------------- |
| `shape.organicAsymmetry.pebble` | 20px 6px 16px 28px | Buttons, primary actions     |
| `shape.organicAsymmetry.stone`  | 16px 4px 12px 24px | Cards, containers            |
| `shape.organicAsymmetry.leaf`   | 24px 8px 20px 4px  | Hero elements, feature cards |
| `shape.organicAsymmetry.seed`   | 8px 4px 10px 6px   | Badges, tags, small elements |

### Typography Scale

| Role           | Font Family         | Weight               | Size                            | Use Case                   |
| -------------- | ------------------- | -------------------- | ------------------------------- | -------------------------- |
| Display Hero   | Libre Bodoni Italic | 700                  | 72-96px                         | Landing headlines only     |
| Display Large  | Fraunces            | 700, WONK=1, SOFT=50 | 48px                            | Page titles (Gallery)      |
| Display Large  | Fraunces            | 500, WONK=0, SOFT=15 | 42px                            | Page titles (Laboratory)   |
| Metric Display | Work Sans           | 100                  | 120-200px                       | Large numerical callouts   |
| Body           | Work Sans           | 400                  | 14-16px                         | Paragraph text             |
| Data           | JetBrains Mono      | 400                  | 12px                            | Parsed content, skill tags |
| Annotation     | JetBrains Mono      | 500                  | 10px, uppercase, 0.1em tracking | Labels, specimen markers   |

---

## Page Specifications

### PAGE 1: Landing ("The Resurrection")

**Classification:** Mode A (Gallery) | Entry Point | Emotional Register: Wonder

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Z-2: motif-gallery-wattle-hanging (top-right)               │
│                                                             │
│  Z-3: firefly-sprite (scattered, 12-16 instances)          │
│                                                             │
│         ┌─────────────────────────────────┐                │
│         │    "FUTURE SPECIMEN"            │  Z-1           │
│         │    Glassmorphic/Leaf Container  │                │
│         └─────────────────────────────────┘                │
│                                                             │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│    │ Fig. A   │  │ Fig. B   │  │ Fig. C   │  Z-1          │
│    │ Stone    │  │ Stone    │  │ Stone    │               │
│    └──────────┘  └──────────┘  └──────────┘               │
│                                                             │
│                  ┌─────────────────┐                       │
│                  │ Nav Dock/Pebble │  Z-2                  │
│                  └─────────────────┘                       │
│                                                             │
│ Z-2: motif-gallery-banksia-pot (bottom-left)               │
│                                                             │
│ Z-0: pattern-nocturnal-canopy (25% opacity)                │
└─────────────────────────────────────────────────────────────┘
```

#### Functional Annotations

| Element              | Specification                             | Token Reference                               |
| -------------------- | ----------------------------------------- | --------------------------------------------- |
| **Background**       | `pattern-nocturnal-canopy`                | `texture.gallery.background` + asset overlay  |
| **Opacity**          | 25%                                       | Custom (not tokenized)                        |
| **Gradient Overlay** | Bottom-up, `specimenNight` to transparent | `color.semantic.surface.shared.specimenNight` |

#### Content Annotations

| Element           | Content                                                        | Typography Token                                                                             |
| ----------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Headline**      | "FUTURE SPECIMEN"                                              | `typography.scale.displayHero` (Libre Bodoni Italic, 96px, Gold)                             |
| **Subhead**       | "Your career, catalogued with care"                            | `typography.scale.headlineMedium`                                                            |
| **Feature Cards** | "Fig. A: Discovery", "Fig. B: Analysis", "Fig. C: Application" | `typography.scale.monoAnnotation` for labels, `typography.scale.bodyMedium` for descriptions |

#### Design Annotations

| Element            | Shape                           | Surface                               | Border                               |
| ------------------ | ------------------------------- | ------------------------------------- | ------------------------------------ |
| **Hero Container** | `shape.organicAsymmetry.leaf`   | `color.glassmorphism.gallery.surface` | `color.glassmorphism.gallery.border` |
| **Feature Cards**  | `shape.organicAsymmetry.stone`  | `color.glassmorphism.gallery.surface` | `color.glassmorphism.gallery.border` |
| **Nav Buttons**    | `shape.organicAsymmetry.pebble` | `color.semantic.primary.wattleGold`   | None                                 |

#### Interaction Annotations

| Element            | Trigger | Animation                       | Token Reference                   |
| ------------------ | ------- | ------------------------------- | --------------------------------- |
| **Feature Cards**  | Hover   | translateY(-4px), shadow deepen | `motion.interactions.cardHover`   |
| **Nav Buttons**    | Hover   | translateY(-2px), glow increase | `motion.interactions.buttonHover` |
| **Wattle Hanging** | Scroll  | translateY at 0.1x scroll speed | Custom parallax                   |
| **Fireflies**      | Ambient | Float + opacity pulse, 8s loop  | Custom CSS animation              |

#### Asset Placement

| Asset ID                       | Position                     | Size                        | Z-Index | Behavior                 |
| ------------------------------ | ---------------------------- | --------------------------- | ------- | ------------------------ |
| `motif-gallery-wattle-hanging` | `top: -20px; right: 0`       | 320px width, natural height | Z-2     | Parallax (0.1x)          |
| `motif-gallery-banksia-pot`    | `bottom: -60px; left: -40px` | 280px width                 | Z-2     | Static                   |
| `motif-gallery-firefly-sprite` | Scattered, viewport-relative | 8-16px diameter             | Z-3     | Animated (8s, staggered) |
| `pattern-nocturnal-canopy`     | Full viewport cover          | 100%                        | Z-0     | Static, 25% opacity      |

---

### PAGE 2: Authentication ("The Entry Gate")

**Classification:** Mode A (Gallery) | Security Gateway | Emotional Register: Trust

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Z-3: firefly-sprite (sparse, 6-8 instances, card-adjacent) │
│                                                             │
│              ┌─────────────────────────┐                   │
│              │                         │                   │
│              │    Authentication       │  Z-2              │
│              │    Stone Container      │                   │
│              │    480px width          │                   │
│              │                         │                   │
│              └─────────────────────────┘                   │
│                                                             │
│              ┌─────────────────────────┐                   │
│              │  motif-laboratory-      │  Z-1              │
│              │  compass (60% opacity)  │                   │
│              └─────────────────────────┘                   │
│                                                             │
│ Z-0: pattern-nocturnal-canopy (15% opacity, darker)        │
└─────────────────────────────────────────────────────────────┘
```

#### Functional Annotations

| Element             | Specification                             | Token Reference                           |
| ------------------- | ----------------------------------------- | ----------------------------------------- |
| **Background**      | `pattern-nocturnal-canopy` at 15% opacity | Darker than landing for focus             |
| **Auth Card Width** | 480px fixed                               | Custom specification                      |
| **Backdrop Blur**   | 32px                                      | `color.glassmorphism.gallery.blur` + 12px |

#### Content Annotations

| Element              | Content                | Typography Token                        |
| -------------------- | ---------------------- | --------------------------------------- |
| **Card Title**       | "Enter the Collection" | `typography.scale.displaySmall.gallery` |
| **Input Labels**     | "Email", "Password"    | `typography.scale.labelMedium`          |
| **Primary Action**   | "Sign In"              | `typography.scale.labelLarge`           |
| **Secondary Action** | "Create Account"       | `typography.scale.bodyMedium`           |

#### Design Annotations

| Element            | Shape                           | Surface                               | Special Treatment                   |
| ------------------ | ------------------------------- | ------------------------------------- | ----------------------------------- |
| **Auth Card**      | `shape.organicAsymmetry.stone`  | `color.glassmorphism.gallery.surface` | Enhanced blur (32px)                |
| **Input Fields**   | None (underline style)          | Transparent                           | Bottom border `wattleGold` on focus |
| **Sign In Button** | `shape.organicAsymmetry.pebble` | `color.semantic.primary.wattleGold`   | Solid fill                          |

#### Interaction Annotations

| Element            | Trigger     | Animation                         | Token Reference             |
| ------------------ | ----------- | --------------------------------- | --------------------------- |
| **Input Focus**    | Focus       | Border color fade to `wattleGold` | `motion.duration.micro`     |
| **Compass**        | Input focus | Subtle rotation (±5°)             | `motion.easing.settle`      |
| **Sign In Button** | Hover       | Glow intensify                    | `elevation.shadow.glowGold` |

#### Asset Placement

| Asset ID                       | Position                  | Size           | Z-Index | Behavior               |
| ------------------------------ | ------------------------- | -------------- | ------- | ---------------------- |
| `motif-gallery-firefly-sprite` | Card-adjacent, sparse     | 8-12px         | Z-3     | Slower animation (12s) |
| `motif-laboratory-compass`     | Centered, 40px below card | 180px diameter | Z-1     | Rotation on focus      |
| `pattern-nocturnal-canopy`     | Full viewport             | 100%           | Z-0     | Static, 15% opacity    |

---

### PAGE 3: Onboarding ("Choosing the Soil")

**Classification:** Mode A (Gallery) | Selection Flow | Emotional Register: Possibility

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Z-2: motif-gallery-botanical-waratah (top-left, cropped)   │
│                                                             │
│         ┌────────┐  ┌────────┐  ┌────────┐                │
│         │ Sector │  │ Sector │  │ Sector │                │
│         │ Leaf   │  │ Leaf   │  │ Leaf   │  Z-1          │
│         └────────┘  └────────┘  └────────┘                │
│         ┌────────┐  ┌────────┐  ┌────────┐                │
│         │ Sector │  │ Sector │  │ Sector │                │
│         │ Leaf   │  │ Leaf   │  │ Leaf   │  Z-1          │
│         └────────┘  └────────┘  └────────┘                │
│         ┌────────┐  ┌────────┐  ┌────────┐                │
│         │ Sector │  │ Sector │  │ Sector │                │
│         │ Leaf   │  │ Leaf   │  │ Leaf   │  Z-1          │
│         └────────┘  └────────┘  └────────┘                │
│                                                             │
│            Z-1: motif-gallery-botanical-banksia            │
│                    (right edge, 40% opacity)                │
│                                                             │
│ Z-2: motif-gallery-botanical-wattle (bottom-right, cropped)│
│                                                             │
│ Z-0: pattern-nocturnal-canopy (20% opacity)                │
└─────────────────────────────────────────────────────────────┘
```

#### Functional Annotations

| Element                 | Specification                        | Token Reference                     |
| ----------------------- | ------------------------------------ | ----------------------------------- |
| **Grid Layout**         | 3×3, 24px gap                        | `spacing.grid.gap`                  |
| **Card Selection**      | Multi-select allowed                 | Toggle state                        |
| **Selection Indicator** | 3px solid `wattleGold` border + glow | `color.semantic.primary.wattleGold` |

#### Content Annotations

| Element         | Content                                           | Typography Token                        |
| --------------- | ------------------------------------------------- | --------------------------------------- |
| **Page Title**  | "Choose Your Habitat"                             | `typography.scale.displaySmall.gallery` |
| **Card Labels** | Industry names ("Technology", "Healthcare", etc.) | `typography.scale.titleLarge`           |
| **Card Icons**  | Botanical icons per sector                        | Custom icon set                         |

#### Design Annotations

| Element            | Shape                         | Surface                               | States                                                        |
| ------------------ | ----------------------------- | ------------------------------------- | ------------------------------------------------------------- |
| **Sector Cards**   | `shape.organicAsymmetry.leaf` | `color.glassmorphism.gallery.surface` | Default, Hover, Selected                                      |
| **Selected State** | —                             | —                                     | Border: 3px `wattleGold`, Shadow: `elevation.shadow.glowGold` |

#### Interaction Annotations

| Element            | Trigger | Animation                  | Token Reference                 |
| ------------------ | ------- | -------------------------- | ------------------------------- |
| **Card Selection** | Click   | Border fade in, glow bloom | `motion.duration.short`         |
| **Card Hover**     | Hover   | translateY(-4px)           | `motion.interactions.cardHover` |

#### Asset Placement

| Asset ID                          | Position                      | Size  | Z-Index | Behavior            |
| --------------------------------- | ----------------------------- | ----- | ------- | ------------------- |
| `motif-gallery-botanical-waratah` | `top: -80px; left: -60px`     | 240px | Z-2     | Static, cropped     |
| `motif-gallery-botanical-wattle`  | `bottom: -60px; right: -40px` | 200px | Z-2     | Static, cropped     |
| `motif-gallery-botanical-banksia` | `right: -100px; top: 50%`     | 180px | Z-1     | 40% opacity         |
| `pattern-nocturnal-canopy`        | Full viewport                 | 100%  | Z-0     | Static, 20% opacity |

---

### PAGE 4: Ingestion ("The Mulch & Mineral Setup")

**Classification:** Mode B (Laboratory) | Document Upload | Emotional Register: Precision

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Z-2: motif-laboratory-compass            │
│                         (top-right, 30% opacity)            │
│                                                             │
│              ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐                 │
│              │                           │                 │
│              │    DROP ZONE              │  Z-2            │
│              │    "DEPOSIT SPECIMEN"     │                 │
│              │    900px width            │                 │
│              │    Sunken Stone           │                 │
│              │                           │                 │
│              └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘                 │
│                                                             │
│              Z-3: motif-laboratory-stamp-verified           │
│                   (appears on success, bottom-right)        │
│                                                             │
│ Z-1: motif-laboratory-skeleton-etch (centered, 6% opacity) │
│                                                             │
│ Z-0: texture-laboratory-parchment (#F5F2EB)                │
└─────────────────────────────────────────────────────────────┘
```

#### Functional Annotations

| Element             | Specification                  | Token Reference                                |
| ------------------- | ------------------------------ | ---------------------------------------------- |
| **Background**      | `texture-laboratory-parchment` | `color.semantic.surface.laboratory.fieldPaper` |
| **Drop Zone Width** | 900px fixed                    | Custom specification                           |
| **Accepted Files**  | PDF only                       | Validation rule                                |

#### Content Annotations

| Element             | Content                              | Typography Token                           |
| ------------------- | ------------------------------------ | ------------------------------------------ |
| **Page Title**      | "UPLOAD RESUME"                      | `typography.scale.displaySmall.laboratory` |
| **Title Subtitle**  | _(Deposit Your Specimen)_            | `typography.scale.bodyMedium`              |
| **Title Treatment** | "HISTORY" with strikethrough effect  | Custom CSS                                 |
| **Drop Zone Label** | "Upload Resume (PDF)"                | `typography.scale.monoData`                |
| **Helper Text**     | "Drag your resume here for analysis" | `typography.scale.bodyMedium`              |

#### Design Annotations

| Element          | Shape                          | Surface                                        | Special Treatment           |
| ---------------- | ------------------------------ | ---------------------------------------------- | --------------------------- |
| **Drop Zone**    | `shape.organicAsymmetry.stone` | `color.semantic.surface.laboratory.slateSmoke` | Inner shadow, dashed border |
| **Border Style** | Dashed, 2px                    | `color.etching.lineStrong`                     | —                           |

#### Interaction Annotations

| Element                | Trigger       | Animation                              | Token Reference         |
| ---------------------- | ------------- | -------------------------------------- | ----------------------- |
| **Drop Zone Dragover** | File drag     | Border solid, glow                     | `motion.duration.micro` |
| **Upload Success**     | File accepted | Stamp animation                        | Custom keyframes        |
| **Stamp Animation**    | On success    | Scale 150%→100%, rotate 15°→0°, bounce | `motion.easing.viscous` |

#### Asset Placement

| Asset ID                          | Position                  | Size               | Z-Index | Behavior            |
| --------------------------------- | ------------------------- | ------------------ | ------- | ------------------- |
| `texture-laboratory-parchment`    | Full viewport             | 100%               | Z-0     | Static              |
| `motif-laboratory-skeleton-etch`  | Centered behind drop zone | 60% viewport width | Z-1     | Static, 6% opacity  |
| `motif-laboratory-compass`        | `top: 40px; right: 40px`  | 120px              | Z-2     | Static, 30% opacity |
| `motif-laboratory-stamp-verified` | Drop zone bottom-right    | 140px              | Z-3     | Animated on success |

---

### PAGE 5: Analysis Dashboard ("The Audit Microscope")

**Classification:** Mode B (Laboratory) | Data Visualization | Emotional Register: Revelation

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Z-1: texture-laboratory-grid-major (full viewport, 8%)     │
│                                                             │
│  ┌──────────────┐  ┌────────────────────────────────────┐  │
│  │              │  │  ┌──────────┐  ┌──────────┐       │  │
│  │   COMPASS    │  │  │ FIG. A   │  │ FIG. B   │       │  │
│  │   GAUGE      │  │  │ Stone    │  │ Stone    │       │  │
│  │              │  │  └──────────┘  └──────────┘       │  │
│  │   Match      │  │  ┌──────────┐  ┌──────────┐       │  │
│  │   Score      │  │  │ FIG. C   │  │ FIG. D   │       │  │
│  │              │  │  │ Stone    │  │ Stone    │       │  │
│  │   Z-2        │  │  └──────────┘  └──────────┘       │  │
│  │              │  │                          Z-1      │  │
│  └──────────────┘  └────────────────────────────────────┘  │
│       40%                        60%                       │
│                                                             │
│ Z-0: texture-laboratory-parchment                          │
└─────────────────────────────────────────────────────────────┘
```

#### Functional Annotations

| Element              | Specification                    | Token Reference                        |
| -------------------- | -------------------------------- | -------------------------------------- |
| **Layout**           | Split view, 40% / 60%            | CSS Grid                               |
| **Compass Function** | Data visualization (0-100 score) | Dynamic needle rotation                |
| **Grid Overlay**     | Major grid, 8% opacity           | `texture.laboratory.gridOverlay.major` |

#### Content Annotations

| Element         | Content                                      | Typography Token                              |
| --------------- | -------------------------------------------- | --------------------------------------------- |
| **Score Label** | "MATCH SCORE"                                | `typography.scale.monoAnnotation`             |
| **Score Value** | "87" (dynamic)                               | `typography.scale.metricDisplay` (200 weight) |
| **Card Labels** | "FIG. A: SKILLS", "FIG. B: EXPERIENCE", etc. | `typography.scale.monoAnnotation`             |
| **Card Data**   | Parsed metrics                               | `typography.scale.monoData`                   |

#### Design Annotations

| Element             | Shape                          | Surface                                            | Special Treatment       |
| ------------------- | ------------------------------ | -------------------------------------------------- | ----------------------- |
| **Metric Cards**    | `shape.organicAsymmetry.stone` | `color.semantic.surface.laboratory.slateSmoke`     | Solid, no glassmorphism |
| **Compass Housing** | Circular                       | `color.semantic.surface.laboratory.slateSmokeHigh` | Brass trim accent       |

#### Interaction Annotations

| Element            | Trigger      | Animation                | Token Reference                           |
| ------------------ | ------------ | ------------------------ | ----------------------------------------- |
| **Compass Needle** | Score update | Rotation to target angle | `motion.easing.settle`, 800ms             |
| **Metric Cards**   | Hover        | Subtle lift              | `motion.interactions.cardHover` (reduced) |

#### Asset Placement

| Asset ID                         | Position               | Size           | Z-Index | Behavior           |
| -------------------------------- | ---------------------- | -------------- | ------- | ------------------ |
| `texture-laboratory-parchment`   | Full viewport          | 100%           | Z-0     | Static             |
| `texture-laboratory-grid-major`  | Full viewport overlay  | 100%           | Z-1     | Static, 8% opacity |
| `motif-laboratory-compass`       | Left column, centered  | 280px diameter | Z-2     | Needle animated    |
| `motif-laboratory-skeleton-etch` | Empty card backgrounds | Fragmentary    | Z-1     | 4% opacity         |

---

### PAGE 6: Opportunity Feed ("The Sentry Lookout")

**Classification:** Mode A (Gallery) | Content Browse | Emotional Register: Discovery

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│           Z-2: motif-gallery-wattle-hanging (top-right)    │
│                                                             │
│  ┌────────────┐  ┌───────────────────────────────────────┐ │
│  │ Z-3:       │  │                                       │ │
│  │ KOOKABURRA │  │  ┌─────────────────────────────────┐ │ │
│  │ SENTRY     │  │  │ Job Card / Stone               │ │ │
│  │            │  │  │ "98% Match" Seed badge         │ │ │
│  ├────────────┤  │  └─────────────────────────────────┘ │ │
│  │            │  │  ┌─────────────────────────────────┐ │ │
│  │ FILTERS    │  │  │ Job Card / Stone               │ │ │
│  │ Pebble     │  │  └─────────────────────────────────┘ │ │
│  │ Toggles    │  │  ┌─────────────────────────────────┐ │ │
│  │            │  │  │ Job Card / Stone               │ │ │
│  │ Z-1        │  │  └─────────────────────────────────┘ │ │
│  │            │  │                              Z-1     │ │
│  └────────────┘  └───────────────────────────────────────┘ │
│      280px                    Remaining                    │
│                                                             │
│ Z-3: firefly-sprite (sidebar area, sparse)                 │
│                                                             │
│ Z-0: pattern-nocturnal-canopy (22% opacity)                │
└─────────────────────────────────────────────────────────────┘
```

#### Functional Annotations

| Element     | Specification                     | Token Reference          |
| ----------- | --------------------------------- | ------------------------ |
| **Layout**  | Split view, 280px sidebar + fluid | CSS Grid                 |
| **Sidebar** | Fixed position on scroll          | `position: sticky`       |
| **Feed**    | Infinite scroll, virtualized      | Performance optimization |

#### Content Annotations

| Element           | Content                | Typography Token                        |
| ----------------- | ---------------------- | --------------------------------------- |
| **Page Title**    | "Job Feed"             | `typography.scale.displaySmall.gallery` |
| **Page Subtitle** | _(The Sentry Lookout)_ | `typography.scale.bodyMedium`           |
| **Job Titles**    | Dynamic from API       | `typography.scale.titleLarge`           |
| **Company Names** | Dynamic                | `typography.scale.bodyMedium`           |
| **Match Badges**  | "98% Match" etc.       | `typography.scale.monoAnnotation`       |

#### Design Annotations

| Element            | Shape                           | Surface                                      | Special Treatment                |
| ------------------ | ------------------------------- | -------------------------------------------- | -------------------------------- |
| **Job Cards**      | `shape.organicAsymmetry.stone`  | `color.glassmorphism.gallery.surface`        | Reveals background through glass |
| **Filter Toggles** | `shape.organicAsymmetry.pebble` | Ghost (transparent bg)                       | Border on active                 |
| **Match Badges**   | `shape.organicAsymmetry.seed`   | `color.semantic.primary.wattleGoldContainer` | —                                |

#### Interaction Annotations

| Element           | Trigger | Animation                | Token Reference                 |
| ----------------- | ------- | ------------------------ | ------------------------------- |
| **Job Cards**     | Hover   | translateY(-4px), shadow | `motion.interactions.cardHover` |
| **Kookaburra**    | Ambient | Head tilt every 8-12s    | Custom (randomized interval)    |
| **Filter Toggle** | Click   | Background fade          | `motion.duration.micro`         |

#### Asset Placement

| Asset ID                          | Position                | Size         | Z-Index | Behavior            |
| --------------------------------- | ----------------------- | ------------ | ------- | ------------------- |
| `pattern-nocturnal-canopy`        | Full viewport           | 100%         | Z-0     | Static, 22% opacity |
| `motif-gallery-sentry-kookaburra` | Top of sidebar, perched | 160px height | Z-3     | Idle animation      |
| `motif-gallery-wattle-hanging`    | `top: -20px; right: 0`  | 280px width  | Z-2     | Static              |
| `motif-gallery-firefly-sprite`    | Sidebar area            | 8-12px       | Z-3     | Animated            |

---

### PAGE 7: Kanban Board ("The Command Center Greenhouse")

**Classification:** Mode A (Gallery) | Task Management | Emotional Register: Growth

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Z-2: motif-gallery-eucalyptus-hanging (column tops)        │
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────┐│
│  │ 12      │ │ 4       │ │ 2       │ │ 1       │ │ 3     ││
│  │ ACTIVE  │ │ REVIEW  │ │ INTER-  │ │ OFFER   │ │ CLOSED││
│  │         │ │         │ │ VIEW    │ │         │ │       ││
│  │ ┌─────┐ │ │ ┌─────┐ │ │ ┌─────┐ │ │ ┌─────┐ │ │       ││
│  │ │Leaf │ │ │ │Leaf │ │ │ │Leaf │ │ │ │Leaf │ │ │       ││
│  │ │Card │ │ │ │Card │ │ │ │Card │ │ │ │Card │ │ │       ││
│  │ └─────┘ │ │ └─────┘ │ │ └─────┘ │ │ └─────┘ │ │       ││
│  │ ┌─────┐ │ │ ┌─────┐ │ │         │ │         │ │       ││
│  │ │Leaf │ │ │ │Leaf │ │ │         │ │  Z-3:   │ │       ││
│  │ │Card │ │ │ │Card │ │ │         │ │  Dense  │ │       ││
│  │ └─────┘ │ │ └─────┘ │ │         │ │ Firefly │ │       ││
│  │  Z-1    │ │  Z-1    │ │  Z-1    │ │  Z-1    │ │  Z-1  ││
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └───────┘│
│                                                             │
│ Z-2: motif-gallery-banksia-pot (bottom-left)               │
│                                                             │
│ Z-0: pattern-nocturnal-canopy (18% opacity)                │
└─────────────────────────────────────────────────────────────┘
```

#### Functional Annotations

| Element             | Specification                     | Token Reference           |
| ------------------- | --------------------------------- | ------------------------- |
| **Layout**          | Horizontal columns, drag-and-drop | React DnD or similar      |
| **Column Overflow** | Vertical scroll within column     | Custom scrollbar styling  |
| **Card Dragging**   | Drag between columns              | Ghost preview during drag |

#### Content Annotations

| Element            | Content                  | Typography Token                                     |
| ------------------ | ------------------------ | ---------------------------------------------------- |
| **Column Metrics** | "12", "4", etc.          | `typography.scale.metricDisplay` (200 weight, 120px) |
| **Column Labels**  | "ACTIVE", "REVIEW", etc. | `typography.scale.monoAnnotation`                    |
| **Card Titles**    | Job/Company              | `typography.scale.titleLarge`                        |
| **Card Meta**      | Date, status             | `typography.scale.bodyMedium`                        |

#### Design Annotations

| Element        | Shape                          | Surface                                       | Special Treatment    |
| -------------- | ------------------------------ | --------------------------------------------- | -------------------- |
| **Columns**    | `shape.organicAsymmetry.stone` | `color.glassmorphism.gallery.surface`         | Trellis metaphor     |
| **Task Cards** | `shape.organicAsymmetry.leaf`  | `color.glassmorphism.gallery.surfaceElevated` | "Hanging" on trellis |

#### Interaction Annotations

| Element         | Trigger    | Animation                   | Token Reference         |
| --------------- | ---------- | --------------------------- | ----------------------- |
| **Card Drag**   | Drag start | Scale 1.02, shadow increase | `motion.easing.viscous` |
| **Column Drop** | Card drop  | Settle animation            | `motion.easing.settle`  |
| **Eucalyptus**  | Ambient    | Subtle sway, 6s loop        | Custom CSS              |

#### Asset Placement

| Asset ID                           | Position                         | Size        | Z-Index | Behavior            |
| ---------------------------------- | -------------------------------- | ----------- | ------- | ------------------- |
| `pattern-nocturnal-canopy`         | Full viewport                    | 100%        | Z-0     | Static, 18% opacity |
| `motif-gallery-eucalyptus-hanging` | Top of each column               | 80px height | Z-2     | Sway animation      |
| `motif-gallery-banksia-pot`        | `bottom: -40px; left: -30px`     | 200px       | Z-2     | Static              |
| `motif-gallery-firefly-sprite`     | Concentrated near "Offer" column | 8-16px      | Z-3     | Increased density   |

---

### PAGE 8: Split-Screen Editor ("The Writing Workbench")

**Classification:** Mode B (Laboratory) | Content Creation | Emotional Register: Craft

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌───────────────────────┐  ┌───────────────────────────┐  │
│  │                       │  │ "SPECIMEN DRAWER"         │  │
│  │   EDITOR PANEL        │  │                           │  │
│  │                       │  │  ┌─────────┐  ┌─────────┐ │  │
│  │   Z-1: grid-minor     │  │  │ Stone   │  │ Stone   │ │  │
│  │   (ruled paper)       │  │  │ Evidence│  │ Evidence│ │  │
│  │                       │  │  └─────────┘  └─────────┘ │  │
│  │   Wattle Gold border  │  │  ┌─────────┐  ┌─────────┐ │  │
│  │   on focus            │  │  │ Stone   │  │ Stone   │ │  │
│  │                       │  │  │ Evidence│  │ Evidence│ │  │
│  │                       │  │  └─────────┘  └─────────┘ │  │
│  │   Z-2                 │  │                    Z-1    │  │
│  │                       │  │  Z-2: compass (bottom-   │  │
│  │                       │  │       right, 25%)         │  │
│  └───────────────────────┘  └───────────────────────────┘  │
│          50%                          50%                  │
│                                                             │
│ Z-0: texture-laboratory-parchment                          │
└─────────────────────────────────────────────────────────────┘
```

#### Functional Annotations

| Element            | Specification        | Token Reference              |
| ------------------ | -------------------- | ---------------------------- |
| **Layout**         | 50/50 vertical split | CSS Grid                     |
| **Editor**         | Rich text, autosave  | Custom implementation        |
| **Evidence Panel** | Draggable cards      | Drag-to-editor functionality |

#### Content Annotations

| Element                 | Content             | Typography Token                  |
| ----------------------- | ------------------- | --------------------------------- |
| **Panel Title (Left)**  | "COMPOSITION"       | `typography.scale.monoAnnotation` |
| **Panel Title (Right)** | "SPECIMEN DRAWER"   | `typography.scale.monoAnnotation` |
| **Editor Text**         | User input          | `typography.scale.bodyLarge`      |
| **Evidence Labels**     | Source descriptions | `typography.scale.monoData`       |

#### Design Annotations

| Element            | Shape                          | Surface                                                  | Special Treatment          |
| ------------------ | ------------------------------ | -------------------------------------------------------- | -------------------------- |
| **Editor Panel**   | None (full bleed)              | `color.semantic.surface.laboratory.fieldPaper` (#EBE8E1) | Focus: `wattleGold` border |
| **Evidence Cards** | `shape.organicAsymmetry.stone` | `color.semantic.surface.laboratory.slateSmoke`           | Draggable                  |

#### Interaction Annotations

| Element           | Trigger        | Animation                   | Token Reference         |
| ----------------- | -------------- | --------------------------- | ----------------------- |
| **Editor Focus**  | Click          | Border fade in `wattleGold` | `motion.duration.micro` |
| **Evidence Drag** | Drag start     | Scale 1.02, shadow          | `motion.easing.viscous` |
| **Evidence Drop** | Drop in editor | Dissolve into text          | `motion.duration.short` |

#### Asset Placement

| Asset ID                         | Position                     | Size        | Z-Index | Behavior            |
| -------------------------------- | ---------------------------- | ----------- | ------- | ------------------- |
| `texture-laboratory-parchment`   | Full viewport                | 100%        | Z-0     | Static              |
| `texture-laboratory-grid-minor`  | Editor panel only            | 100% panel  | Z-1     | 5% opacity          |
| `motif-laboratory-compass`       | Evidence panel, bottom-right | 100px       | Z-2     | Static, 25% opacity |
| `motif-laboratory-skeleton-etch` | Evidence panel header        | Fragmentary | Z-1     | 8% opacity          |

---

### PAGE 9: Studio Designer ("The Specimen Finalization")

**Classification:** Mode B (Laboratory) | Document Preview | Emotional Register: Refinement

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────────────────┐  ┌───────────────────────┐│
│  │                             │  │ Z-2: compass (header) ││
│  │   PREVIEW PANEL             │  │                       ││
│  │                             │  │ CONTROLS              ││
│  │   Z-1: grid-major (10%)     │  │                       ││
│  │                             │  │  ┌─────────────────┐  ││
│  │   [ ] Bot View Toggle       │  │  │ Style Options   │  ││
│  │   (When ON: grid turns      │  │  │                 │  ││
│  │   red #B85450, 15%)         │  │  └─────────────────┘  ││
│  │                             │  │                       ││
│  │                             │  │  ┌─────────────────┐  ││
│  │   Z-2                       │  │  │ Export Options  │  ││
│  │                             │  │  │                 │  ││
│  │                             │  │  └─────────────────┘  ││
│  │                             │  │                       ││
│  │                             │  │  [ FINALIZE ]         ││
│  │                             │  │  Z-3: stamp on click  ││
│  └─────────────────────────────┘  └───────────────────────┘│
│            65%                           35%               │
│                                                             │
│ Z-0: texture-laboratory-parchment (increased grain)        │
└─────────────────────────────────────────────────────────────┘
```

#### Functional Annotations

| Element             | Specification                    | Token Reference          |
| ------------------- | -------------------------------- | ------------------------ |
| **Layout**          | 65/35 split                      | CSS Grid                 |
| **Bot View Toggle** | Shows structural wireframe       | Grid overlay color shift |
| **Finalize Action** | Exports document, triggers stamp | API call + animation     |

#### Content Annotations

| Element             | Content                    | Typography Token                  |
| ------------------- | -------------------------- | --------------------------------- |
| **Panel Title**     | "SPECIMEN PREVIEW"         | `typography.scale.monoAnnotation` |
| **Toggle Label**    | "BOT VIEW"                 | `typography.scale.labelMedium`    |
| **Control Labels**  | "TEMPLATE", "FORMAT", etc. | `typography.scale.labelMedium`    |
| **Finalize Button** | "FINALIZE SPECIMEN"        | `typography.scale.labelLarge`     |

#### Design Annotations

| Element             | Shape                           | Surface                                            | Special Treatment |
| ------------------- | ------------------------------- | -------------------------------------------------- | ----------------- |
| **Preview Panel**   | `shape.organicAsymmetry.stone`  | `color.semantic.surface.laboratory.slateSmoke`     | Document within   |
| **Control Cards**   | `shape.organicAsymmetry.stone`  | `color.semantic.surface.laboratory.slateSmokeHigh` | Grouped controls  |
| **Finalize Button** | `shape.organicAsymmetry.pebble` | `color.semantic.primary.wattleGold`                | Primary action    |

#### Interaction Annotations

| Element             | Trigger     | Animation                       | Token Reference         |
| ------------------- | ----------- | ------------------------------- | ----------------------- |
| **Bot View Toggle** | Click       | Grid color transition to red    | `motion.duration.short` |
| **Finalize Click**  | Click       | Stamp animation                 | Same as Page 4          |
| **Stamp Animation** | On finalize | Scale 150%→100%, rotate, bounce | `motion.easing.viscous` |

#### Asset Placement

| Asset ID                          | Position                   | Size       | Z-Index | Behavior                            |
| --------------------------------- | -------------------------- | ---------- | ------- | ----------------------------------- |
| `texture-laboratory-parchment`    | Full viewport              | 100%       | Z-0     | Increased grain                     |
| `texture-laboratory-grid-major`   | Preview panel              | 100% panel | Z-1     | 10% opacity (15% red when Bot View) |
| `motif-laboratory-compass`        | Control panel header       | 80px       | Z-2     | Static, 40% opacity                 |
| `motif-laboratory-stamp-verified` | Preview panel, on finalize | 160px      | Z-3     | Animated on action                  |

---

### PAGE 10: Settings ("The Archive Vault")

**Classification:** Mode B (Laboratory) | Configuration | Emotional Register: Storage

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Z-2: compass (header nav)                   │
│                                                             │
│              ┌─────────────────────────────┐               │
│              │   ACCOUNT SETTINGS          │               │
│              │   Stone Card                │               │
│              │   Z-1: grid-minor (6%)      │               │
│              └─────────────────────────────┘               │
│              ┌─────────────────────────────┐               │
│              │   PREFERENCES               │               │
│              │   Stone Card                │               │
│              └─────────────────────────────┘               │
│              ┌─────────────────────────────┐               │
│              │   INTEGRATIONS              │               │
│              │   Stone Card                │               │
│              └─────────────────────────────┘               │
│              ┌─────────────────────────────┐               │
│              │   DATA & PRIVACY            │               │
│              │   Stone Card                │               │
│              └─────────────────────────────┘               │
│                                                             │
│ Z-1: motif-laboratory-skeleton-etch (centered, 4% opacity) │
│                                                             │
│ Z-0: texture-laboratory-parchment                          │
└─────────────────────────────────────────────────────────────┘
```

#### Functional Annotations

| Element            | Specification                            | Token Reference               |
| ------------------ | ---------------------------------------- | ----------------------------- |
| **Layout**         | Single column, centered, 640px max-width | `max-width: 640px`            |
| **Card Expansion** | Accordion behavior                       | Click to expand               |
| **Form Elements**  | Inputs follow Laboratory mode styling    | `components.input.laboratory` |

#### Content Annotations

| Element            | Content                        | Typography Token                           |
| ------------------ | ------------------------------ | ------------------------------------------ |
| **Page Title**     | "THE ARCHIVE"                  | `typography.scale.displaySmall.laboratory` |
| **Section Titles** | "ACCOUNT", "PREFERENCES", etc. | `typography.scale.monoAnnotation`          |
| **Field Labels**   | Form labels                    | `typography.scale.labelMedium`             |
| **Field Values**   | User data                      | `typography.scale.monoData`                |

#### Design Annotations

| Element            | Shape                          | Surface                                        | Special Treatment              |
| ------------------ | ------------------------------ | ---------------------------------------------- | ------------------------------ |
| **Settings Cards** | `shape.organicAsymmetry.stone` | `color.semantic.surface.laboratory.slateSmoke` | Archival cardstock             |
| **Input Fields**   | Laboratory style               | —                                              | Monospace font, minimal border |

#### Interaction Annotations

| Element         | Trigger      | Animation         | Token Reference          |
| --------------- | ------------ | ----------------- | ------------------------ |
| **Card Expand** | Click header | Height transition | `motion.duration.medium` |
| **Form Save**   | Submit       | Success indicator | `motion.duration.short`  |

#### Asset Placement

| Asset ID                         | Position                | Size         | Z-Index | Behavior                  |
| -------------------------------- | ----------------------- | ------------ | ------- | ------------------------- |
| `texture-laboratory-parchment`   | Full viewport           | 100%         | Z-0     | Static                    |
| `texture-laboratory-grid-minor`  | Behind each card        | 100% card    | Z-1     | 6% opacity                |
| `motif-laboratory-skeleton-etch` | Centered, full viewport | 50% viewport | Z-1     | 4% opacity, architectural |
| `motif-laboratory-compass`       | Header navigation       | 60px         | Z-2     | Static                    |

---

### PAGE 11: Dashboard Overview ("The Canopy View")

**Classification:** Mode A (Gallery) | Overview | Emotional Register: Altitude

#### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Z-2: motif-gallery-eucalyptus-hanging (top-left, dramatic) │
│       └── Z-3: kookaburra-sentry (nested within)           │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  87%        12         3          $145K                ││
│  │  MATCH    ACTIVE   INTERVIEWS   POTENTIAL              ││
│  │                                                         ││
│  │  Hero Metric Bar / Glassmorphic / Stone                ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ Recent       │  │ Upcoming     │                        │
│  │ Activity     │  │ Interviews   │                        │
│  │ Stone        │  │ Stone        │                        │
│  └──────────────┘  └──────────────┘                        │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ Top Matches  │  │ Skill Gaps   │                        │
│  │ Stone        │  │ Stone        │                        │
│  └──────────────┘  └──────────────┘                        │
│                                                             │
│                    Z-2: motif-gallery-banksia-pot          │
│                         (bottom-right)                     │
│                                                             │
│ Z-3: firefly-sprite (ambient, throughout)                  │
│                                                             │
│ Z-0: pattern-nocturnal-canopy (25% opacity)                │
└─────────────────────────────────────────────────────────────┘
```

#### Functional Annotations

| Element            | Specification              | Token Reference      |
| ------------------ | -------------------------- | -------------------- |
| **Layout**         | Hero bar + 2×2 grid        | CSS Grid             |
| **Metric Updates** | Real-time from API         | WebSocket or polling |
| **Card Links**     | Navigate to detailed views | Router links         |

#### Content Annotations

| Element           | Content                   | Typography Token                              |
| ----------------- | ------------------------- | --------------------------------------------- |
| **Hero Metrics**  | "87%", "12", "3", "$145K" | `typography.scale.metricDisplay` (200 weight) |
| **Metric Labels** | "MATCH", "ACTIVE", etc.   | `typography.scale.monoAnnotation`             |
| **Card Titles**   | "RECENT ACTIVITY", etc.   | `typography.scale.titleLarge`                 |
| **Card Content**  | Dynamic lists             | `typography.scale.bodyMedium`                 |

#### Design Annotations

| Element             | Shape                          | Surface                               | Special Treatment     |
| ------------------- | ------------------------------ | ------------------------------------- | --------------------- |
| **Hero Bar**        | `shape.organicAsymmetry.stone` | `color.glassmorphism.gallery.surface` | Full-width            |
| **Dashboard Cards** | `shape.organicAsymmetry.stone` | `color.glassmorphism.gallery.surface` | "Blur Bloom" on hover |

#### Interaction Annotations

| Element             | Trigger | Animation                                    | Token Reference                        |
| ------------------- | ------- | -------------------------------------------- | -------------------------------------- |
| **Dashboard Cards** | Hover   | Blur increase (Blur Bloom), translateY(-4px) | `motion.interactions.cardHover` + blur |
| **Kookaburra**      | Ambient | Idle animation (head tilt)                   | Custom                                 |
| **Eucalyptus**      | Scroll  | Parallax (0.15x)                             | Custom                                 |

#### Asset Placement

| Asset ID                           | Position                      | Size        | Z-Index | Behavior            |
| ---------------------------------- | ----------------------------- | ----------- | ------- | ------------------- |
| `pattern-nocturnal-canopy`         | Full viewport                 | 100%        | Z-0     | Static, 25% opacity |
| `motif-gallery-eucalyptus-hanging` | `top: -40px; left: -20px`     | 400px width | Z-2     | Parallax (0.15x)    |
| `motif-gallery-sentry-kookaburra`  | Nested in eucalyptus          | 120px       | Z-3     | Idle animation      |
| `motif-gallery-banksia-pot`        | `bottom: -50px; right: -30px` | 220px       | Z-2     | Static              |
| `motif-gallery-firefly-sprite`     | Ambient, throughout           | 8-16px      | Z-3     | Animated            |

---

## Asset Library Reference

### File Naming Convention

All assets follow this pattern for traceability:

```
{type}-{mode}-{name}-{variant}.{extension}
```

| Type      | Mode                    | Examples                                   |
| --------- | ----------------------- | ------------------------------------------ |
| `motif`   | `gallery`, `laboratory` | `motif-gallery-sentry-kookaburra-1024.png` |
| `texture` | `gallery`, `laboratory` | `texture-laboratory-parchment-tile.jpg`    |
| `pattern` | `gallery`, `laboratory` | `pattern-nocturnal-canopy-2048.jpg`        |
| `icon`    | `shared`                | `icon-shared-compass-navigation.svg`       |

### Asset Inventory

| Asset ID     | Asset Name                   | Target Filename                           | Mode       | Status             |
| :----------- | :--------------------------- | :---------------------------------------- | :--------- | :----------------- |
| —            | Kookaburra Sentry            | `motif-gallery-sentry-kookaburra.png`     | Gallery    | ✅ Available       |
| —            | Banksia Pot                  | `motif-gallery-botanical-banksia-pot.png` | Gallery    | ✅ Available       |
| —            | Nocturnal Canopy             | `pattern-nocturnal-canopy-2048.jpg`       | Gallery    | ✅ Available       |
| —            | Parchment Texture            | `texture-laboratory-parchment-tile.jpg`   | Laboratory | ✅ Available       |
| —            | Botanical Banksia            | `motif-gallery-botanical-banksia.png`     | Gallery    | ✅ Available       |
| **ASSET-7**  | Firefly Sprite (Glow)        | `northcote-firefly-sprite.png`            | Gallery    | 🔴 **Missing/Gap** |
| **ASSET-8**  | Fossil Verification Mark     | `northcote-verification-stamp.png`        | Laboratory | 🔴 **Missing/Gap** |
| **ASSET-9**  | Waratah Hero Closeup         | `northcote-waratah-hero.jpg`              | Gallery    | 🔴 **Missing/Gap** |
| **ASSET-12** | Laboratory Grid Major        | `northcote-lab-grid-major.png`            | Laboratory | 🔴 **Missing/Gap** |
| **ASSET-13** | Laboratory Grid Minor        | `northcote-lab-grid-minor.png`            | Laboratory | 🔴 **Missing/Gap** |
| **ASSET-14** | Skeleton Anatomical Etching  | `northcote-skeleton-etch.png`             | Laboratory | 🔴 **Missing/Gap** |
| **ASSET-15** | Brass Compass Navigation     | `northcote-compass-rose.png`              | Laboratory | 🔴 **Missing/Gap** |
| **ASSET-16** | Wattle Hanging Branch        | `northcote-wattle-hanging.png`            | Gallery    | 🔴 **Missing/Gap** |
| **ASSET-17** | Eucalyptus Hanging (Ceiling) | `northcote-eucalyptus-hanging.png`        | Gallery    | 🔴 **Missing/Gap** |
| **ASSET-19** | Eucalyptus Kanban (Column)   | `northcote-eucalyptus-kanban.png`         | Gallery    | 🔴 **Missing/Gap** |

---

## Implementation Notes

### Z-Index Layering System

| Layer      | Z-Index | Content                                       |
| ---------- | ------- | --------------------------------------------- |
| Stage      | Z-0     | Background patterns, textures                 |
| Atmosphere | Z-1     | Grid overlays, watermarks, decorative shadows |
| Content    | Z-2     | UI components, cards, primary content         |
| Anchors    | Z-2     | Organic decorative elements                   |
| Highlights | Z-3     | Mascots, fireflies, stamps, floating elements |
| Modal      | Z-10+   | Overlays, dialogs (when present)              |

### Responsive Considerations

Organic anchors should scale and reposition at breakpoints:

| Breakpoint  | Adjustment                               |
| ----------- | ---------------------------------------- |
| ≥1440px     | Full asset display, maximum parallax     |
| 1024–1439px | Assets scale to 80%, reduced parallax    |
| 768–1023px  | Assets scale to 60%, parallax disabled   |
| <768px      | Assets hidden or minimized to icons only |

### Performance Guidelines

Firefly animations should use `will-change: transform, opacity` and be limited to 16 instances maximum. Background patterns should be optimized WebP where possible, with JPG fallback. SVG grid overlays preferred over raster for Laboratory mode.

---

_This document serves as the definitive implementation guide for the Northcote Curio interface. Each page specification balances functional requirements with the atmospheric intention that distinguishes this system from generic dashboard patterns. The Victorian Naturalist doesn't merely organize data—they curate a collection worthy of wonder._

---

**See Also:**

- **System Overview**: [00-overview.md](00-overview.md)
- **Design Tokens**: [01-tokens.md](01-tokens.md)
- **Typography Strategy**: [02-typography.md](02-typography.md)
- **Component Library**: [03-components.md](03-components.md)
- **Voice & Tone**: [04-voice.md](04-voice.md)
- **Asset Strategy**: [05-assets.md](05-assets.md)
- **Asset Manifest (Source of Truth)**: [../../assets/northcote-curio-manifest.json](../../assets/northcote-curio-manifest.json)
- **Design Principles**: [northcote-design-principles.md](northcote-design-principles.md)
- **Asset Consolidation Details**: [asset-consolidation-inventory.md](asset-consolidation-inventory.md)
- **Theme Location Evidence**: [theme_evidence_list.md](theme_evidence_list.md)
- **Content & Asset Draft**: [07-wireframe-content-draft.md](07-wireframe-content-draft.md)

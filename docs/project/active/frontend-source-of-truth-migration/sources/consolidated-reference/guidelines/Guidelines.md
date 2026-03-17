# DESIGN GUIDELINES: KERALA RAGE — SOLIDARITY MODE
> **System:** CAREER_COPILOT
> **Design System:** Kerala Rage v6.1 (Shape System + Motion Library)
> **Mode:** Solidarity (Dark-only)
> **Strict Mode:** ENABLED — Anti-Slop Protocol active
> **Last Updated:** 2026-03-13

---

## 1. DESIGN PHILOSOPHY

This is not a dashboard. This is a **living manifesto** — a wheat-paste protest wall on charcoal, built for migrants, POC, and career-changers navigating systems not designed for them.

- **Solidarity Mode:** Dark-only. No light mode. No white backgrounds. Ever.
- **Screenprint Logic:** Visual elements behave like ink layers on paper — high contrast, visible grain, deliberate registration errors, wet-ink expansion.
- **Emotional Typography:** Fonts shift weight, width, and pressure in response to content meaning. Text is not decoration — it carries conviction.
- **Anti-Slop:** No generic corporate aesthetics. No symmetrical grids. No static fonts. No perfect circles. No uniform corner-radius.
- **Substrate:** Backgrounds are never a void. They are matte charcoal paper, weathered brick, or Melbourne asphalt.

---

## 2. COLOR PALETTE

### Surface System (Charcoal Background)
| Step | Hex | Usage |
| :--- | :--- | :--- |
| **Base** | `#1A1714` | Solidarity Charcoal — foundational substrate |
| **Step 0** | `#0F0F0F` | Deepest app background |
| **Step 1** | `#1A1A1A` | Surfaces |
| **Step 2** | `#242424` | Elevation layers |
| **Step 3** | `#2A2A2A` | Gutters |
| **Step 4** | `#323232` | Raised cards |
| **Step 5** | `#3A3A3A` | Hover states |
| **Step 6** | `#444444` | Active states |

### Primary Accents
| Token | Hex | Semantic Name | Usage |
| :--- | :--- | :--- | :--- |
| `solidarityRed` | `#F14714` | The Resistance | Primary CTA, urgent emphasis, screenprint ink, halo accents |
| `inkGold` | `#DAF674` | The Radiance | Halo disks, focus rings, primary actions, optimism accents |
| `stencilYellow` | `#F6E748` | The Attention | Headline accents, attention markers, stencil type |
| `signalGreen` | `#48F0E5` | The Pulse | Links, accent chips, illustration splashes, micro accents |
| `kr-activistSmokeGreen` | `#48DA8B` | The Life | Landscape accents, secondary highlights, map routes |
| `worker-ash` | `#DAF6B3` | The Ink | Body text, icon strokes, divider lines, secondary text |
| `solidaritySmokeOrange` | `#DA8B48` | The Earth | Portrait warmth, labor motifs, wheat-paste tones |
| `protestMetalBlue` | `#48B3DA` | The Water | Water ripples, secondary metadata, charts secondary |
| `concreteGrey` | `#A39B8F` | The Grit | Borders, dividers, urban textures |
| `ochreEarth` | `#B8733D` | The Ground | Warm earth accents, labor continuity motifs |

### Destructive / Error
| Token | Hex | Usage |
| :--- | :--- | :--- |
| `kr-charcoalRed` | `#F14844` | Destructive actions, error states, critical banners, urgent typography |

### Aboriginal Flag Colors ⚠️ RESTRICTED
| Token | Hex | Usage |
| :--- | :--- | :--- |
| `aboriginalFlagRed` | `#D81E05` | **In-situ placards/posters ONLY** |
| `aboriginalFlagYellow` | `#FCD116` | **In-situ placards/posters ONLY** |
| `aboriginalFlagBlack` | `#000000` | **In-situ placards/posters ONLY** |

> ⚠️ These colors must **NEVER** be used as general UI decoration, brand colors, or abstracted tokens. Must be accompanied by "ALWAYS WAS ALWAYS WILL BE" or "TREATY NOW" text.

---

## 3. TYPOGRAPHY

### Font Families (The Federation Stack)
| Role | Font | Google Fonts Variable Axes | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | `Work Sans` | `wght` 100–900, `wdth` 75–125 | Body, UI, navigation, functional labels |
| **Display** | `Fraunces` | `opsz` 9–144, `wght` 100–900, `SOFT` 0–100, `WONK` 0–1 | Hero headlines, emotional subheads |
| **Proclamation** | `Libre Bodoni` | `wght` 400–700 | Authoritative hero lines, editorial headers |
| **Mono** | `JetBrains Mono` | `wght` 100–800 | Data, code, technical labels, annotations |
| **Curator** | `Caveat` | `wght` 400–700 | Handwritten annotations, personal notes |
| **Hero Accent** | `Nabla` | Color font | **RESTRICTED:** one word per hero view only (e.g., "COLLECTIVE") |

> **BANNED fonts:** Inter, Plus Jakarta Sans, Recursive, Roboto Flex, Amstelvar, Arial, Helvetica

### Emotional Patterns (Variable Font Axes)
| Pattern | wght | wdth | Tracking | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Solidarity Protest** | 900 | 120 | 0.02em | Declarative headers, street-poster slab words, UPPERCASE |
| **Labor Pressure** | 900 | 75 | 0em | Fatigue, extraction, wage critique, scarcity |
| **Melancholy Longing** | 475 | 98 | 0em | Between-worlds sections, homesickness, reflective copy |
| **Identity Assertion** | 700 | 110 | 0em | Identity declarations ("AUSSIE?"), cultural anchors, UPPERCASE |
| **Scroll Pressure** | 300→900 | 100 | dynamic | Scroll-driven headers — weight builds with user scroll |
| **Extreme Contrast** | 100 (secondary) / 900 (primary) | 100 | -0.02em | Hero lines vs. micro metadata — 9× weight ratio required |

### Type Scale
| Step | Size | Usage |
| :--- | :--- | :--- |
| `micro` | `8px` | Metadata, small UI hints |
| `small` | `12px` | Secondary labels, quiet acknowledgments |
| `body` | `16px` | Default reading size |
| `subhead` | `24px` | Card titles, section headers |
| `headline` | `48px` | Major section headers |
| `display` | `72px` | Poster-style declarations |
| `hero` | `144px` | Manifesto lines — use sparingly |

> **Required:** `font-optical-sizing: auto` globally. Enforce 9× weight ratio (100 vs 900) and 6× size ratio (12px vs 72px+).

---

## 4. SHAPE SYSTEM (v6.1)

### The Four Laws of KR Shape

1. **Asymmetric Radii Are the Default** — No identical values on all four corners. Uniform geometry = institutional squelch.
2. **Shape Morphs with State** — A button that is loading looks different from one that is idle, not only in color but in geometry.
3. **Tension Through Contrast** — Juxtapose sharp corners with deeply rounded ones for expressive pressure.
4. **Shape is Versatile, Not Sacred** — Archetypes define role and tone; shape tokens define geometry. A token may appear in multiple archetype contexts.

### Base Shape Scale
| Token | CSS Variable | Value |
| :--- | :--- | :--- |
| `radius.none` | `--sys-shape-radius-none` | `0px` |
| `radius.xs` | `--sys-shape-radius-xs` | `2px` |
| `radius.sm` | `--sys-shape-radius-sm` | `4px` |
| `radius.md` | `--sys-shape-radius-md` | `8px` |
| `radius.lg` | `--sys-shape-radius-lg` | `12px` |
| `radius.xl` | `--sys-shape-radius-xl` | `20px` |
| `radius.xxl` | `--sys-shape-radius-xxl` | `32px` |
| `radius.xxxl` | `--sys-shape-radius-xxxl` | `48px` |
| `radius.full` | `--sys-shape-radius-full` | `9999px` — **Never use `50%`** |

### Shape Library (Core UI)
| Token | CSS Variable | Border-Radius |
| :--- | :--- | :--- |
| `blockRiot01` | `--sys-shape-blockRiot01` | `8px 2px 8px 2px` |
| `blockRiot02` | `--sys-shape-blockRiot02` | `20px 4px 12px 2px` |
| `blockRiot03` | `--sys-shape-blockRiot03` | `32px 2px 2px 2px` |
| `pillMarch01` | `--sys-shape-pillMarch01` | `9999px` |
| `marchSurge01` | `--sys-shape-marchSurge01` | `20px 8px 12px 32px` |
| `alertShard01` | `--sys-shape-alertShard01` | `32px 2px 2px 32px` |
| `scaffoldFrame01` | `--sys-shape-scaffoldFrame01` | `8px 2px 8px 2px` |
| `megaphoneCut01` | `--sys-shape-megaphoneCut01` | `42% 58% 45% 55% / 48% 62% 38% 52%` |
| `placardTorn01` | `--sys-shape-placardTorn01` | `48% 52% 58% 42% / 55% 45% 60% 40%` |
| `sentryAvatar` | `--sys-shape-sentryAvatar` | `98%` — avatars only, **never 50%** |
| `tornEdgeClipPath` | `--sys-shape-tornEdgeClipPath` | polygon(…) — wheat-paste section breaks |

### Shape Library (Decorative — Substrate archetype only)
| Token | CSS Variable | Border-Radius | Tier |
| :--- | :--- | :--- | :--- |
| `substrateTile01` | `--sys-shape-substrateTile01` | `60% 40% 30% 70% / 60% 30% 70% 40%` | Substrate / Avatar masks / Hero frames only |
| `substrateTile02` | `--sys-shape-substrateTile02` | `40% 60% 70% 30% / 40% 50% 60% 50%` | Substrate / Avatar masks / Hero frames only |

### Semantic Action Archetypes
| Archetype | Role | Base Shape | Active / Selected | Loading | Motion |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Strike** | Primary CTA, defiance | `blockRiot03` | `blockRiot02` | `pillMarch01` | `typeSpringSlam` 600ms |
| **March** | Flow, select, progress | `blockRiot01` | `marchSurge01` | `blockRiot02` | `dragSettle` 800ms |
| **Megaphone** | Modal, announcement | `megaphoneCut01` | `megaphoneCut01` | `placardTorn01` | `typeSpringSlam` 600ms |
| **Placard** | Content card, container | `placardTorn01` | `blockRiot02` | `blockRiot03` | `dragSettle` 800ms |
| **Scaffold** | Layout, navigation | `blockRiot02` | `blockRiot02` | `blockRiot02` | none — **immutable** |
| **Substrate** | Decorative background | `substrateTile02` | — | — | `waterRipple` 3000ms |

---

## 5. ELEVATION (SHADOWS)

| Level | CSS Variable | Value | Usage |
| :--- | :--- | :--- | :--- |
| **Strike** | `--sys-shadow-elevation1Strike` | `0 2px 4px rgba(0,0,0,0.25)` | Resting interactive elements |
| **Placard** | `--sys-shadow-elevation2Placard` | `0 4px 8px rgba(0,0,0,0.35)` | Cards |
| **Hover Lift** | `--sys-shadow-elevation3HoverLift` | `0 8px 16px rgba(0,0,0,0.45)` | Hover state |
| **Float** | `--sys-shadow-elevation4Float` | `0 16px 32px rgba(0,0,0,0.55)` | Modals, overlays |
| **Ink Offset** | `--sys-shadow-inkOffset` | `2px 2px 0px inkGold` | Stencil text depth |
| **Solidarity Bleed** | *(utility class)* | `0 0 12px solidarityRed` | Urgent glow, active CTA |

---

## 6. MOTION SYSTEM (Viscous Breeze)

### Easing Curves
| Name | Curve | Usage |
| :--- | :--- | :--- |
| **Viscous (M3 Expressive)** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | All typographic transitions, Strike/Megaphone morphs |
| **Precise** | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Controlled interactions, no overshoot |
| **Settle** | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | March/Placard settle, smooth deceleration |
| **Snap** | `cubic-bezier(0.4, 0, 0.2, 1)` | Press interactions, chip tap |
| **Elastic** | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Substrate accents only |

> **BANNED:** `ease`, `linear`, generic transitions (except as `prefers-reduced-motion` fallback)

### Duration Scale
| Name | Value | Usage |
| :--- | :--- | :--- |
| `instant` | `100ms` | Micro-interactions, press feedback |
| `fast` | `180ms` | Hover states, focus rings |
| `standard` | `280ms` | Button press, typography bloom |
| `moderate` | `450ms` | Card lift, panel slide |
| `slow` / `typeSpringSlam` | `600ms` | Hero entrance, emphasis toggles, weight/width shifts |
| `deliberate` / `dragSettle` | `800ms` / `900ms` | Card drag, panel expansions, hero animations |
| `pulseThrob` | `1000ms` | Urgent text emphasis — must respect `prefers-reduced-motion` |
| `windFlutter` | `2000ms` | Illustration micro-motion, ambient life |
| `waterRipple` | `3000ms` | Houseboat/backwater sections, Substrate ambient |
| `melancholyBreath` | `4000ms` | Oscillate `wght` 450–500 and opacity — reflective sections |

### Spring Physics (kr-solidarity mode)
- **Stiffness:** 500 — gentle, expressive, allows overshoot
- **Damping:** 27 — air resistance, natural settle
- **Overshoot:** enabled

---

## 7. SYMBOLIC ANCHORS & VISUAL MOTIFS

### Symbolic Anchors (max one per viewport)
| Asset | Category | Usage Screen |
| :--- | :--- | :--- |
| Bhagat Singh | Resistance | Landing |
| Tipu Sultan | Resistance | Landing / Editorial |
| Shiva / Nataraja | Spiritual (reverent) | Analysis Dashboard only |
| Kerala Elephant | Cultural | Opportunity Lookout |
| Treaty Now Poster | Street Solidarity | Dashboard Overview |
| First Nations Placard | Street Solidarity | Dashboard Overview |

> Symbolic anchors: always Z-2, always with Ink Gold halo disk (150% width, 80px blur, 10% opacity), mobile ≤768px removed.

### Halo Disk Rule
Every symbolic anchor must be accompanied by a `inkGold` radial gradient halo at Z-3.

### Atmospheric Overlays (anti–Flat-Black)
| Motif | Usage |
| :--- | :--- |
| Grit Particles | Global, 5% opacity — mimics screenprint dust |
| Paint Splash | Section transitions, 15% opacity, `multiply` blend |
| Wheat-Paste Noise | Dashboard surfaces, subhead background depth |

### Voice Slogans
`NO PRIDE IN GENOCIDE` · `TREATY NOW` · `ALWAYS WAS ALWAYS WILL BE` · `SOVEREIGNTY NEVER CEDED` · `AUSSIE?` · `INQUILAB ZINDABAD` · `NO NEUTRAL CANVAS`

> Use sparingly — slogan wallpaper across every screen is a violation.

---

## 8. ANTI-SLOP PROTOCOL

### 🚫 BANNED
- Light mode or white backgrounds (`#FFFFFF`)
- Crown, scepter, or monarchy symbols
- Passports, visas, ID cards, border gates, government documentation motifs
- Aboriginal art imitation (dot painting, sacred motif appropriation)
- Aboriginal flag colors as general decoration
- `border-radius: 50%` — use `radius.full` or `sentryAvatar (98%)`
- Uniform corner-radius on all four corners (the Institutional Squelch)
- Hardcoded `px` values for radii in component code — must use `--sys-radius-*` or `--sys-shape-*` tokens
- `shape.substrateTile*` outside Substrate archetype, avatar masks, and whitelisted hero frames
- `ease` or `linear` easing (except `prefers-reduced-motion` fallback)
- Static single-weight fonts — all fonts must use variable axes
- Kangaroo, Koala, or endemic fauna as icons/mascots (Zero-Flora Rule)
- Eucalyptus, Gum leaves, Wattle, or generic forest aesthetics
- Flora or floral devotional décor (No Lilies, No Lotus)
- AI-hype jargon ("Powered by AI", "Unlock Potential", "Smart Resume")
- Corporate blue
- Stock-photo diversity aesthetics
- Mixing Shiva devotional imagery with protest slogans on the same screen
- Slogan wallpaper across multiple screens simultaneously
- Two symbolic anchors in the same scroll frame

### ✅ REQUIRED
- Solidarity Mode dark-only on Solidarity Charcoal `#1A1714` base
- English-only UI and documentation
- Variable fonts with `wght` 100–900, `wdth` 75–125, `opsz` 8–144 (where supported)
- Global `font-optical-sizing: auto`
- Extreme variable contrast: 9× weight ratio, 6× size ratio minimum
- M3 Expressive Viscous Breeze curve for all typographic transitions
- All radii via `--sys-radius-*` or `--sys-shape-*` tokens — no hardcoded values
- Asymmetric corner-radius on all interactive elements
- Shape morphing between archetype states (Strike, March, Placard, Megaphone, Substrate)
- `prefers-reduced-motion` respected — all motion classes must have a `transition: none` fallback
- Icon-scale motifs recognizable at 24px
- Wheat-paste/brick/asphalt textures as background-only — foreground stays legible
- First Nations solidarity in-situ via placards/posters/acknowledgment text only
- One Nabla hero accent word maximum per viewport
- One symbolic anchor maximum per scroll frame

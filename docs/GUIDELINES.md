# DESIGN GUIDELINES: KERALA RAGE — SOLIDARITY MODE

> **System:** CAREER_COPILOT
> **Design System:** Kerala Rage v1.0.0
> **Mode:** Solidarity (Dark-only)
> **Strict Mode:** ENABLED — Anti-Slop Protocol active

---

## 1. DESIGN PHILOSOPHY

This is not a corporate dashboard. This is a **wheat-paste protest wall on charcoal**.

*   **Solidarity Mode:** Dark-only. No light mode. No white backgrounds. Ever.
*   **Poster Aesthetic:** Interfaces feel printed, stencilled, and layered — like a Melbourne laneway meets a Kerala houseboat.
*   **Emotional Typography:** Fonts shift weight, width, and pressure in response to content meaning. Text is not decoration — it carries conviction.
*   **Anti-Slop:** No generic corporate aesthetics. No symmetrical grids. No static fonts. No perfect circles.

---

## 2. COLOR PALETTE

### Surface System (Charcoal Background)
| Step | Hex | Usage |
| :--- | :--- | :--- |
| **Step 0** | `#0F0F0F` | App background |
| **Step 1** | `#1A1A1A` | Surfaces |
| **Step 2** | `#242424` | Elevation layers |
| **Step 3** | `#2A2A2A` | Gutters |
| **Step 4** | `#323232` | Raised cards |
| **Step 5** | `#3A3A3A` | Hover states |
| **Step 6** | `#444444` | Active states |

### Primary Accents
| Token | Hex | Usage |
| :--- | :--- | :--- |
| **Solidarity Red** | `#F14714` | Primary CTA, urgent emphasis, screenprint ink, halo accents |
| **Ink Gold** | `#DAF674` | Halo disks, ornament highlights, optimism accents, focus rings |
| **Stencil Yellow** | `#F6E748` | Headline accents, attention markers, type highlights, stencil type |
| **Signal Green** | `#48F0E5` | Accent chips, link highlights, illustration splashes, micro accents |
| **Activist Smoke Green** | `#48DA8B` | Landscape accents, secondary highlights, map routes |
| **Worker Ash** | `#DAF6B3` | Body text, icon strokes, divider lines, secondary text |
| **Smoke Orange** | `#DA8B48` | Portrait warmth, labor motifs, earth highlights, wheat-paste tones |
| **Metal Blue** | `#48B3DA` | Water ripples, secondary metadata, charts secondary, cool accents |

### Charcoal Red (Destructive)
| Token | Hex | Usage |
| :--- | :--- | :--- |
| **Charcoal Red** | `#F14844` | Destructive actions, error states, critical banners, urgent typography |

### Aboriginal Flag Colors ⚠️ RESTRICTED
| Token | Hex | Usage |
| :--- | :--- | :--- |
| **Flag Red** | `#D81E05` | In-situ placards/posters ONLY |
| **Flag Yellow** | `#FCD116` | In-situ placards/posters ONLY |
| **Flag Black** | `#000000` | In-situ placards/posters ONLY |

> These colours must NEVER be used as general UI decoration.

---

## 3. TYPOGRAPHY

### Font Families
| Role | Font | Usage |
| :--- | :--- | :--- |
| **Primary** | `Work Sans` | Body, UI, navigation |
| **Display** | `Fraunces` | Hero headlines, display type |
| **Proclamation** | `Libre Bodoni` | Declarative statements, editorial |
| **Mono** | `JetBrains Mono` | Data, code, technical labels |
| **Curator** | `Caveat` | Handwritten annotations, personal notes |
| **Color Accent** | `Nabla` | Decorative, icon-scale color glyphs |

### Emotional Patterns (Variable Font Axes)
| Pattern | wght | wdth | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Solidarity Protest** | 800 | 120 | 0.02em | Declarative headers, street-poster slab words |
| **Labor Pressure** | 900 | 75 | 0em | Fatigue, extraction, wage critique, exhaustion |
| **Melancholy Longing** | 475 | 98 | 0em | Homesickness, reflective copy, gentle emphasis |
| **Identity Assertion** | 700 | 110 | 0em | Identity questions ("AUSSIE?"), cultural anchors |
| **Scroll Pressure** | 300→900 | 100 | dynamic | Scroll-driven headers, weight builds with pressure |
| **Extreme Contrast** | 100 | 100 | -0.02em | Hero lines vs. micro ultra-black metadata |

### Type Scale
`8px` → `12px` → `16px` → `24px` → `48px` → `72px` → `144px`

> **Required:** Variable fonts with wght 100–900, wdth 75–125, opsz 8–144. Global `font-optical-sizing: auto`. Enforce 9× weight ratio (100 vs 900) and 6× size ratio (12px vs 72px+).

---

## 4. SHAPE DNA

| Shape | Radius | Usage |
| :--- | :--- | :--- |
| **Stone** | `42% 58% 45% 55% / 48% 62% 38% 52%` | Irregular blob containers |
| **Slab** | `48% 52% 58% 42% / 55% 45% 60% 40%` | Editorial blocks |
| **Pebble** | `16px 8px 12px 20px` | Interactive elements |
| **Sentry Avatar** | `98%` | Avatar frames (not 50%!) |
| **Torn Edge** | `polygon(...)` clip-path | Poster/placard edges |

> **BANNED:** `border-radius: 50%` (perfect circles). Use `98%` for avatars.

---

## 5. ELEVATION (SHADOWS)

| Level | Shadow | Usage |
| :--- | :--- | :--- |
| **Pebble** | `0 2px 4px rgba(0,0,0,0.25)` | Resting state |
| **Stone** | `0 4px 8px rgba(0,0,0,0.35)` | Cards |
| **Hover Lift** | `0 8px 16px rgba(0,0,0,0.45)` | Hover |
| **Float** | `0 16px 32px rgba(0,0,0,0.55)` | Modals, overlays |
| **Ink Offset** | `2px 2px 0px inkGold` | Stencil text shadow |
| **Solidarity Bleed** | `0 0 12px solidarityRed` | Urgent glow |

---

## 6. MOTION PATTERNS

| Pattern | Duration | Usage |
| :--- | :--- | :--- |
| **Type Spring Slam** | 600ms | Hero entrance, weight/width shifts |
| **Drag Settle** | 800ms | Card drag, panel expansions |
| **Pulse Throb** | 1000ms | Urgent text emphasis *(respects reduced motion)* |
| **Wind Flutter** | 2000ms | Illustration micro-motion |
| **Water Ripple** | 3000ms | Houseboat sections, calm transitions |
| **Melancholy Breath** | 4000ms | Oscillate wght 450–500, subtle opacity |

> **Easing:** M3 Expressive `cubic-bezier(0.34, 1.56, 0.64, 1)` for all typographic transitions. **BANNED:** `ease`, `linear`, generic transitions.

---

## 7. MOTIFS & VOICE

### Visual Motifs
*   Kerala: elephant, palms, houseboat (kettuvalam), backwater ripples
*   Australian place: laneway brick, wheat-paste posters, tram silhouette
*   Devotional anchor: Nataraja presence, trishula + damru (icon-scale)
*   Street truth: graffiti phrases (English-only)
*   Resistance lineage: Tipu Sultan, Bhagat Singh portraits

### Voice Slogans
`NO PRIDE IN GENOCIDE` · `TREATY NOW` · `ALWAYS WAS ALWAYS WILL BE` · `SOVEREIGNTY NEVER CEDED` · `AUSSIE?` · `INQUILAB ZINDABAD` · `NO NEUTRAL CANVAS`

---

## 8. ANTI-SLOP PROTOCOL

### 🚫 BANNED
*   Light mode or white backgrounds (`#FFFFFF`)
*   Crown/monarchy symbols
*   Passports, visas, ID cards, border gates, government forms
*   Aboriginal art imitation (dot painting, sacred motif appropriation)
*   Aboriginal flag colors as general decoration
*   Perfect circles (`border-radius: 50%`)
*   Symmetrical geometric layouts as dominant structure
*   Linear/generic ease transitions
*   Static single-weight fonts
*   Slogan wallpaper (overuse across screens)
*   Mixing devotional (Shiva) and First Nations solidarity in one motif
*   Corporate diversity stock-photo aesthetics

### ✅ REQUIRED
*   Dark-only Solidarity mode on charcoal base
*   English-only UI and documentation
*   Variable fonts with wght 100–900, wdth 75–125, opsz 8–144
*   Global `font-optical-sizing: auto`
*   Extreme variable contrast: 9× weight ratio, 6× size ratio
*   M3 Expressive motion curve for typographic transitions
*   Icon-scale motifs recognizable at 24px
*   Wheat-paste/brick textures as background-only (foreground stays legible)
*   First Nations solidarity in-situ via placards/posters/acknowledgment text only

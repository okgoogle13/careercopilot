# Non-Negotiable Core Design Directives

## 1. Visual Hierarchy: Kerala/Indian-Australian PRIMARY, Colonial SECONDARY

**Dominant Visual Language (80% weight):**

- Kerala cultural imagery: elephants, kettuvalam houseboats, coconut palms, rubber plantations
- Australian activism: union posters, refugee rights campaigns, anti-racist street signage, Melbourne laneways
- Indian-Australian diaspora: migration journeys, visa/passport subversion, dual-city life, service labor dignity
- Socialist organizing: red hammer-sickle flags, workers' solidarity, protest banners

**Receding/Fractured (20% maximum):**

- Colonial motifs (crowns, Union Jack, British symbols) appear ONLY as:
  - Cracked, torn background fragments
  - 10-30% opacity maximum
  - Desaturated, washed-out colors
  - Visually overpowered by Kerala/activist imagery
  - Conceptually "losing" to migrant/socialist elements

## 2. Language Protocol: English is ONLY LANGUAGE

- All user-facing text MUST be in English
- All design system documentation in English only
- Cultural references (Kerala, Indian-Australian, diaspora) expressed in English
- No assumption of literacy in any other language

**Examples:**

- ✅ "Socialism" - English primary
- ✅ "WORKERS UNITE" - English primary
- ❌ No Malayalam-only text without English translation

## 3. First Nations Solidarity: Contextual Reference, NOT Aesthetic Appropriation

**Include:**

- Text acknowledgment: "Wurundjeri Woi-wurrung Country"
- Shared anti-colonial language: "Always Was Always Will Be", "Sovereignty Never Ceded"
- Visible Aboriginal-led campaign posters/placards in protest scenes
- Aboriginal flags in organizing contexts

**NEVER:**

- Imitate or generate Aboriginal dot painting patterns
- Appropriate sacred motifs or iconography
- Create new "Aboriginal-style" artwork
- Use Aboriginal art traditions as decorative elements

## 4. Material 3 Expressive Principles

**Required:**

- Variable fonts with wght (100-900), wdth (75-125), opsz (8-144) axes
- Organic asymmetric shapes (no perfect circles or geometric symmetry)
- Physics-based motion (spring, drag, gravity, pulse)
- 5-7 step tonal families for every color (never flat single-tone)
- Extreme type scale contrast (8px micro to 144px hero)

**Banned:**

- Static single-weight fonts
- Perfect circles (border-radius: 50%)
- Linear or generic ease transitions
- Flat single-color values
- Symmetrical geometric layouts

## 5. Single Mode: Solidarity (Dark UI Mandatory)

- **One Truth**: There is only one mode. It is Solidarity. It is Dark.
- **Default Canvas**: Very dark charcoal (#1a1a1a), matte finish.
- **Abolished Modes**: Light Mode, Gallery Mode, Laboratory Mode, Theory Mode.
- **Reasoning**: We do not "switch code" for the user. We present one unified front.

---

## Color System

### Philosophy

- Every color has 5-7 tonal steps (shadow → dark → primary → light → highlight → brightest)
- Semantic naming references cultural/natural sources
- Usage context documented for each family

### Color Families

#### Waratah Red (#F14714)

**Source:** Australian waratah flower, blood, resistance
**Tonal Family:** #A02F0F → #C03811 → #F14714 → #FF6B3D → #FF9470 → #FFB999
**Usage:** Red hammer-sickle flags, urgent emphasis text, elephant temple decorations, protest banners, primary CTAs
**Emotion:** Deep rage → active resistance → hopeful fire

#### Specimen Night Red (#F14844)

**Source:** Specimen jar label, institutional critique
**Tonal Family:** #C1132F → #D72F41 → #F14844 → #FF6B66 → #FF9490
**Usage:** Urgent text ("Revolution"), urgent headlines, worker solidarity declarations, visa stamp subversions
**Emotion:** Institutional warning → urgent action

#### Eucalyptus Smoke Green (#48DA8B)

**Source:** Kerala backwaters, Australian eucalyptus, calm-meets-activism
**Tonal Family:** #3AAF6E → #42C47D → #48DA8B → #6BE5A8 → #8EEFC0
**Usage:** Coconut palms, Kerala landscape, backwater water ripples, bridge text ("BETWEEN WORLDS"), migration route maps, melancholic sections
**Emotion:** Calm melancholy → living persistence

#### Parrot Green (#48F0E5)

**Source:** Tropical parrot, Melbourne integration, hybrid identity
**Tonal Family:** #36BDD1 → #3FD9DC → #48F0E5 → #6FF5EC → #97F9F3
**Usage:** Melbourne context text/signage, visa stamps, crossed-out bureaucracy, Australian activist posters, diaspora integration elements
**Emotion:** Bureaucratic cold → vibrant hybrid identity

#### Baru Gold (#DAF674)

**Source:** Baru nut, temple gold, optimistic resistance
**Tonal Family:** #C8E260 → #D1EC68 → #DAF674 → #E6FF90 → #F0FFB3
**Usage:** Kerala elephant ornaments, temple decorations, evening light, optimistic moments, small crown tags (when Kerala winning), radiating energy, hope accents
**Emotion:** Temple reverence → optimistic defiance

#### Gum Leaf Yellow (#F6E748)

**Source:** Australian gum tree, economic critique, solidarity text
**Tonal Family:** #E4DA39 → #EDE241 → #F6E748 → #F9ED6F → #FFF876
**Usage:** Solidarity text ("WORKERS UNITE"), economic critique ("$27/HR COLONIAL GUILT"), union signage, Australian landscape elements, warning/attention accents
**Emotion:** Economic exploitation → collective power

#### Eucalyptus Ash (#DAF6B3)

**Source:** Pale ash, worker hands, formal acknowledgments
**Tonal Family:** #B8D89A → #C8E8A7 → #DAF6B3 → #E8FBCC → #F4FFDD
**Usage:** Worker hands/skin tones, kettuvalam houseboat structures, coconut palm frames, Wurundjeri Country acknowledgments, calm melancholic backgrounds
**Emotion:** Exhausted dignity → quiet reverence

#### Waratah Smoke Orange (#DA8B48)

**Source:** Rubber plantation earth, labor warmth
**Usage:** Rubber plantation scenes, labor continuity elements, warm Kerala landscape tones, worker solidarity warmth
**Emotion:** Plantation labor → warm solidarity

#### Lab Wren Metal Blue (#48B3DA)

**Source:** Lab wren bird, cool technical, water depth
**Tonal Family:** #36A8C6 → #3FAFD0 → #48B3DA → #6BCCE8 → #8FDCF0
**Usage:** Backwater ripples, water depth, cool technical accents, radiating crown symbols (when used), secondary metadata text
**Emotion:** Cool technical → water life

#### Charcoal Background (#1a1a1a)

**Source:** Dark UI mandatory base
**Tonal Family:** #1a1a1a → #2a2a2a → #3a3a3a
**Usage:** All backgrounds, elevated surfaces, interactive hover states
**Emotion:** Foundational depth

---

## Typography System

### Variable Font Requirements

**Mandatory Axes:**

- `wght` (weight): 100-900
- `wdth` (width): 75-125
- `opsz` (optical size): 8-144
- **CRITICAL:** `font-optical-sizing: auto;` must be enabled globaly.

**Optional Axis:**

- `slnt` (slant): -15 to 0

**Recommended Fonts:**

- Inter Variable (primary)
- Recursive (expressive display)
- Fraunces Variable (extreme optical size)

### M3 Expressive Type Scale

1. **Micro (8px):** Bureaucratic detail, visa fine print, metadata
2. **Small (12px):** Wurundjeri acknowledgment, secondary labels
3. **Body (16px):** Default readable paragraph text
4. **Subhead (24px):** Form labels, card titles, subsection headers
5. **Headline (48px):** Page titles, panel headers, major sections
6. **Display (72px):** Hero statements, solidarity banners, cultural pride declarations
7. **Hero (144px):** Manifestos ("NO NEUTRAL CANVAS", "KERALA TO NAARM")

### M3 Expressive Contrast Ratios

**Extreme Weight Contrast (9x Ratio):**

- **Hero Banner**: wght 100, size 144px (Hairline Thin)
- **Supporting Subtext**: wght 900, size 16px (Ultra Black)
- **Ratio**: 9x weight difference = Visual Drama

**Size + Weight Compound Contrast:**

- **Display Large**: wght 100, size 72px, letter-spacing -0.02em
- **Body Small**: wght 900, size 12px, letter-spacing 0em
- **Combined Effect**: 9x weight × 6x size = Maximum Hierarchy

### Emotional Typography Patterns

| Pattern | Weight | Width | Slant | Optical Size | Letter Spacing | Duration | Easing | Usage |
|---------|--------|-------|-------|--------------|----------------|----------|--------|-------|
| **Pressure/Occupation** | 900 | 75 | 0 | auto | 0em | - | - | "MIGRANT" visa stamp, labor exploitation |
| **Solidarity/Protest** | 800 | 120 | 0 | auto | 0.02em | - | - | "WORKERS UNITE", collective action (SIGNATURE) |
| **Melancholy/Longing** | 450-500 | 95-100 | 0 | auto | 0em | 4s | ease-in-out | "BETWEEN WORLDS", diaspora tension |
| **Ghostly Colonial** | 100 | 75 | 0 | auto | 0em | - | - | Crown fragments, British symbols |
| **Identity Assertion** | 700 | 110 | 0 | auto | 0em | - | - | "Kerala Migrant Rage", cultural pride |
| **Scroll Pressure** | 300→700 | 100 | 0 | auto | dynamic | 400ms | cubic-bezier(0.34,1.56,0.64,1) | Hero headers, pressure building |

**Implementation Notes:**

- All patterns use `font-optical-sizing: auto` globally
- Scroll Pressure easing is M3 Expressive spring physics (cubic-bezier with overshoot)
- Letter spacing negative values tighten display type; positive values open body type
- Melancholy/Longing uses continuous 4s breathing animation, not discrete transitions

---

## Key Motifs & Cultural Symbols

### Primary Motifs (Dominant Visual Language)

**Kerala Elephant**

- **Symbol:** Cultural power, defiance, Kerala identity assertion
- **Visual:** Asymmetric organic shape, temple ornaments in waratah red/baru gold
- **Usage:** Hero sections, identity declarations, "no apology" moments
- **Motion:** Stride forward with momentum, elastic bounce on interaction

**Kettuvalam Houseboat**

- **Symbol:** Backwater socialist organizing, Kerala landscape persistence
- **Visual:** Thatched roof, wooden hull, red hammer-sickle flag flying from mast
- **Usage:** Calm-meets-protest sections, landscape context, journey metaphors
- **Motion:** Gentle rock/sway, water ripple reflections

**Red Hammer-Sickle Flags**

- **Symbol:** Workers' solidarity, plantation-to-café labor continuity, protest
- **Visual:** Fabric physics with flutter, waratah red dominant
- **Usage:** Protest banners, union organizing, solidarity declarations
- **Motion:** Wind drag, flag flutter animation, impact slam

**Coconut Palms**

- **Symbol:** Kerala landscape refusing to disappear, diaspora rootedness
- **Visual:** Tall organic curves, asymmetric fronds, eucalyptus smoke green
- **Usage:** Landscape frames, homesickness melancholy, persistent identity
- **Motion:** Gentle sway, wind responsiveness

**Rubber Plantation Workers**

- **Symbol:** Labor dignity, Kerala-to-Melbourne service work continuity
- **Visual:** Hands with tools (rubber cup, coffee, mop, delivery bag)
- **Usage:** Labor exploitation sections, economic critique, worker heroism
- **Motion:** Upward solidarity thrust, tool grip with tension

**Visa/Passport Subversion**

- **Symbol:** Bureaucratic rebellion, documentation overpowered by identity
- **Visual:** Official documents with Kerala imagery bleeding through
- **Usage:** Migration stress, border violence, rage against bureaucracy
- **Motion:** Stamp slam impact, rotation momentum

**Melbourne Laneways + Kerala Streets**

- **Symbol:** Diaspora duality, code-switching, dual-city existence
- **Visual:** Split-screen or morphing transitions between landscapes
- **Usage:** Complexity sections, "between worlds" tension
- **Motion:** Split momentum, morphing transitions

**Australian Union/Refugee Rights Posters**

- **Symbol:** Local activism, Melbourne-specific organizing
- **Visual:** Wheat-paste aesthetic, torn edges, tape marks, English text
- **Usage:** Community organizing, Australian context integration
- **Motion:** Poster slam, drag settle into place

### Secondary Motifs (Receding, Fractured, Losing)

**Cracked Crown Fragments**

- **Symbol:** Colonial power defeated, monarchy irrelevance
- **Visual:** Small broken pieces, 10-30% opacity, desaturated gold
- **Usage:** Background archaeology only, never central
- **Motion:** Static decay, no animation (dead weight)

**Torn Union Jack**

- **Symbol:** British occupation losing to Kerala/migrant power
- **Visual:** Torn fabric, faded colors, crossed-out sections
- **Usage:** Background fragments being painted over
- **Motion:** Static or fading out

---

## Motion System

### Physics-Based Easing (NO Linear or Generic Ease)

**M3 Expressive Easing:** `cubic-bezier(0.34, 1.56, 0.64, 1)` (The "Springy" Standard - use for all impact)
**Spring Elastic (600ms):** Flag slam, stamp impact, solidarity banner drop

**Drag Momentum (800ms):** Dragging labor, heavy tool movement, settling exhaustion
**Gravity Drip (1200ms):** Paint drips, blood drops, material weight
**Pulse Throb (1000ms):** Rage pulsing, urgent text throb, heartbeat rhythm
**Wind Flutter (2000ms):** Flag fabric physics, palm frond sway
**Water Ripple (3000ms):** Houseboat rock, water reflection shimmer

### Animation Patterns

**Pressure → Solidarity Transformation:**

- Start: wght 900, wdth 75, opacity 0.6 (compressed heavy)
- End: wght 800, wdth 120, opacity 1 (extended bold)
- Duration: 1200ms spring elastic
- Usage: Liberation moments, pressure releasing to collective power

**Flag Flutter:**

- Pattern: Rotate -2° to +1°, translateY 0 to -5px
- Duration: 2000ms wind flutter infinite
- Usage: Red flags, protest banners

**Elephant Stride:**

- Pattern: TranslateX -20px to 0
- Duration: 800ms spring elastic
- Usage: Elephant motif entrance

**Colonial Defeat:**

- Start: Opacity 0.3, blur 0px
- End: Opacity 0.1, blur 2px
- Duration: 2000ms ease-out
- Usage: Crown fragments, British symbols fading

---

## Shape System

### Organic Asymmetry (NO Perfect Circles)

**Organic Cards:** `border-radius: 42% 58% 45% 55% / 48% 62% 38% 52%` (and variations)
**Sharp Protest Angles:** `clip-path: polygon(0% 15% 85% 0%)`
**Torn Edge:** Polygon with irregular 30+ points creating wheat-paste poster aesthetic
**Elephant Body:** `border-radius: 35% 65% 60% 40% / 45% 55% 50% 50%`

**Banned:** `border-radius: 50%`, perfect symmetry, geometric regularity

---

## Voice & Slogans

### Primary Manifestos (Bold, Unapologetic)

**English Primary:**

- "KERALA TO NAARM: RED FLAGS RISING"
- "BACKWATERS TO BRUNSWICK: MIGRANT SOLIDARITY"
- "RUBBER TAPPERS TO BARISTAS: WORKERS UNITE"
- "MALAYALI RAGE ON STOLEN LAND"
- "COCONUT TREES OVER CROWN JEWELS"
- "NO NEUTRAL CANVAS"
- "BORDERS = COLONIALISM"
- "$27/HR CLEANING YOUR GUILT"

**First Nations Solidarity:**

- "ALWAYS WAS ALWAYS WILL BE ABORIGINAL LAND"
- "WURUNDJERI WOI-WURRUNG COUNTRY"
- "SOVEREIGNTY NEVER CEDED"
- "MIGRANT SETTLER ACCOUNTABILITY"

### Tone Characteristics

**Voice:**

- Confrontational, not apologetic
- Explicit about power structures (colonialism, capitalism, white supremacy)
- Combines rage with melancholic beauty (backwater calm meets protest urgency)
- Code-switches between cultural pride and political critique
- Honors First Nations without appropriation
- Names economic exploitation directly ("$27/hr", "visa expired")

**Avoid:**

- Corporate diversity speak
- "Inclusive" without specificity
- Neutral/diplomatic language about oppression
- Saviorism toward any group
- Romanticizing poverty or struggle without rage

---

**The Single Narrative Arc:**

1.  **Identity Declaration**: Defiant cultural pride, powerful assertion.
2.  **Diaspora Complexity**: Dual-city tension, public organizing.
3.  **Labor Dignity**: Exhausted rage, bureaucratic rebellion.
4.  **Transformation**: Colonial fading, active overthrow, synthesis.

---

## Anti-Slop Protocol (Explicit Bans)

### Typography Bans

❌ Default Inter font without variable axes
❌ Generic San Francisco/Helvetica fallback
❌ Single weight/width throughout interface
❌ Flat type scale without extreme contrast

### Color Bans

❌ Flat single-tone colors without tonal families
❌ Generic "primary", "secondary", "accent" without cultural meaning
❌ White backgrounds (#fff)
❌ Light mode

### Shape Bans

❌ Perfect circles (border-radius: 50%)
❌ Geometric symmetrical layouts
❌ Generic 8px border-radius on all elements
❌ Regular grid spacing without asymmetry

### Motion Bans

❌ Linear or generic ease transitions
❌ Single 300ms duration for all animations
❌ No animation (static design)

### Imagery Bans

❌ Crowns or monarchs as central subjects
❌ Union Jack or colonial symbols as hero imagery
❌ Aboriginal art imitation or appropriation
❌ Generic diverse stock photos

### Language Bans

❌ Text that assumes literacy in any language other than English
❌ Corporate diversity speak ("inclusive", "diverse", "multicultural" without context)
❌ Neutral/diplomatic language about colonialism

---

## Implementation Priorities

### For Frontend Developers

**Typography Must:**

- Use variable fonts with dynamic axis adjustment
- Show extreme scale contrast (micro labels next to hero declarations)
- Animate weight/width for emotional expression
- Never use single static font setting

**Color Must:**

- Reference tonal families, not flat values
- Show dimension through shadow-to-highlight progression
- Adjust intensity based on emotional context
- Use Kerala colors (reds/greens/golds) as dominant

**Layout Must:**

- Embrace asymmetry (no perfect centering)
- Use organic irregular spacing
- Layer elements (street wall logic: base → Kerala → flags → typography)
- Show material texture (paint drips, torn edges, tape marks)

**Motion Must:**

- Use physics tokens (spring/drag/gravity/pulse)
- Animate based on emotional context
- Never use generic ease curves
- Show transformation arcs (compression → expansion)

### Developer Implementation Examples

**React/Framer Motion (Scroll Pressure):**

```tsx
// The "Viscous Breeze" Scroll Effect
const { scrollYProgress } = useScroll();
const weight = useTransform(scrollYProgress, [0, 1], [300, 800]);

<motion.h1
  style={{
    fontFamily: "var(--font-display)",
    fontVariationSettings: `'wght' ${weight.get()}`, // Fluid weight shift
    transition: "font-variation-settings 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)", // M3 Easing
  }}
>
  KERALA RAGE
</motion.h1>;
```

**Global Variable Font Configuration:**

```css
:root {
  /* Font Family Registration */
  --font-display: "Inter Variable", sans-serif;
  --font-body: "Inter Variable", sans-serif;
  --font-accent: "Recursive", sans-serif;

  /* CRITICAL: Enable Optical Sizing */
  font-optical-sizing: auto;

  /* Emotional Axis Tokens */
  --type-solidarity-wght: 800;
  --type-solidarity-wdth: 120;
  --type-melancholy-wght: 475;
  --type-melancholy-wdth: 97.5;
  --type-pressure-wght: 900;
  --type-pressure-wdth: 75;
  --type-colonial-wght: 100;
  --type-colonial-wdth: 75;
  --type-identity-wght: 700;
  --type-identity-wdth: 110;

  /* M3 Expressive Easing */
  --motion-expressive-ease: cubic-bezier(0.34, 1.56, 0.64, 1);
}

@supports (font-variation-settings: normal) {
  * {
    font-variation-settings: "wght" var(--type-body-wght, 400);
  }
}
```

**Solidarity Typography Component (React + Framer Motion):**

```tsx
import { motion } from "framer-motion";

export const SolidarityBanner: React.FC<{ children: string }> = ({ children }) => {
  return (
    <motion.h1
      initial={{
        fontVariationSettings: `'wght' 600, 'wdth' 100`,
        opacity: 0.6
      }}
      animate={{
        fontVariationSettings: `'wght' 800, 'wdth' 120`,
        opacity: 1
      }}
      transition={{
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1], // M3 Expressive Easing
      }}
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "var(--type-display-size)",
        letterSpacing: "0.02em",
        color: "var(--color-waratah-primary)",
      }}
    >
      {children}
    </motion.h1>
  );
};
```

### M3 Expressive Typography Validation Checklist

Validate Kerala Rage typography compliance before deployment:

- [ ] **Variable Fonts Loaded**: Inter Variable, Recursive with full axis support (wght 100-900)
- [ ] **Optical Sizing Enabled**: `font-optical-sizing: auto` set globally on `:root` or `*`
- [ ] **Extreme Weight Contrast**: 9x ratio (100 vs 900) implemented in at least 3 contexts
- [ ] **Compound Contrast**: Size + Weight combined for maximum hierarchy (9x × 6x = 54x multiplier)
- [ ] **Letter Spacing**: Display (-0.02em), Body (0em), Solidarity (+0.02em) applied correctly
- [ ] **Emotional Axis Mapping**: 6 emotional patterns use distinct wght/wdth combinations from table
- [ ] **M3 Expressive Easing**: `cubic-bezier(0.34, 1.56, 0.64, 1)` for all transitions (not linear/ease)
- [ ] **Scroll-Driven Animation**: At least one header responds to scrollYProgress with weight shift
- [ ] **No Static Fonts**: Zero single-weight imports (no `@import url('...wght@400')`), all variable
- [ ] **Semantic Tokens**: `--type-solidarity-wght`, `--type-melancholy-wght` etc. defined in `:root`
- [ ] **Anti-Slop**: No Inter 400 vs 500 defaults, no generic weights, typography feels intentional

### Typography Troubleshooting

**Issue: Variable fonts not rendering axis changes**

- **Cause**: Browser doesn't support `font-variation-settings` or font file incomplete
- **Solution**: Add `@supports` check and verify Google Fonts import includes `wght@100..900`
- **Test**: Open DevTools, inspect element, verify computed `font-variation-settings` shows new values

**Issue: Extreme weights (100, 900) look broken or don't render**

- **Cause**: Font file doesn't include full weight range
- **Solution**: Verify Google Fonts import: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');`
- **Verify**: Use Google Fonts UI to check font variants loaded

**Issue: Optical sizing not working**

- **Cause**: `font-optical-sizing: auto` not inherited or browser doesn't support
- **Solution**: Set on `:root` or `*` selector globally, not per-element
- **Verify**: Test with font that has wide opsz range (e.g., Fraunces opsz 9..144)

**Issue: Scroll-driven animation janky or freezing**

- **Cause**: Heavy recalculation on every scroll event
- **Solution**: Use `will-change: font-variation-settings` and consider throttling updates
- **Performance**: Monitor frame rate, may need CSS `@scroll-timeline` (experimental) for heavy animations

**Issue: Letter spacing too tight or too loose**

- **Cause**: Wrong units or values from table not applied
- **Solution**: Verify using exactly the values from Emotional Typography Patterns table
- **Test**: Display should be -0.02em (tighter), Solidarity should be 0.02em (looser)

### For Claude Implementation

**This brief provides:**

1. Complete identity for design-system-doc-generator
2. Anti-slop protocol for quality enforcement
3. Motif catalog for wireframe-annotator asset integration
4. Voice guidelines for microcopy generation
5. Emotional spectrum for journey stage mapping

---

## Success Criteria

**Design system succeeds when:**

1. Kerala/Indian-Australian identity feels PRIMARY (not "diverse representation")
2. Cultural references honor Kerala identity without language barriers
3. First Nations solidarity present without appropriation
4. Colonial imagery feels defeated/irrelevant (not nostalgic)
5. Variable fonts create emotional expression through axis manipulation
6. Dark UI reads as essential (not "dark mode option")
7. Motion physics feel visceral (impact, exhaustion, breathing)
8. Economic critique explicit in voice ($27/hr visible, not abstracted)

**Design system fails when:**

1. Colonial imagery equal weight to Kerala imagery
2. Any language other than English used in documentation or interface
3. Aboriginal art imitated as decoration
4. Generic font weights without variable expression
5. Light backgrounds present anywhere
6. Perfect circles or geometric symmetry
7. Generic ease transitions
8. Corporate-speak replaces explicit political language

---

## Appendix: Token Naming Conventions

**Colors:** `--color-[source]-[tone]` (e.g., `--color-waratah-dark`)
**Typography:** `--type-[scale]-[property]` (e.g., `--type-hero-size`)
**Motion:** `--motion-[physics]-[easing/duration]` (e.g., `--motion-spring-elastic`)
**Shape:** `--shape-[type]-[variant]` (e.g., `--shape-organic-card-1`)
**Emotional Patterns:** `--type-[emotion]-[property]` (e.g., `--type-solidarity-wght`)

---

**End of Brand Identity Brief**

This brief serves as the authoritative source for Kerala Migrant Rage design system implementation in CareerCopilot and related projects.

# Supplement: Shadow & Elevation System

## Philosophy

Shadows are not just depth; they are atmosphere. In the Kerala Rage system, shadows are heavy, colored, and behave like thick liquid ("Viscous Breeze").

## Semantic Elevations

### 1. The Surface (Background)

- **Token:** `elevation-0`
- **Value:** `none`
- **Usage:** The dark charcoal canvas itself.

### 2. The Pebble (Button/Badge)

- **Token:** `elevation-1` / `shadow-subtle`
- **Value:** `0 2px 4px rgba(0, 0, 0, 0.25)`
- **Usage:** Small interactive elements.

### 3. The Stone (Card/Panel)

- **Token:** `elevation-2` / `shadow-standard`
- **Value:** `0 4px 8px rgba(0, 0, 0, 0.35)`
- **Usage:** Default container state.

### 4. The Lift (Hover State)

- **Token:** `elevation-3` / `shadow-hover`
- **Value:** `0 8px 16px rgba(0, 0, 0, 0.45)`
- **Usage:** Interactable cards on hover.

### 5. The Float (Modal/Popout)

- **Token:** `elevation-4` / `shadow-maximum`
- **Value:** `0 16px 32px rgba(0, 0, 0, 0.55)`
- **Usage:** Dialogs, menus, critical alerts.

## Colored Shadow Signatures

### Wattle Offset (Optimism)

- **Token:** `shadow-wattle-offset`
- **Value:** `2px 2px 0px var(--color-baru-gold-primary)`
- **Usage:** Primary buttons, "Call to Action" cards.
- **Effect:** Hard edge, retro-optimistic.

### Waratah Bleed (Rage/Danger)

- **Token:** `shadow-waratah-bleed`
- **Value:** `0 0 12px var(--color-waratah-primary)`
- **Usage:** Error inputs, destructive buttons, "Revolution" text.
- **Effect:** Glowing, radioactive intensity.

### Viscous Breeze (Interactive Physics)

- **Token:** `transition-viscous`
- **Value:** `box-shadow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Usage:** All elevation changes. Shadows don't just fade; they _ooze_ into place.

# Supplement: Organic Shape System

## Philosophy

Nature hates straight lines. The Kerala Rage system rejects the colonial "perfect grid" in favor of organic, asymmetric, and "torn" shapes that imply history, wear, and resistance.

## Core Shapes

### 1. Organic Card (The Stone)

- **Token:** `shape-organic-card`
- **Border-Radius:** `28px 24px 32px 20px` (Base), `32px 20px 24px 28px` (Variant)
- **Usage:** All main content containers. NEVER a perfect rectangle.

### 2. Organic Button (The Pebble)

- **Token:** `shape-organic-button`
- **Border-Radius:** `16px 8px 12px 20px`
- **Usage:** Primary interactions.

### 3. The Torn Edge (Protest)

- **Token:** `clip-path-torn-top` / `clip-path-torn-bottom`
- **Value:** `polygon(0% 10px, 5% 0px, 10% 8px, 15% 2px, 20% 6px, 25% 0px, 30% 8px, 35% 2px, 40% 6px, 45% 0px, 50% 8px, 55% 2px, 60% 6px, 65% 0px, 70% 8px, 75% 2px, 80% 6px, 85% 0px, 90% 8px, 95% 2px, 100% 6px, 100% 100%, 0% 100%)`
- **Usage:** Separators between sections, "wheat-paste" poster aesthetics.

### 4. The Sentry (Avatar)

- **Token:** `shape-sentry`
- **Value:** `98%` (Imperfect Circle)
- **Usage:** User profile pictures.

## Implementation Notes

- Use `CSS Masking` or `clip-path` for Torn Edges.
- Avoid repeating the exact same organic shape adjacent to each other; use `nth-child` to alternate radius values.

# Supplement: Data Visualization System

## Philosophy

Data is political. We do not use neutral blues. We use the colors of the land (Kerala/Australia) to represent truth.

## Semantic Data Palette

### 1. Primary Data (The Truth)

- **Token:** `color-data-primary`
- **Ref:** `var(--color-wattle-gold)`
- **Usage:** The main dataset, the "User's" performance.

### 2. Comparison Data (The Context)

- **Token:** `color-data-comparison`
- **Ref:** `var(--color-eucalyptus-smoke-primary)`
- **Usage:** Averages, benchmarks, "others".

### 3. Alert Data (The Warning)

- **Token:** `color-data-alert`
- **Ref:** `var(--color-waratah-red)`
- **Usage:** Drops in performance, critical thresholds.

### 4. Background Data (The Noise)

- **Token:** `color-data-background`
- **Ref:** `rgba(255, 255, 255, 0.1)`
- **Usage:** Grid lines, axis ticks, inactive segments.

## Typography in Charts

- **Axis Labels:** `JetBrains Mono` (The Annotation), 10px, Uppercase.
- **Tooltips:** `Work Sans` (The Field Note), 12px, Dark Background with Wattle Border.
- **Big Numbers:** `Libre Bodoni` (The Proclamation), Condensed.

## Chart Styles

- **Line Charts:** Thick lines (3px), no smoothing (raw data honesty), dot markers on hover.
- **Bar Charts:** Asymmetric top radius (refer to Shape System).
- **Grid:** Dotted, low opacity (`0.1`).

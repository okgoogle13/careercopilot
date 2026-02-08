# Non-Negotiable Core Design Directives

## 1. Visual Hierarchy: Kerala/Indian-Australian PRIMARY, Colonial SECONDARY

**Dominant Visual Language (80% weight):**

- Kerala cultural imagery: elephants, kettuvalam houseboats, coconut palms, rubber plantations
- Australian activism: **Australian context appears through land-based demands and street truth, not institutional imagery.** Examples: Anti-colonial graffiti ("NO PRIDE IN GENOCIDE"), Land justice demands ("TREATY NOW"). The system avoids state symbols, civic branding, or bureaucratic aesthetics entirely.

- Indian-Australian diaspora: migration journeys, dual-city life, service labor dignity

- Socialist organizing: red hammer-sickle flags, workers' solidarity, protest banners

**Receding/Fractured (20% maximum):**

- Colonial motifs (crowns, Union Jack, British symbols) appear ONLY as:
  - Cracked, torn background fragments
  - 10-30% opacity maximum
  - Desaturated, washed-out colors
  - Visually overpowered by Kerala/activist imagery
  - Conceptually "losing" to migrant/socialist elements

**Core Narrative: Street kr-dark, Not Campaign Flyer**

> **This system operates as a street kr-dark, not a campaign flyer.**
> Visuals borrow from wheat-paste portrait posters, protest murals, devotional statuary, and anti-colonial graffiti. The tone is declarative, symbolic, and interrogative — not instructional, not recruitment-oriented, and never neutral.
>
> **Primary visual energy is mythic and archival, not logistical.**
> Portraits, statues, and symbols function as cultural memory and refusal, not as calls to action. The system privileges _who we are_ and _what history refuses to disappear_ over explicit instruction or mobilisation graphics.

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

**First Nations solidarity is expressed through language and placement, not style.**

- Aboriginal flag colours may be used **only** on protest placards, banners, or contextual posters within a scene.
- No Aboriginal visual styles, mark-making systems, or symbolic abstractions are ever reinterpreted, echoed, or remixed into the design system itself.

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
- **Abolished Modes**: Light Mode, kr-dark Mode, kr-dark Mode, Theory Mode.
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

#### kr-motif Night Red (#F14844)

**Source:** kr-motif jar label, institutional critique
**Tonal Family:** #C1132F → #D72F41 → #F14844 → #FF6B66 → #FF9490
**Usage:** Malayalam urgent text ("വിപ്ലവം" revolution), urgent headlines, worker solidarity declarations
**Emotion:** Institutional warning → urgent action

#### kr-leafus Smoke Green (#48DA8B)

**Source:** Kerala backwaters, Australian kr-leafus, calm-meets-activism
**Tonal Family:** #3AAF6E → #42C47D → #48DA8B → #6BE5A8 → #8EEFC0
**Usage:** Coconut palms, Kerala landscape, backwater water ripples, bridge text ("BETWEEN WORLDS"), migration route maps, melancholic sections
**Emotion:** Calm melancholy → living persistence

#### Parrot Green (#48F0E5)

**Source:** Tropical parrot, Melbourne integration, hybrid identity
**Tonal Family:** #36BDD1 → #3FD9DC → #48F0E5 → #6FF5EC → #97F9F3
**Usage:** Melbourne context text/signage, Australian activist posters, diaspora integration elements

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

#### kr-leafus Ash (#DAF6B3)

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

### Typography as Pressure System

> Typography in the Kerala Rage system behaves as a physical force, not a neutral carrier of text.

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

1.  **Micro (8px):** Technical detail, metadata

2.  **Small (12px):** Wurundjeri acknowledgment, secondary labels
3.  **Body (16px):** Default readable paragraph text
4.  **Subhead (24px):** Form labels, card titles, subsection headers
5.  **Headline (48px):** Page titles, panel headers, major sections
6.  **Display (72px):** Hero statements, solidarity banners, cultural pride declarations
7.  **Hero (144px):** Manifestos ("NO NEUTRAL CANVAS", "KERALA TO NAARM")

### M3 Expressive Contrast Ratios

**Extreme Variable Contrast:**
A minimum **9× weight ratio** (100 ↔ 900) and **6× size ratio** (12px ↔ 72px+) is required to create expressive tension.

**Emotional Axis Mapping:**
Variable font axes are mapped to emotional states:
– _Pressure_: compressed, heavy
– _Solidarity_: expanded, bold
– _Melancholy_: oscillating, light

**Global Optical Sizing:**
`font-optical-sizing: auto` is mandatory to ensure dignity at small sizes and fragility at large scales.

**English-Only, Visually Loud:**
Cultural identity is asserted through scale, weight, and layout — never through non-English UI text.

### Emotional Typography Patterns

| Pattern                                       | Weight | Width | Slant | Optical Size | Letter Spacing | Duration | Easing | Usage                   |
| --------------------------------------------- | ------ | ----- | ----- | ------------ | -------------- | -------- | ------ | ----------------------- |
| **Pressure/Occupation (Labor Exploitation):** | 900    | 75    | 0     | auto         | 0em            | -        | -      | Labor exploitation text |

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
- **Visual:** Tall organic curves, asymmetric fronds, kr-leafus smoke green
- **Usage:** Landscape frames, homesickness melancholy, persistent identity
- **Motion:** Gentle sway, wind responsiveness

**Rubber Plantation Workers**

- **Symbol:** Labor dignity, Kerala-to-Melbourne service work continuity
- **Visual:** Hands with tools (rubber cup, coffee, mop, delivery bag)
- **Usage:** Labor exploitation sections, economic critique, worker heroism
- **Motion:** Upward solidarity thrust, tool grip with tension

**Melbourne Laneways + Kerala Streets**

- **Symbol:** Diaspora duality, code-switching, dual-city existence
- **Visual:** Split-screen or morphing transitions between landscapes
- **Usage:** Complexity sections, "between worlds" tension
- **Motion:** Split momentum, morphing transitions

**Australian Union/Refugee Rights Posters**

- **Symbol:** Local activism, Melbourne-specific organizing
- Visual: Worker portraits, compressed heavy typography
- **Usage:** Community organizing, Australian context integration
- **Motion:** Poster slam, drag settle into place

### Secondary Motifs (Receding, Fractured, Losing)

**Shiva (Statue Reference, Icon-Scale)**

- **Symbol:** Cultural anchor, emotional stabilizer
- **Visual:** Simplified statue-inspired form, screened in limited inks, stone-like weight. Revered, not ironic.
- **Constraint:** Never merged with protest text or First Nations content. Not a political logo.

**Torn Union Jack**

- **Symbol:** British occupation losing to Kerala/migrant power
- **Visual:** Torn fabric, faded colors, crossed-out sections
- **Usage:** Background fragments being painted over
- **Motion:** Static or fading out

---

## South Asian Resistance Lineage

> The system explicitly situates Kerala diaspora identity within a longer South Asian anti-colonial lineage.
>
> Revolutionary figures such as **Tipu Sultan** and **Bhagat Singh** appear as **portrait-poster icons**, rendered in screenprint style with halo or sun-disk treatments.
>
> These figures are not decorative; they establish continuity between historical resistance and contemporary migrant rage on stolen land.

**Bhagat Singh Text Protocol:**
Text associated with Bhagat Singh uses **Latin-script English transliteration** (e.g., _INQUILAB ZINDABAD_) to maintain the English-only protocol while preserving revolutionary meaning.

---

## Motif and Visual Safety Preferences

### 1. Simple, Bold, Icon-Scale Motifs

- **Enforce:** All motifs must be simple, bold, and clearly recognizable even at small icon scales (24px).
- **Ban:** Over-complex, ambiguous, or abstract shapes that lose meaning when resized.
- **Goal:** Immediate visual cognition without requiring "artistic interpretation."

### 2. Balanced Representation

- **Requirement:** Every visual composition must maintain a balance between:
  - **Indian/Kerala:** (Elephants, Palms, Houseboats)
  - **Australian:** (Waratah, Gum Leaves, Melbourne Laneways)
  - **Solidarity:** (Hands, Flags, Placards)
- **Avoid:** Over-indexing on one culture to the exclusion of the others. The strength is in the _hybrid_.

### 3. Australian Context Motifs

- **Include:**
  - Union posters (wheat-paste aesthetic)
  - Refugee rights campaign imagery
  - Anti-racist street signage
  - Iconic Melbourne motifs (trams, laneway bricks, coffee cups as labor tools)
- **Explicitly Reject:** Generic corporate "diversity" stock-photo aesthetics. Real grit, not polished inclusion.

### 4. UI-Usable Activism

- **Constraint:** Protest elements must be drawn as **flat, legible icons** suitable for UI components.
- **Usage:**
  - **Buttons:** Small raised fist or flag icon.
  - **Nav:** Simple placard icon.
  - **Empty States:** Single clear banner or crowd silhouette.
- **Ban:** Full complex poster scenes used as tiny UI elements. Keep them distinct.

### 5. Bureaucracy Ban (Explicit)

- **Constraint:** Passports, ID cards, border gates, visas, and immigration counters are **EXPLICITLY BANNED**.
- **Reasoning:** We reject the "migrant as documented subject" narrative entirely. The focus is on the human, the labor, and the culture, not the permission to exist.
- **Action:** If a concept requires "documentation," use a union card or a protest flyer instead.

### 6. Colonial Defeat

- **Restatement:** Crowns, Union Jacks, and monarchic symbols must **ONLY** appear as:
  - Cracked, broken, or fading background archaeology.
  - Low opacity (<20%).
  - Desaturated.
- **Never:** Hero imagery, positive symbols, or decorative flourishes. They represent a fading, defeated past.

### 7. First Nations Solidarity (In Situ)

- **Constraint:** Use Aboriginal flags and slogans ("Always Was, Always Will Be") only **in situ** (on protest placards, posters within a scene).
- **Ban:**
  - Imitating Aboriginal dot painting styles.
  - Using sacred motifs as decoration.
  - Inventing "Aboriginal-style" patterns.
- **Goal:** Respectful solidarity, not appropriation.

### 8. Mood Board Layout Rules

- **Format:** Single-page, tile-based grid.
- **Content:** Each tile shows **ONE** motif, color family, or UI fragment.
- **Spacing:** Consistent size tiles separated by ample **dark-UI whitespace**.
- **Reasoning:** Prevents visual clutter ("slop") and ensures each element is readable and intentional.

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

**The interface asserts, it does not persuade.**
Text is declarative, confrontational, or reflective — never instructional or motivational in tone.

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
❌ Passports, Visas, ID Cards (even subverted)
❌ Bureaucratic forms or government aesthetics
❌ Overuse of slogans across multiple tiles or screens
❌ Treating revolutionary figures as decorative wallpaper
❌ Mixing devotional, First Nations, and protest symbolism into a single composite motif

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
        opacity: 0.6,
      }}
      animate={{
        fontVariationSettings: `'wght' 800, 'wdth' 120`,
        opacity: 1,
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
- **Ref:** `var(--color-kr-leafus-smoke-primary)`
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
- **Big Numbers:** `kr-serif-bold` (The Proclamation), Condensed.

## Chart Styles

- **Line Charts:** Thick lines (3px), no smoothing (raw data honesty), dot markers on hover.
- **Bar Charts:** Asymmetric top radius (refer to Shape System).
- **Grid:** Dotted, low opacity (`0.1`).

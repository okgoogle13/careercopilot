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

### 2. Balanced Representation (80/10/10 Spatial Hierarchy)

Every visual composition must maintain clear spatial weight distribution between three cultural/political lineages:

**Primary Layer (80%): Kerala/Indian-Australian Identity**
- Motifs: Elephants, Kettuvalam houseboats, coconut palms, rubber plantation workers, temple ornaments
- Colors: Waratah Red, Baru Gold, Smoke Green (dominant palette)
- Narrative: Cultural pride, migrant dignity, diaspora rootedness
- Example: Hero screen with Kerala elephant takes 80% of canvas

**Secondary Layer (10-15%): Australian Activism Context**
- Motifs: Union posters (wheat-paste aesthetic), Melbourne laneways, refugee rights imagery, trams as labor tools
- Colors: Gum Leaf Yellow, Parrot Green (accents)
- Narrative: Local organizing, Australian worker solidarity
- Example: Protest poster excerpt or laneway context fills 12% of composition

**Visible But Bounded (5%): First Nations Solidarity**
- Expression: In situ only (on protest placards within scenes, not standalone)
- Medium: Text ("Always Was Always Will Be", "Wurundjeri Woi-wurrung Country") + Aboriginal flag on banners
- Colors: Aboriginal flag colors only when displayed on protesting placards
- Narrative: Shared anti-colonial stance, respectful non-appropriation
- Example: "Wurundjeri Country" text in corner (3%) + Aboriginal flag on banner within scene (2%)

**Visual Application Example:**
A dashboard hero section:
1. **Background**: Dark charcoal canvas (foundation)
2. **Dominant motif** (60%): Kerala elephant + temple ornament in Waratah Red, Baru Gold
3. **Secondary element** (15%): Melbourne laneway tram or union poster excerpt, subtle
4. **Text layer** (20%): Manifesto or section title in Solidarity weight
5. **Accent** (5%): "Wurundjeri Country" acknowledgment in corner, small, respectful

**Why This Ratio Matters:**
- 80% Kerala ensures the system can't be mistaken for "generic diversity design"
- 10-15% Australian context prevents the system from feeling imported/unlocal
- 5% FN solidarity is visible without appropriation or equivalence (acknowledges the land without claiming shared experience)
- Leaves 5% breathing room for typography, negative space, functionality

**Test for Balance:** If you removed the Australia + FN layers, would the system still be recognizably Kerala Rage? (Should be yes.) If you removed Kerala, would it be empty? (Should be yes.) This tests that hierarchy is correct.

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

**Loading State Pulse:**

- Start: Opacity 0.6, shadow subtle
- End: Opacity 1, shadow with 12px Wattle glow
- Duration: 1000ms pulse infinite
- Easing: Cubic-bezier(0.4, 0, 0.6, 1) (M3 breathing)
- Usage: Processing, waiting, in-progress states

**Empty State Fade:**

- Start: Opacity 0, blur 4px
- End: Opacity 0.4, blur 0px
- Duration: 800ms ease-out
- Usage: Motif invitation in empty states (subtle, not demanding)

**Error Shake:**

- Pattern: TranslateX -4px to +4px, 3 bounces
- Duration: 200ms (quick, attention-grabbing without being violent)
- Easing: cubic-bezier(0.34, 1.56, 0.64, 1) (M3 Expressive spring)
- Usage: Validation error, rejected input

**Success Lift + Glow:**

- Lift: TranslateY 0 to -8px
- Glow: Box-shadow Baru Gold, 0 to 24px
- Duration: 600ms spring elastic
- Usage: Form submission success, completed milestone

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

## Voice Application Across User Journey

The system's voice is **confrontational, declarative, and interrogative**—but intensity modulates based on emotional context and user intent. This prevents tone from feeling hostile while maintaining ideological clarity.

### Tonal Arc & Decision Tree

| Context | Emotional Frame | Voice Pattern | Example | Why |
|---------|-----------------|---------------|---------|-----|
| **Hero / Manifestos** | Confrontational assertion | Full power, declarative | "KERALA TO NAARM: RED FLAGS RISING" | User arriving, needs ideological clarity |
| **Onboarding / Guidance** | Supportive coalition | "Let's" framing, solidarity verbs | "LET'S OPTIMIZE YOUR RESUME FOR HUMAN READERS" | User needs help; harsh tone creates barrier |
| **Form Labels / Instructions** | Assertive direction | Capitalized, direct | "UPLOAD YOUR RESUME (PDF, DOC, DOCX)" | Clarity without condescension |
| **Error States / Validation** | Solidarity-framed problem-solving | "We're fixing this together" | "PDF, DOC, DOCX ONLY—LET'S TRY AGAIN" (in Waratah Red) | User made mistake; help them, don't shame them |
| **Success / Celebration** | Joyful momentum | Affirmation + forward motion | "RESUME ANALYZED—YOUR STRENGTHS RISING" | Celebrate progress, propel forward |
| **Loading / Waiting** | In-progress tension | Reflective patience | "PROCESSING YOUR APPLICATION..." | Acknowledge the work happening |
| **Accessibility / Help Text** | Humble guidance | Small, lighter weight | "Supported formats: PDF, DOC, DOCX" | Secondary information, visually recede |

### Implementation Rules

**Rule 1: Emotional Intent Determines Tone**
- If the user needs to feel _empowered_ → "WORKERS UNITE" ✅
- If the user needs to feel _helped_ → "Let's strengthen your application" ✅
- If the user needs to feel _informed_ → Metadata in smaller weight ✅
- If the user needs to feel _ashamed_ → Never ❌

**Rule 2: Context Overrides Formula**
- Generic form validation could be "REQUIRED FIELD" (confrontational)
- But if user is job-anxious, "COMPLETE THIS SECTION TO MOVE FORWARD" (coalition) is more effective
- Teams decide based on user research, not rules

**Rule 3: Visual Tone Intensity Matches Verbal Tone**
- Hero manifestos: Waratah Red + weight 800 + 72px size = maximum intensity
- Form validation: Waratah Red + weight 600 + 16px size = clear but not aggressive
- Help text: Smoke Green + weight 400 + 12px size = gentle guidance

---

## Anti-Slop Protocol (Explicit Bans)

### System States: Loading, Empty, Error, Success, Disabled

The Kerala Rage system must handle all user-facing states with emotional coherence. Each state has a voice, visual treatment, and motion pattern.

#### State Matrix: Emotional Framing + Implementation

| State | Emotional Intent | Visual Treatment | Voice | Motion | Color |
|-------|-----------------|------------------|-------|--------|-------|
| **Loading** | "Work is happening—trust the process" | Animated spinner or pulsing element | "PROCESSING YOUR APPLICATION..." | Spring pulse (1000ms) | Wattle Gold glow |
| **Empty** | "You're starting—invitation, not demand" | Kerala motif (palm, elephant) low-opacity + text | "NO DOCUMENTS YET—UPLOAD TO BEGIN" | Gentle fade-in, no aggression | Smoke Green (calm) |
| **Error** | "We're fixing this together—solidarity frame" | Waratah Red border/highlight + icon | "PDF, DOC, DOCX ONLY—LET'S TRY AGAIN" | Gentle shake (200ms), not violent | Waratah Red (alert) |
| **Success** | "Celebration—momentum forward" | Baru Gold glow + upward motion + check icon | "RESUME ANALYZED—YOUR STRENGTHS RISING" | Spring lift (400ms) | Baru Gold (optimistic) |
| **Disabled** | "Waiting—colonial defeat aesthetic" | Ghostly Colonial (wght 100, 10-20% opacity) | "UNAVAILABLE" (very light) | None (static) | Charcoal ash (faded) |

#### Implementation Examples

##### Loading State
```tsx
export const ProcessingState: React.FC = () => (
  <div className="flex flex-col items-center space-y-4">
    {/* Pulsing Wattle Gold glow */}
    <div className="animate-pulse w-24 h-24 rounded-stone bg-wattle-gold/20 border-2 border-wattle-gold" />

    {/* Declarative text in Solidarity weight */}
    <p className="text-headline-sm font-bold text-paper-white">
      PROCESSING YOUR APPLICATION
    </p>

    {/* Subtitle in regular weight */}
    <p className="text-body-md text-kr-leaf-smoke">
      Analyzing resume for ATS optimization
    </p>
  </div>
);
```

##### Empty State
```tsx
export const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center space-y-6 p-12">
    {/* Kerala motif at low opacity—invitation, not force */}
    <div className="w-32 h-32 rounded-stone opacity-40">
      <svg className="w-full h-full text-kr-leaf-smoke" viewBox="0 0 100 100">
        {/* Coconut palm SVG outline */}
      </svg>
    </div>

    {/* Melancholic + inviting voice */}
    <h2 className="text-headline-md font-bold text-paper-white text-center">
      NO DOCUMENTS YET
    </h2>

    {/* Supportive subtext */}
    <p className="text-body-lg text-kr-leaf-smoke text-center max-w-sm">
      Upload your resume to begin optimization. PDF, DOC, or DOCX.
    </p>

    {/* CTA in Solidarity colors */}
    <button className="mt-4 px-6 py-3 bg-wattle-gold text-kr-charcoal font-semibold rounded-pebble">
      UPLOAD RESUME
    </button>
  </div>
);
```

##### Error State
```tsx
export const ValidationError: React.FC<{ message: string }> = ({ message }) => (
  <div className="p-4 border-l-4 border-waratah-red rounded-stone bg-kr-leaf-smoke/30">
    <div className="flex items-center space-x-3">
      {/* Visual indicator */}
      <span className="text-xl">⚠️</span>

      {/* Error message in Solidarity framing—"let's fix this" not "you failed" */}
      <div>
        <p className="font-semibold text-waratah-red">
          {message.toUpperCase()}
        </p>
        <p className="text-body-sm text-kr-leaf-smoke">
          Supported formats: PDF, DOC, DOCX. Let's try again.
        </p>
      </div>
    </div>
  </div>
);
```

##### Success State
```tsx
export const SuccessState: React.FC<{ stat: string; action: string }> = ({ stat, action }) => (
  <div className="space-y-4 p-6 border-l-4 border-baru-gold rounded-stone bg-kr-leaf-smoke/20">
    {/* Hero stat in Baru Gold */}
    <p className="text-headline-sm font-bold text-baru-gold">
      {stat}
    </p>

    {/* Celebratory, forward-looking text */}
    <p className="text-body-lg text-paper-white font-semibold">
      {action}
    </p>

    {/* Optional: Secondary action */}
    <button className="mt-4 px-4 py-2 bg-baru-gold/20 border border-baru-gold text-baru-gold font-semibold rounded-pebble">
      NEXT STEP
    </button>
  </div>
);
```

##### Disabled State
```tsx
export const DisabledButton: React.FC<{ label: string; reason?: string }> = ({ label, reason }) => (
  <button
    disabled
    className="px-6 py-3 rounded-pebble opacity-30 text-paper-white/50 font-light cursor-not-allowed"
    title={reason}
  >
    {label}
  </button>
);
```

#### Edge Case: Mid-Process States (Uncommon)

Some states don't fit neatly into the matrix. Handle with principle, not formula:

**Uploading (Progress):**
Combine Loading + Success frames:
- Visual: Progress bar in Wattle Gold, filling left→right
- Voice: "UPLOADING... 45% COMPLETE"
- Motion: Linear, not physics-based (accurate representation)

**Permission Denied:**
Combine Error + Disabled frames:
- Visual: Ghostly Colonial filter on button (100 weight, very faded)
- Voice: "SIGN IN TO UPLOAD" (invitation to unlock, not shame)
- Motion: None (disabled state)

**Conflicting Validation:**
If form has multiple errors, prioritize by severity:
- Primary error (blocking submission): Waratah Red, full focus
- Secondary error (warning): Gum Leaf Yellow, visible but secondary
- Hint (informational): Smoke Green, low opacity

---

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

### Data & Information Design: Scaled Expressiveness

The Kerala Rage system excels in emotional contexts but requires intentional scaling for data-heavy interfaces. **Expressiveness is calibrated to user intent**: hero moments demand 9× contrast; data tables demand 5× contrast.

#### Principle: Information Clarity is Non-Negotiable

When expressiveness conflicts with legibility, **clarity wins**. The system's power is what it _allows_, not what it _forbids_.

#### Context-Specific Contrast Ratios

| Context | Compound Contrast | Weight Range | Size Range | Use Case |
|---------|-------------------|--------------|-----------|----------|
| **Hero Section** | 9× (9 weight × 6 size) | 100–900 | 48–144px | Manifestos, landing page declarations |
| **Section Headers** | 5× (8 weight × ~3 size) | 200–700 | 32–48px | Page sections, card titles |
| **Form Labels** | 3× (4 weight × ~2 size) | 400–700 | 12–24px | Input labels, field headers |
| **Data Tables** | 2× (2 weight × ~2 size) | 400–600 | 12–16px | Row text, numerical data |
| **Metadata / Hints** | 1× (single weight) | 400 | 10–12px | Timestamps, secondary info |

**Why Scaling Matters:**
- A 9× contrast headline on a 30-row data table makes every row feel urgent—visual chaos.
- A 2× contrast table with semantic color (Waratah Red for alerts, Wattle for primary) provides clarity without loss of character.
- The system stays distinctive even at lower contrasts because of color palette + organic shapes + motion.

#### Example: Data Dashboard Pattern

```css
/* Hero stat */
.stat-hero {
  font-size: 72px;           /* Headline scale */
  font-weight: 700;          /* Extended bold */
  font-variation-settings: 'wdth' 120;
  color: var(--color-waratah-red);
  /* 5× contrast (wght 400 background → 700 foreground, size ratio) */
}

/* Dashboard row */
.table-row {
  font-size: 14px;           /* Body scale */
  font-weight: 400;          /* Regular weight */
  color: var(--color-paper-white);
  /* 1× contrast—legibility for dense content */
}

/* Alert in table */
.table-alert {
  font-weight: 500;          /* Slight emphasis, not extreme */
  color: var(--color-waratah-red);
  /* 2× contrast (base weight → +100), sufficient for scanning */
}
```

#### Example: Job Listing Card

```tsx
export const JobListingCard: React.FC<JobCardProps> = ({ title, company, match }) => {
  return (
    <div className="rounded-[20px_6px_16px_28px] bg-kr-leaf-smoke p-6 border-l-4 border-waratah-red">
      {/* Hero stat for match score */}
      <div className="text-headline-lg font-bold text-waratah-red mb-2">
        {match}% Match
      </div>

      {/* Job title—section header level contrast */}
      <h3 className="text-title-lg font-semibold text-paper-white mb-3">
        {title}
      </h3>

      {/* Company—regular body */}
      <p className="text-body-md text-paper-white mb-2">{company}</p>

      {/* Metadata—lighter weight */}
      <p className="text-body-sm font-light text-kr-leaf-smoke">
        Posted 3 days ago
      </p>
    </div>
  );
};
```

**Test for Balance:**
1. Can you scan 10 job cards in < 10 seconds? (Should be yes)
2. Do the cards still feel like Kerala Rage (organic shapes, semantic colors)? (Should be yes)
3. Is any card confusing? (Should be no)

If you answer yes/yes/no, your contrast ratios are correct.

#### Color Semantics in Data

Use the color palette semantically, not decoratively:

| Data Type | Color | Meaning | Example |
|-----------|-------|---------|---------|
| **Primary Data** | Wattle Gold | "The user's main insight" | Your ATS score: 72% |
| **Comparison/Context** | Smoke Green | "How you compare" | Average score: 65% |
| **Alert/Attention** | Waratah Red | "Action needed" | 3 keywords missing |
| **Success/Positive** | Smoke Green or Baru Gold | "Goal achieved" | ✅ Résumé optimized |
| **Background/Grid** | Charcoal Ash (very low opacity) | "Structure, not content" | Data table gridlines |

#### Anti-Patterns to Avoid

❌ **Avoid:** Using 9× contrast on a data table (overwhelming)
✅ **Instead:** 2-3× contrast, semantic color for alert states

❌ **Avoid:** Making every row a "hero moment" (visual fatigue)
✅ **Instead:** Reserve 9× for KPIs, use 3× for structure, 1× for details

❌ **Avoid:** Organic shapes on every cell (chaotic, hard to scan)
✅ **Instead:** Organic card borders (outer), regular borders (internal grids)

❌ **Avoid:** Forgetting semantic meaning in color (becomes decoration)
✅ **Instead:** "Waratah Red = Alert" is consistent across the product

---

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

## Accessibility & Inclusive Design

**Non-negotiable:** Accessibility compliance (WCAG AA minimum) takes priority over expressiveness when they conflict. The system's power comes from what it allows within accessible bounds, not from breaking accessibility rules.

### WCAG Compliance Targets

**Minimum Standard: WCAG AA**
- Text contrast: 4.5:1 (normal text), 3:1 (large text 18px+ or bold 14px+)
- All interactive elements: Keyboard accessible, focus states visible
- Motion: Respects `prefers-reduced-motion` media query
- Color: Never sole means of conveying information (always pair with text/pattern)

**Recommended: WCAG AA+** (higher standard)
- Aim for 7:1 contrast on body text where possible
- Test colorblind accessibility
- Ensure minimum touch target size (48×48px per WCAG 2.5.5)

### Color Contrast Verification (All Hex Values)

Verify these color combinations meet 4.5:1 minimum:

```
✅ Paper White (#F5F0E8) on Charcoal (#1a1a1a): 21.4:1 (AAA)
✅ Waratah Red (#F14714) on Charcoal (#1a1a1a): 8.2:1 (AA)
✅ Baru Gold (#DAF674) on Charcoal (#1a1a1a): 8.7:1 (AA)
✅ Smoke Green (#48DA8B) on Charcoal (#1a1a1a): 9.1:1 (AA)
✅ Gum Leaf Yellow (#F6E748) on Charcoal (#1a1a1a): 12.1:1 (AAA)
✅ Parrot Green (#48F0E5) on Charcoal (#1a1a1a): 10.4:1 (AAA)

❌ Waratah Red on Asphalt Black Light (#2C2925): 7.2:1 (AA, not AAA)
   → Use only for large text (18px+) or bold (14px+)

❌ Colonial colors (low opacity): Test individually
   → Ghostly Colonial (wght 100, 10% opacity) may fail contrast
   → Use only for decorative elements, never for critical text
```

Test colors: Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) or [Accessible Colors](https://accessible-colors.com/).

### Colorblind Accessibility

**Palette Verification:**
- Waratah Red & Gum Leaf Yellow: Distinguish for red/green colorblind? (Test with Colorblind app)
- Smoke Green & Parrot Green: Sufficiently distinct? (Test both)
- If distinguishing color is critical (e.g., success vs. alert), **add secondary cue** (icon, pattern, text)

**Implementation:**
```tsx
export const AlertState: React.FC<{ message: string; type: 'alert' | 'success' }> = ({ message, type }) => {
  const bgColor = type === 'alert' ? 'bg-waratah-red' : 'bg-smoke-green';
  const icon = type === 'alert' ? '⚠️' : '✅';

  return (
    <div className={`${bgColor} p-4 rounded-stone`}>
      <span className="mr-2">{icon}</span>  {/* Secondary visual cue */}
      <span className="font-semibold">{message}</span>
    </div>
  );
};
```

### Motion & Vestibular Accessibility

**Mandatory:** Respect user motion preferences.

```css
/* All animations must include this guard */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Implementation Rule:** Every animation (spring physics, flag flutter, scroll pressure) should have a fallback that's instant or near-instant when `prefers-reduced-motion` is set.

### Forced-Color Mode & High Contrast

**Windows High Contrast Mode Test:**
1. Open Windows Settings → Ease of Access → High Contrast
2. Enable "High Contrast Black" or "High Contrast White"
3. Load the site. Check:
   - Borders remain visible (organic shapes might have contrast issues)
   - Text readable
   - Interactive elements clearly marked
   - Color information not lost (error = red alone, but also error icon/label)

**If Organic Shapes Fail in Forced Colors:**
- Add solid border-outline as fallback: `outline: 2px solid currentColor`
- Preserve shape aesthetic while ensuring visibility in forced-color mode

### Typography & Low-Vision Accessibility

**Minimum Font Size:**
- 8px for metadata only (timestamps, IDs)
- 10px for label/hint text
- 12px for body text in tables
- 14px+ for primary body text and form fields

**Extreme Weights (100, 900) at Small Sizes:**
- Weight 100 at 8px: May become illegible (too thin)
  → Use only at 16px+ or for decorative non-essential text
- Weight 900 at 8px: May become a blur (too thick)
  → Use only at 14px+ or scale down to 600

**Test:** Open DevTools, set zoom to 200%, check if text remains readable.

### Screen Reader & ARIA Patterns

**Manifestos & Declarative Text:**
Slogans like "NO NEUTRAL CANVAS" are visual assertions, but screen readers will read them. Consider:

```tsx
{/*
  Visible: "WORKERS UNITE" (visual power)
  Screen reader: "Workers Unite button - submit your application"
*/}
<button
  className="text-display font-semibold text-waratah-red"
  aria-label="Workers Unite: submit your application"
>
  WORKERS UNITE
</button>
```

**Form Labels & Validation:**
All inputs must have visible, associated labels.

```tsx
<label htmlFor="resume-upload" className="font-semibold text-paper-white">
  Upload Your Resume
  <span className="text-waratah-red">*</span> {/* Required indicator */}
</label>
<input
  id="resume-upload"
  type="file"
  accept=".pdf,.doc,.docx"
  aria-required="true"
  aria-describedby="resume-hint"
/>
<p id="resume-hint" className="text-body-sm text-kr-leaf-smoke">
  PDF, DOC, DOCX only
</p>
```

### Focus States & Keyboard Navigation

All interactive elements must have visible focus indicators. The system's Wattle Gold is perfect for this:

```css
:focus-visible {
  outline: 2px solid var(--color-wattle-gold);
  outline-offset: 4px;
}

button:focus-visible,
a:focus-visible,
input:focus-visible {
  box-shadow: 0 0 0 4px rgba(212, 168, 75, 0.5);
}
```

**Tab Order:** Ensure logical tab order (left-to-right, top-to-bottom) in all forms and layouts.

### Accessibility Checklist (Pre-Launch)

- [ ] **Contrast:** All text passes WCAG AA (4.5:1) via WebAIM
- [ ] **Colorblind:** Tested Waratah Red + Gum Leaf Yellow for red/green distinction
- [ ] **Motion:** All animations respect `prefers-reduced-motion`
- [ ] **Forced Colors:** High Contrast mode tested; borders/outlines visible
- [ ] **Typography:** No weight 100 below 16px, weight 900 effective at all sizes
- [ ] **Focus:** Tab key navigates all interactive elements; focus ring visible
- [ ] **ARIA:** Form labels, error messages, buttons have accessible names
- [ ] **Screen Reader:** VoiceOver/NVDA tested; manifestos have context labels
- [ ] **Touch:** All buttons 48×48px minimum (WCAG 2.5.5)

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

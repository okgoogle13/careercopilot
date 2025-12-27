# SYSTEM_CONFIGURATION: CAREER_COPILOT

# DESIGN_SYSTEM: ELECTRIC_ALCHEMIST_v4.5

# THEME: ORGANIC_GROWTH (Plants + Tech)

# STRICT_MODE: ENABLED

## 1. THE TYPOGRAPHY MATRIX (VISUAL ENFORCEMENT)

_Do not use "Inter" or "Roboto" for everything. You must distinct styles for each Tier._

### **TIER 1 & 2: THE HERO (The "Wide" Voice)**

- **Target Vibe:** Heavy, Industrial, Expanded.
- **Visual Rule:** Use a Sans-Serif that is **Extra Bold** and **Extra Wide (Expanded)**.
- **Fallback Fonts:** If "Variable Hero" is not loaded, use **Archivo Black**, **Oswald**, or **Impact**.
- **Styling:** \* Case: **ALL CAPS**
  - Size: Massive (Display Small to Headline Medium).
  - Letter Spacing: Tight (-2%).

### **TIER 3: THE HUMAN (The "Reading" Voice)**

- **Target Vibe:** Clean, Legible, Standard.
- **Visual Rule:** Use a standard geometric sans-serif.
- **Usage:** Body copy, summaries, and user inputs.
- **Styling:** Regular weight, mixed case.

### **TIER 4: DATA & AI (The "Glitch" Voice)**

- **Target Vibe:** Technical, Code-like, Precision.
- **Visual Rule:** Use a **Monospace** or **Narrow/Condensed** font.
- **Usage:** Tags, "Active Applications" counts, timestamps, and AI labels.
- **Styling:** \* Case: **UPPERCASE**
  - Size: Small (Label Small).
  - Letter Spacing: Wide (5% / 0.05em).

## 2. COLOR PALETTE (SURFACE SYSTEM)

_Do NOT use Drop Shadows. Use these colors to create depth._

```json
{
  "surfaces": {
    "level_0_floor": "#121212" /* Deepest Background */,
    "level_1_nav": "#1E1E1E" /* Navigation Rail */,
    "level_2_card": "#2C2C2C" /* Standard Cards/Panes */,
    "level_3_hero": "#383838" /* High Emphasis / Welcome Banner */
  },
  "accents": {
    "primary_sage": "#8A9A5B" /* Success, Toggles, Plant Vibes */,
    "action_terracotta": "#E2725B" /* High Priority Buttons */,
    "text_primary": "#E3E3E3",
    "text_secondary": "#C4C7C5"
  }
}
```

## 3. LAYOUT & PHYSICS (M3 EXPRESSIVE)

- **The Container Shape:** All Cards, Panes, and the Nav Rail active state must use **28px Rounded Corners** (`rounded-3xl`).
- **The "Pane" Concept:** Do not make a dashboard of tiny widgets. Group content into **Large, Full-Width Panes** (Level 2) sitting on the Floor (Level 0).
- **Spacing:** Use `gap-8` (32px). Do not use borders between sections; use whitespace.

```json
{
  "motion": {
    "physics": "Spring-based / Heavy",
    "easing_emphasized": "cubic-bezier(0.2, 0.0, 0, 1.0)",
    "duration_pane_entry": "600ms" /* Slow, deliberate entry for big panes */,
    "duration_hover": "200ms" /* Snappy response for buttons */,
    "behavior": "Smart Animate Matching Layers"
  }
}
```

## 4. BRAND ASSETS

- **Logo:** `image_8.png` (Pink Unicorn) -> Top of Nav Rail.
- **Banner:** `plantbanner.jpg` -> Bottom of the Level 3 "Welcome Pane".

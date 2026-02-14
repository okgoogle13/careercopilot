# SYSTEM_CONFIGURATION: CAREER_COPILOT

# DESIGN_SYSTEM: ELECTRIC_ALCHEMIST_v4.5

# THEME: ORGANIC_GROWTH (Plants + Tech)

# STRICT_MODE: ENABLED

## 1. M3 EXPRESSIVE TYPOGRAPHY (The "Live" Voice)

_Philosophy: "Anti-Slop." No generic fonts. High drama. Fluid weights._

### **TIER 1: DISPLAY (The "Confident" Voice)**

- **Role:** Hero Headers, Pane Titles, Impact Statements.
- **Font Family:** **`Plus Jakarta Sans Variable`** (Google Fonts).
- **Tone Mapping:** Confident & Professional (Tech-Forward).
- **Visual Rule (Extreme Contrast):**
  - **Primary:** Ultra-Heavy (`'wght' 800`). Tight tracking (`-0.02em`).
  - **Secondary:** Ultra-Light (`'wght' 200`). Wide tracking (`+0.02em`).
- **Token:**
  ```css
  font-family: "Plus Jakarta Sans Variable", sans-serif;
  font-variation-settings: "wght" 800;
  letter-spacing: -0.02em; /* Tight for authority */
  line-height: 110%;
  ```

### **TIER 2: BODY (The "Human" Voice)**

- **Role:** Long-form text, summaries, chat responses.
- **Font Family:** **`Plus Jakarta Sans Variable`** (Google Fonts).
- **Weight Strategy:**
  - **Reading:** Regular (`'wght' 400`).
  - **Strong:** Bold (`'wght' 700`) - _Avoid semi-bold (600) to ensure 3x contrast._
- **Token:**
  ```css
  font-family: "Plus Jakarta Sans Variable", sans-serif;
  font-variation-settings: "wght" 400;
  line-height: 160%; /* High readability */
  font-size: 1rem;
  ```

### **TIER 3: DATA & GLITCH (The "Code" Voice)**

- **Role:** AI Confidence scores, Tags, Timestamps, System Labels.
- **Font Family:** **`JetBrains Mono`** (Monospace).
- **Pairing Logic:** _High Contrast Pairing (Geometric Sans + Monospace)._
- **Visual Rule:**
  - **Case:** UPPERCASE.
  - **Weight:** ExtraBold (`800`).
- **Token:**
  ```css
  font-family: "JetBrains Mono", monospace;
  font-weight: 800;
  font-size: 0.75rem; /* Label Small */
  letter-spacing: 0.05em; /* Wide tracking */
  ```

### **INTERACTION: "ALIVE" TYPOGRAPHY**

_Typography must respond to physics, not just color._

- **Hover State (The "Breath"):**
  - Do not just change color. Shift the weight.
  - **Transition:** `transition: font-variation-settings 300ms cubic-bezier(0.2, 0, 0, 1);`
  - **Action:** When hovering a card title or button, shift `wght` from **800** to **900**.
  - _Effect:_ The text feels like it is "swelling" or reacting to the cursor.

## 2. COLOR PALETTE (Surface System)

_Usage: Do not use drop shadows for depth. Use Surface Tones._

```json
{
  "theme": "Organic_Growth",
  "surfaces": {
    "surface_dim": "#121212" /* The Floor (Background) */,
    "surface_container_low": "#1E1E1E" /* Navigation Rail */,
    "surface_container": "#2C2C2C" /* Main Content Panes */,
    "surface_container_high": "#383838" /* Modals / Floating Actions */,
    "surface_bright": "#444444" /* Hover States */
  },
  "content": {
    "primary_sage": "#8A9A5B" /* Active States, Success, "Growth" */,
    "action_terracotta": "#E2725B" /* CTAs, Alerts, High Priority */,
    "on_surface": "#E3E3E3" /* Primary Text */,
    "on_surface_variant": "#C4C7C5" /* Secondary Text */,
    "outline": "#444746" /* Borders (Use sparingly) */
  }
}
```

## 3. LAYOUT & PHYSICS (Container Transform)

- **Shape Scale:**
  - **28px (`rounded-3xl`):** All Level 2 Panes (Soft/[DEPRECATED_STYLE]).
  - **12px (`rounded-xl`):** Inner data cards (Functional).
  - **999px (Pill):** All Buttons and Tier 3 Tags (M3 Standard).
- **Motion Choreography:**
  - **Entrance:** Elements must **stagger**. Pane enters at 0ms. Text enters at 100ms. Buttons enter at 200ms.
  - **Curve:** `cubic-bezier(0.2, 0.0, 0, 1.0)` (Heavy Spring).
  - **Container Transform:** Cards do not just appear; they morph from their list state to their detail state.

## 4. BRAND ASSETS

- **Logo:** `image_8.png` (Pink Unicorn) -> Fixed at Top of Nav Rail.
- **Contextual Imagery:** `plantbanner.jpg` -> Used as a header mask in the "Welcome Pane" (Level 3 Surface).

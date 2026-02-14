# STYLE_GUIDE.md

**Project:** CareerCopilot ("Geologic Pop")
**Version:** 5.0
**Maintainer:** Brand Strategy Lead
**Objective:** Translate the "Excavation" metaphor into strict engineering constraints.

---

## 01. Tailwind Configuration Strategy

We do not use standard colors. We simulate a subterranean environment. All UI surfaces must be derived from the `bedrock` or `stone` scales.

### `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        // THE SUBTERRANEAN VOID
        bedrock: "#121110", // Global Background (Warm Black)

        // SURFACE MATERIAL
        stone: {
          DEFAULT: "#2D2A27", // Surface Cards (Warm Grey)
          light: "#3E3B38", // Hover states
        },

        // BIOLUMINESCENCE (Primary Accent)
        magma: {
          DEFAULT: "#FF9E7D", // Soft Coral/Orange
          dim: "#A65D45", // Muted state
          glow: "#FFB098", // Hover/Active state
        },

        // LIGHT SOURCE
        crystal: "#E2D4FF", // Primary Text (Pale Lavender/White substitute)
        fossil: "#9C9A96", // Secondary Text (Muted Grey)
      },
      fontFamily: {
        // THE "POLY-VOICE" SYSTEM
        // Use Serif for "Archaeologist" headlines, Sans for UI utility
        serif: ["Newsreader", "Merriweather", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        // Marketing Pattern: "The Sediment Stack"
        strata: "repeating-linear-gradient(0deg, #121110 0px, #121110 20px, #2D2A27 20px, #2D2A27 21px, #121110 21px, #121110 40px, #2D2A27 40px, #2D2A27 44px)",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 02. The "Geologic" Component Library

We explicitly forbid "floating" elements (`box-shadow` drop shadows). Depth is achieved through **Lighting (borders)** and **Density (inset shadows)**.

### A. The Stone Card (Chiseled UI)

This card represents an object embedded in the rock wall, not floating above it.

```tsx
// Component: <StoneCard />
// The top border (white/10) creates the "Rim Light" effect.
// The inset shadow creates density/mass.

export const StoneCard = ({ children }) => (
  <div
    className="
    bg-stone 
    rounded-lg 
    border-t border-white/10 
    border-x border-white/5 
    border-b border-black/40
    shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]
    p-6
  "
  >
    {children}
  </div>
);
```

### B. The Magma Button (Energy Source)

The button mimics a hot coal or bioluminescent pebble. High contrast is non-negotiable.

```tsx
// Component: <MagmaButton />
// Text must be BEDROCK (#121110) to contrast against the orange.
// No border radius corners; use 'rounded-full' for [DEPRECATED_STYLE] pebble shape.

export const MagmaButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="
      bg-magma 
      text-bedrock 
      font-sans 
      font-bold 
      tracking-wide
      px-8 py-3 
      rounded-full 
      hover:bg-magma-glow 
      hover:shadow-[0_0_20px_rgba(255,158,125,0.4)] 
      transition-all 
      duration-300
      active:scale-95
    "
  >
    {label}
  </button>
);
```

### C. The Strata Background (Utility)

Use this wrapper for marketing sections to create the "sediment layer" effect.

```tsx
// Usage: <div className="bg-strata w-full h-screen">...</div>
// Note: Defined in tailwind.config.ts under 'backgroundImage'
```

---

## 03. Motion Physics (Framer Motion)

**Rule:** Objects in our world are heavy. They do not "pop" or "bounce" like lightweight SaaS tools. They **heave** and **crystallize**.

### The `excavationVar` Object

```javascript
import { Variants } from "framer-motion";

export const excavationVar: Variants = {
  hidden: {
    y: 20,      // Start slightly "buried" in the earth
    opacity: 0,
    scale: 0.98 // Compressed by pressure
  },
  visible: {
    y: 0,       // Rise to surface level
    opacity: 1,
    scale: 1,
    transition: {
      // Heavy Physics
      type: "spring",
      stiffness: 70, // Low stiffness = heavy object
      damping: 15,   // Moderate friction = no bounce
      mass: 1.2
    }
  },
  exit: {
    y: 10,
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Usage: <motion.div variants={excavationVar} initial="hidden" animate="visible" ... />
```

---

## 04. Voice & Copy Dictionary

The "Archaeologist" persona must be enforced in all UI micro-copy. Do not use generic "System" language.

| Standard Copy          | **Geologic Pop / Archaeologist Rewrite** | Logic                                    |
| :--------------------- | :--------------------------------------- | :--------------------------------------- |
| **"Loading..."**       | `Extracting...` or `Drilling...`         | We are actively digging for data.        |
| **"Search"**           | `Survey` or `Scan Bedrock`               | Search is passive; Survey is scientific. |
| **"No results found"** | `No artifacts detected in this strata.`  | It's not an error; it's an empty layer.  |
| **"404 Error"**        | `Dead End / Bedrock Reached`             | Hits the visual of a cave wall.          |
| **"Success!"**         | `Artifact Secured`                       | Validates the value of the find.         |
| **"Job Description"**  | `Fossil Record`                          | Past data about the role.                |
| **"Apply Now"**        | `Initiate Contact`                       | More grounded/tactical.                  |
| **"Settings"**         | `Calibration`                            | Tools are precise instruments.           |

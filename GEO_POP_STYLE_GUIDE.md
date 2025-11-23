# GEO_POP_STYLE_GUIDE.md

**Project:** CareerCopilot ("Gem Hunter")
**Version:** 6.0
**Maintainer:** Brand Strategy Lead
**Objective:** Translate "Gem Hunter" physics into code.

---

## 01. Tailwind Configuration Strategy

We retain the dark foundation but soften the taxonomy. "Magma" becomes "Coral" (visually similar, emotionally different).

### `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        // THE CAVE (Unchanged Foundation)
        bedrock: "#121110", // Global Background (Warm Black)

        // THE RIVER STONES (Smoother surfacing)
        stone: {
          DEFAULT: "#2D2A27", // Surface Cards
          polished: "#3E3B38", // Hover states (Lighter/Smoother)
        },

        // THE GEM (Primary Accent)
        // Renamed from 'magma' to 'coral' to reflect the playful vibe
        coral: {
          DEFAULT: "#FF9E7D", // Living Coral
          vivid: "#FFB098",   // High gloss state
          glow: "rgba(255, 158, 125, 0.5)", // For box-shadows
        },

        // THE HUD
        crystal: "#E2D4FF", // Primary Text
        shale: "#9C9A96",   // Secondary Text
      },
      borderRadius: {
        // THE RIVER STONE SHAPE
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem', // Default card radius
        '4xl': '2.5rem',
      },
      boxShadow: {
        // Soft, diffuse glows instead of hard shadows
        'gem-glow': '0 0 25px -5px rgba(255, 158, 125, 0.4)',
        'inner-light': 'inset 0 2px 0 0 rgba(255,255,255,0.1)',
      }
    },
  },
  plugins: [],
};

export default config;
```

---

## 02. The "Gem Hunter" Component Library

We move from "Chiseled/Inset" to "Bubble/Extruded."

### A. The River Stone Card (Container)
Instead of a jagged rock, this is a smooth, tumbled stone.

```tsx
// Component: <RiverStone />
// Uses rounded-3xl for that friendly "squircle" feel.
// The border is barely visible, just a hint of light.

export const RiverStone = ({ children }) => (
  <div className="
    bg-stone 
    rounded-3xl 
    border border-white/5 
    shadow-inner-light
    p-8
    transition-transform duration-300
    hover:scale-[1.01]
  ">
    {children}
  </div>
);
```

### B. The Gem Button (Primary Action)
A high-gloss, gummy interface element. It should feel like pressing a candy button.

```tsx
// Component: <GemButton />
// High stiffness spring physics on click (scale-95).
// High contrast text (Bedrock on Coral).

export const GemButton = ({ label, onClick }) => (
  <button 
    onClick={onClick}
    className="
      relative
      overflow-hidden
      bg-coral 
      text-bedrock 
      font-sans 
      font-black 
      tracking-tight
      px-10 py-4 
      rounded-full 
      shadow-gem-glow
      transform
      transition-all
      hover:bg-coral-vivid
      hover:-translate-y-1
      active:scale-95
      active:translate-y-0
    "
  >
    {/* Gloss Reflection Overlay */}
    <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-full pointer-events-none" />
    <span className="relative z-10">{label}</span>
  </button>
);
```

---

## 03. Motion Physics (Framer Motion)

**Rule:** Objects are **bouncy**. They are not heavy rocks; they are loot popping out of a chest.

### The `gemBounceVar` Object

```javascript
import { Variants } from "framer-motion";

export const gemBounceVar: Variants = {
  hidden: { 
    y: 50, 
    opacity: 0,
    scale: 0.5 // Starts small
  },
  visible: { 
    y: 0, 
    opacity: 1,
    scale: 1,
    transition: {
      // Toy Physics
      type: "spring",
      stiffness: 300, // High stiffness = snappy
      damping: 15,    // Low damping = bouncy/wobbly
      mass: 1
    }
  },
  tap: {
    scale: 0.9,
    rotate: -3
  }
};

// Usage: <motion.div variants={gemBounceVar} whileTap="tap" ... />
```

---

## 04. UI Micro-Copy Dictionary (The Expedition Guide)

| Standard Copy | **Gem Hunter Rewrite** | Logic |
| :--- | :--- | :--- |
| **"Loading..."** | `Polishing Gems...` | Adds a sense of value to the wait time. |
| **"Search"** | `Scout` or `Shine Light` | Active exploration verbs. |
| **"No results"** | `This cave is empty.` | It's not a system failure, just an empty room. |
| **"Error"** | `Bonk!` | Playful, low-stakes failure message. |
| **"Profile"** | `Inventory` | Treats skills/history like collected items. |
| **"Salary"** | `Loot Value` | Gamifies the reward. |
| **"Filters"** | `Sifting Tools` | Keeps the geology metaphor but lighter. |
# M3 Atmospheric Backgrounds

**Purpose:** Create depth and atmosphere through layered gradients, geometric patterns, and contextual effects (not flat, solid colors).

**Input:** Component file path + color tokens + atmospheric preferences
**Output:** Layered background system with CSS gradients, patterns, and depth effects

---

## Overview

This skill implements M3 Expressive background principles:

1. **Layered Gradients** - Multi-stop gradients for depth (not single solid colors)
2. **Geometric Patterns** - Subtle textures and patterns for visual interest
3. **Contextual Effects** - Backgrounds that match the overall aesthetic
4. **Depth & Atmosphere** - Create environment, not just fill space
5. **Performance** - CSS-only solutions (no heavy images)

---

## M3 Expressive Background Principles

### 1. Layered Gradients (Not Flat Solids)

**Anti-Pattern (Boring, Flat):**
```css
/* ❌ Solid color - no depth */
.page-background {
  background-color: #FFFFFF;
}
```

**M3 Expressive (Layered Depth):**
```css
/* ✅ Multi-layer gradient - atmospheric */
.page-background {
  background:
    /* Layer 1: Subtle radial gradient (top-left glow) */
    radial-gradient(
      circle at 20% 20%,
      rgba(var(--sys-color-primary-rgb), 0.08) 0%,
      transparent 50%
    ),
    /* Layer 2: Diagonal gradient (depth) */
    linear-gradient(
      135deg,
      rgba(var(--sys-color-secondary-rgb), 0.03) 0%,
      transparent 50%,
      rgba(var(--sys-color-tertiary-rgb), 0.05) 100%
    ),
    /* Layer 3: Base color */
    var(--sys-color-surface);
}
```

**Gradient Complexity Levels:**

| Level | Layers | Opacity | Use Case |
|-------|--------|---------|----------|
| Subtle | 2 | 0.03-0.05 | Business apps, SaaS platforms |
| Moderate | 3-4 | 0.05-0.10 | Creative tools, social apps |
| Bold | 5+ | 0.10-0.20 | Marketing sites, landing pages |

---

### 2. Geometric Patterns (Visual Texture)

**Grid Pattern (Subtle Tech Aesthetic):**
```css
.background-grid {
  background-color: var(--sys-color-surface);
  background-image:
    /* Vertical lines */
    linear-gradient(
      90deg,
      rgba(var(--sys-color-on-surface-rgb), 0.02) 1px,
      transparent 1px
    ),
    /* Horizontal lines */
    linear-gradient(
      0deg,
      rgba(var(--sys-color-on-surface-rgb), 0.02) 1px,
      transparent 1px
    );
  background-size: 40px 40px;
}
```

**Dot Pattern (Playful, Textured):**
```css
.background-dots {
  background-color: var(--sys-color-surface);
  background-image: radial-gradient(
    circle,
    rgba(var(--sys-color-primary-rgb), 0.08) 1px,
    transparent 1px
  );
  background-size: 24px 24px;
}
```

**Diagonal Stripes (Dynamic, Energetic):**
```css
.background-stripes {
  background:
    repeating-linear-gradient(
      45deg,
      var(--sys-color-surface) 0px,
      var(--sys-color-surface) 20px,
      rgba(var(--sys-color-primary-rgb), 0.02) 20px,
      rgba(var(--sys-color-primary-rgb), 0.02) 40px
    );
}
```

**Organic Blob (Soft, Premium):**
```css
.background-organic {
  background:
    /* Blob 1: Top-right */
    radial-gradient(
      ellipse 800px 600px at 80% 10%,
      rgba(var(--sys-color-primary-rgb), 0.10),
      transparent
    ),
    /* Blob 2: Bottom-left */
    radial-gradient(
      ellipse 600px 800px at 20% 90%,
      rgba(var(--sys-color-secondary-rgb), 0.08),
      transparent
    ),
    /* Base */
    var(--sys-color-surface);
}
```

---

### 3. Contextual Effects (Match Aesthetic)

#### Playful & Energetic (Social Apps)
```css
.background-playful {
  background:
    /* Bold gradient overlay */
    linear-gradient(
      135deg,
      rgba(233, 30, 99, 0.15) 0%,   /* Magenta */
      rgba(0, 188, 212, 0.15) 100%  /* Cyan */
    ),
    /* Dot pattern */
    radial-gradient(
      circle,
      rgba(205, 220, 57, 0.10) 2px, /* Lime */
      transparent 2px
    ),
    /* Base */
    #FFFFFF;
  background-size: auto, 32px 32px;
}
```

#### Confident & Professional (SaaS Platforms)
```css
.background-professional {
  background:
    /* Subtle radial glow (top-left) */
    radial-gradient(
      circle at 15% 15%,
      rgba(0, 137, 123, 0.06) 0%,   /* Teal */
      transparent 40%
    ),
    /* Fine grid pattern */
    linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.015) 1px,
      transparent 1px
    ),
    linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.015) 1px,
      transparent 1px
    ),
    /* Base */
    #FAFAFA;
  background-size: auto, 48px 48px, 48px 48px;
}
```

#### Elegant & Premium (Lifestyle Brands)
```css
.background-elegant {
  background:
    /* Soft organic blobs */
    radial-gradient(
      ellipse 1000px 800px at 70% 20%,
      rgba(159, 168, 218, 0.08) 0%,  /* Lavender */
      transparent 60%
    ),
    radial-gradient(
      ellipse 800px 1000px at 30% 80%,
      rgba(255, 112, 67, 0.06) 0%,   /* Orange */
      transparent 60%
    ),
    /* Subtle texture */
    repeating-linear-gradient(
      0deg,
      transparent 0px,
      rgba(0, 0, 0, 0.01) 1px,
      transparent 2px
    ),
    /* Base */
    #FDFBFF;
}
```

---

### 4. Depth & Atmosphere (Layered Surfaces)

**Hero Section (Dramatic Depth):**
```css
.hero-background {
  position: relative;
  background:
    /* Layer 1: Top glow */
    radial-gradient(
      ellipse 1200px 600px at 50% 0%,
      rgba(var(--sys-color-primary-rgb), 0.12),
      transparent 60%
    ),
    /* Layer 2: Diagonal sweep */
    linear-gradient(
      120deg,
      rgba(var(--sys-color-secondary-rgb), 0.08) 0%,
      transparent 40%,
      rgba(var(--sys-color-tertiary-rgb), 0.10) 100%
    ),
    /* Layer 3: Grid pattern */
    linear-gradient(
      90deg,
      rgba(var(--sys-color-on-surface-rgb), 0.02) 1px,
      transparent 1px
    ),
    linear-gradient(
      0deg,
      rgba(var(--sys-color-on-surface-rgb), 0.02) 1px,
      transparent 1px
    ),
    /* Base */
    var(--sys-color-surface);
  background-size: auto, auto, 64px 64px, 64px 64px;
}

/* Optional: Animated gradient shift */
.hero-background::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(var(--sys-color-primary-rgb), 0.08),
    transparent 40%
  );
  opacity: 0;
  transition: opacity 600ms var(--sys-motion-easing-expressive);
  pointer-events: none;
}

.hero-background:hover::before {
  opacity: 1;
}
```

**Card Backgrounds (Subtle Elevation):**
```css
.card-elevated {
  background:
    /* Subtle gradient for depth */
    linear-gradient(
      135deg,
      rgba(var(--sys-color-surface-bright-rgb), 1) 0%,
      rgba(var(--sys-color-surface-rgb), 1) 100%
    );
  box-shadow: var(--sys-elevation-level2);
}

.card-elevated:hover {
  background:
    /* Brighter gradient on hover */
    linear-gradient(
      135deg,
      rgba(var(--sys-color-surface-bright-rgb), 1) 0%,
      rgba(var(--sys-color-surface-container-high-rgb), 1) 100%
    );
  box-shadow: var(--sys-elevation-level3);
  transition:
    background 300ms var(--sys-motion-easing-expressive),
    box-shadow 300ms var(--sys-motion-easing-expressive);
}
```

---

### 5. Performance Optimization (CSS-Only)

**Anti-Pattern (Heavy Images):**
```css
/* ❌ Requires HTTP request, large file size */
.background {
  background-image: url('/images/background-texture.png');
}
```

**M3 Expressive (Pure CSS):**
```css
/* ✅ No HTTP request, lightweight */
.background {
  background:
    radial-gradient(circle, rgba(0, 137, 123, 0.08), transparent),
    linear-gradient(135deg, rgba(255, 111, 97, 0.05), transparent);
}
```

**GPU Acceleration for Animations:**
```css
.animated-background {
  /* Use transform/opacity for GPU acceleration */
  background: var(--sys-color-surface);
  position: relative;
}

.animated-background::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(var(--sys-color-primary-rgb), 0.10),
    transparent 60%
  );
  transform: scale(1); /* GPU-accelerated property */
  opacity: 0.5; /* GPU-accelerated property */
  animation: pulse 4s ease-in-out infinite;
  will-change: transform, opacity; /* Hint for browser optimization */
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}
```

---

## Background Pattern Library

### Pattern 1: Mesh Gradient (Modern, Vibrant)

```css
.mesh-gradient {
  background:
    radial-gradient(at 20% 30%, rgba(var(--sys-color-primary-rgb), 0.15), transparent 50%),
    radial-gradient(at 80% 20%, rgba(var(--sys-color-secondary-rgb), 0.12), transparent 50%),
    radial-gradient(at 60% 70%, rgba(var(--sys-color-tertiary-rgb), 0.10), transparent 50%),
    radial-gradient(at 30% 80%, rgba(var(--sys-color-primary-rgb), 0.08), transparent 50%),
    var(--sys-color-surface);
}
```

### Pattern 2: Noise Texture (Subtle Grain)

```css
.noise-texture {
  background-color: var(--sys-color-surface);
  position: relative;
}

.noise-texture::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  opacity: 0.5;
  pointer-events: none;
}
```

### Pattern 3: Isometric Grid (Tech Aesthetic)

```css
.isometric-grid {
  background-color: var(--sys-color-surface);
  background-image:
    /* Diagonal lines (60deg) */
    repeating-linear-gradient(
      60deg,
      transparent 0px,
      rgba(var(--sys-color-primary-rgb), 0.02) 1px,
      transparent 2px,
      transparent 40px
    ),
    /* Diagonal lines (-60deg) */
    repeating-linear-gradient(
      -60deg,
      transparent 0px,
      rgba(var(--sys-color-primary-rgb), 0.02) 1px,
      transparent 2px,
      transparent 40px
    );
}
```

### Pattern 4: Aurora Effect (Premium, Luxe)

```css
.aurora-effect {
  background:
    /* Aurora wave 1 */
    linear-gradient(
      110deg,
      transparent 0%,
      rgba(var(--sys-color-primary-rgb), 0.12) 30%,
      rgba(var(--sys-color-secondary-rgb), 0.10) 50%,
      rgba(var(--sys-color-tertiary-rgb), 0.08) 70%,
      transparent 100%
    ),
    /* Aurora wave 2 (offset) */
    linear-gradient(
      70deg,
      transparent 0%,
      rgba(var(--sys-color-tertiary-rgb), 0.08) 20%,
      rgba(var(--sys-color-primary-rgb), 0.10) 40%,
      transparent 60%
    ),
    /* Base */
    var(--sys-color-surface);
  background-size: 200% 200%;
  animation: aurora-shift 10s ease-in-out infinite;
}

@keyframes aurora-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
```

---

## Atmospheric Background Schema

```json
{
  "backgrounds": {
    "expressive": {
      "pageBackground": {
        "type": "layered-gradient",
        "layers": [
          {
            "type": "radial-gradient",
            "position": "20% 20%",
            "color": "rgba(var(--sys-color-primary-rgb), 0.08)",
            "falloff": "50%"
          },
          {
            "type": "linear-gradient",
            "angle": "135deg",
            "stops": [
              { "color": "rgba(var(--sys-color-secondary-rgb), 0.03)", "position": "0%" },
              { "color": "transparent", "position": "50%" },
              { "color": "rgba(var(--sys-color-tertiary-rgb), 0.05)", "position": "100%" }
            ]
          },
          {
            "type": "base-color",
            "color": "var(--sys-color-surface)"
          }
        ]
      },
      "patterns": {
        "grid": {
          "type": "repeating-linear-gradient",
          "orientation": "both",
          "lineColor": "rgba(var(--sys-color-on-surface-rgb), 0.02)",
          "spacing": "40px"
        },
        "dots": {
          "type": "radial-gradient",
          "dotColor": "rgba(var(--sys-color-primary-rgb), 0.08)",
          "dotSize": "1px",
          "spacing": "24px"
        }
      },
      "atmosphere": "professional", // or "playful", "elegant"
      "complexity": "moderate", // or "subtle", "bold"
      "cssOnly": true,
      "performanceOptimized": true
    }
  }
}
```

---

## Usage

**Standalone Skill:**
```bash
# Generate atmospheric background for component
m3-atmospheric-backgrounds \
  --file frontend/src/pages/Dashboard.tsx \
  --atmosphere "professional" \
  --complexity "moderate" \
  --pattern "grid"
```

**Within Design Systems Architect:**
```javascript
const atmosphericBg = await runSkill('m3-atmospheric-backgrounds', {
  aestheticPreferences: {
    style: 'confident-professional',
    colorPalette: { primary: '#00897B', secondary: '#FF6F61' }
  },
  complexity: 'moderate'
});
```

---

## Validation Checklist

- [ ] No flat, solid background colors (use layered gradients)
- [ ] At least 2 layers for depth (gradient + pattern or gradient + gradient)
- [ ] Opacity values ≤ 0.20 (subtle, not overpowering)
- [ ] CSS-only solutions (no background images unless necessary)
- [ ] GPU-accelerated properties for animations (transform, opacity)
- [ ] Pattern spacing appropriate for context (24-64px for grids/dots)
- [ ] Contextual effect matches aesthetic preference (playful, professional, elegant)
- [ ] `will-change` used sparingly for animated backgrounds only

---

**Created:** 2025-01-18
**Version:** 1.0.0
**Status:** Production Ready
**Aligned with:** M3 Expressive Background Principles (layered, atmospheric, contextual, performant)

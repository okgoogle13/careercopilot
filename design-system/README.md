# CareerCopilot Design System 2.0

## Authentic Intelligence Theme (Expressive Cyber-Pop)

This directory contains the **Authentic Intelligence** design system - a comprehensive token-based design language that combines Material 3 principles with expressive, AI-focused aesthetics.

---

## 📁 Directory Structure

```
design-system/
├── tokens.json                          # Complete design tokens (colors, typography, shape, motion)
├── README.md                            # This file
└── (generated files from build scripts)
```

---

## 🎨 Theme Overview

**Theme Name:** Authentic Intelligence
**Style:** Expressive Cyber-Pop
**Philosophy:** Deep space backgrounds, breathing typography, asymmetric AI shapes

### Core Principles

1. **Emotive & Fluid** - Typography that "breathes" on hover using variable font axes
2. **Depth-Aware** - Tinted violet neutrals (#16131E background) creating "deep space"
3. **Humanist AI** - Distinct visual language for AI content vs. system UI
4. **Pop & Unexpected** - Cyber-pop colors (Purple, Mint, Pink) for accents

---

## 🎯 Key Features

### 1. Typography Triad System

Three font families for distinct purposes:

| Font | Role | Usage |
|------|------|-------|
| **Roboto Flex** | Structure | UI elements, navigation, labels, data |
| **Roboto Serif** | Content | AI responses, resumes, cover letters |
| **Syne** | Magic | AI insight headers, breakthrough moments |

**Expressive Feature:** Roboto Flex uses variable font axes (`wdth`, `GRAD`) to create "breathing" text on hover.

### 2. Color System (Material 3 Dark)

**Core Colors:**
- Primary: `#C4BFFF` (Soft Electric Purple)
- Secondary: `#56DBBE` (Mint)
- Tertiary: `#FFAEDC` (Bubblegum Pink)

**Background:**
- Deep Space: `#16131E` (Tinted Violet - not pure black!)

**Surface Containers:**
- Lowest: `#0F0D13`
- Low: `#1D1B22`
- Default: `#211F26`
- High: `#2B2930`
- Highest: `#36343B`

### 3. Shape System

| Token | Value | Usage |
|-------|-------|-------|
| `shape-md` | 12px | Inputs, chips |
| `shape-lg` | 24px | Standard cards |
| `shape-ai` | 28px 28px 4px 28px | AI chat bubbles (asymmetric) |
| `shape-magic` | polygon(...) | Starburst badges |

**Special:** The `shape-ai` asymmetric radius (sharp bottom-right corner) visually differentiates AI content.

### 4. Motion System

| Token | Easing | Duration | Usage |
|-------|--------|----------|-------|
| `emphasized` | cubic-bezier(0.2, 0, 0, 1) | 400ms | Liquid physics |
| `standard` | cubic-bezier(0.4, 0, 0.2, 1) | 300ms | Standard transitions |
| `decelerated` | cubic-bezier(0, 0, 0.2, 1) | 250ms | Enter animations |
| `accelerated` | cubic-bezier(0.4, 0, 1, 1) | 200ms | Exit animations |

---

## 🔧 Usage

### Using Design Tokens

The `tokens.json` file is the source of truth for all design decisions.

**Build CSS from Tokens:**
```bash
# Generate CSS custom properties
./scripts/update-design-system.sh
```

This creates:
- `frontend/src/styles/authentic-intelligence-theme.css` - CSS variables
- (Optional) Tailwind config patches

### Using in React Components

**1. Import the theme CSS:**
```tsx
// In your App.tsx or main entry point
import './styles/authentic-intelligence-theme.css';
```

**2. Use CSS variables:**
```tsx
<div style={{
  backgroundColor: 'var(--color-surface-container-high)',
  color: 'var(--color-on-surface)',
  borderRadius: 'var(--shape-lg)',
  padding: 'var(--spacing-lg)'
}}>
  Content
</div>
```

**3. Use utility classes:**
```tsx
<div className="intelligence-card">
  <h2 className="font-magic">AI Insight</h2>
  <p className="font-content">Human-readable content</p>
</div>
```

### Expressive Components

#### Intelligence Card (AI Content)

```tsx
<div className="intelligence-card">
  <h4 className="card-title">AI Generated Insight</h4>
  <p className="card-body">
    This card has an asymmetric shape and gradient border
    to visually signal AI-generated content.
  </p>
</div>
```

Features:
- Asymmetric border radius (`shape-ai`)
- Purple-to-Pink gradient border
- Uses "Magic" font (Syne) for title
- Uses "Content" font (Roboto Serif) for body

#### Breathing Typography

```tsx
<h1 className="breathing-text">
  Hover over me to see the type "breathe"
</h1>
```

The text expands (`wdth`: 110 → 120) and gets heavier (`GRAD`: 0 → 50) on hover.

---

## 📊 Token Structure

### Colors

```json
{
  "colors": {
    "core": { "primary", "secondary", "tertiary" },
    "schemes": {
      "dark": {
        "primary", "onPrimary", "primaryContainer", ...
        "surface", "surfaceContainer", "surfaceContainerHigh", ...
      }
    },
    "palettes": {
      "primary": { "0", "10", "20", ..., "100" },
      "secondary": { ... },
      "tertiary": { ... }
    }
  }
}
```

### Typography

```json
{
  "typography": {
    "fonts": {
      "structure": { "family", "role", "axes" },
      "content": { "family", "role" },
      "magic": { "family", "role" }
    },
    "scale": {
      "structureDisplay": { "fontSize", "fontWeight", ... },
      "contentBody": { ... },
      "magicHero": { ... }
    }
  }
}
```

### Shape, Spacing, Motion, Elevation

```json
{
  "shape": { "md", "lg", "ai", "magic" },
  "spacing": { "xs", "sm", "md", ..., "3xl" },
  "motion": { "emphasized", "standard", "decelerated", "accelerated" },
  "elevation": { "shadow": { "level0", ..., "level5" } }
}
```

---

## 🛠️ Development Workflow

### 1. Modify Design Tokens

Edit `design-system/tokens.json` to update colors, typography, etc.

### 2. Validate Tokens

```bash
python3 scripts/validate-design-tokens.py
```

Checks:
- JSON schema validity
- WCAG color contrast compliance
- Required token presence

### 3. Build Design Assets

```bash
./scripts/update-design-system.sh
```

Generates:
- CSS custom properties (`:root` variables)
- Tailwind config patches (optional)
- Design token documentation

### 4. Import in Application

```tsx
// frontend/src/App.tsx
import './styles/authentic-intelligence-theme.css';
```

---

## 🎨 Design Principles

### When to Use Each Font

| Scenario | Font Family | Rationale |
|----------|-------------|-----------|
| Navigation menus | Roboto Flex (Structure) | Efficient, scannable |
| Button labels | Roboto Flex (Structure) | Clear, actionable |
| Resume content | Roboto Serif (Content) | Professional, readable |
| AI chat responses | Roboto Serif (Content) | Warm, human-like |
| "Perfect match!" alerts | Syne (Magic) | Celebratory, attention-grabbing |
| Feature announcements | Syne (Magic) | Bold, memorable |

### When to Use Asymmetric Shapes

Use `shape-ai` (asymmetric radius) for:
- AI chat bubbles
- AI-generated content cards
- AI insight panels
- Smart suggestions

**Why?** The sharp corner "points" to the origin (user or AI), creating a visual conversation.

### When to Use Gradient Borders

Apply `.intelligence-card` class for:
- AI analysis results
- Confidence scores
- Smart recommendations
- Machine learning outputs

**Why?** The purple-to-pink gradient signals "This content was created by AI intelligence."

---

## 🔍 WCAG Compliance

All color combinations meet **WCAG AA** standards:

| Foreground | Background | Contrast Ratio | Grade |
|------------|------------|----------------|-------|
| `onPrimary` | `primary` | 4.9:1 | AA ✅ |
| `onSurface` | `surface` | 13.2:1 | AAA ✅ |
| `onSecondary` | `secondary` | 7.1:1 | AAA ✅ |

Run validation:
```bash
python3 scripts/validate-design-tokens.py --wcag
```

---

## 📚 Resources

### Design Files
- **Tokens:** `design-system/tokens.json`
- **CSS:** `frontend/src/styles/authentic-intelligence-theme.css`
- **Visual Test:** `claude-artifact-runner/outputs/artifact.html`

### Scripts
- **Validate:** `scripts/validate-design-tokens.py`
- **Build:** `scripts/build-design-tokens.py`
- **Update:** `scripts/update-design-system.sh`

### Documentation
- **Design Brief:** `/design-brief.md` (original specification)
- **CLAUDE.md:** Design system commands and workflows

---

## 🚀 Quick Start

```bash
# 1. Validate tokens
python3 scripts/validate-design-tokens.py

# 2. Build CSS
./scripts/update-design-system.sh

# 3. Preview in browser
open claude-artifact-runner/outputs/artifact.html

# 4. Import in app
# Add to frontend/src/App.tsx:
# import './styles/authentic-intelligence-theme.css';
```

---

## 🎯 Version History

- **v2.0.0** (Current) - Authentic Intelligence theme
  - Typography Triad system (Roboto Flex, Roboto Serif, Syne)
  - Deep space tinted backgrounds
  - Asymmetric AI shapes
  - Breathing typography with variable fonts
  - Cyber-pop color palette

- **v1.0.0** - Original Material-UI theme
  - Standard MUI dark mode
  - Google Sans typography
  - Glass morphism effects

---

## 📞 Support

For questions about the design system:
- See `CLAUDE.md` for detailed commands
- Check `docs/DESIGN_SYSTEM.md` for Material 3 guidelines
- Review `scripts/validate-design-tokens.py` for token requirements

---

**Theme:** Authentic Intelligence
**Version:** 2.0.0
**Last Updated:** 2025-11-17
**Status:** ✅ Production Ready

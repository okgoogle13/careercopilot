# ⚡ Design System Sidekick Quick Reference

Use this server to **bridge creative direction with programmatic validation** for the **Kerala Rage — Solidarity Mode** design system.

## 🛑 WHEN TO USE

- 🎨 **Asset Auditing**: Checking if a generated image matches Kerala Rage compliance standards.
- 📦 **Implementation**: Generating CSS/React code for a validated asset.
- ✅ **Compliance**: Ensuring typography, color, cultural safety, and antiSlopProtocol rules are met.

## 🛠️ AVAILABLE TOOLS

### 1. 👁️ `validate_asset_compliance` (Visual Audit)

**Use for:** Checking generated images against Kerala Rage design system rules.
**Cost:** High (Vision API) - Use strategically.

**Example Prompt:**

> "Audit this generated solidarity poster for Kerala Rage compliance."

**What it does:**

- Analyzes image using Gemini Vision (with GitHub Models fallback).
- Checks against **antiSlopProtocol**:
  - 🎨 **Palette**: Solidarity Red (#F14714), Charcoal (#1A1A1A), Worker Ash (#DAF6B3)
  - 🚫 **Banned Elements**: Crowns, perfect circles, bureaucratic aesthetics, Aboriginal art imitation
  - 🌑 **Dark Mode**: Must use charcoal backgrounds (no white/light backgrounds)
  - 🔤 **Typography**: Variable fonts with extreme contrast (9× weight ratio, 6× size ratio)
  - 🏛️ **Cultural Safety**: First Nations solidarity in-situ only (placards/posters)
  - 🎭 **Aesthetic Modes**: Screenprint, wheat-paste, or technical (NOT gallery/laboratory)

**Returns:**
```json
{
  "compliance": boolean,
  "score": 0-100,
  "issues": ["list of violations"],
  "banned_violations": ["specific banned items found"],
  "missing_requirements": ["required items not found"],
  "color_palette_match": boolean,
  "typography_compliance": boolean,
  "cultural_safety": boolean
}
```

---

### 2. 📦 `generate_implementation_package` (Code Gen)

**Use for:** Creating the code to use an asset in the frontend.
**Cost:** Medium (Text Generation).

**Example Prompt:**

> "Create the React component and CSS for this validated solidarity poster background."

**What it does:**

- Generates:
  - `{ComponentName}.tsx` (React Component with TypeScript)
  - `{component-name}.module.css` (CSS Modules with Kerala Rage tokens)
  - Implementation guide with:
    - CSS Design Tokens (Kerala Rage palette, variable fonts, M3 Expressive curve)
    - React Component Structure (props, accessibility, responsive behavior)
    - Animation Specifications (typeSpringSlam, dragSettle, reduced motion fallbacks)
    - Cultural Safety Checklist (banned elements verification)

---

## 💡 BEST PRACTICES

### ✅ DO:

- **Audit First:** Always run `validate_asset_compliance` _before_ generating code.
- **Be Specific:** Provide the `asset_id` and specific `image_path` (absolute path).
- **Review Findings:** Read the audit report; if it fails cultural safety or has banned violations, regenerate the image.
- **Check Dark Mode:** Ensure all backgrounds use charcoal (#1A1A1A or darker).

### ❌ DON'T:

- **Don't Audit Sketches:** Only audit "final candidate" generations.
- **Don't Ignore Cultural Safety:** If the audit flags Aboriginal art imitation or crown symbols, fix the prompt immediately.
- **Don't Use Light Backgrounds:** Kerala Rage is dark-only. White backgrounds = instant fail.
- **No Parallel Calls:** Run audit → Review → Run implementation.

---

## 🎨 Kerala Rage Design System Quick Reference

### Core Colors
- **Solidarity Red**: `#F14714` (primary CTA, resistance energy)
- **Charcoal Background**: `#1A1A1A` (foundational canvas)
- **Worker Ash**: `#DAF6B3` (body text on dark)
- **Activist Smoke Green**: `#48DA8B` (landscape accents)
- **Signal Green**: `#48F0E5` (hybrid identity pop)
- **Ink Gold**: `#DAF674` (temple radiance, halo disks)

### Typography Patterns
- **Solidarity Protest**: wght 800, wdth 120 (declarative headers)
- **Labor Pressure**: wght 900, wdth 75 (compressed constraint)
- **Melancholy Longing**: wght 475, wdth 98 (reflective copy)
- **Extreme Variable Contrast**: 9× weight ratio (100 vs 900), 6× size ratio (12px vs 72px+)

### Motion
- **M3 Expressive**: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Type Spring Slam**: 600ms (headline entrance)
- **Drag Settle**: 800ms (card drag, labor-weight metaphors)

### Banned Elements (antiSlopProtocol)
- ❌ Light mode or white backgrounds
- ❌ Crown/monarchy symbols
- ❌ Perfect circles (border-radius: 50%)
- ❌ Bureaucratic aesthetics (passports, IDs, border gates)
- ❌ Aboriginal art imitation

---

## 📋 CHEATSHEET

| Intent          | Tool                              | Arguments Pattern                                              |
| :-------------- | :-------------------------------- | :------------------------------------------------------------- |
| **Check Image** | `validate_asset_compliance`       | `asset_id="solidarity-poster-01"`, `image_path="/abs/path/to/img.png"` |
| **Make Code**   | `generate_implementation_package` | `asset_id="solidarity-poster-01"`, `asset_metadata={...}`      |

---

## 🔧 Backend Status

- **Primary**: Gemini Vision (2.5 Pro → 2.0 Flash → 1.5 Pro → 1.5 Flash)
- **Fallback**: GitHub Models (GPT-4o-mini) via Azure AI Inference
- **Current Status**: ⚠️ Gemini API key invalid, fallback pending `azure-ai-inference` installation

---

_Reference: `servers/design_system_sidekick.py` | Design Tokens: `frontend/src/design/tokens/tokens.json`_

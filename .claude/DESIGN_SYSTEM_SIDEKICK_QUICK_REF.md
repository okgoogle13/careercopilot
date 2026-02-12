# ⚡ Design System Sidekick Quick Reference

Use this server to **bridge creative direction with programmatic validation**.

## 🛑 WHEN TO USE

- 🎨 **Asset Auditing**: Checking if a generated image matches kerala-rage standards.
- 📦 **Implementation**: Generating CSS/React code for a validated asset.
- ✅ **Compliance**: Ensuring typography, color, and layout rules are met.

## 🛠️ AVAILABLE TOOLS

### 1. 👁️ `validate_asset_compliance` (Visual Audit)

**Use for:** Checking generated images against design rules.
**Cost:** High (Vision API) - Use strategically.

**Example Prompt:**

> "Audit this generated kr-shiva image for kerala-rage compliance."

**What it does:**

- Analyzes image using Gemini Vision.
- Checks against:
  - 🎨 Palette (Ochre, Crimson, Sage, etc.) / NO Blues/Purples.
  - 📐 Geometry (Haeckelian patterns).
  - 💡 Lighting (Chiaroscuro).
  - 🏛️ Typography (if present).

---

### 2. 📦 `generate_implementation_package` (Code Gen)

**Use for:** Creating the code to use an asset in the frontend.
**Cost:** Medium (Text Generation).

**Example Prompt:**

> "Create the React component and CSS for this validated [DEPRECATED_STYLE] background."

**What it does:**

- Generates:
  - `Motif{Name}.tsx` (React Component).
  - `motif-{name}.module.css` (CSS Modules).
  - `index.ts` (Export).
- Applies correct CSS variables (`var(--sys-color-...)`).
- Handles responsive sizing and accessibility props.

---

## 💡 BEST PRACTICES

### ✅ DO:

- **Audit First:** Always run `validate_asset_compliance` _before_ generating code.
- **Be Specific:** Provide the `asset_id` and specific `image_path` (absolute path).
- **Review Findings:** Read the audit report; if it fails, regenerate the image, don't generate code for a bad asset.

### ❌ DON'T:

- **Don't Audit Sketches:** Only audit "final candidate" generations.
- **Don't Ignore Fails:** If the audit says "Blue feathers detected," fix the prompt, don't force implementation.
- **No Parallel Calls:** Run audit -> Review -> Run implementation.

---

## 📋 CHEATSHEET

| Intent          | Tool                              | Arguments Pattern                                              |
| :-------------- | :-------------------------------- | :------------------------------------------------------------- |
| **Check Image** | `validate_asset_compliance`       | `asset_id="frillneck-01"`, `image_path="/abs/path/to/img.png"` |
| **Make Code**   | `generate_implementation_package` | `asset_id="frillneck-01"`, `asset_metadata={...}`              |

---

_Reference: `.claude/skills/kerala-rage-visual-audit/SKILL.md`_

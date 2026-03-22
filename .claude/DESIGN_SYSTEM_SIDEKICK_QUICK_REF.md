# ⚡ Design System Sidekick Quick Reference (v6.1)

### 1. Naming Protocol v2.0: Plain UI First
**Public/Repo Docs:** Use Plain UI primitives (Button, Card, Input).
**Internal/Implementation:** Map to KR Archetypes (Strike, Placard, ScaffoldInput).

### 2. Emotional Registers
Use these to set the "intensity" of the Generative sidekick and design scoring:
- **Possibility**: Low contrast, lighter weights, airy spacing.
- **Reflection**: Deep charcoal, focus on typography and whitespace.
- **Direct Action**: High contrast, Solidarity Crimson, thick borders.
- **Insight**: Stencil Yellow highlights, high information density.

### 3. Palette & Motif Guardrails
- ✅ **ALLOWED**: Solidarity Charcoal, Worker Ash, Solidarity Crimson, Ink Gold, Activist Smoke, Stencil Yellow, **Protest Metal Blue**.
- ❌ **STRICT LOCKDOWN**: **Zero-Flora** (No gum leaves, no flowers). No bureaucratic seals. No perfect circles (`border-radius: 50%` banned).

## 🛠️ AVAILABLE TOOLS

### 1. 👁️ `validate_asset_compliance` (Visual Audit)
...
[Existing tool description, but update context]
...

## 📋 CHEATSHEET

| Intent          | Tool                              | Arguments Pattern                                              |
| :-------------- | :-------------------------------- | :------------------------------------------------------------- |
| **Check Image** | `validate_asset_compliance`       | `asset_id="strike-01"`, `image_path="/abs/path/img.png"`       |
| **Make Code**   | `generate_implementation_package` | `asset_id="strike-01"`, `asset_metadata={...}`                |

---

_Reference: `docs/design/01_CANON.md`_
_Last Updated: 2026-03-22_

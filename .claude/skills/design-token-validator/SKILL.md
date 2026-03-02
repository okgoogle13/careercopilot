---
name: design-token-validator
description: Validate CareerCopilot design tokens for DTCG compliance, kerala-rage
  palette rules, circular references, and WCAG contrast. Use before wireframing or
  deployment.
metadata:
  legacy_frontmatter:
    tags:
    - design-tokens
    - validation
    - kerala-rage
    - accessibility
    version: 2.0.0
---

# Design Token Validator

## Quick Decision Tree

- **Build failing with getValue() errors?** → `python scripts/audit_tailwind.py`
- **Adding new tokens?** → `python scripts/audit_structure.py`
- **Checking aesthetic compliance?** → `python scripts/validate_palette_mcp.py`
- **Pre-commit validation?** → `bash scripts/run_full_audit.sh`

## Purpose

Ensures design token integrity by validating DTCG compliance, kerala-rage palette rules, circular references, and WCAG contrast ratios before deployment or wireframing. This skill consolidates all kerala-rage kr-solidarity and M3 token validation logic.

## Process

1. **DTCG Compliance**: Verify `$value` and `$type` fields via `audit_structure.py`.
2. **Tailwind Integration**: Resolve `getValue()` paths via `audit_tailwind.py`.
3. **Palette Compliance**: Audit against the 6-dimension scorecard ([DEPRECATED_STYLE] Authenticity, Translucency, etc.) via `validate_palette_mcp.py`.
4. **Mode Parity**: SKIPPED (Single Mode Enforced).
5. **Accessibility**: Verify WCAG AA contrast ratios (4.5:1 minimum).
6. **Full Audit**: Run `run_full_audit.sh` for pre-commit verification.

## When to Use

- **ALWAYS** before committing token changes
- Before generating wireframes (ensures valid references)
- During CI/CD pipeline (pre-build check)
- When updating color palette or typography

## Validation Checks

1. ✅ **DTCG Schema**: Validates `$value`, `$type`, and unit compliance.
2. ✅ **Circular Refs**: Ensures no infinite alias loops.
3. ✅ **WCAG 2.2 AA**: Contrast checks for all token pairs.
4. ✅ **Mode Parity**: SKIPPED.
5. ✅ **6-Dimension Scorecard**:
   - [DEPRECATED_STYLE] Authenticity (Australian [DEPRECATED_STYLE] references)
   - Translucency Physics (kr-screenprint/ink pools)
   - Scale Hierarchy (display→body typography)
   - Density Zones (Mode-specific contrast)
   - Background Compliance (#1A1714)
   - Typography (Fraunces, kr-serif-bold, Work Sans)

## File Locations

- Tokens: `src/design/tokens/tokens.json`
- Theme: `src/theme/kerala-rage-theme.js`
- Validator: `scripts/design-validation/validate-tokens.py`

## Usage

```bash
python3 scripts/design-validation/validate-tokens.py
# Exit code 0 = pass, 1 = fail
```

## Integration

Runs automatically before:

- wireframe-annotator (ensures valid token references)
- design-system-doc-generator (validates source data)
- component-spec-generator (confirms token availability)

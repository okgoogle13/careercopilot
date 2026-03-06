---
name: token-orchestrator
description: Validates design tokens for DTCG compliance, Kerala Rage palette rules,
  and Tailwind integration. Use when (1) Build fails with getValue() errors, (2) Adding/modifying
  tokens.json, (3) Checking palette compliance, (4) Finding hardcoded CSS values,
  (5) Pre-commit validation needed, or (6) Syncing tokens across systems.
---

# Design Token Orchestrator

Comprehensive token validation for the Kerala Rage design system. Ensures tokens.json compliance, catches build errors before they happen, and enforces Agit-Prop / Viscous Fluidity aesthetic principles.

## Quick Decision Tree

**Build failing with getValue() errors?**
→ `python scripts/audit_tailwind.py`

**Adding new tokens?**
→ `python scripts/audit_structure.py`

**Checking aesthetic compliance?**
→ `python scripts/validate_palette_mcp.py`

**Finding hardcoded CSS?**
→ `bash scripts/analyze-m3-styling-consistency.sh`

**Pre-commit validation?**
→ `bash scripts/run_full_audit.sh`

## Dependencies

Required before running any script:

```bash
pip install wcag-contrast-ratio jsonschema pyyaml colormath
```

Verify: `python -c "import wcag_contrast_ratio, jsonschema, yaml, colormath"`

## Core Operations

### 1. Fix Tailwind Build Errors

**When**: Build fails with `Cannot read properties of undefined` or `getValue()` returns undefined

**Scripts**:

```bash
bash scripts/verify-m3-token-consistency.sh  # Component token usage check
python scripts/audit_tailwind.py             # getValue() path resolution
```

**Checks**:

- Component files using tokens vs hardcoded values
- Every `getValue()` path resolves correctly
- `$value` extraction succeeds

**Common fixes**: See [references/COMMON_FIXES.md](references/COMMON_FIXES.md)

### 2. Validate Structure & Schema

**When**: Checking DTCG format compliance

**Script**: `python scripts/audit_structure.py`

**Validates**:

- All tokens have `$value` and `$type`
- Valid color formats (hex, rgb, hsl)
- Dimension values have units ("16px" not 16)
- No circular alias references
- WCAG AA contrast ratios (4.5:1 text, 3:1 UI)

### 3. Validate Kerala Rage Palette

**When**: Checking Agit-Prop aesthetic compliance

**Scripts**:

```bash
python scripts/validate_palette_mcp.py           # MCP tool wrapper
python scripts/audit_structure.py --palette-only # Direct validation
```

**6-Dimension Scorecard**:

- Political Authenticity (Agit-Prop, Worker Solidarity)
- Viscous Physics (Spring easing, fluid transitions)
- Scale Hierarchy (Display Black → Body)
- Political Authenticity (Agit-Prop, Worker Solidarity)
- Viscous Physics (Spring easing, fluid transitions)
- Scale Hierarchy (Display Black → Body)
- Background Color (#1A1714 Charcoal mandatory)
- Typography (Inter Variable, Recursive)

**Reference palette**: [references/KERALA_RAGE_PALETTE.md](references/KERALA_RAGE_PALETTE.md)

### 4. Detect Hardcoded Values

**When**: Finding non-token CSS in components

**Script**: `bash scripts/analyze-m3-styling-consistency.sh`

**Detects**: Hardcoded colors, spacing, shadows, border-radius

**Guide**: [references/HARDCODED_VALUES.md](references/HARDCODED_VALUES.md)

### 5. Check Mode Parity (DEPRECATED)

**Status**: ABOLISHED. Single mode "Solidarity" enforced.

### 6. Build Token Artifacts

**When**: Generating CSS variables, Tailwind config, TypeScript types

**Script**: `python scripts/build-m3-tokens.py`

**Generates**:

- `frontend/src/styles/design-tokens.css`
- `frontend/src/design/tokens/tailwind-extensions.js`
- TypeScript type definitions

### 7. Sync Cross-System

**When**: Syncing tokens between Figma, JSON, CSS, Tailwind

**Script**: `python scripts/sync-theme-to-tokens.py`

**Maintains**: tokens.json as single source of truth

## Pre-Commit Workflow

Run before committing token changes:

```bash
bash scripts/run_full_audit.sh
```

**Validation checklist**:

```
- [ ] Step 1: Structure & schema (audit_structure.py)
- [ ] Step 2: Palette compliance (validate_palette_mcp.py)
- [ ] Step 3: Tailwind integration (audit_tailwind.py)
### 4. Mode Parity (ABOLISHED)
**Status**: This section has been moved to [references/MODE_PARITY.md](references/MODE_PARITY.md). Single Mode Enforced.
- [x] Step 4: Mode parity (Abolished)
- [ ] Step 5: Hardcoded values (analyze-m3-styling-consistency.sh)
```

**Step-by-step**:

1. **Structure & schema**: `python scripts/audit_structure.py`
   - Fix tokens.json if errors found
   - Re-run until exit code = 0

2. **Palette compliance**: `python scripts/validate_palette_mcp.py`
   - If score < 85/100, review KERALA_RAGE_PALETTE.md
   - Fix non-compliant colors

3. **Tailwind integration**: `python scripts/audit_tailwind.py`
   - If getValue() errors, see COMMON_FIXES.md
   - Fix and re-run until exit code = 0

4. **Mode parity**: SKIPPED (Abolished).

5. **Hardcoded values**: `bash scripts/analyze-m3-styling-consistency.sh`
   - Review report and replace per HARDCODED_VALUES.md

**Exit codes**: 0=safe to commit, 1=critical errors, 2=warnings

## CI/CD Integration

**GitHub Actions**:

```yaml
- name: Validate Tokens
  run: bash scripts/run_full_audit.sh
```

**Pre-commit hook** (`.git/hooks/pre-commit`):

```bash
#!/bin/bash
bash scripts/run_full_audit.sh
if [ $? -ne 0 ]; then
  echo "❌ Token validation failed"
  exit 1
fi
```

## Reference Files

Progressive disclosure—load only when needed:

- **[COMMON_FIXES.md](references/COMMON_FIXES.md)** - Solutions for getValue() errors
- **[KERALA_RAGE_PALETTE.md](references/KERALA_RAGE_PALETTE.md)** - Approved colors & derivation rules
- **[HARDCODED_VALUES.md](references/HARDCODED_VALUES.md)** - What to replace with tokens
- **[AUDIT_OUTPUT.md](references/AUDIT_OUTPUT.md)** - Sample report formats

## Script Reference

All scripts return standardized exit codes:

- `0` = Success, all checks passed
- `1` = Critical errors (build will fail)
- `2` = Warnings (review recommended)

**Existing scripts** (keep as-is):

- `verify-m3-token-consistency.sh` - Component token usage
- `analyze-m3-styling-consistency.sh` - Hardcoded value detection
- `build-m3-tokens.py` - Artifact generation
- `sync-theme-to-tokens.py` - Cross-system sync

**New scripts** (to be created):

- `audit_structure.py` - Enhanced schema validator
- `audit_tailwind.py` - getValue() path resolver
- `check_mode_parity.py` - ABOLISHED.
- `validate_palette_mcp.py` - MCP tool wrapper
- `run_full_audit.sh` - Master orchestrator

## Key Principles

1. **Single source of truth**: tokens.json is canonical (DTCG format)
2. **Validate before build**: Catch errors in tokens, not in CI/CD
3. **Kerala Rage compliance**: Agit-Prop aesthetic is non-negotiable
4. **Single Mode**: "Solidarity" is the ONLY valid mode.
5. **Progressive disclosure**: Reference files loaded only when needed

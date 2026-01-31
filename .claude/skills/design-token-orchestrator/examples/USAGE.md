# Design Token Orchestrator - Usage Examples

## Example 1: Build Tokens from Source

```bash
# Navigate to skill directory
cd .claude/skills/design-token-orchestrator

# Run build script
python scripts/build_tokens.py

# Expected output:
# ✅ Generated design-tokens.css
# ✅ Generated tailwind-token-patch.js
```

**Result**: CSS variables and Tailwind config ready to use.

---

## Example 2: Validate Token Compliance

```bash
# Run validation
python scripts/validate_tokens.py

# Expected output (passing):
# ✅ Token schema is valid
# ✅ Color contrast passed
# Compliance score: 94/100
```

**If validation fails**:

```
❌ Forbidden color detected: color.accent (#0080FF)
⚠️  Contrast ratio below WCAG AA: primary-50 on primary-100 (3.2:1)
```

Fix violations in `design-system/tokens.json` and rebuild.

---

## Example 3: Complete Workflow (Sync → Validate → Build)

```bash
# 1. Sync current theme to tokens
python scripts/sync_tokens.py

# 2. Validate compliance
python scripts/validate_tokens.py

# 3. If validation passes, build outputs
python scripts/build_tokens.py
```

---

## Example 4: Claude Skill Usage

"Build design tokens and validate Northcote compliance"

**Claude will**:

1. Run `build_tokens.py`
2. Run `validate_tokens.py`
3. Return compliance report
4. Flag any violations

---

## Testing the Skill

### Test 1: Minimal Valid Token Set

Create `design-system/tokens.json`:

```json
{
  "color": {
    "primary": "#C45C4B",
    "secondary": "#D4A84B"
  },
  "typography": {
    "fontFamilyBase": "'Crimson Text', serif"
  },
  "spacing": {
    "scale": {
      "space1": "8px"
    }
  },
  "shape": {
    "corner_medium": "12px"
  },
  "elevation": {
    "level_1": "0 1px 2px rgba(0,0,0,0.05)"
  }
}
```

Run: `python scripts/build_tokens.py`

Expected: CSS file with `--sys-color-primary: #C45C4B;`

### Test 2: Forbidden Color Detection

Add forbidden blue:

```json
{
  "color": {
    "accent": "#0080FF"
  }
}
```

Run: `python scripts/validate_tokens.py`

Expected: ❌ Validation fails with forbidden color warning.

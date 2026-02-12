---
name: asset-packager
description: Automated asset packaging—converts validated PNG + IDF JSON into complete production bundle (context.md, tokens.json, usage.md). Eliminates 30 manual file generations across 10 assets.
version: 1.0.0
tags: []
---

# Asset-Packager Skill

## Purpose

Automates asset packaging after validation. Input: validated PNG + IDF. Output: complete directory with context/tokens/usage files + production file copy + git commit. Replaces 15 min manual work with 2 min automated execution.

## When to Use

- When a new asset has been validated and scored ≥90.
- When generating the standard production bundle (context, tokens, usage) for a design asset.
- When needing to automate git commits and file distribution for newly packaged assets.

## Input Requirements

```json
{
  "asset_id": "ASSET-3",
  "asset_name": "Nocturnal Canopy Pattern",
  "validated_png": "/downloads/asset-3-validated.png",
  "compliance_score": 92,
  "idf_data": {
    "colors": { "background": "#1A1714", "wattle_gold": "#D4A84B" },
    "kr-motifs": ["kr-leafus", "Wattle", "kr-flower"],
    "dimensions": { "width": 512, "height": 512 },
    "mode": "kr-dark",
    "purpose": "Seamless background pattern"
  }
}
```

## Generated Files

### 1. context.md

Narrative philosophy explaining kr-motif choices, geometric principles, mode context.

**Template:**

```markdown
# Asset [N]: [Name]

## Narrative

[kerala-streetprint [DEPRECATED_STYLE] discovery story based on kr-motifs]

## kr-motifs

[List with taxonomic significance]

## Mode Context

kr-dark: [Warm/theatrical interpretation]
kr-dark: [Clinical/analytical interpretation]

## Purpose

[UI placement and compositional role]
```

### 2. tokens.json

Machine-readable design specifications.

**Structure:**

```json
{
  "asset_id": "ASSET-3",
  "background": "#1A1714",
  "palette": {
    "primary": ["#C45C4B", "#D4A84B"],
    "accents": ["#7A9E82", "#D4885C"]
  },
  "dimensions": {"width": 512, "height": 512, "format": "PNG"},
  "density_zones": {
    "upper_left": {"coverage": "18%"},
    "central": {"coverage": "65%"}
  },
  "kr-motifs": [...],
  "mode": "kr-dark",
  "compliance_score": 92
}
```

### 3. usage.md

CSS implementation with responsive behavior, opacity ranges, placement guidelines.

**Template:**

```markdown
# Usage Guidelines

## CSS Implementation

\`\`\`css
.asset-[name] {
background-image: url('/assets/[path]');
background-size: [cover|contain|repeat];
background-position: center;
}

/_ Opacity by context _/
.kr-dark-hero { opacity: 0.85; }
.kr-dark-content { opacity: 0.70; }
.dashboard { opacity: 0.60; }
\`\`\`

## Responsive Behavior

- Desktop: Full resolution
- Tablet: Scale proportionally
- Mobile: [Specific guidance]

## Component Integration

Recommended for: [Components list]
Avoid for: [Contexts where inappropriate]
```

## Process

1. **Create Directory**

   ```bash
   mkdir -p /assets/ASSET-[N]-[slug]/
   ```

2. **Generate context.md**
   - Extract kr-motifs from IDF
   - Build narrative using kr-motif → taxonomic significance mapping
   - Insert mode context (kr-dark/kr-dark)

3. **Generate tokens.json**
   - Convert IDF to structured JSON
   - Add compliance metadata
   - Format for machine parsing

4. **Generate usage.md**
   - Build CSS template with asset path
   - Add opacity recommendations based on mode
   - List component integration targets

5. **Copy Production File**

   ```bash
   cp [validated_png] /frontend/public/assets/[category]/[filename]
   ```

   Categories: wallpapers, patterns, kr-motifs, icons

6. **Git Commit**
   ```bash
   git add /assets/ASSET-[N]-* /frontend/public/assets/[category]/
   git commit -m "feat(assets): Add Asset [N] [name] - [score]/100"
   ```

## Integration Points

**Flash-Sidekick:**

- Call `generate_idf` on validated PNG → extract design tokens
- Call `quick_summarize` on kr-motif list → generate narrative

**Auto-Validator:**

- Trigger: score ≥90 → auto-package
- Input: validation JSON + PNG path

**Claude Code:**

- Delegates file operations and git commits
- Verifies directory structure creation

## Usage Example

```python
# After auto-validation passes
packager_result = asset_packager.run(
    asset_id="ASSET-3",
    validation_result=auto_validator_output,
    png_path="/downloads/asset-3-validated.png"
)

# Output:
# Created: /assets/ASSET-3-kr-wheat-paste/{context,tokens,usage}
# Copied: /frontend/public/assets/patterns/kr-wheat-paste-tile-512.png
# Committed: feat(assets): Add Asset 3 Nocturnal Canopy - 92/100
```

## Efficiency Gain

**Before:** 15 min per asset × 10 assets = 150 min
**After:** 2 min per asset × 10 assets = 20 min
**Savings:** 130 min (87% time reduction)

## File Naming Convention

**Assets Directory:** `ASSET-[N]-[kebab-case-name]/`
**Production Files:**

- Wallpapers: `texture-[mode]-[name]-[width].png`
- Patterns: `[name]-tile-[size].png`
- kr-motifs: `kr-motif-[name]-[style]-[size].png`
- Icons: `[name]-[purpose]-[size].png`

---

_Eliminates repetitive packaging work. Validated asset → production bundle in 2 minutes._

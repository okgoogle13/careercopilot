# kerala-rage Asset Cataloger Skill

Manifest-driven visual analysis for kerala-rage kr-solidarity design system.

## Installation

1. Download this ZIP file
2. Go to claude.ai → Settings → Capabilities → Skills
3. Click "Upload skill"
4. Select this ZIP file
5. Skill syncs automatically to Claude Desktop

## What This Skill Does

- Analyzes images against `kerala-rage-kr-solidarity-manifest.json` schema
- Validates PNG format, naming conventions, size constraints
- Enforces kr-dark/kr-dark mode compliance
- Routes 20+ images to Flash Sidekick MCP for efficiency
- Generates manifest-compliant catalog entries

## Structure

```
kerala-rage-asset-cataloger/
├── SKILL.md                      # Main skill with YAML frontmatter
├── scripts/                      # Executable automation
│   ├── catalog_assets.py        # Batch cataloging
│   ├── standardize_png.py       # PNG conversion + validation
│   ├── flash_batch.py           # MCP routing for 20+ images
│   └── package_assets.py        # Manifest-driven packaging
├── references/                   # Loaded as needed
│   ├── doc008-gaps.md           # Missing asset requirements
│   ├── asset-inventory.md       # ASSET-1 to ASSET-25
│   └── mode-compliance.md       # kr-dark vs kr-dark rules
├── MANIFEST-WORKFLOW.md          # Complete integration guide
└── INTEGRATION.md                # Tier 2 automation examples
```

## Quick Start

Once installed, simply upload images and say:
- "Catalog these assets against the manifest"
- "Standardize these to PNG"
- "Package all manifest assets"

Claude will recognize the context and use this skill automatically.

## Requirements

- Python 3.9+ (for scripts)
- Pillow library: `pip install Pillow`
- Manifest file at: `/Users/okgoogle13/Projects/careercopilot/assets/kerala-rage-kr-solidarity-manifest.json`

## Integration

Works with:
- tier2-automation (batch processing)
- Flash Sidekick MCP (20+ images)
- tier1-automation (validation)

#!/bin/bash

# Define the Master Directory
BASE_DIR="frontend/public/assets/northcote_v1"

# 1. Create the Directory Structure
<<<<<<< HEAD
echo "🏛️  Creating  Asset Structure..."
=======
echo "🏛️  Creating Northcote [DEPRECATED_STYLE] Asset Structure..."
>>>>>>> restoration-KR-Rage-Figma-v2.0
mkdir -p "$BASE_DIR/backgrounds"
mkdir -p "$BASE_DIR/botanicals"
mkdir -p "$BASE_DIR/icons"
mkdir -p "$BASE_DIR/ui"

# 2. Generate the Master Manifest (JSON)
# This file serves as your "Ledger" - if it's not in here, it's not production.
echo "📝 Generating _manifest.json..."

cat > "$BASE_DIR/_manifest.json" <<EOF
{
<<<<<<< HEAD
  "project": " Design System",
=======
  "project": "Northcote [DEPRECATED_STYLE] Design System",
>>>>>>> restoration-KR-Rage-Figma-v2.0
  "version": "1.0",
  "last_audit": "$(date +%Y-%m-%d)",
  "assets": {
    "backgrounds": {
      "asset_01_wallpaper": {
        "status": "MISSING",
<<<<<<< HEAD
        "desc": "The Curio Wallpaper (Gallery Master)",
=======
        "desc": "The [DEPRECATED_STYLE] Wallpaper (Gallery Master)",
>>>>>>> restoration-KR-Rage-Figma-v2.0
        "source": "Gemini Asset 1"
      },
      "asset_03_parchment": {
        "status": "MISSING",
        "desc": "Laboratory Grid Texture",
        "source": "Gemini Asset 3"
      }
    },
    "botanicals": {
      "asset_02_kookaburra": {
        "status": "READY",
        "file": "kookaburra_master.png",
        "desc": "The Sentry Kookaburra (Mascot)",
        "source": "Archive (94/100)"
      },
      "asset_04_wattle": {
        "status": "READY",
        "file": "wattle_study_master.png",
        "desc": "Wattle Branch Base",
        "source": "Claude Archive (90/100)"
      },
      "asset_09_waratah": {
        "status": "READY",
        "file": "waratah_hero_master.png",
<<<<<<< HEAD
        "desc": "Waratah Hero Closeup",
=======
        "desc": "[DEPRECATED_STYLE] Hero Closeup",
>>>>>>> restoration-KR-Rage-Figma-v2.0
        "source": "Claude Archive (92/100)"
      }
    },
    "icons": {
      "asset_07_navigators": {
        "status": "MISSING",
        "desc": "Compass, Loupe, Caliper",
        "source": "Gemini Asset 7"
      }
    },
    "ui": {
      "asset_06_spinner": {
        "status": "MISSING",
        "desc": "Banksia Geometric Spinner",
        "source": "Gemini Asset 6"
      }
    }
  }
}
EOF

# 3. Instructions for the User
echo ""
echo "✅ Structure Created at: $BASE_DIR"
echo "📂 Subfolders: backgrounds, botanicals, icons, ui"
echo "📜 Manifest Created: _manifest.json"
echo ""
echo "👉 NEXT STEP: Manually move your 'Keeper' files into these folders and rename them to match the manifest (e.g., 'kookaburra_master.png')."

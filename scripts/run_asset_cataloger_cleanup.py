#!/usr/bin/env python3
import os
import json
import re
import shutil
from datetime import datetime
from pathlib import Path

# Configuration
SOURCE_DIR = Path("/Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/uncategorized")
TARGET_JSON = Path("/Users/okgoogle13/Desktop/careercopilot/assets/asset_triage_plan.json")
INVENTORY_FILE = Path("/Users/okgoogle13/Desktop/careercopilot/.claude/skills/kerala-rage-asset-cataloger/references/asset-inventory.md")

# Regex for "Generated Image"
GEN_IMG_PATTERN = re.compile(r"Generated Image .*")
SCREENSHOT_PATTERN = re.compile(r"Screenshot .*")

def normalize_name(filename, index):
    """Generate a rigorous, standardized name for triage."""
    ext = filename.suffix.lower()
    
    # If already compliant, keep it
    if filename.name.startswith("kerala-rage-"):
        return filename.name
        
    # Classify based on probable source
    prefix = "kerala-rage-triage"
    if GEN_IMG_PATTERN.match(filename.stem):
        prefix = "kerala-rage-gen-raw"
    elif SCREENSHOT_PATTERN.match(filename.stem):
        prefix = "kerala-rage-ref-screen"
    elif filename.stem.startswith("file-"):
        prefix = "kerala-rage-upload"
        
    return f"{prefix}-{datetime.now().strftime('%Y%m%d')}-{index:03d}{ext}"

def main():
    if not SOURCE_DIR.exists():
        print(f"Directory not found: {SOURCE_DIR}")
        return

    files = sorted([f for f in SOURCE_DIR.iterdir() if f.is_file() and not f.name.startswith('.')])
    
    actions = []
    renaming_map = {}
    
    print(f"Found {len(files)} files in {SOURCE_DIR}")
    
    # 1. Plan Renames
    for i, file_curr in enumerate(files):
        new_name = normalize_name(file_curr, i+1)
        if new_name != file_curr.name:
            renaming_map[file_curr] = SOURCE_DIR / new_name
            
            actions.append({
                "status": "RENAME_FOR_TRIAGE",
                "original": file_curr.name,
                "proposed": new_name,
                "instruction": f"mv '{file_curr}' '{SOURCE_DIR / new_name}'"
            })
        else:
            actions.append({
                "status": "KEEP",
                "original": file_curr.name,
                "note": "Already normalized"
            })

    # 2. Execute Renames
    print("Executing standardizations...")
    for old_path, new_path in renaming_map.items():
        try:
            old_path.rename(new_path)
            print(f"✅ Renamed: {old_path.name} -> {new_path.name}")
        except Exception as e:
            print(f"❌ Failed: {old_path.name} -> {e}")

    # 3. Generate Catalog JSON
    report = {
        "timestamp": datetime.now().isoformat(),
        "total_processed": len(files),
        "actions": actions
    }
    
    TARGET_JSON.parent.mkdir(parents=True, exist_ok=True)
    with open(TARGET_JSON, 'w') as f:
        json.dump(report, f, indent=2)
        
    print(f"\n📃 Triage plan generated at: {TARGET_JSON}")
    print("Run visual inspection on 'kerala-rage-triage-*' files to assign final categories.")

if __name__ == "__main__":
    main()

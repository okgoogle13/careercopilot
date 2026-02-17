#!/usr/bin/env python3
import os
import shutil
import sys
import glob
from pathlib import Path
from datetime import datetime

# Configuration
DRY_RUN = True
BACKUP = True
ROOT_DIR = Path(os.getcwd())
BACKUP_DIR = ROOT_DIR.parent / f"careercopilot_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

# Defined Moves (Source relative to Root -> Destination relative to Root)
MOVES = {
    # Apps
    "frontend": "apps/frontend",
    "backend": "apps/backend",
    "functions": "apps/functions",
    
    # Libs
    "src/components": "libs/legacy-ui",
    
    # Tools
    "servers": "tools/mcp-servers",
    "tools": "tools/admin"  # Rename existing tools to admin
}

# Pattern-based moves for root files
# (Source Pattern -> Destination Folder inside tools/scripts/)
ROOT_PATTERNS = {
    "setup_*": "tools/scripts/setup",
    "audit_*": "tools/scripts/audit",
    "verify_*": "tools/scripts/audit",
    "validate_*": "tools/scripts/audit",
    "check_*": "tools/scripts/audit",
    "analyze_*": "tools/scripts/analysis",
    "generate_*": "tools/scripts/generators",
    "migrate_*": "tools/scripts/migration",
    "kerala_rage_*": "tools/scripts/migration",
    "cleanup_*": "tools/scripts/maintenance",
    "purge*": "tools/scripts/maintenance",
    "run_*": "tools/scripts/workflow",
    "orchestrate_*": "tools/scripts/workflow",
    "deploy.sh": "tools/scripts/ops",
    "docker-*": "tools/scripts/ops",
    # Catch-all for other scripts at root, handled separately if needed
    "*.sh": "tools/scripts/misc_sh",
    "*.py": "tools/scripts/misc_py",
}

def log(msg, level="INFO"):
    print(f"[{level}] {msg}")

def safe_move(src: Path, dest: Path):
    if not src.exists():
        log(f"Source not found: {src}", "WARN")
        return

    if dest.exists():
        log(f"Destination already exists: {dest}", "WARN")
        # In a real scenario, we might merge or rename. For now, skip to avoid overwriting.
        return

    if DRY_RUN:
        log(f"[DRY RUN] Will move {src} -> {dest}")
    else:
        log(f"Moving {src} -> {dest}")
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(src), str(dest))

def categorize_root_files():
    """Moves files from root based on patterns."""
    processed_files = set()
    
    # Sort patterns by specificity (longer pattern -> more specific, generally)
    # This helps ensure setup_*.py is matched before *.py
    sorted_patterns = sorted(ROOT_PATTERNS.keys(), key=lambda x: len(x), reverse=True)
    
    for pattern in sorted_patterns:
        dest_folder = ROOT_PATTERNS[pattern]
        files = list(ROOT_DIR.glob(pattern))
        for file_path in files:
            if file_path.name == "refactor_monorepo.py":
                continue # Don't move self
            
            if file_path in processed_files:
                continue

            # Re-check if file still exists (for non-dry-run safety)
            if not DRY_RUN and not file_path.exists():
                continue

            target_dir = ROOT_DIR / dest_folder
            target_path = target_dir / file_path.name
            
            safe_move(file_path, target_path)
            processed_files.add(file_path)

def main():
    global DRY_RUN
    
    print("="*50)
    print("CAREERCOPILOT MONOREPO REFACTOR")
    print("="*50)
    print(f"Root: {ROOT_DIR}")
    
    if "--execute" in sys.argv:
        DRY_RUN = False
        print("!! EXECUTION MODE !!")
    else:
        print("!! DRY RUN MODE (pass --execute to run) !!")

    if not DRY_RUN and BACKUP:
        print(f"Creating backup at {BACKUP_DIR}...")
        try:
            shutil.copytree(ROOT_DIR, BACKUP_DIR, ignore=shutil.ignore_patterns('node_modules', '.venv', '.git', '__pycache__', 'dist'))
            print("Backup complete.")
        except Exception as e:
            print(f"Backup failed: {e}")
            if input("Continue without backup? (y/n) ").lower() != 'y':
                sys.exit(1)

    # 1. Create new top-level structure
    new_dirs = ["apps", "libs", "tools", "tools/scripts", "tools/mcp-servers"]
    for d in new_dirs:
        p = ROOT_DIR / d
        if not p.exists():
            if DRY_RUN:
                log(f"[DRY RUN] Will create directory {p}")
            else:
                p.mkdir(parents=True)

    # 2. Execute Defined Moves
    for src_name, dest_name in MOVES.items():
        src = ROOT_DIR / src_name
        dest = ROOT_DIR / dest_name
        safe_move(src, dest)

    # 3. Categorize Root Files
    categorize_root_files()

    # 4. Final instructions
    if not DRY_RUN:
        print("\n" + "="*50)
        print("Refactor Complete.")
        print("Next Steps:")
        print("1. Update package.json workspaces to include 'apps/*', 'libs/*'.")
        print("2. Update CI/CD configurations.")
        print("3. Check for broken imports in moved files.")
        print("4. Delete empty directories (if any left).")

if __name__ == "__main__":
    main()

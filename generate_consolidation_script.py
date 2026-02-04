
import json
import os
import shlex

# Load the analysis
with open('consolidation-analysis.json', 'r') as f:
    plan = json.load(f)

# Script Header
script_lines = [
    "#!/bin/bash",
    "set -e",  # Exit on error
    "",
    "echo '=== NORTHCOTE ASSET CONSOLIDATION ==='",
    "TIMESTAMP=$(date +%s)",
    "BACKUP_DIR=\".asset_backup_$TIMESTAMP\"",
    "",
    "# 1. Backup Phase",
    "echo \"Creating backup at $BACKUP_DIR...\"",
    "mkdir -p \"$BACKUP_DIR\"",
    "cp -r assets \"$BACKUP_DIR/assets_canonical\" 2>/dev/null || echo 'No canonical assets to backup'",
    "cp -r \"frontend/public/assets\" \"$BACKUP_DIR/frontend_public\" 2>/dev/null || echo 'No frontend assets to backup'",
    "cp -r \"Curio images phase 3\" \"$BACKUP_DIR/phase3_source\" 2>/dev/null || echo 'No phase 3 assets to backup'",
    "",
    "# 2. Structure Phase",
    "echo 'Ensuring canonical directory structure...'",
    "mkdir -p assets/{plates,fauna,textures,specimens,ui,uncategorized}",
    ""
]

# 3. Execution Phase
script_lines.append("# 3. Consolidation Phase")

for item in plan:
    action = item['action']
    dest = item['destination']
    sources = item['sources']
    current_canon = item.get('current_canonical_path')

    if not sources and not current_canon: continue

    safe_dest = shlex.quote(dest)

    if action == 'MOVE':
        # Pick best source
        safe_source = shlex.quote(sources[0])
        script_lines.append(f"mkdir -p $(dirname {safe_dest})")
        script_lines.append(f"echo \"Moving {os.path.basename(dest)}...\"")
        script_lines.append(f"mv -n {safe_source} {safe_dest}")

    elif action == 'RENAME':
        # Rename within canonical (or move if path changed)
        safe_source = shlex.quote(current_canon)
        script_lines.append(f"mkdir -p $(dirname {safe_dest})")
        script_lines.append(f"echo \"Renaming to {os.path.basename(dest)}...\"")
        script_lines.append(f"mv -n {safe_source} {safe_dest}")

script_lines.append("")
script_lines.append("# 4. Symlink Phase")
script_lines.append("echo 'Replacing frontend assets with symlinks...'")
script_lines.append("rm -rf frontend/public/assets")
script_lines.append("ln -s ../../../assets frontend/public/assets")
script_lines.append("")
script_lines.append("echo '=== CONSOLIDATION COMPLETE ==='")
script_lines.append("echo \"Backup available at: $BACKUP_DIR\"")

# Write the script
output_path = 'consolidate-assets.sh'
with open(output_path, 'w') as f:
    f.write('\n'.join(script_lines))

print(f"Script generated: {output_path}")

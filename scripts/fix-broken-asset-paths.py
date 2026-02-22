#!/usr/bin/env python3
"""
Fix broken asset paths in layout components.

This script fixes 5 broken /src/assets/ references by converting them to
ES module imports. The paths are invalid in Vite and will cause 404 errors
at runtime.

Fixes:
- KrDarkLanding.tsx:102 - /src/assets/KrMotifs/the-sentry.png
- GalleryFeed.tsx:121 - /src/assets/specimens/leaf-fern.png
- GalleryFeed.tsx:130 - /src/assets/specimens/beetle-scarab.png
- GalleryLanding.tsx:22 - /src/assets/specimens/the-sentry.png
- SidePanel.tsx:13 - /src/assets/KrMotifs/lab-sentry.png
"""

import re
import subprocess
from pathlib import Path

# Define fixes: (file_path, broken_path, import_name, actual_file, import_statement)
FIXES = [
    {
        "file": "frontend/src/layouts/KrDarkShell/views/KrDarkLanding.tsx",
        "line": 102,
        "broken_src": '/src/assets/KrMotifs/the-sentry.png',
        "import_name": "sentryKrShivaSrc",
        "import_path": "../../../assets/KrMotifs/sentry_kr-shiva.png",
        "replacement_var": "sentryKrShivaSrc",
    },
    {
        "file": "frontend/src/layouts/GalleryShell/views/GalleryFeed.tsx",
        "line": 121,
        "broken_src": '/src/assets/specimens/leaf-fern.png',
        "import_name": "leafFernSrc",
        "import_path": "../../../assets/specimens/leaf-fern.png",
        "replacement_var": "leafFernSrc",
    },
    {
        "file": "frontend/src/layouts/GalleryShell/views/GalleryFeed.tsx",
        "line": 130,
        "broken_src": '/src/assets/specimens/beetle-scarab.png',
        "import_name": None,
        "import_path": None,
        "replacement_var": "/assets/specimens/northcote-beetle-scarab-variant.png",
        "use_public_path": True,
    },
    {
        "file": "frontend/src/layouts/GalleryShell/views/GalleryLanding.tsx",
        "line": 22,
        "broken_src": '/src/assets/specimens/the-sentry.png',
        "import_name": "sentrySrc",
        "import_path": "../../../assets/specimens/sentry_kookaburra.png",
        "replacement_var": "sentrySrc",
    },
    {
        "file": "frontend/src/layouts/LaboratoryShell/components/SidePanel.tsx",
        "line": 13,
        "broken_src": '/src/assets/KrMotifs/lab-sentry.png',
        "import_name": "labSentrySrc",
        "import_path": "../../../assets/KrMotifs/sentry_kr-shiva.png",
        "replacement_var": "labSentrySrc",
    },
]

def fix_file(fix_config):
    """Apply fix to a single file."""
    file_path = Path(fix_config["file"])

    if not file_path.exists():
        print(f"❌ File not found: {file_path}")
        return False

    content = file_path.read_text()
    lines = content.split('\n')

    # For public path replacement, just replace the src
    if fix_config.get("use_public_path"):
        # Replace the broken path with public path
        old_src = f'src="{fix_config["broken_src"]}"'
        new_src = f'src="{fix_config["replacement_var"]}"'

        if old_src in content:
            new_content = content.replace(old_src, new_src)
            file_path.write_text(new_content)
            print(f"✅ Fixed {file_path}: Public path replacement")
            return True
        else:
            print(f"⚠️  Could not find pattern in {file_path}")
            return False

    # For ES module imports
    import_name = fix_config["import_name"]
    import_path = fix_config["import_path"]
    replacement_var = fix_config["replacement_var"]
    broken_src = fix_config["broken_src"]

    # Find and add import at top of file (after existing imports)
    import_statement = f"import {import_name} from '{import_path}';"

    if import_statement in content:
        print(f"⚠️  Import already exists in {file_path}")
        # Skip adding import, but still replace src
    else:
        # Find last import line
        import_lines = [i for i, line in enumerate(lines) if line.strip().startswith('import ')]
        if import_lines:
            insert_at = import_lines[-1] + 1
            lines.insert(insert_at, import_statement)
            print(f"✅ Added import to {file_path}")
        else:
            print(f"⚠️  Could not find import section in {file_path}")

    # Replace src attribute
    old_src = f'src="{broken_src}"'
    new_src = f'src={{{replacement_var}}}'

    content = '\n'.join(lines)
    if old_src in content:
        new_content = content.replace(old_src, new_src)
        file_path.write_text(new_content)
        print(f"✅ Fixed {file_path}: Line {fix_config['line']}")
        return True
    else:
        print(f"⚠️  Could not find src pattern in {file_path}")
        return False

def main():
    """Apply all fixes and commit changes."""
    print("🔧 Fixing broken asset paths...\n")

    fixed_count = 0
    for fix in FIXES:
        if fix_file(fix):
            fixed_count += 1

    print(f"\n✅ Fixed {fixed_count}/{len(FIXES)} files\n")

    if fixed_count == 0:
        print("No files were fixed.")
        return False

    # Create git commit
    print("📝 Creating git commit...\n")
    try:
        subprocess.run(["git", "add", "-A"], check=True, cwd=".")
        subprocess.run(
            ["git", "commit", "-m", "fix: correct broken asset paths in layout components\n\nFix 5 broken /src/assets/ references by converting to ES module imports.\nThese paths are invalid in Vite and caused 404 errors at runtime."],
            check=True,
            cwd=".",
        )
        print("✅ Commit created successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error creating commit: {e}")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)

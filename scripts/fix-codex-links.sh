#!/bin/bash

# Fix broken Codex skill symlinks
# The old path /Users/okgoogle13/Desktop/careercopilot/ is invalid.
# The new path is /Users/okgoogle13/Projects/careercopilot/

OLD_BASE="/Users/okgoogle13/Desktop/careercopilot"
NEW_BASE="/Users/okgoogle13/Projects/careercopilot"
SKILLS_DIR="$HOME/.codex/skills"

echo "🔍 Checking for broken symlinks in $SKILLS_DIR..."

for link in "$SKILLS_DIR"/*; do
    if [ -L "$link" ]; then
        target=$(readlink "$link")
        if [[ "$target" == "$OLD_BASE"* ]]; then
            new_target="${target/$OLD_BASE/$NEW_BASE}"
            echo "🔧 Fixing $link"
            echo "   Old: $target"
            echo "   New: $new_target"

            if [ -d "$new_target" ]; then
                rm "$link"
                ln -s "$new_target" "$link"
                echo "   ✅ Fixed"
            else
                echo "   ❌ ERROR: Target directory $new_target does not exist!"
            fi
        fi
    fi
done

echo "🎉 Done! Please restart your Codex session."

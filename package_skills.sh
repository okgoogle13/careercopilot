#!/bin/bash

# Create output directory
mkdir -p dist/skills

# Package each skill
for skill_dir in .claude/skills/*/; do
  if [ -f "${skill_dir}SKILL.md" ]; then
    skill_name=$(basename "$skill_dir")
    echo "Packaging $skill_name..."
    
    # Create a temporary directory
    temp_dir=$(mktemp -d)
    cp -r "$skill_dir"* "$temp_dir/"
    
    # Create the .skill file (which is just a zip file)
    (cd "$temp_dir" && zip -r "../../dist/skills/${skill_name}.skill" ./*)
    
    echo "✅ Created dist/skills/${skill_name}.skill"
  fi
done

# Create upload instructions
cat > dist/upload_instructions.md << 'INSTRUCTIONS'
# Claude Skill Upload Instructions

## How to Upload Skills to Claude

1. Go to [claude.ai](https://claude.ai) and sign in
2. Click on your profile picture in the bottom left
3. Select "Skills" from the menu
4. Click "Upload Skill" or "Add Skill"
5. Select the .skill files from the dist/skills/ directory

## Available Skills:
INSTRUCTIONS

# List all packaged skills
ls -1 dist/skills/*.skill | sed 's|dist/skills/|  - |' >> dist/upload_instructions.md

echo -e "\n✅ Skill packages created in dist/skills/"
echo "📝 Upload instructions saved to dist/upload_instructions.md"

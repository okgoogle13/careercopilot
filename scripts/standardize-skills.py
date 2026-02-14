import os
import re
import yaml
from pathlib import Path

SKILLS_DIR = Path("/Users/okgoogle13/Desktop/careercopilot/.claude/skills")

def get_frontmatter(content):
    if content.startswith("---"):
        match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
        if match:
            return yaml.safe_load(match.group(1)), content[match.end():]
    return {}, content

def standardize_skill(skill_path):
    skill_file = skill_path / "SKILL.md"
    if not skill_file.exists():
        return

    with open(skill_file, "r") as f:
        content = f.read()

    metadata, body = get_frontmatter(content)
    
    # Extract name and description from Markdown if not present in YAML
    if not metadata.get("name"):
        name_match = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
        if name_match:
            metadata["name"] = name_match.group(1).strip().lower().replace(" ", "-")
        else:
            metadata["name"] = skill_path.name

    if not metadata.get("description"):
        desc_match = re.search(r"\*\*Purpose\*\*:\s*(.+)$", body, re.MULTILINE)
        if desc_match:
            metadata["description"] = desc_match.group(1).strip()[:200]
        else:
            metadata["description"] = f"Skill for {metadata['name']}"

    # Normalize structure
    new_yaml = yaml.dump(metadata, sort_keys=False, default_flow_style=False).strip()
    new_content = f"---\n{new_yaml}\n---\n\n{body.strip()}\n"

    with open(skill_file, "w") as f:
        f.write(new_content)
    
    # Cleanup duplicate directories
    for legacy_dir in ["references 2", "scripts 2", "assets 2"]:
        legacy_path = skill_path / legacy_dir
        target_dir = legacy_dir.replace(" 2", "")
        target_path = skill_path / target_dir
        
        if legacy_path.is_dir():
            print(f"Cleaning up {legacy_path} -> {target_path}")
            if not target_path.exists():
                legacy_path.rename(target_path)
            else:
                # Merge or delete if redundant
                for item in legacy_path.iterdir():
                    dest = target_path / item.name
                    if not dest.exists():
                        item.rename(dest)
                legacy_path.rmdir()

def main():
    for skill_path in SKILLS_DIR.iterdir():
        if skill_path.is_dir() and not skill_path.name.startswith(("_", ".")):
            print(f"Standardizing {skill_path.name}...")
            standardize_skill(skill_path)

if __name__ == "__main__":
    main()

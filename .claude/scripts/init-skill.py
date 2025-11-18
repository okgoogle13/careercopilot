#!/usr/bin/env python3
"""
Initialize a new Claude Code skill with proper structure.

Usage:
    python3 .claude/scripts/init-skill.py <skill-name> [--path <output-directory>]

Example:
    python3 .claude/scripts/init-skill.py my-awesome-skill --path .claude/skills
"""

import argparse
import os
import sys
from pathlib import Path
from datetime import datetime


SKILL_MD_TEMPLATE = """---
name: {name}
description: "{description}"
---
# {title}

## Overview

Brief description of what this skill does and when to use it.

## Workflow Steps

1. **Step 1: [Action]**
   - Detail what happens in this step
   - Include any prerequisites or checks

2. **Step 2: [Action]**
   - Detail what happens in this step
   - Reference any scripts or assets used

3. **Step 3: [Output]**
   - Describe the final output
   - List any artifacts created

## Usage Tips

- Tip 1: When to use this skill
- Tip 2: Common patterns or best practices
- Tip 3: Related skills or workflows

## Example Output

```
Example of what this skill produces
```

## References

- `references/example-guide.md` - Detailed reference documentation
"""

REFERENCE_TEMPLATE = """# {title} Reference

## Table of Contents

- [Overview](#overview)
- [Section 1](#section-1)
- [Section 2](#section-2)
- [Examples](#examples)

---

## Overview

Detailed reference information for {skill_name}.

## Section 1

Content here...

## Section 2

Content here...

## Examples

Example content here...
"""

SCRIPT_TEMPLATE = """#!/usr/bin/env bash
# {title} Script
# Part of the {skill_name} skill

set -e

# Default configuration
VERBOSE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -v|--verbose)
      VERBOSE=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Main script logic
main() {
  if [ "$VERBOSE" = true ]; then
    echo "Running {skill_name}..."
  fi

  # Add your script logic here

  if [ "$VERBOSE" = true ]; then
    echo "✅ Complete!"
  fi
}

main "$@"
"""

README_TEMPLATE = """# {title}

**Created:** {date}
**Location:** `{path}`

## Quick Start

```bash
# Trigger this skill by asking Claude:
"[Your trigger phrase here]"
```

## Development

### Testing the Skill

```bash
# Test the skill workflow
# [Add your testing instructions]
```

### Modifying the Skill

1. Edit `SKILL.md` for workflow changes
2. Add references to `references/` for detailed docs
3. Add scripts to `scripts/` for automation
4. Add templates to `assets/` for output files

## Structure

```
{skill_name}/
├── SKILL.md              # Main skill definition
├── README.md             # This file (development notes)
├── scripts/              # Executable automation scripts
│   └── example.sh
├── references/           # Reference documentation
│   └── example-guide.md
└── assets/               # Templates and boilerplate
    └── template.txt
```

## Guidelines Compliance

- ✅ SKILL.md under 500 lines
- ✅ References one level deep
- ✅ Description includes when-to-use triggers
- ✅ Lowercase directory names

## Notes

Add any development notes, TODOs, or considerations here.
"""


def slugify(name: str) -> str:
    """Convert skill name to lowercase slug format."""
    return name.lower().replace(' ', '-').replace('_', '-')


def title_case(name: str) -> str:
    """Convert slug to Title Case."""
    return ' '.join(word.capitalize() for word in name.replace('-', ' ').split())


def create_skill_structure(skill_name: str, output_path: Path) -> None:
    """Create the skill directory structure."""
    skill_slug = slugify(skill_name)
    skill_title = title_case(skill_slug)
    skill_dir = output_path / skill_slug

    # Check if skill already exists
    if skill_dir.exists():
        print(f"❌ Error: Skill '{skill_slug}' already exists at {skill_dir}")
        sys.exit(1)

    # Create directories
    directories = [
        skill_dir,
        skill_dir / "scripts",
        skill_dir / "references",
        skill_dir / "assets",
    ]

    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)
        print(f"✅ Created: {directory.relative_to(Path.cwd())}/")

    # Prompt for description
    print(f"\n📝 Creating skill: {skill_title}")
    print("=" * 60)
    description = input("Enter skill description (include when to use it): ").strip()

    if not description:
        description = f"[TODO: Add description with when-to-use context]"

    # Create SKILL.md
    skill_md_path = skill_dir / "SKILL.md"
    skill_md_content = SKILL_MD_TEMPLATE.format(
        name=skill_slug,
        description=description,
        title=skill_title
    )
    skill_md_path.write_text(skill_md_content)
    print(f"✅ Created: {skill_md_path.relative_to(Path.cwd())}")

    # Create README.md
    readme_path = skill_dir / "README.md"
    readme_content = README_TEMPLATE.format(
        title=skill_title,
        date=datetime.now().strftime("%Y-%m-%d"),
        path=skill_dir.relative_to(Path.cwd()),
        skill_name=skill_slug
    )
    readme_path.write_text(readme_content)
    print(f"✅ Created: {readme_path.relative_to(Path.cwd())}")

    # Create example reference file
    reference_path = skill_dir / "references" / "example-guide.md"
    reference_content = REFERENCE_TEMPLATE.format(
        title=skill_title,
        skill_name=skill_slug
    )
    reference_path.write_text(reference_content)
    print(f"✅ Created: {reference_path.relative_to(Path.cwd())}")

    # Create example script
    script_path = skill_dir / "scripts" / "example.sh"
    script_content = SCRIPT_TEMPLATE.format(
        title=skill_title,
        skill_name=skill_slug
    )
    script_path.write_text(script_content)
    script_path.chmod(0o755)  # Make executable
    print(f"✅ Created: {script_path.relative_to(Path.cwd())} (executable)")

    # Create example asset
    asset_path = skill_dir / "assets" / "template.txt"
    asset_content = f"# {skill_title} Template\n\nAdd your template content here.\n"
    asset_path.write_text(asset_content)
    print(f"✅ Created: {asset_path.relative_to(Path.cwd())}")

    # Summary
    print("\n" + "=" * 60)
    print(f"✅ Skill '{skill_slug}' created successfully!")
    print("=" * 60)
    print(f"\n📁 Location: {skill_dir.relative_to(Path.cwd())}")
    print(f"📝 Description: {description}")
    print("\n📋 Next Steps:")
    print(f"   1. Edit {skill_md_path.relative_to(Path.cwd())} to define your workflow")
    print(f"   2. Add detailed docs to references/")
    print(f"   3. Add automation scripts to scripts/")
    print(f"   4. Test the skill with Claude")
    print(f"   5. Run: python3 .claude/scripts/package-skill.py {skill_dir}")
    print()


def main():
    parser = argparse.ArgumentParser(
        description="Initialize a new Claude Code skill with proper structure.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 .claude/scripts/init-skill.py my-awesome-skill
  python3 .claude/scripts/init-skill.py database-migrator --path .claude/skills

The script will create:
  <skill-name>/
  ├── SKILL.md              # Main skill definition
  ├── README.md             # Development notes
  ├── scripts/              # Automation scripts
  │   └── example.sh
  ├── references/           # Reference documentation
  │   └── example-guide.md
  └── assets/               # Templates and boilerplate
      └── template.txt
        """
    )

    parser.add_argument(
        "skill_name",
        help="Name of the skill (will be converted to lowercase-slug-format)"
    )

    parser.add_argument(
        "--path",
        type=Path,
        default=Path(".claude/skills"),
        help="Output directory for the skill (default: .claude/skills)"
    )

    args = parser.parse_args()

    # Ensure output path exists
    args.path.mkdir(parents=True, exist_ok=True)

    # Create the skill
    create_skill_structure(args.skill_name, args.path)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Validate and package a Claude Code skill into a distributable .skill file.

Usage:
    python3 .claude/scripts/package-skill.py <path/to/skill> [output-directory]

Example:
    python3 .claude/scripts/package-skill.py .claude/skills/my-skill
    python3 .claude/scripts/package-skill.py .claude/skills/my-skill dist/
"""

import argparse
import os
import re
import sys
import yaml
import zipfile
from pathlib import Path
from typing import List, Tuple, Dict


class SkillValidator:
    """Validates Claude Code skill structure and content."""

    def __init__(self, skill_path: Path):
        self.skill_path = skill_path
        self.skill_name = skill_path.name
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.info: List[str] = []

    def validate(self) -> bool:
        """Run all validation checks. Returns True if valid."""
        print(f"🔍 Validating skill: {self.skill_name}")
        print("=" * 60)

        self._check_directory_exists()
        self._check_skill_md_exists()
        self._validate_frontmatter()
        self._validate_description()
        self._validate_skill_md_size()
        self._check_directory_naming()
        self._check_reference_depth()
        self._check_reference_file_sizes()
        self._check_no_auxiliary_docs()
        self._check_script_permissions()

        self._print_results()

        return len(self.errors) == 0

    def _check_directory_exists(self):
        """Check that skill directory exists."""
        if not self.skill_path.exists():
            self.errors.append(f"Skill directory not found: {self.skill_path}")
        elif not self.skill_path.is_dir():
            self.errors.append(f"Path is not a directory: {self.skill_path}")
        else:
            self.info.append(f"✅ Skill directory exists")

    def _check_skill_md_exists(self):
        """Check that SKILL.md exists."""
        skill_md = self.skill_path / "SKILL.md"
        if not skill_md.exists():
            self.errors.append("SKILL.md not found")
        elif not skill_md.is_file():
            self.errors.append("SKILL.md is not a file")
        else:
            self.info.append("✅ SKILL.md exists")

    def _validate_frontmatter(self):
        """Validate YAML frontmatter."""
        skill_md = self.skill_path / "SKILL.md"
        if not skill_md.exists():
            return

        content = skill_md.read_text()

        # Check for frontmatter delimiters
        if not content.startswith("---\n"):
            self.errors.append("SKILL.md must start with YAML frontmatter (---)")
            return

        # Extract frontmatter
        parts = content.split("---\n", 2)
        if len(parts) < 3:
            self.errors.append("SKILL.md frontmatter not properly closed with ---")
            return

        frontmatter_text = parts[1]

        # Parse YAML
        try:
            frontmatter = yaml.safe_load(frontmatter_text)
        except yaml.YAMLError as e:
            self.errors.append(f"Invalid YAML in frontmatter: {e}")
            return

        # Check required fields
        if not isinstance(frontmatter, dict):
            self.errors.append("Frontmatter must be a YAML dictionary")
            return

        if "name" not in frontmatter:
            self.errors.append("Frontmatter missing required field: 'name'")
        elif not isinstance(frontmatter["name"], str):
            self.errors.append("Frontmatter 'name' must be a string")
        elif frontmatter["name"] != self.skill_name:
            self.warnings.append(
                f"Frontmatter name '{frontmatter['name']}' doesn't match directory '{self.skill_name}'"
            )
        else:
            self.info.append(f"✅ Valid 'name' field: {frontmatter['name']}")

        if "description" not in frontmatter:
            self.errors.append("Frontmatter missing required field: 'description'")
        elif not isinstance(frontmatter["description"], str):
            self.errors.append("Frontmatter 'description' must be a string")
        else:
            self.info.append("✅ Valid 'description' field")

    def _validate_description(self):
        """Validate description quality."""
        skill_md = self.skill_path / "SKILL.md"
        if not skill_md.exists():
            return

        content = skill_md.read_text()
        parts = content.split("---\n", 2)
        if len(parts) < 3:
            return

        try:
            frontmatter = yaml.safe_load(parts[1])
        except yaml.YAMLError:
            return

        if "description" not in frontmatter:
            return

        description = frontmatter["description"]

        # Check for "when to use" triggers
        trigger_patterns = [
            r"use when",
            r"when asked",
            r"when you need",
            r"when creating",
            r"when working with",
        ]

        has_trigger = any(re.search(pattern, description.lower()) for pattern in trigger_patterns)

        if not has_trigger:
            self.warnings.append(
                "Description should include 'when to use' context (e.g., 'Use when asked to...')"
            )
        else:
            self.info.append("✅ Description includes usage triggers")

        # Check minimum length
        if len(description) < 30:
            self.warnings.append(
                f"Description is short ({len(description)} chars). Consider adding more detail."
            )

    def _validate_skill_md_size(self):
        """Check that SKILL.md is under 500 lines."""
        skill_md = self.skill_path / "SKILL.md"
        if not skill_md.exists():
            return

        lines = skill_md.read_text().count('\n') + 1

        if lines > 500:
            self.warnings.append(
                f"SKILL.md is {lines} lines (recommended: under 500). "
                "Consider moving content to references/"
            )
        else:
            self.info.append(f"✅ SKILL.md size: {lines} lines (under 500)")

    def _check_directory_naming(self):
        """Check for lowercase directory names."""
        bundled_dirs = ["scripts", "references", "assets"]
        issues = []

        for dir_name in self.skill_path.iterdir():
            if dir_name.is_dir() and dir_name.name in ["SCRIPTS", "REFERENCE", "REFERENCES", "ASSETS"]:
                correct_name = dir_name.name.lower()
                if correct_name == "reference":
                    correct_name = "references"
                issues.append(f"{dir_name.name}/ should be {correct_name}/")

        if issues:
            self.errors.append("Directory naming: " + ", ".join(issues))
        else:
            existing_dirs = [d.name for d in self.skill_path.iterdir() if d.is_dir()]
            valid_dirs = [d for d in existing_dirs if d in bundled_dirs]
            if valid_dirs:
                self.info.append(f"✅ Directory naming: {', '.join(valid_dirs)}")

    def _check_reference_depth(self):
        """Check that references are only one level deep."""
        references_dir = self.skill_path / "references"
        if not references_dir.exists():
            return

        nested_files = []
        for item in references_dir.rglob("*"):
            if item.is_file():
                # Check if file is more than one level deep
                relative = item.relative_to(references_dir)
                if len(relative.parts) > 1:
                    nested_files.append(str(relative))

        if nested_files:
            self.errors.append(
                f"Nested reference files found (should be one level deep): {', '.join(nested_files)}"
            )
        else:
            ref_count = len(list(references_dir.glob("*.md")))
            if ref_count > 0:
                self.info.append(f"✅ Reference depth: all files one level deep ({ref_count} files)")

    def _check_reference_file_sizes(self):
        """Check if reference files over 100 lines have table of contents."""
        references_dir = self.skill_path / "references"
        if not references_dir.exists():
            return

        for ref_file in references_dir.glob("*.md"):
            lines = ref_file.read_text().count('\n') + 1
            if lines > 100:
                content = ref_file.read_text()
                # Check for table of contents
                toc_patterns = [
                    r"## Table of Contents",
                    r"## Contents",
                    r"# Table of Contents",
                ]
                has_toc = any(re.search(pattern, content, re.IGNORECASE) for pattern in toc_patterns)

                if not has_toc:
                    self.warnings.append(
                        f"{ref_file.name} is {lines} lines but missing table of contents"
                    )

    def _check_no_auxiliary_docs(self):
        """Check for auxiliary documentation that shouldn't be included."""
        auxiliary_files = ["CHANGELOG.md", "INSTALL.md", "CONTRIBUTING.md"]
        found = []

        for aux_file in auxiliary_files:
            if (self.skill_path / aux_file).exists():
                found.append(aux_file)

        if found:
            self.warnings.append(
                f"Auxiliary docs found (should be in README.md): {', '.join(found)}"
            )

    def _check_script_permissions(self):
        """Check that scripts are executable."""
        scripts_dir = self.skill_path / "scripts"
        if not scripts_dir.exists():
            return

        non_executable = []
        for script in scripts_dir.rglob("*"):
            if script.is_file() and script.suffix in [".sh", ".py"]:
                if not os.access(script, os.X_OK):
                    non_executable.append(script.name)

        if non_executable:
            self.warnings.append(
                f"Scripts not executable: {', '.join(non_executable)}. Run: chmod +x scripts/*"
            )
        else:
            script_count = len(list(scripts_dir.glob("*")))
            if script_count > 0:
                self.info.append(f"✅ All scripts are executable ({script_count} files)")

    def _print_results(self):
        """Print validation results."""
        print()

        if self.errors:
            print("❌ ERRORS:")
            for error in self.errors:
                print(f"   • {error}")
            print()

        if self.warnings:
            print("⚠️  WARNINGS:")
            for warning in self.warnings:
                print(f"   • {warning}")
            print()

        if self.info and not self.errors:
            print("ℹ️  INFO:")
            for info in self.info:
                print(f"   • {info}")
            print()

        print("=" * 60)
        if self.errors:
            print(f"❌ Validation FAILED: {len(self.errors)} error(s), {len(self.warnings)} warning(s)")
        else:
            print(f"✅ Validation PASSED: {len(self.warnings)} warning(s)")
        print("=" * 60)


def package_skill(skill_path: Path, output_dir: Path) -> Path:
    """Package skill into .skill file (zip format)."""
    skill_name = skill_path.name
    output_file = output_dir / f"{skill_name}.skill"

    print(f"\n📦 Packaging skill: {skill_name}")
    print("=" * 60)

    # Create zip file
    with zipfile.ZipFile(output_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file_path in skill_path.rglob("*"):
            if file_path.is_file():
                # Skip README.md and auxiliary docs
                if file_path.name in ["README.md", "CHANGELOG.md", "INSTALL.md"]:
                    continue

                arcname = file_path.relative_to(skill_path.parent)
                zipf.write(file_path, arcname)
                print(f"   Added: {arcname}")

    file_size = output_file.stat().st_size / 1024  # KB
    print("=" * 60)
    print(f"✅ Package created: {output_file}")
    print(f"📊 Size: {file_size:.1f} KB")
    print("=" * 60)

    return output_file


def main():
    parser = argparse.ArgumentParser(
        description="Validate and package a Claude Code skill.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 .claude/scripts/package-skill.py .claude/skills/my-skill
  python3 .claude/scripts/package-skill.py .claude/skills/my-skill dist/

Validation checks:
  ✓ SKILL.md exists with valid YAML frontmatter
  ✓ Required fields: name, description
  ✓ Description includes "when to use" triggers
  ✓ SKILL.md under 500 lines
  ✓ Lowercase directory names (scripts/, references/, assets/)
  ✓ References one level deep (no nested subdirectories)
  ✓ Reference files over 100 lines have table of contents
  ✓ No auxiliary docs (README.md excluded from package)
  ✓ Scripts are executable
        """
    )

    parser.add_argument(
        "skill_path",
        type=Path,
        help="Path to the skill directory"
    )

    parser.add_argument(
        "output_dir",
        type=Path,
        nargs="?",
        default=Path("dist"),
        help="Output directory for .skill file (default: dist/)"
    )

    parser.add_argument(
        "--validate-only",
        action="store_true",
        help="Only validate, don't create package"
    )

    args = parser.parse_args()

    # Validate skill
    validator = SkillValidator(args.skill_path)
    is_valid = validator.validate()

    if not is_valid:
        print("\n❌ Skill validation failed. Fix errors before packaging.")
        sys.exit(1)

    # Package skill
    if not args.validate_only:
        args.output_dir.mkdir(parents=True, exist_ok=True)
        output_file = package_skill(args.skill_path, args.output_dir)

        print("\n📋 Next Steps:")
        print(f"   1. Test the skill with Claude")
        print(f"   2. Share: {output_file}")
        print(f"   3. Install: unzip {output_file.name} -d .claude/skills/")
        print()


if __name__ == "__main__":
    main()

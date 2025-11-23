#!/usr/bin/env python3
import os
import zipfile
import argparse
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def create_skill_package(skill_dir: Path, output_dir: Path):
    """
    Creates a .skill package (zip archive) for a single skill.

    Args:
        skill_dir: The absolute path to the skill's directory.
        output_dir: The absolute path to the output directory for .skill files.
    """
    skill_name = skill_dir.name
    skill_file_path = output_dir / f"{skill_name}.skill"
    skill_md_path = skill_dir / "SKILL.md"

    if not skill_md_path.is_file():
        logging.warning(f"Skipping '{skill_name}': 'SKILL.md' not found.")
        return

    logging.info(f"Processing skill: {skill_name}")

    try:
        with zipfile.ZipFile(skill_file_path, 'w', zipfile.ZIP_DEFLATED) as skill_zip:
            # 1. Add SKILL.md
            skill_zip.write(skill_md_path, arcname="SKILL.md")
            logging.info(f"  - Added SKILL.md")

            # 2. Add files from 'references', 'scripts', and 'assets' directories
            for subdir_name in ["references", "scripts", "assets"]:
                subdir = skill_dir / subdir_name
                if subdir.is_dir():
                    for root, _, files in os.walk(subdir):
                        for file in files:
                            # Exclude hidden files
                            if file.startswith('.'):
                                continue
                            
                            file_path = Path(root) / file
                            archive_path = file_path.relative_to(skill_dir)
                            skill_zip.write(file_path, arcname=archive_path)
                            logging.info(f"  - Added {archive_path}")

        logging.info(f"Successfully created skill package: {skill_file_path}")

    except Exception as e:
        logging.error(f"Failed to create skill package for '{skill_name}': {e}")
        # Clean up partially created file on error
        if skill_file_path.exists():
            os.remove(skill_file_path)

def package_skills(skills_base_dir: Path, output_dir: Path):
    """
    Packages all skills from a source directory into .skill files.

    Args:
        skills_base_dir: The absolute path to the directory containing all skill subdirectories.
        output_dir: The absolute path where the .skill files will be saved.
    """
    if not skills_base_dir.is_dir():
        logging.error(f"Error: The specified skills directory does not exist: {skills_base_dir}")
        return

    # Create the output directory if it doesn't exist
    output_dir.mkdir(parents=True, exist_ok=True)
    logging.info(f"Output directory is: {output_dir.resolve()}")

    skill_dirs = [d for d in skills_base_dir.iterdir() if d.is_dir() and not d.name.startswith('.')]

    if not skill_dirs:
        logging.warning(f"No skill directories found in {skills_base_dir}")
        return

    logging.info(f"Found {len(skill_dirs)} potential skills.")

    for skill_dir in skill_dirs:
        create_skill_package(skill_dir.resolve(), output_dir.resolve())

def main():
    """Main function to parse arguments and run the packaging process."""
    parser = argparse.ArgumentParser(
        description="""
        Packages Claude skills from a directory into .skill files.
        Each subdirectory in the source directory is treated as a skill.
        A .skill file is a zip archive containing SKILL.md and the
        contents of 'references/', 'scripts/', and 'assets/' subdirectories.
        """
    )
    parser.add_argument(
        "skills_dir",
        type=str,
        help="The absolute path to the directory containing the skill subdirectories."
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default=str(Path.cwd() / "dist" / "skills"),
        help="The absolute path to the output directory for the .skill files. Defaults to 'dist/skills' in the current working directory."
    )

    args = parser.parse_args()

    skills_dir_path = Path(args.skills_dir).resolve()
    output_dir_path = Path(args.output_dir).resolve()

    package_skills(skills_dir_path, output_dir_path)

if __name__ == "__main__":
    main()

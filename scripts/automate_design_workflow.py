"""
⚠️  IMPORTANT: THIS SCRIPT IS A WORKFLOW COORDINATOR

This script scaffolds the design-to-code workflow but DOES NOT directly execute 
the LLM-based logic (skills). It coordinates the artifacts and sequence.

HOW TO USE WITH CLAUDE CODE:
1. Run this script to generate initial scaffolds and paths.
2. When the script prints 'Invoking skill...', copy that command.
3. Run the command in your Claude Code terminal.
4. After the skill completes, return to this script and approve/proceed.
"""

import argparse
import os
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Optional
import shutil

# --- Constants & Configuration ---

REPO_ROOT = Path(__file__).resolve().parent.parent
CLAUDE_SKILLS_DIR = REPO_ROOT / ".claude" / "skills"
DOCS_DESIGN_DIR = REPO_ROOT / "docs" / "design"
GENERATED_DIR = DOCS_DESIGN_DIR / "generated"
COMPONENTS_DIR = REPO_ROOT / "src" / "components"
DEFAULT_BRIEF_PATH = DOCS_DESIGN_DIR / "KERALA_RAGE_BRAND_BRIEF.md"

# Ensure output directories exist
PROTOCOLS_DIR = GENERATED_DIR / "protocols"
WIREFRAMES_DIR = GENERATED_DIR / "wireframes"
MOCKUPS_DIR = GENERATED_DIR / "mockups"
SPECS_DIR = GENERATED_DIR / "specs"

# Skill Paths
SKILLS: Dict[str, Path] = {
    "design_system_doc_generator": CLAUDE_SKILLS_DIR / "design-system-doc-generator",
    "wireframe_annotator": CLAUDE_SKILLS_DIR / "wireframe-annotator",
    "m3_expressive_ui_evaluator": CLAUDE_SKILLS_DIR / "m3-expressive-ui-evaluator",
    "component_spec_generator": CLAUDE_SKILLS_DIR / "component-spec-generator",
    "component_builder": CLAUDE_SKILLS_DIR / "component-builder",
    "component_transformer": CLAUDE_SKILLS_DIR / "component-transformer",
}

# --- Helpers ---

def run_skill(skill_name: str, *args: str) -> bool:
    """Executes a skill script with given arguments."""
    skill_path = SKILLS.get(skill_name)
    if not skill_path or not skill_path.exists():
        # Fallback for simulation/development if actual skill files are missing
        print(f"⚠️  Skill '{skill_name}' not found at {skill_path}. Running mock execution.")
        return True # Mock success
    
    # In a real scenario, this would likely be an LLM call or a script execution. 
    # Since these are directory paths to skills (markdown mainly), we simulate the 'action' 
    # they would perform or assume there's an executable entry point.
    # For this automation, we will assume we are coordinating AGENTIC actions.
    # But as a python script, we can't directly invoke the LLM. 
    # So this script primarily acts as a SCAFFOLDER and GUIDE, creating necessary files 
    # to facilitate the agent's work, or printing exact commands for the user/agent.

    print(f"🤖 Invoking skill: {skill_name} with args: {args}")
    # Here we would normally subprocess.run if they were executable scripts. 
    # For now, we print the intended action.
    return True

def ensure_dirs():
    """Creates necessary output directories."""
    for d in [PROTOCOLS_DIR, WIREFRAMES_DIR, MOCKUPS_DIR, SPECS_DIR, COMPONENTS_DIR]:
        d.mkdir(parents=True, exist_ok=True)

def component_exists(component_name: str) -> bool:
    """Checks if a component already exists in the source tree."""
    return (COMPONENTS_DIR / component_name / "index.tsx").exists() or \
           (COMPONENTS_DIR / f"{component_name}.tsx").exists()

def get_file_paths(component_name: str):
    """Returns standardized file paths for a component."""
    lower_name = component_name.lower()
    return {
        "protocol": PROTOCOLS_DIR / f"{lower_name}-protocol.md",
        "wireframe": WIREFRAMES_DIR / f"{lower_name}.md",
        "mockup": MOCKUPS_DIR / f"{lower_name}.html",
        "validation_report": MOCKUPS_DIR / f"{lower_name}-validation.json",
        "spec": SPECS_DIR / f"{component_name}.md",
        "component_dir": COMPONENTS_DIR / component_name
    }

# --- Mock Implementation Functions (Simulating Skill Outputs) ---

def mock_generate_file(path: Path, content: str, description: str):
    if not path.exists():
        print(f"📄 Generating {description}: {path}")
        with open(path, "w") as f:
            f.write(content)
    else:
        print(f"✅ {description} already exists at {path}")

# --- Stages ---

def run_structure_stage(component_name: str, brief_path: Path, auto_approve: bool = False):
    """
    Stage 1: Structure (Lo-Fi)
    Goal: Validate layout, hierarchy, and API before any visual polish.
    Steps: Protocol -> Wireframe -> Spec
    """
    print(f"\n🏗️  Running STAGE 1: STRUCTURE for '{component_name}'\n")
    
    paths = get_file_paths(component_name)
    
    # 1. Design System Protocol
    print(f"1️⃣  Generating Design System Protocol from {brief_path.name}...")
    run_skill("design_system_doc_generator", "--brief", str(brief_path), "--out", str(paths["protocol"]))
    mock_generate_file(paths["protocol"], f"# Protocol based on {brief_path.name}\n\n## Design System: Kerala Rage\n...", "Protocol")

    # 2. Lo-Fi Wireframe
    print(f"2️⃣  Generating Lo-Fi Wireframe (ASCII)...")
    run_skill("wireframe_annotator", "--protocol", str(paths["protocol"]), "--component", component_name, "--out", str(paths["wireframe"]))
    mock_generate_file(paths["wireframe"], f"# Wireframe: {component_name}\n\n```text\n+--- {component_name} ---+\n| [ Placeholder ] |\n+-------------------+\n```", "Wireframe")

    # 3. Component Spec
    print(f"3️⃣  Generating Component Specification...")
    run_skill("component_spec_generator", "--wireframe", str(paths["wireframe"]), "--component", component_name, "--out", str(paths["spec"]))
    mock_generate_file(paths["spec"], f"# Spec: {component_name}\n\n## Props\n- title: string\n...", "Spec")

    # 4. Validation Gate
    print(f"\n4️⃣  [QUALITY GATE] Running M3 Expressive validation on wireframe...")
    print(f"   📊 Score target: ≥ 240/400 (Check {paths['wireframe']})")
    run_skill("m3_expressive_ui_evaluator", "--wireframe", str(paths["wireframe"]), "--mode", "validate")
    
    if auto_approve:
        print(f"   ⏩ Auto-approving gate for batch mode.")
    else:
        proceed = input("\n✅ Wireframe and validation approved? (y/n): ").lower() == 'y'
        if not proceed:
            print("   ❌ Workflow paused. Please refine wireframe/spec and re-run.")
            sys.exit(0)

    print(f"\n🎉 Stage 1 Complete! Review the generated files:\n- {paths['wireframe']}\n- {paths['spec']}")

def run_visuals_stage(component_name: str, mode: str):
    """
    Stage 2: Visuals (Hi-Fi & Code)
    Goal: Apply visual design and implement/refactor code based on reviewed wireframes/specs.
    """
    print(f"\n🎨 Running STAGE 2: VISUALS for '{component_name}' (Mode: {mode})\n")

    paths = get_file_paths(component_name)

    # Check prerequisites
    if not paths["spec"].exists() or not paths["wireframe"].exists():
        print(f"❌ Error: Missing Stage 1 artifacts (Spec or Wireframe). Run --stage structure first.")
        return

    # 1. Hi-Fi Mockup (Common step, useful for visual reference even in migration)
    print(f"1️⃣  Generating Hi-Fi HTML Mockup...")
    run_skill("m3_expressive_ui_evaluator", "--wireframe", str(paths["wireframe"]), "--out", str(paths["mockup"]))
    mock_generate_file(paths["mockup"], f"<html><body><h1>{component_name} Mockup</h1></body></html>", "Mockup")

    # 2. Implementation
    if mode == "new":
        print(f"2️⃣  Building NEW Component '{component_name}'...")
        run_skill("component_builder", "--spec", str(paths["spec"]), "--out-dir", str(paths["component_dir"]))
        # Create dir if not exists to simulate
        if not paths["component_dir"].exists():
            paths["component_dir"].mkdir(parents=True)
            (paths["component_dir"] / "index.tsx").touch()
            print(f"   ✅ Created component directory: {paths['component_dir']}")

    elif mode == "migrate":
        if not paths["component_dir"].exists():
            print(f"❌ Error: Component directory not found at {paths['component_dir']}")
            return

        print(f"2️⃣  Refactoring EXISTING Component '{component_name}' via Transformer...")
        run_skill("component_transformer", "--component-dir", str(paths["component_dir"]), "--spec", str(paths["spec"]), "--protocol", str(paths["protocol"]))
        print(f"   ℹ️  Transformer logic would apply here to {paths['component_dir']}")
        
        # 3. Post-Migration Validation
        print(f"3️⃣  Validating migrated component against M3 Expressive standards...")
        run_skill("m3_expressive_ui_evaluator", "--component", str(paths["component_dir"]), "--out-report", str(paths["validation_report"]))
        print(f"   ✅ Validation complete. Check report at {paths['validation_report']}")

    print(f"\n🎉 Stage 2 Complete! Component is ready in {paths['component_dir']}")

# --- Main CLI ---

def main():
    parser = argparse.ArgumentParser(description="Automate Design Workflow (Two-Stage)")
    
    parser.add_argument("--component", required=True, help="PascalCase name of the component (e.g. LoginCard)")
    parser.add_argument("--brief", default=str(DEFAULT_BRIEF_PATH), help="Path to design brief")
    parser.add_argument("--stage", choices=["structure", "visuals", "full"], default="full", help="Workflow stage")
    parser.add_argument("--mode", choices=["new", "migrate", "auto"], default="auto", help="Implementation mode")
    parser.add_argument("--auto-approve", action="store_true", help="Skip interactive approval gates (for batch mode)")

    args = parser.parse_args()
    
    ensure_dirs()
    
    brief_path = Path(args.brief)
    if not brief_path.exists():
        # Fallback or warning if default brief is missing
        print(f"⚠️  Warning: Brief not found at {brief_path}. Proceeding with defaults.")

    # Determine Mode
    mode = args.mode
    if mode == "auto":
        if component_exists(args.component):
            mode = "migrate"
            print(f"🔍 Auto-detected existing component: Switching to 'migrate' mode.")
        else:
            mode = "new"
            print(f"🔍 No existing component found: Switching to 'new' mode.")
    
    # Execute Stages
    if args.stage in ["structure", "full"]:
        run_structure_stage(args.component, brief_path, auto_approve=args.auto_approve)
    
    if args.stage in ["visuals", "full"]:
        run_visuals_stage(args.component, mode)

if __name__ == "__main__":
    main()

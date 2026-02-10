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
    print(f"📄 Generating {description}: {path}")
    with open(path, "w") as f:
        f.write(content)

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
    print(f"   📊 Score target: ≥ 320/400 (Check {paths['wireframe']})")
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

def run_screen_visuals_stage(screen_name: str):
    """
    Stage 2: Screen Visuals (Hi-Fi)
    Goal: Transform structural React files into Hi-Fi implementations using hifi-notes.
    """
    print(f"\n🎨 Running STAGE 2: VISUALS for Screen '{screen_name}'\n")
    
    view_path = REPO_ROOT / "frontend" / "src" / "layouts" / "KrDarkShell" / "views" / f"KrDark{screen_name}.tsx"
    hifi_notes = DOCS_DESIGN_DIR / "hifi" / f"{screen_name}-hifi.md"
    
    if not view_path.exists():
        print(f"❌ Error: Missing structural view at {view_path}. Run Stage 1/Scaffolding first.")
        return
        
    if not hifi_notes.exists():
        print(f"❌ Error: Missing Hi-Fi notes at {hifi_notes}. Generate them first.")
        return

    print(f"1️⃣  Transforming {view_path.name} using Hi-Fi notes from {hifi_notes.name}...")
    # This invokes the transformer logic on the screen file
    run_skill("component_transformer", "--file", str(view_path), "--hifi-notes", str(hifi_notes))
    
    print(f"✅ Screen transformation initiated for {screen_name}.")

def run_screens_stage(screen_name: str, brief_path: Path):
    """
    Stage: Screens (Lo-Fi)
    Goal: Define full-page layout and discover component/asset needs.
    """
    print(f"\n📱 Running STAGE: SCREENS for '{screen_name}'\n")
    
    # 1. Screen Protocol (Ensures we have a shared protocol for the screen)
    protocol_path = PROTOCOLS_DIR / "kerala-rage-protocol.md"
    print(f"1️⃣  Ensuring Kerala Rage Protocol exists...")
    run_skill("design_system_doc_generator", "--brief", str(brief_path), "--out", str(protocol_path))
    # Note: In mock mode, we just ensure it exists.
    if not protocol_path.exists():
        mock_generate_file(protocol_path, "# Kerala Rage Protocol\n\nDerived from design briefs.", "Global Protocol")

    # 2. Lo-Fi Screen Wireframe
    out_path = WIREFRAMES_DIR / f"{screen_name.lower()}-screen.md"
    print(f"2️⃣  Generating Lo-Fi Screen Wireframe...")
    run_skill("wireframe_annotator", "--protocol", str(protocol_path), "--screen", screen_name, "--out", str(out_path))
    
    mock_content = f"""# Wireframe: {screen_name} (Screen)

<layout>
```text
+------------------------------------------+
| [ Header / Nav ]                         |
+------------------------------------------+
|                                          |
|  [ Hero / Manifesto ]                    |
|                                          |
+------------------------------------------+
|                                          |
|  [ Content / Cards ]                     |
|                                          |
+------------------------------------------+
| [ Footer ]                               |
+------------------------------------------+
```
</layout>

<tokens>
- **Container**: `surface-charcoal`, `shadow-viscous`
- **HeroTitle**: `Hero-144px`, `Solidarity-800`, `Waratah-Red`
- **Body**: `Body-16px`, `Direct-Action-450`, `On-Surface-Ash`
- **PrimaryAction**: `Baru-Gold-Surface`, `shadow-hover-rise`
</tokens>

<assets>
- Hero motif: `Elephant-Motif`, 1x, top-right, 20% opacity.
- Background texture: `Torn-Edge-Texture`, full-width, bottom.
- Icon set: `Solidarity-Icon-Pack` (filter, sort, bookmark).
</assets>

<components>
- ManifestoCard (card)
  - Used: hero manifesto section.
  - Assets: background motif (elephant), torn edge.
- SkillBreakdownCard (card)
  - Used: data visualization section.
  - Assets: botanical-motif.
</components>

<annotations>
1 | hero_title        | Content: max-chars: 80; Style: display-heading; State: default.
2 | btn_primary_cta   | Action: onClick → POST /api/apply, then nav → /application/success; State: default, loading, error.
3 | job_search_input  | Input: type=text; max-chars: 60; Validation: non-empty; State: default, focused, error.
4 | job_list_item     | Data: bound to jobs[]; Layout: 1-line title, 1-line org/location; Truncate: ellipsis on overflow.
5 | toast_error       | State: visible when form submit fails; Content: "Something went wrong"; Auto-hide: 6s; Role: status.
6 | layout_grid       | Breakpoints: mobile=1col, tablet=2col, desktop=3col; Gutter: 16px.
7 | form_apply        | System: onSubmit → POST /api/applications; Retry: 3x on 5xx.
</annotations>

<notes>
- Flow: primary path is “Read manifesto → Search jobs → Apply”.
- Edge cases: empty job list state, offline banner.
</notes>
"""
    mock_generate_file(out_path, mock_content, "Screen Wireframe")

    print(f"\n🎉 Screen Stage Complete! Review: {out_path}")

def regenerate_discovery_summary():
    """
    Scans all generated screen wireframes and consolidates components/assets into a summary.
    """
    print(f"\n📊 Regenerating Discovery Summary...")
    
    import re
    from collections import Counter
    
    summary_path = GENERATED_DIR / "lofi-discovery-summary.md"
    screens = sorted(WIREFRAMES_DIR.glob("*-screen.md"))
    
    all_components = Counter()
    all_assets = set()
    component_details = {} # Name -> {type, assets}
    
    for screen in screens:
        with open(screen, 'r') as f:
            content = f.read()
            
            # Extract Components
            comp_match = re.search(r"<components>(.*?)</components>", content, re.DOTALL)
            if comp_match:
                comp_lines = comp_match.group(1).strip().split('\n')
                current_comp = None
                for line in comp_lines:
                    orig_line = line
                    line = line.strip()
                    if line.startswith("- ") and "Assets:" not in line and "(" in line:
                        match = re.search(r"- (.*?) \((.*?)\)", line)
                        if match:
                            current_comp = match.group(1).strip()
                            comp_type = match.group(2).strip()
                            all_components[current_comp] += 1
                            if current_comp not in component_details:
                                component_details[current_comp] = {"type": comp_type, "assets": []}
                    elif "Assets:" in line and current_comp:
                        assets_part = line.split("Assets:")[1].strip()
                        # Clean up assets (remove parentheses and split by comma)
                        cleaned_assets = re.sub(r"\(.*?\)", "", assets_part).split(",")
                        component_details[current_comp]["assets"].extend([a.strip() for a in cleaned_assets if a.strip() and a.strip().lower() != "none"])

            # Extract Assets
            asset_match = re.search(r"<assets>(.*?)</assets>", content, re.DOTALL)
            if asset_match:
                asset_lines = asset_match.group(1).strip().split('\n')
                for line in asset_lines:
                    line = line.strip()
                    if line.startswith("- "):
                        all_assets.add(line.replace("- ", "").strip())

    # Build Markdown
    md = [
        "# Kerala Rage Lo-Fi Discovery Summary",
        "\nThis document is automatically generated by `automate_design_workflow.py`.",
        "\n## 📱 Screens & Artifacts",
        "| Screen | Wireframe | Status |",
        "| :--- | :--- | :--- |"
    ]
    
    for screen in screens:
        name = screen.name.replace("-screen.md", "").capitalize()
        rel_path = f"generated/wireframes/{screen.name}"
        md.append(f"| **{name}** | [{screen.name}](file://{screen}) | ✅ Lo-Fi Only |")

    md.append("\n## 🏗️ Candidate Component Backlog")
    md.append("| Component | Count | Type | Asset Needs |")
    md.append("| :--- | :--- | :--- | :--- |")
    for comp, count in sorted(all_components.items()):
        details = component_details[comp]
        assets = ", ".join(sorted(set(details["assets"]))) if details["assets"] else "none"
        md.append(f"| **{comp}** | {count} | {details['type']} | {assets} |")

    md.append("\n## 🎨 Image & Motif Backlogs")
    md.append("Consolidated requirements for high-fidelity assets:\n")
    for asset in sorted(all_assets):
        md.append(f"- {asset}")

    md.append("\n## 📋 Next Mission: High-Fidelity Promotion")
    md.append("1. Select components from the backlog above for Spec/Mockup generation.")
    md.append("2. Commission image assets identified above.")
    
    with open(summary_path, 'w') as f:
        f.write("\n".join(md))
    
    print(f"✅ Discovery summary updated: {summary_path}")

# --- Main CLI ---

def main():
    parser = argparse.ArgumentParser(description="Automate Design Workflow (Two-Stage + Screens)")
    
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--component", help="PascalCase name of the component")
    group.add_argument("--screen", help="PascalCase name of the screen")
    group.add_argument("--plan", help="Path to screen-plan.yaml for batch processing")
    
    parser.add_argument("--brief", help="Path to design brief")
    parser.add_argument("--stage", choices=["structure", "visuals", "full", "screens"], default="full", help="Workflow stage")
    parser.add_argument("--mode", choices=["new", "migrate", "auto"], default="auto", help="Implementation mode")
    parser.add_argument("--auto-approve", action="store_true", help="Skip interactive approval gates")

    args = parser.parse_args()
    
    ensure_dirs()
    
    # Handle Screens
    if args.screen:
        if args.stage != "screens":
             print(f"⚠️  For screens, stage is forced to 'screens'.")
        
        # Determine brief path for screen
        brief_path = Path(args.brief) if args.brief else DOCS_DESIGN_DIR / "briefs" / f"{args.screen.lower()}.md"
        if not brief_path.exists():
            # Fallback to default if specific brief missing
            print(f"⚠️  Specific brief not found at {brief_path}. Using default.")
            brief_path = DEFAULT_BRIEF_PATH
            
        run_screens_stage(args.screen, brief_path)
        sys.exit(0)

    # Handle Components
    brief_path = Path(args.brief) if args.brief else DEFAULT_BRIEF_PATH
    if not brief_path.exists():
        print(f"⚠️  Warning: Brief not found at {brief_path}. Proceeding with defaults.")

    # Determine Mode
    mode = args.mode
    if args.component and mode == "auto":
        if component_exists(args.component):
            mode = "migrate"
            print(f"🔍 Auto-detected existing component: Switching to 'migrate' mode.")
        else:
            mode = "new"
            print(f"🔍 No existing component found: Switching to 'new' mode.")
    
    # Execute Stages
    if args.screen:
        # Determine brief path for screen
        brief_path = Path(args.brief) if args.brief else DOCS_DESIGN_DIR / "briefs" / f"{args.screen.lower()}.md"
        if not brief_path.exists():
            # Fallback to default if specific brief missing
            print(f"⚠️  Specific brief not found at {brief_path}. Using default.")
            brief_path = DEFAULT_BRIEF_PATH
            
        run_screens_stage(args.screen, brief_path)
        regenerate_discovery_summary()
        sys.exit(0)

    # New plan-based execution
    if hasattr(args, 'plan') and args.plan:
        import yaml
        batch_ran = False
        with open(args.plan, 'r') as f:
            plan = yaml.safe_load(f)
            for screen in plan.get('screens', []):
                name = screen['name']
                target = screen.get('target', {}).get('wireframes')
                if target == 'lo-fi-only':
                    out_path = WIREFRAMES_DIR / f"{name.lower()}-screen.md"
                    if not out_path.exists():
                        brief_path = Path(screen['brief'])
                        if not brief_path.exists():
                            brief_path = DEFAULT_BRIEF_PATH
                        run_screens_stage(name, brief_path)
                        batch_ran = True
                    else:
                        print(f"✅ Screen '{name}' already exists. Skipping.")
        
        # Always regenerate summary if plan is provided, or specifically if steps were taken
        regenerate_discovery_summary()
        sys.exit(0)

    if args.screen and args.stage == "visuals":
        run_screen_visuals_stage(args.screen)
        sys.exit(0)

    if args.stage in ["structure", "full"]:
        run_structure_stage(args.component, brief_path, auto_approve=args.auto_approve)
    
    if args.stage in ["visuals", "full"]:
        run_visuals_stage(args.component, mode)

if __name__ == "__main__":
    main()

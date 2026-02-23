#!/usr/bin/env python3

"""
kr-solidarity v3.0.0 Setup Validator
Checks environment and dependencies for workflow readiness.

Usage:
    python validate_setup.py
"""

import sys
import os
from pathlib import Path


def check_python_version():
    """Check Python 3.9+"""
    version = sys.version_info
    status = "✅" if version >= (3, 9) else "❌"
    print(f"{status} Python {version.major}.{version.minor}.{version.micro} (requires 3.9+)")
    return version >= (3, 9)


def check_environment_variable(var_name: str, description: str = "") -> bool:
    """Check if environment variable is set."""
    value = os.environ.get(var_name)
    if value:
        masked = value[:10] + "..." if len(value) > 10 else value
        status = "✅"
        print(f"{status} {var_name}={masked}")
        return True
    else:
        status = "❌"
        hint = f"({description})" if description else ""
        print(f"{status} {var_name} not set {hint}")
        return False


def check_import(module_name: str, install_name: str = None) -> bool:
    """Check if Python module is importable."""
    try:
        __import__(module_name)
        print(f"✅ {module_name}")
        return True
    except ImportError:
        hint = f"pip install {install_name or module_name}"
        print(f"❌ {module_name} (install: {hint})")
        return False


def check_file_exists(file_path: str, description: str = "") -> bool:
    """Check if file exists."""
    path = Path(file_path)
    if path.exists():
        print(f"✅ {description or file_path}")
        return True
    else:
        print(f"❌ {description or file_path} NOT FOUND")
        return False


def main():
    """Run all validation checks."""
    print("\n" + "=" * 80)
    print("kr-solidarity v3.0.0 SETUP VALIDATOR")
    print("=" * 80)

    all_passed = True

    # ========================================================================
    # PYTHON & ENVIRONMENT
    # ========================================================================
    print("\n📋 PYTHON & ENVIRONMENT")
    print("-" * 80)
    all_passed &= check_python_version()
    all_passed &= check_environment_variable("GEMINI_API_KEY", "Get from https://aistudio.google.com/app/apikey")

    # ========================================================================
    # DEPENDENCIES
    # ========================================================================
    print("\n📦 DEPENDENCIES")
    print("-" * 80)
    all_passed &= check_import("google.generativeai", "google-generativeai")
    all_passed &= check_import("PIL", "Pillow")

    # ========================================================================
    # WORKFLOW SCRIPTS
    # ========================================================================
    print("\n🔧 WORKFLOW SCRIPTS")
    print("-" * 80)
    scripts_dir = Path(__file__).parent
    all_passed &= check_file_exists(
        scripts_dir / "analyze_political_asset.py",
        "Phase 1a: Political Asset Analysis"
    )
    all_passed &= check_file_exists(
        scripts_dir / "validate_kr_solidarity_governance.py",
        "Phase 1b: Governance Validation"
    )
    all_passed &= check_file_exists(
        scripts_dir / "score_cultural_significance.py",
        "Phase 2: Cultural Significance Scoring"
    )
    all_passed &= check_file_exists(
        scripts_dir / "package_kr_solidarity_asset.py",
        "Phase 3: Asset Packaging"
    )
    all_passed &= check_file_exists(
        scripts_dir / "orchestrate_kr_solidarity_workflow.py",
        "Phase 4: Workflow Orchestration"
    )

    # ========================================================================
    # DESIGN SYSTEM
    # ========================================================================
    print("\n🎨 DESIGN SYSTEM")
    print("-" * 80)
    project_root = Path(__file__).parent.parent
    manifest_path = project_root / "frontend" / "public" / "assets" / "kerala-rage-kr-solidarity-manifest.json"
    all_passed &= check_file_exists(
        manifest_path,
        "kr-solidarity v3.0.0 Asset Manifest"
    )

    # ========================================================================
    # OUTPUT DIRECTORIES
    # ========================================================================
    print("\n📁 OUTPUT DIRECTORIES (will be created)")
    print("-" * 80)
    asset_packages_dir = Path("./asset-packages")
    if asset_packages_dir.exists():
        print(f"✅ {asset_packages_dir} (exists)")
    else:
        print(f"⏳ {asset_packages_dir} (will be created on first run)")

    # ========================================================================
    # SUMMARY
    # ========================================================================
    print("\n" + "=" * 80)
    if all_passed:
        print("✅ SETUP COMPLETE - Ready to process assets!")
        print("=" * 80)
        print("\n🚀 QUICK START:")
        print("   python orchestrate_kr_solidarity_workflow.py /path/to/image.png")
        print("\n📖 Documentation:")
        print("   cat README_KR_SOLIDARITY_WORKFLOW.md")
        return 0
    else:
        print("❌ SETUP INCOMPLETE - Please fix issues above")
        print("=" * 80)
        print("\n⚠️  REQUIRED FIXES:")
        if not os.environ.get("GEMINI_API_KEY"):
            print("   1. Set GEMINI_API_KEY:")
            print("      export GEMINI_API_KEY='your-key-here'")
        if not check_import("google.generativeai", skip_print=True):
            print("   2. Install dependencies:")
            print("      pip install google-generativeai Pillow")
        return 1


def check_import(module_name: str, install_name: str = None, skip_print: bool = False) -> bool:
    """Check if Python module is importable."""
    try:
        __import__(module_name)
        if not skip_print:
            print(f"✅ {module_name}")
        return True
    except ImportError:
        if not skip_print:
            hint = f"pip install {install_name or module_name}"
            print(f"❌ {module_name} (install: {hint})")
        return False


if __name__ == "__main__":
    sys.exit(main())

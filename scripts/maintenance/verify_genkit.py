#!/usr/bin/env python3
"""
verify_genkit.py

Verification script for Genkit framework initialization and health status.
Tests the complete Genkit setup including API connectivity and flow registration.
"""

import os
import sys
from typing import Dict, Any

# Add backend to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from app.core.genkit_init import init_genkit, check_genkit_health


def print_header(title: str) -> None:
    """Print a formatted header."""
    print(f"\n{'='*60}")
    print(f" {title}")
    print(f"{'='*60}")


def print_status_line(label: str, status: str, details: str = "") -> None:
    """Print a formatted status line."""
    status_icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
    print(f"{status_icon} {label:<40} {status}")
    if details:
        print(f"   {details}")


def format_health_results(health_status: Dict[str, Any]) -> None:
    """Format and display health check results."""
    print_header("GENKIT HEALTH CHECK RESULTS")

    # Core status checks
    print_status_line(
        "Genkit Initialization",
        "PASS" if health_status.get("initialized") else "FAIL"
    )

    print_status_line(
        "Gemini API Key Present",
        "PASS" if health_status.get("gemini_api_key_present") else "FAIL"
    )

    print_status_line(
        "Genkit Flows Enabled",
        "PASS" if health_status.get("enabled") else "WARN",
        f"ENABLE_GENKIT_FLOWS={os.getenv('ENABLE_GENKIT_FLOWS', 'not set')}"
    )

    print_status_line(
        "AI Models Initialized",
        "PASS" if health_status.get("models_initialized") else "FAIL"
    )

    flows_count = health_status.get("flows_registered", 0)
    print_status_line(
        "Registered Flows",
        "PASS" if flows_count > 0 else "WARN",
        f"{flows_count} flows registered"
    )

    # Error details
    errors = health_status.get("errors", [])
    if errors:
        print("\n❌ ERRORS DETECTED:")
        for i, error in enumerate(errors, 1):
            print(f"   {i}. {error}")

    # Environment details
    print("\n📋 ENVIRONMENT DETAILS:")
    print(f"   GEMINI_API_KEY: {'Set' if os.getenv('GEMINI_API_KEY') else 'Not set'}")
    print(f"   ENABLE_GENKIT_FLOWS: {os.getenv('ENABLE_GENKIT_FLOWS', 'Not set')}")
    print(f"   GENKIT_LOG_LEVEL: {os.getenv('GENKIT_LOG_LEVEL', 'Not set')}")
    print(f"   ENABLE_TELEMETRY: {os.getenv('ENABLE_TELEMETRY', 'Not set')}")


def main() -> int:
    """Main verification function."""
    print_header("GENKIT FRAMEWORK VERIFICATION")

    try:
        # Initialize Genkit
        print("🚀 Initializing Genkit framework...")
        init_success = init_genkit()

        if init_success:
            print("✅ Genkit initialization completed")
        else:
            print("❌ Genkit initialization failed")

        # Run health check
        print("\n🔍 Running health check...")
        health_status = check_genkit_health()

        # Display results
        format_health_results(health_status)

        # Determine overall status
        has_critical_errors = len(health_status.get("errors", [])) > 0
        is_properly_initialized = (
            health_status.get("initialized", False) and
            health_status.get("gemini_api_key_present", False) and
            health_status.get("models_initialized", False)
        )

        # Final verdict
        print_header("VERIFICATION RESULT")

        if is_properly_initialized and not has_critical_errors:
            print("🎉 SUCCESS: Genkit is properly configured and ready for use!")
            print("   ✅ All critical components are working")
            print("   ✅ API connectivity confirmed")
            print("   ✅ Ready for AI-powered features")
            return 0
        else:
            print("❌ FAILURE: Genkit configuration has issues")
            if not is_properly_initialized:
                print("   ❌ Critical components failed to initialize")
            if has_critical_errors:
                print("   ❌ Configuration errors detected")
            print("\n💡 Next steps:")
            print("   1. Check environment variables")
            print("   2. Verify API key validity")
            print("   3. Review error messages above")
            return 1

    except ImportError as e:
        print(f"❌ FAILURE: Could not import Genkit modules")
        print(f"   Error: {str(e)}")
        print(f"   Make sure you're running from the correct directory")
        return 1

    except Exception as e:
        print(f"❌ FAILURE: Unexpected error during verification")
        print(f"   Error: {str(e)}")
        print(f"   Stack trace available for debugging")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)

#!/usr/bin/env python3
"""
Configuration Testing Script for CareerCopilot.

This script tests all aspects of the application configuration including
API keys, database connections, Firebase setup, and Secret Manager integration.
"""

import json
import os
import sys
import asyncio
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# Add the backend directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

try:
    from app.core.secure_config import settings
    from app.core.secret_manager import get_app_secret, get_firebase_config
    import requests
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you're running from the project root and dependencies are installed")
    sys.exit(1)

try:
    from google.cloud import secretmanager

    SECRET_MANAGER_AVAILABLE = True
except ImportError:
    secretmanager = None  # type: ignore[assignment]
    SECRET_MANAGER_AVAILABLE = False


class ConfigurationTester:
    """Comprehensive configuration testing for CareerCopilot."""

    def __init__(self):
        self.project_id = "careercopilot-468811"
        self.test_results = {}
        self.errors = []
        self.warnings = []

    def print_header(self, title: str):
        """Print a formatted header."""
        print(f"\n{'=' * 60}")
        print(f" {title}")
        print('=' * 60)

    def print_test(self, test_name: str, status: str, details: str = ""):
        """Print test result with formatting."""
        status_icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_icon} {test_name:<40} {status}")
        if details:
            print(f"   {details}")

    def test_environment_variables(self) -> Dict[str, bool]:
        """Test basic environment variable setup."""
        self.print_header("ENVIRONMENT VARIABLES TEST")

        results = {}

        # Critical environment variables
        critical_vars = [
            ("GCP_PROJECT_ID", "Google Cloud Project ID"),
            ("GOOGLE_CLOUD_PROJECT", "Google Cloud Project (alt)"),
            ("ENVIRONMENT", "Application Environment"),
        ]

        for var_name, description in critical_vars:
            value = os.getenv(var_name)
            if value:
                self.print_test(f"{description}", "PASS", f"{var_name}={value}")
                results[var_name] = True
            else:
                self.print_test(f"{description}", "WARN", f"{var_name} not set")
                results[var_name] = False
                self.warnings.append(f"Environment variable {var_name} not set")

        return results

    def test_secret_manager_connectivity(self) -> bool:
        """Test Google Cloud Secret Manager connectivity."""
        self.print_header("SECRET MANAGER CONNECTIVITY TEST")

        if not SECRET_MANAGER_AVAILABLE:
            self.print_test(
                "Secret Manager Client",
                "WARN",
                "google.cloud.secretmanager is not installed in this environment",
            )
            self.warnings.append("Secret Manager client library not installed")
            return False

        try:
            client = secretmanager.SecretManagerServiceClient()
            parent = f"projects/{self.project_id}"

            # List secrets to test connectivity
            response = client.list_secrets(request={"parent": parent})
            secrets = list(response)

            self.print_test("Secret Manager Connection", "PASS",
                          f"Found {len(secrets)} secrets")

            # Test accessing Gemini secret (required)
            try:
                test_secret = get_app_secret("gemini-api-key")
                if test_secret:
                    self.print_test("Secret Access Test (Gemini)", "PASS",
                                  "Successfully retrieved Gemini API key")
                else:
                    self.print_test("Secret Access Test (Gemini)", "WARN",
                                  "Secret exists but is empty")
            except Exception as e:
                self.print_test("Secret Access Test (Gemini)", "FAIL", str(e))
                self.errors.append(f"Failed to access Gemini secret: {e}")
                return False

            return True

        except Exception as e:
            self.print_test("Secret Manager Connection", "FAIL", str(e))
            self.errors.append(f"Secret Manager connectivity failed: {e}")
            return False

    def test_ai_service_keys(self) -> Dict[str, bool]:
        """Test AI service API keys."""
        self.print_header("AI SERVICE API KEYS TEST")

        results = {}

        # AI service configurations (Gemini is required, Anthropic is optional fallback)
        ai_services = [
            ("gemini-api-key", "Google Gemini API", None),  # Required, Requires specific setup
            ("anthropic-api-key", "Anthropic API (fallback)", None),  # Optional fallback
        ]

        for secret_name, service_name, test_url in ai_services:
            try:
                api_key = get_app_secret(secret_name)
                if not api_key:
                    self.print_test(f"{service_name} Key", "FAIL", "API key not found or empty")
                    results[secret_name] = False
                    continue

                # Basic format validation
                if secret_name == "anthropic-api-key" and not api_key.startswith("sk-ant-"):
                    self.print_test(f"{service_name} Key", "WARN", "Invalid format")
                    results[secret_name] = False
                elif secret_name == "gemini-api-key" and not api_key.startswith("AIzaSy"):
                    self.print_test(f"{service_name} Key", "WARN", "Invalid format")
                    results[secret_name] = False
                else:
                    # Test API connectivity if URL is provided
                    if test_url:
                        try:
                            headers = {"Authorization": f"Bearer {api_key}"}
                            response = requests.get(test_url, headers=headers, timeout=10)
                            if response.status_code == 200:
                                self.print_test(f"{service_name} Connectivity", "PASS",
                                              "API responds correctly")
                            else:
                                self.print_test(f"{service_name} Connectivity", "WARN",
                                              f"HTTP {response.status_code}")
                        except Exception as e:
                            self.print_test(f"{service_name} Connectivity", "WARN",
                                          f"Connection test failed: {e}")

                    self.print_test(f"{service_name} Key", "PASS", "Key format valid")
                    results[secret_name] = True

            except Exception as e:
                self.print_test(f"{service_name} Key", "FAIL", str(e))
                results[secret_name] = False
                self.errors.append(f"Failed to test {service_name}: {e}")

        return results

    def test_database_configuration(self) -> bool:
        """Test database configuration."""
        self.print_header("DATABASE CONFIGURATION TEST")

        try:
            db_url = get_app_secret("database-url")
            if not db_url:
                # Fall back to settings
                db_url = settings.DATABASE_URL

            if not db_url:
                self.print_test("Database URL", "FAIL", "No database URL configured")
                return False

            if db_url.startswith("sqlite:"):
                self.print_test("Database Type", "PASS", "SQLite (development)")

                # Check if SQLite file directory exists
                db_path = db_url.replace("sqlite:///", "")
                db_dir = Path(db_path).parent
                if not db_dir.exists():
                    self.print_test("Database Directory", "WARN", f"Directory {db_dir} doesn't exist")
                    try:
                        db_dir.mkdir(parents=True, exist_ok=True)
                        self.print_test("Database Directory Created", "PASS", f"Created {db_dir}")
                    except Exception as e:
                        self.print_test("Database Directory Creation", "FAIL", str(e))
                        return False
                else:
                    self.print_test("Database Directory", "PASS", f"Directory {db_dir} exists")

            elif db_url.startswith("postgresql:"):
                self.print_test("Database Type", "PASS", "PostgreSQL (production)")

                # Test connection (basic validation)
                try:
                    import psycopg2
                    # Don't actually connect, just validate the URL format
                    self.print_test("PostgreSQL Driver", "PASS", "psycopg2 available")
                except ImportError:
                    self.print_test("PostgreSQL Driver", "WARN", "psycopg2 not installed")

            self.print_test("Database Configuration", "PASS", f"URL: {db_url[:20]}...")
            return True

        except Exception as e:
            self.print_test("Database Configuration", "FAIL", str(e))
            self.errors.append(f"Database configuration failed: {e}")
            return False

    def test_firebase_configuration(self) -> bool:
        """Test Firebase configuration."""
        self.print_header("FIREBASE CONFIGURATION TEST")

        try:
            # Test Firebase config loading
            firebase_config = get_firebase_config()

            if not firebase_config.get("project_id"):
                self.print_test("Firebase Config", "FAIL", "No project ID configured")
                return False

            self.print_test("Firebase Project ID", "PASS",
                          firebase_config.get("project_id"))

            # Test Firebase credentials
            try:
                firebase_creds = get_app_secret("firebase-credentials-json")
                if firebase_creds:
                    creds_data = json.loads(firebase_creds)
                    if creds_data.get("type") == "service_account":
                        self.print_test("Firebase Credentials", "PASS",
                                      "Service account credentials loaded")
                    else:
                        self.print_test("Firebase Credentials", "WARN",
                                      "Invalid credentials format")
                else:
                    self.print_test("Firebase Credentials", "WARN",
                                  "No credentials in Secret Manager")
            except Exception as e:
                self.print_test("Firebase Credentials", "FAIL", str(e))

            # Check Firebase service account key file
            firebase_key_file = Path("firebase-prod-key.json")
            if firebase_key_file.exists():
                self.print_test("Firebase Key File", "PASS",
                              "firebase-prod-key.json exists")
            else:
                self.print_test("Firebase Key File", "WARN",
                              "firebase-prod-key.json not found")

            return True

        except Exception as e:
            self.print_test("Firebase Configuration", "FAIL", str(e))
            self.errors.append(f"Firebase configuration failed: {e}")
            return False

    def test_security_configuration(self) -> bool:
        """Test security-related configuration."""
        self.print_header("SECURITY CONFIGURATION TEST")

        try:
            # Test JWT secret key
            jwt_secret = get_app_secret("jwt-secret-key")
            if not jwt_secret:
                jwt_secret = settings.SECRET_KEY

            if jwt_secret == "insecure-default-secret-key":
                self.print_test("JWT Secret Key", "FAIL",
                              "Using insecure default secret key")
                self.errors.append("JWT secret key is insecure default")
                return False
            elif len(jwt_secret) < 32:
                self.print_test("JWT Secret Key", "WARN",
                              f"Secret key too short ({len(jwt_secret)} chars)")
                self.warnings.append("JWT secret key should be at least 32 characters")
            else:
                self.print_test("JWT Secret Key", "PASS",
                              f"Secure secret key ({len(jwt_secret)} chars)")

            # Test algorithm
            algorithm = settings.ALGORITHM
            if algorithm == "HS256":
                self.print_test("JWT Algorithm", "PASS", f"Using {algorithm}")
            else:
                self.print_test("JWT Algorithm", "WARN", f"Using {algorithm}")

            return True

        except Exception as e:
            self.print_test("Security Configuration", "FAIL", str(e))
            self.errors.append(f"Security configuration failed: {e}")
            return False

    def test_application_settings(self) -> Dict[str, any]:
        """Test application-specific settings."""
        self.print_header("APPLICATION SETTINGS TEST")

        results = {}

        # Test environment
        env = settings.ENVIRONMENT
        self.print_test("Environment", "PASS", env)
        results["environment"] = env

        # Test debug mode
        debug = settings.DEBUG
        status = "WARN" if debug and env == "production" else "PASS"
        self.print_test("Debug Mode", status, f"Debug={debug}")
        if debug and env == "production":
            self.warnings.append("Debug mode enabled in production")
        results["debug"] = debug

        # Test feature flags
        features = {
            "AI Features": settings.ENABLE_AI_FEATURES,
            "Multi-Agent": settings.ENABLE_MULTI_AGENT,
            "ML Analysis": settings.ENABLE_ML_ANALYSIS,
            "Web Search": settings.ENABLE_WEB_SEARCH,
        }

        for feature_name, enabled in features.items():
            self.print_test(f"{feature_name}", "PASS" if enabled else "INFO",
                          "Enabled" if enabled else "Disabled")
            results[feature_name.lower().replace(" ", "_")] = enabled

        return results

    def run_all_tests(self) -> bool:
        """Run all configuration tests."""
        print("🧪 CareerCopilot Configuration Test Suite")
        print("==========================================")

        test_results = {}

        # Run all tests
        test_results["env_vars"] = self.test_environment_variables()
        test_results["secret_manager"] = self.test_secret_manager_connectivity()
        test_results["ai_keys"] = self.test_ai_service_keys()
        test_results["database"] = self.test_database_configuration()
        test_results["firebase"] = self.test_firebase_configuration()
        test_results["security"] = self.test_security_configuration()
        test_results["app_settings"] = self.test_application_settings()

        # Summary
        self.print_header("TEST SUMMARY")

        total_errors = len(self.errors)
        total_warnings = len(self.warnings)

        if total_errors == 0:
            print("✅ All critical tests passed!")
        else:
            print(f"❌ {total_errors} critical errors found:")
            for error in self.errors:
                print(f"   - {error}")

        if total_warnings > 0:
            print(f"⚠️  {total_warnings} warnings:")
            for warning in self.warnings:
                print(f"   - {warning}")

        # Recommendations
        if total_errors > 0 or total_warnings > 0:
            print("\n💡 Recommendations:")
            if total_errors > 0:
                print("   1. Fix critical errors before deployment")
                print("   2. Run setup scripts to configure missing secrets")
            if total_warnings > 0:
                print("   3. Review warnings for security and performance")
                print("   4. Consider production-ready configurations")

        print(f"\n📊 Test Results Summary:")
        print(f"   ✅ Critical Tests: {'PASS' if total_errors == 0 else 'FAIL'}")
        print(f"   ⚠️  Warnings: {total_warnings}")
        print(f"   🔧 Errors: {total_errors}")

        return total_errors == 0


def main():
    """Main function."""
    import argparse

    parser = argparse.ArgumentParser(
        description="Test CareerCopilot configuration",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python test-configuration.py                    # Run all tests
  python test-configuration.py --quick           # Run quick tests only
  python test-configuration.py --verbose         # Detailed output
        """
    )

    parser.add_argument("--quick", action="store_true",
                       help="Run only quick tests (skip connectivity tests)")
    parser.add_argument("--verbose", action="store_true",
                       help="Enable verbose output")
    parser.add_argument("--project-id", default="careercopilot-468811",
                       help="GCP Project ID")

    args = parser.parse_args()

    tester = ConfigurationTester()
    tester.project_id = args.project_id

    try:
        success = tester.run_all_tests()

        if success:
            print("\n🎉 Configuration is ready for deployment!")
        else:
            print("\n🔧 Configuration needs attention before deployment")
            print("\nNext steps:")
            print("1. Run: python scripts/setup-production-secrets.py")
            print("2. Run: python scripts/setup-firebase-config.py")
            print("3. Review and fix any remaining errors")

        sys.exit(0 if success else 1)

    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Test suite failed with error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

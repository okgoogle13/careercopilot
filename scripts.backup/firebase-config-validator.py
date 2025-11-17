#!/usr/bin/env python3
"""
Firebase Configuration Validator for CareerCopilot.

This script validates Firebase project configuration, services setup,
security rules, and deployment readiness.
"""

import json
import os
import sys
import subprocess
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple

# Add the backend directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

try:
    import firebase_admin
    from firebase_admin import credentials, firestore, auth, storage
    from google.cloud import firestore as gcloud_firestore
    FIREBASE_ADMIN_AVAILABLE = True
except ImportError:
    FIREBASE_ADMIN_AVAILABLE = False

try:
    from backend.app.core.firebase import get_firebase_config
    from backend.app.core.secret_manager import get_firebase_credentials
    BACKEND_AVAILABLE = True
except ImportError:
    BACKEND_AVAILABLE = False


class FirebaseConfigValidator:
    """Validates Firebase configuration and deployment readiness."""

    def __init__(self, project_id: str = "careercopilot-468811"):
        """Initialize the Firebase validator."""
        self.project_id = project_id
        self.staging_project_id = "careercopilot-staging"

        # Load Firebase configuration files
        self.root_path = Path(__file__).parent.parent
        self.firebase_json = self._load_firebase_json()
        self.firebaserc = self._load_firebaserc()

        # Firebase service requirements
        self.required_services = {
            "authentication": {
                "description": "Firebase Authentication",
                "enabled": False,
                "providers": ["google.com", "password"],
                "critical": True,
            },
            "firestore": {
                "description": "Cloud Firestore Database",
                "enabled": False,
                "location": "us-central1",
                "critical": True,
            },
            "storage": {
                "description": "Cloud Storage",
                "enabled": False,
                "bucket": f"{project_id}.appspot.com",
                "critical": True,
            },
            "functions": {
                "description": "Cloud Functions",
                "enabled": False,
                "runtime": "nodejs20",
                "critical": False,
            },
            "hosting": {
                "description": "Firebase Hosting",
                "enabled": False,
                "public_dir": "frontend/dist",
                "critical": False,
            },
        }

    def _load_firebase_json(self) -> Dict[str, Any]:
        """Load firebase.json configuration."""
        try:
            with open(self.root_path / "firebase.json", 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"⚠️  Could not load firebase.json: {e}")
            return {}

    def _load_firebaserc(self) -> Dict[str, Any]:
        """Load .firebaserc configuration."""
        try:
            with open(self.root_path / ".firebaserc", 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"⚠️  Could not load .firebaserc: {e}")
            return {}

    def _run_firebase_command(self, args: List[str]) -> Tuple[bool, str]:
        """Run a Firebase CLI command."""
        try:
            result = subprocess.run(
                ["firebase"] + args,
                capture_output=True,
                text=True,
                cwd=self.root_path,
                timeout=30
            )
            return result.returncode == 0, result.stdout + result.stderr
        except (subprocess.TimeoutExpired, FileNotFoundError) as e:
            return False, f"Command failed: {str(e)}"

    def validate_firebase_cli(self) -> Dict[str, Any]:
        """Validate Firebase CLI installation and authentication."""
        result = {
            "cli_installed": False,
            "cli_version": None,
            "authenticated": False,
            "current_user": None,
            "projects_accessible": [],
            "errors": [],
        }

        # Check CLI installation
        success, output = self._run_firebase_command(["--version"])
        if success:
            result["cli_installed"] = True
            result["cli_version"] = output.strip()
        else:
            result["errors"].append("Firebase CLI not installed or not in PATH")
            return result

        # Check authentication
        success, output = self._run_firebase_command(["whoami"])
        if success:
            result["authenticated"] = True
            result["current_user"] = output.strip()
        else:
            result["errors"].append("Firebase CLI not authenticated. Run 'firebase login'")

        # List accessible projects
        success, output = self._run_firebase_command(["projects:list", "--json"])
        if success:
            try:
                projects = json.loads(output)
                if isinstance(projects, list):
                    result["projects_accessible"] = [
                        {
                            "projectId": p.get("projectId"),
                            "displayName": p.get("displayName"),
                            "projectNumber": p.get("projectNumber"),
                        }
                        for p in projects
                    ]
            except json.JSONDecodeError:
                result["errors"].append("Could not parse projects list")

        return result

    def validate_project_configuration(self) -> Dict[str, Any]:
        """Validate Firebase project configuration files."""
        result = {
            "firebase_json_valid": bool(self.firebase_json),
            "firebaserc_valid": bool(self.firebaserc),
            "projects_configured": {},
            "services_configured": {},
            "errors": [],
        }

        # Validate .firebaserc
        if self.firebaserc:
            projects = self.firebaserc.get("projects", {})
            result["projects_configured"] = {
                "default": projects.get("default"),
                "staging": projects.get("staging"),
                "production": projects.get("production"),
            }

            # Check if our projects are configured
            expected_projects = {
                "staging": self.staging_project_id,
                "production": self.project_id,
            }

            for env, expected_id in expected_projects.items():
                if projects.get(env) != expected_id:
                    result["errors"].append(
                        f"Project {env} should be '{expected_id}', got '{projects.get(env)}'"
                    )

        # Validate firebase.json
        if self.firebase_json:
            # Check hosting configuration
            hosting = self.firebase_json.get("hosting", {})
            if hosting:
                result["services_configured"]["hosting"] = {
                    "public": hosting.get("public"),
                    "rewrites": len(hosting.get("rewrites", [])),
                    "headers": len(hosting.get("headers", [])),
                }

            # Check functions configuration
            functions = self.firebase_json.get("functions")
            if functions:
                if isinstance(functions, list) and functions:
                    functions = functions[0]  # Take first function config
                result["services_configured"]["functions"] = {
                    "source": functions.get("source"),
                    "runtime": functions.get("runtime"),
                    "predeploy": functions.get("predeploy", []),
                }

            # Check Firestore configuration
            firestore_config = self.firebase_json.get("firestore", {})
            if firestore_config:
                result["services_configured"]["firestore"] = {
                    "rules": firestore_config.get("rules"),
                    "indexes": firestore_config.get("indexes"),
                    "location": firestore_config.get("location"),
                }

            # Check Storage configuration
            storage_config = self.firebase_json.get("storage", {})
            if storage_config:
                result["services_configured"]["storage"] = {
                    "rules": storage_config.get("rules"),
                }

        return result

    def validate_security_rules(self) -> Dict[str, Any]:
        """Validate Firebase security rules files."""
        result = {
            "firestore_rules": {"exists": False, "valid": False, "rules_count": 0},
            "storage_rules": {"exists": False, "valid": False, "rules_count": 0},
            "errors": [],
        }

        # Check Firestore rules
        firestore_rules_path = self.root_path / "firestore.rules"
        if firestore_rules_path.exists():
            result["firestore_rules"]["exists"] = True
            try:
                with open(firestore_rules_path, 'r') as f:
                    rules_content = f.read()

                # Basic validation
                if "rules_version = '2'" in rules_content:
                    result["firestore_rules"]["valid"] = True

                # Count rules (basic heuristic)
                result["firestore_rules"]["rules_count"] = rules_content.count("match /")

            except Exception as e:
                result["errors"].append(f"Error reading Firestore rules: {e}")

        # Check Storage rules
        storage_rules_path = self.root_path / "storage.rules"
        if storage_rules_path.exists():
            result["storage_rules"]["exists"] = True
            try:
                with open(storage_rules_path, 'r') as f:
                    rules_content = f.read()

                # Basic validation
                if "rules_version = '2'" in rules_content:
                    result["storage_rules"]["valid"] = True

                # Count rules (basic heuristic)
                result["storage_rules"]["rules_count"] = rules_content.count("match /")

            except Exception as e:
                result["errors"].append(f"Error reading Storage rules: {e}")

        return result

    def validate_indexes(self) -> Dict[str, Any]:
        """Validate Firestore indexes configuration."""
        result = {
            "indexes_file_exists": False,
            "indexes_count": 0,
            "field_overrides_count": 0,
            "valid_format": False,
            "errors": [],
        }

        indexes_path = self.root_path / "firestore.indexes.json"
        if indexes_path.exists():
            result["indexes_file_exists"] = True
            try:
                with open(indexes_path, 'r') as f:
                    indexes_data = json.load(f)

                result["valid_format"] = True
                result["indexes_count"] = len(indexes_data.get("indexes", []))
                result["field_overrides_count"] = len(indexes_data.get("fieldOverrides", []))

            except (json.JSONDecodeError, KeyError) as e:
                result["errors"].append(f"Invalid indexes file format: {e}")

        return result

    def test_firebase_admin_connection(self) -> Dict[str, Any]:
        """Test Firebase Admin SDK connection."""
        result = {
            "admin_sdk_available": FIREBASE_ADMIN_AVAILABLE,
            "backend_available": BACKEND_AVAILABLE,
            "credentials_available": False,
            "firestore_accessible": False,
            "auth_accessible": False,
            "storage_accessible": False,
            "project_id": self.project_id,
            "errors": [],
        }

        if not FIREBASE_ADMIN_AVAILABLE:
            result["errors"].append("Firebase Admin SDK not installed")
            return result

        if not BACKEND_AVAILABLE:
            result["errors"].append("Backend modules not available")
            return result

        try:
            # Try to get Firebase credentials
            from backend.app.core.secret_manager import get_firebase_credentials
            creds = get_firebase_credentials()
            if creds:
                result["credentials_available"] = True
            else:
                result["errors"].append("Firebase credentials not available from Secret Manager")

            # Try to initialize Firebase Admin SDK
            from backend.app.core.firebase import initialize_firebase, get_firestore, get_auth, get_storage

            app = initialize_firebase()
            if app:
                # Test Firestore connection
                try:
                    db = get_firestore()
                    if db:
                        # Try a simple operation
                        db.collection("_test_").limit(1).get()
                        result["firestore_accessible"] = True
                except Exception as e:
                    result["errors"].append(f"Firestore access failed: {e}")

                # Test Auth connection
                try:
                    auth_client = get_auth()
                    if auth_client:
                        result["auth_accessible"] = True
                except Exception as e:
                    result["errors"].append(f"Auth access failed: {e}")

                # Test Storage connection
                try:
                    storage_client = get_storage()
                    if storage_client:
                        result["storage_accessible"] = True
                except Exception as e:
                    result["errors"].append(f"Storage access failed: {e}")
            else:
                result["errors"].append("Failed to initialize Firebase Admin SDK")

        except Exception as e:
            result["errors"].append(f"Firebase Admin SDK test failed: {e}")

        return result

    def validate_environment_configuration(self) -> Dict[str, Any]:
        """Validate environment-specific Firebase configuration."""
        result = {
            "environment": os.getenv("ENV", "development"),
            "firebase_project_id": None,
            "use_emulator": False,
            "emulator_hosts": {},
            "secrets_configured": False,
            "errors": [],
        }

        # Check environment variables
        result["firebase_project_id"] = os.getenv("FIREBASE_PROJECT_ID") or os.getenv("GCP_PROJECT_ID")
        result["use_emulator"] = os.getenv("FIREBASE_EMULATOR", "false").lower() == "true"

        # Check emulator configuration
        emulator_vars = [
            "FIREBASE_AUTH_EMULATOR_HOST",
            "FIREBASE_STORAGE_EMULATOR_HOST",
            "FIREBASE_DATABASE_EMULATOR_HOST",
        ]

        for var in emulator_vars:
            value = os.getenv(var)
            if value:
                result["emulator_hosts"][var] = value

        # Check if Firebase secrets are configured
        firebase_secrets = [
            "FIREBASE_PROJECT_ID",
            "FIREBASE_STORAGE_BUCKET",
            "FIREBASE_CREDENTIALS_JSON",
        ]

        secrets_count = sum(1 for secret in firebase_secrets if os.getenv(secret))
        result["secrets_configured"] = secrets_count >= 2  # At least project_id and one other

        return result

    def generate_deployment_report(self) -> Dict[str, Any]:
        """Generate comprehensive Firebase deployment readiness report."""
        print("🔥 Firebase Configuration Validation")
        print("=" * 50)
        print(f"Project ID: {self.project_id}")
        print(f"Staging Project: {self.staging_project_id}")
        print()

        # Run all validations
        cli_validation = self.validate_firebase_cli()
        project_validation = self.validate_project_configuration()
        rules_validation = self.validate_security_rules()
        indexes_validation = self.validate_indexes()
        admin_validation = self.test_firebase_admin_connection()
        env_validation = self.validate_environment_configuration()

        # Display results
        print("📋 Firebase CLI Status")
        print("-" * 30)
        print(f"CLI Installed: {'✅' if cli_validation['cli_installed'] else '❌'}")
        if cli_validation['cli_version']:
            print(f"CLI Version: {cli_validation['cli_version']}")
        print(f"Authenticated: {'✅' if cli_validation['authenticated'] else '❌'}")
        if cli_validation['current_user']:
            print(f"Current User: {cli_validation['current_user']}")
        print(f"Projects Accessible: {len(cli_validation['projects_accessible'])}")

        print("\n🏗️ Project Configuration")
        print("-" * 30)
        print(f"firebase.json: {'✅' if project_validation['firebase_json_valid'] else '❌'}")
        print(f".firebaserc: {'✅' if project_validation['firebaserc_valid'] else '❌'}")

        projects = project_validation['projects_configured']
        print(f"Default Project: {projects.get('default', 'Not set')}")
        print(f"Staging Project: {projects.get('staging', 'Not set')}")
        print(f"Production Project: {projects.get('production', 'Not set')}")

        print("\n🛡️ Security Rules")
        print("-" * 30)
        firestore_rules = rules_validation['firestore_rules']
        storage_rules = rules_validation['storage_rules']
        print(f"Firestore Rules: {'✅' if firestore_rules['valid'] else '❌'} ({firestore_rules['rules_count']} rules)")
        print(f"Storage Rules: {'✅' if storage_rules['valid'] else '❌'} ({storage_rules['rules_count']} rules)")

        print("\n📊 Database Indexes")
        print("-" * 30)
        print(f"Indexes File: {'✅' if indexes_validation['indexes_file_exists'] else '❌'}")
        print(f"Indexes Count: {indexes_validation['indexes_count']}")
        print(f"Field Overrides: {indexes_validation['field_overrides_count']}")

        print("\n🔧 Admin SDK Connection")
        print("-" * 30)
        print(f"Admin SDK Available: {'✅' if admin_validation['admin_sdk_available'] else '❌'}")
        print(f"Credentials Available: {'✅' if admin_validation['credentials_available'] else '❌'}")
        print(f"Firestore Access: {'✅' if admin_validation['firestore_accessible'] else '❌'}")
        print(f"Auth Access: {'✅' if admin_validation['auth_accessible'] else '❌'}")
        print(f"Storage Access: {'✅' if admin_validation['storage_accessible'] else '❌'}")

        print("\n🌍 Environment Configuration")
        print("-" * 30)
        print(f"Environment: {env_validation['environment']}")
        print(f"Project ID: {env_validation['firebase_project_id'] or 'Not set'}")
        print(f"Use Emulator: {'✅' if env_validation['use_emulator'] else '❌'}")
        print(f"Secrets Configured: {'✅' if env_validation['secrets_configured'] else '❌'}")

        # Count errors
        total_errors = sum(len(validation.get('errors', [])) for validation in [
            cli_validation, project_validation, rules_validation,
            indexes_validation, admin_validation, env_validation
        ])

        # Determine deployment readiness
        critical_checks = [
            cli_validation['cli_installed'] and cli_validation['authenticated'],
            project_validation['firebase_json_valid'] and project_validation['firebaserc_valid'],
            firestore_rules['valid'] and storage_rules['valid'],
            admin_validation['credentials_available'],
            env_validation['secrets_configured'],
        ]

        deployment_ready = all(critical_checks) and total_errors == 0

        print("\n" + "=" * 50)
        print("📊 Summary")
        print("=" * 50)
        print(f"Total Errors: {total_errors}")
        print(f"Critical Checks Passed: {sum(critical_checks)}/{len(critical_checks)}")

        if deployment_ready:
            print("\n🎉 FIREBASE DEPLOYMENT READY")
            print("All critical Firebase services are properly configured!")
        else:
            print("\n🚨 FIREBASE NOT READY FOR DEPLOYMENT")
            print("\nErrors found:")
            for validation_name, validation in [
                ("CLI", cli_validation),
                ("Project", project_validation),
                ("Rules", rules_validation),
                ("Indexes", indexes_validation),
                ("Admin SDK", admin_validation),
                ("Environment", env_validation),
            ]:
                for error in validation.get('errors', []):
                    print(f"  • {validation_name}: {error}")

        # Compile complete report
        complete_report = {
            "deployment_ready": deployment_ready,
            "total_errors": total_errors,
            "critical_checks_passed": sum(critical_checks),
            "critical_checks_total": len(critical_checks),
            "cli_validation": cli_validation,
            "project_validation": project_validation,
            "rules_validation": rules_validation,
            "indexes_validation": indexes_validation,
            "admin_validation": admin_validation,
            "environment_validation": env_validation,
        }

        return complete_report


def main():
    """Main function."""
    import argparse

    parser = argparse.ArgumentParser(description="Validate Firebase configuration for CareerCopilot")
    parser.add_argument("--project-id", default="careercopilot-468811",
                       help="Firebase project ID for production")
    parser.add_argument("--json", action="store_true",
                       help="Output results as JSON")

    args = parser.parse_args()

    validator = FirebaseConfigValidator(project_id=args.project_id)
    report = validator.generate_deployment_report()

    if args.json:
        print("\n" + "=" * 50)
        print(json.dumps(report, indent=2))

    sys.exit(0 if report["deployment_ready"] else 1)


if __name__ == "__main__":
    main()

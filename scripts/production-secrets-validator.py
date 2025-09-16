#!/usr/bin/env python3
"""
Production Secrets Validator for CareerCopilot.

This script validates that all production secrets are properly configured
and accessible before deployment.
"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Tuple

# Add the backend directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

try:
    from google.cloud import secretmanager
    from google.api_core.exceptions import NotFound, PermissionDenied
    SECRET_MANAGER_AVAILABLE = True
except ImportError:
    SECRET_MANAGER_AVAILABLE = False
    print("⚠️  Google Cloud Secret Manager not available")


class ProductionSecretsValidator:
    """Validates production secrets for CareerCopilot deployment."""

    def __init__(self, project_id: str = "careercopilot-468811"):
        """Initialize the validator."""
        self.project_id = project_id
        self.client = None

        if SECRET_MANAGER_AVAILABLE:
            try:
                self.client = secretmanager.SecretManagerServiceClient()
            except Exception as e:
                print(f"⚠️  Could not initialize Secret Manager client: {e}")

        # Define required secrets for production
        self.required_secrets = {
            "openai-api-key": {
                "description": "OpenAI API Key",
                "env_var": "OPENAI_API_KEY",
                "validation": lambda x: x.startswith("sk-") and len(x) > 20,
                "critical": True,
            },
            "anthropic-api-key": {
                "description": "Anthropic Claude API Key",
                "env_var": "ANTHROPIC_API_KEY",
                "validation": lambda x: x.startswith("sk-ant-") and len(x) > 20,
                "critical": True,
            },
            "gemini-api-key": {
                "description": "Google Gemini API Key",
                "env_var": "GEMINI_API_KEY",
                "validation": lambda x: x.startswith("AIzaSy") and len(x) > 20,
                "critical": True,
            },
            "jwt-secret-key": {
                "description": "JWT Secret Key",
                "env_var": "JWT_SECRET_KEY",
                "validation": lambda x: len(x) >= 32,
                "critical": True,
            },
            "database-url": {
                "description": "Database URL",
                "env_var": "DATABASE_URL",
                "validation": lambda x: x.startswith(("postgresql://", "mysql://", "sqlite:///")),
                "critical": True,
            },
            "redis-password": {
                "description": "Redis Password",
                "env_var": "REDIS_PASSWORD",
                "validation": lambda x: len(x) >= 8,
                "critical": False,
            },
            "firebase-credentials-json": {
                "description": "Firebase Admin SDK Credentials",
                "env_var": "FIREBASE_CREDENTIALS_JSON",
                "validation": self._validate_firebase_json,
                "critical": True,
            },
            "firebase-project-id": {
                "description": "Firebase Project ID",
                "env_var": "FIREBASE_PROJECT_ID",
                "validation": lambda x: len(x) > 5 and "-" in x,
                "critical": True,
            },
            "firebase-storage-bucket": {
                "description": "Firebase Storage Bucket",
                "env_var": "FIREBASE_STORAGE_BUCKET",
                "validation": lambda x: x.endswith(".appspot.com") or x.endswith(".firebaseapp.com"),
                "critical": True,
            },
            "sendgrid-api-key": {
                "description": "SendGrid API Key",
                "env_var": "SENDGRID_API_KEY",
                "validation": lambda x: x.startswith("SG.") and len(x) > 20,
                "critical": False,
            },
        }

    def _validate_firebase_json(self, value: str) -> bool:
        """Validate Firebase credentials JSON."""
        try:
            data = json.loads(value)
            required_fields = ["type", "project_id", "private_key", "client_email"]
            return all(field in data for field in required_fields)
        except json.JSONDecodeError:
            return False

    def get_secret_from_manager(self, secret_id: str) -> Tuple[str, bool, str]:
        """
        Get secret from Secret Manager.

        Returns:
            Tuple of (value, success, error_message)
        """
        if not self.client:
            return "", False, "Secret Manager client not available"

        try:
            secret_path = f"projects/{self.project_id}/secrets/{secret_id}/versions/latest"
            response = self.client.access_secret_version(name=secret_path)
            value = response.payload.data.decode("UTF-8")
            return value, True, ""
        except NotFound:
            return "", False, f"Secret '{secret_id}' not found"
        except PermissionDenied:
            return "", False, f"Permission denied accessing '{secret_id}'"
        except Exception as e:
            return "", False, f"Error accessing '{secret_id}': {str(e)}"

    def validate_secret(self, secret_id: str, config: Dict) -> Dict:
        """Validate a single secret."""
        result = {
            "secret_id": secret_id,
            "description": config["description"],
            "critical": config["critical"],
            "status": "unknown",
            "source": None,
            "valid": False,
            "error": None,
        }

        # Try Secret Manager first
        if self.client:
            value, success, error = self.get_secret_from_manager(secret_id)
            if success:
                if config["validation"](value):
                    result.update({
                        "status": "valid",
                        "source": "secret_manager",
                        "valid": True,
                    })
                    return result
                else:
                    result.update({
                        "status": "invalid_format",
                        "source": "secret_manager",
                        "error": "Secret value has invalid format",
                    })
                    return result
            else:
                result["error"] = f"Secret Manager: {error}"

        # Fallback to environment variable
        env_value = os.getenv(config["env_var"])
        if env_value:
            if config["validation"](env_value):
                result.update({
                    "status": "valid",
                    "source": "environment",
                    "valid": True,
                })
                return result
            else:
                result.update({
                    "status": "invalid_format",
                    "source": "environment",
                    "error": "Environment variable has invalid format",
                })
                return result

        # Secret not found anywhere
        result.update({
            "status": "missing",
            "error": f"Secret not found in Secret Manager or environment variable {config['env_var']}",
        })
        return result

    def validate_all_secrets(self) -> Dict:
        """Validate all required secrets."""
        print("🔍 Validating Production Secrets")
        print("=" * 50)
        print(f"Project ID: {self.project_id}")
        print(f"Secret Manager Available: {SECRET_MANAGER_AVAILABLE}")
        print()

        results = []
        critical_missing = 0
        optional_missing = 0

        for secret_id, config in self.required_secrets.items():
            print(f"Checking {secret_id}...", end=" ")
            result = self.validate_secret(secret_id, config)
            results.append(result)

            if result["valid"]:
                source_icon = "🔐" if result["source"] == "secret_manager" else "🌍"
                print(f"✅ {source_icon}")
            else:
                print(f"❌")
                if result["critical"]:
                    critical_missing += 1
                    print(f"   CRITICAL: {result['error']}")
                else:
                    optional_missing += 1
                    print(f"   Optional: {result['error']}")

        # Summary
        total_secrets = len(self.required_secrets)
        valid_secrets = sum(1 for r in results if r["valid"])
        critical_secrets = sum(1 for r in results if r["critical"])
        valid_critical = sum(1 for r in results if r["valid"] and r["critical"])

        print("\n" + "=" * 50)
        print("📊 Validation Summary")
        print("=" * 50)
        print(f"Total Secrets:     {total_secrets}")
        print(f"Valid Secrets:     {valid_secrets}")
        print(f"Critical Secrets:  {critical_secrets}")
        print(f"Valid Critical:    {valid_critical}")
        print(f"Missing Critical:  {critical_missing}")
        print(f"Missing Optional:  {optional_missing}")

        deployment_ready = critical_missing == 0

        if deployment_ready:
            print("\n🎉 DEPLOYMENT READY")
            print("All critical secrets are properly configured!")
        else:
            print("\n🚨 DEPLOYMENT NOT READY")
            print(f"Missing {critical_missing} critical secrets!")
            print("\nTo fix:")
            print(f"1. Run: python scripts/setup-production-secrets.py")
            print(f"2. Or set missing environment variables")

        return {
            "deployment_ready": deployment_ready,
            "total_secrets": total_secrets,
            "valid_secrets": valid_secrets,
            "critical_secrets": critical_secrets,
            "valid_critical": valid_critical,
            "missing_critical": critical_missing,
            "missing_optional": optional_missing,
            "results": results,
        }

    def generate_deployment_checklist(self) -> str:
        """Generate a deployment checklist."""
        validation_result = self.validate_all_secrets()

        checklist = """
# 🚀 Production Deployment Checklist

## Secrets Configuration
"""

        for result in validation_result["results"]:
            status_icon = "✅" if result["valid"] else "❌"
            priority = "CRITICAL" if result["critical"] else "OPTIONAL"

            checklist += f"- [{status_icon}] {result['description']} ({priority})\n"

            if not result["valid"]:
                checklist += f"  - Error: {result['error']}\n"
                if result["critical"]:
                    checklist += f"  - Action: Set {result['secret_id']} in Secret Manager or {self.required_secrets[result['secret_id']]['env_var']} environment variable\n"

        checklist += f"""
## Environment Configuration
- [ ] Set GCP_PROJECT_ID={self.project_id}
- [ ] Set ENV=production
- [ ] Set USE_SECRET_MANAGER=true
- [ ] Configure Google Application Credentials

## Pre-deployment Commands
```bash
# Validate secrets
python scripts/production-secrets-validator.py

# Set up missing secrets
python scripts/setup-production-secrets.py

# Test configuration
python scripts/test-configuration.py
```

## Deployment Status
- Deployment Ready: {'✅ YES' if validation_result['deployment_ready'] else '❌ NO'}
- Critical Secrets: {validation_result['valid_critical']}/{validation_result['critical_secrets']}
- Total Secrets: {validation_result['valid_secrets']}/{validation_result['total_secrets']}
"""

        return checklist

    def export_environment_template(self) -> str:
        """Export environment variable template."""
        template = "# CareerCopilot Production Environment Variables\n"
        template += "# Copy this file to .env.production and fill in the values\n\n"

        template += "# Core Environment\n"
        template += f"GCP_PROJECT_ID={self.project_id}\n"
        template += "ENV=production\n"
        template += "USE_SECRET_MANAGER=true\n\n"

        template += "# Optional: Environment Variable Overrides\n"
        template += "# (Secrets will be loaded from Secret Manager if not set here)\n\n"

        for secret_id, config in self.required_secrets.items():
            priority = "CRITICAL" if config["critical"] else "OPTIONAL"
            template += f"# {config['description']} ({priority})\n"
            template += f"# {config['env_var']}=your-{secret_id.replace('-', '_')}_value\n\n"

        return template


def main():
    """Main function."""
    import argparse

    parser = argparse.ArgumentParser(description="Validate production secrets for CareerCopilot")
    parser.add_argument("--project-id", default="careercopilot-468811",
                       help="GCP Project ID")
    parser.add_argument("--checklist", action="store_true",
                       help="Generate deployment checklist")
    parser.add_argument("--env-template", action="store_true",
                       help="Generate environment template")
    parser.add_argument("--json", action="store_true",
                       help="Output results as JSON")

    args = parser.parse_args()

    validator = ProductionSecretsValidator(project_id=args.project_id)

    if args.checklist:
        checklist = validator.generate_deployment_checklist()
        print(checklist)
        return

    if args.env_template:
        template = validator.export_environment_template()
        print(template)
        return

    result = validator.validate_all_secrets()

    if args.json:
        print(json.dumps(result, indent=2))

    sys.exit(0 if result["deployment_ready"] else 1)


if __name__ == "__main__":
    main()

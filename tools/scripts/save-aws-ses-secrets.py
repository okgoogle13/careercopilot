#!/usr/bin/env python3
"""
Save AWS SES Secrets to Google Cloud Secret Manager
Uses Python SDK instead of gcloud CLI (no CLI installation needed)
"""

import sys
from getpass import getpass
from pathlib import Path

# Add backend to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

try:
    from google.cloud import secretmanager
    from google.api_core import exceptions
except ImportError:
    print("❌ Error: google-cloud-secret-manager not installed")
    print("Run: pip install google-cloud-secret-manager")
    sys.exit(1)


class SecretCreator:
    """Creates secrets in Google Cloud Secret Manager."""

    def __init__(self, project_id="careercopilot-468811"):
        self.project_id = project_id
        try:
            self.client = secretmanager.SecretManagerServiceClient()
            print(f"✅ Connected to Google Cloud Secret Manager")
            print(f"📦 Project: {project_id}\n")
        except Exception as e:
            print(f"❌ Error connecting to Secret Manager: {e}")
            print("\nMake sure you're authenticated:")
            print("  export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json")
            print("  OR run: gcloud auth application-default login")
            sys.exit(1)

    def secret_exists(self, secret_id):
        """Check if a secret already exists."""
        try:
            name = f"projects/{self.project_id}/secrets/{secret_id}"
            self.client.get_secret(request={"name": name})
            return True
        except exceptions.NotFound:
            return False

    def create_or_update_secret(self, secret_id, secret_value):
        """Create a new secret or add a new version to existing secret."""
        parent = f"projects/{self.project_id}"

        if self.secret_exists(secret_id):
            # Add new version to existing secret
            print(f"  📝 Secret '{secret_id}' exists. Adding new version...")
            secret_path = f"{parent}/secrets/{secret_id}"

            payload = secret_value.encode("UTF-8")
            self.client.add_secret_version(
                request={
                    "parent": secret_path,
                    "payload": {"data": payload},
                }
            )
            print(f"  ✅ Updated secret '{secret_id}'")
        else:
            # Create new secret
            print(f"  🆕 Creating new secret '{secret_id}'...")

            # Create the secret
            secret = self.client.create_secret(
                request={
                    "parent": parent,
                    "secret_id": secret_id,
                    "secret": {
                        "replication": {"automatic": {}},
                    },
                }
            )

            # Add the secret version with data
            payload = secret_value.encode("UTF-8")
            self.client.add_secret_version(
                request={
                    "parent": secret.name,
                    "payload": {"data": payload},
                }
            )
            print(f"  ✅ Created secret '{secret_id}'")

    def grant_access(self, secret_id, service_account_email):
        """Grant a service account access to the secret."""
        try:
            secret_path = f"projects/{self.project_id}/secrets/{secret_id}"

            policy = self.client.get_iam_policy(request={"resource": secret_path})

            # Add the binding
            binding_exists = False
            for binding in policy.bindings:
                if binding.role == "roles/secretmanager.secretAccessor":
                    if f"serviceAccount:{service_account_email}" not in binding.members:
                        binding.members.append(f"serviceAccount:{service_account_email}")
                    binding_exists = True
                    break

            if not binding_exists:
                from google.iam.v1 import policy_pb2
                new_binding = policy_pb2.Binding(
                    role="roles/secretmanager.secretAccessor",
                    members=[f"serviceAccount:{service_account_email}"],
                )
                policy.bindings.append(new_binding)

            self.client.set_iam_policy(request={"resource": secret_path, "policy": policy})
            print(f"  🔐 Granted access to {service_account_email}")
        except Exception as e:
            print(f"  ⚠️  Warning: Could not grant access: {e}")
            print(f"     You may need to grant access manually")


def validate_email(email):
    """Basic email validation."""
    return "@" in email and "." in email


def validate_access_key(key):
    """Validate AWS access key format."""
    return len(key) == 20 and key.isupper() and key.startswith("AKIA")


def validate_secret_key(key):
    """Validate AWS secret key format."""
    return len(key) == 40


def main():
    print("=" * 60)
    print("AWS SES Secrets Setup - Python Edition")
    print("No gcloud CLI needed!")
    print("=" * 60)
    print()

    # Initialize Secret Manager client
    creator = SecretCreator()

    print("Please provide your AWS SES credentials:")
    print("(These will be securely stored in Google Cloud Secret Manager)")
    print()

    # Get AWS Access Key ID
    while True:
        aws_access_key = input("AWS Access Key ID (20 chars, starts with AKIA): ").strip()
        if not aws_access_key:
            print("❌ Access Key cannot be empty")
            continue
        if not validate_access_key(aws_access_key):
            print("⚠️  Warning: Expected format is 20 uppercase characters starting with AKIA")
            confirm = input("Continue anyway? (y/n): ").lower()
            if confirm != 'y':
                continue
        break

    # Get AWS Secret Access Key (hidden input)
    while True:
        aws_secret_key = getpass("AWS Secret Access Key (40 chars, hidden): ").strip()
        if not aws_secret_key:
            print("❌ Secret Key cannot be empty")
            continue
        if not validate_secret_key(aws_secret_key):
            print(f"⚠️  Warning: Expected 40 characters, got {len(aws_secret_key)}")
            confirm = input("Continue anyway? (y/n): ").lower()
            if confirm != 'y':
                continue
        break

    # Get SES Sender Email
    while True:
        ses_sender_email = input("SES Sender Email (your verified Gmail): ").strip()
        if not ses_sender_email:
            print("❌ Email cannot be empty")
            continue
        if not validate_email(ses_sender_email):
            print("⚠️  Warning: Email format looks incorrect")
            confirm = input("Continue anyway? (y/n): ").lower()
            if confirm != 'y':
                continue
        break

    # Get AWS Region (with default)
    aws_region = input("AWS Region [us-east-1]: ").strip() or "us-east-1"

    print()
    print("-" * 60)
    print("Summary:")
    print(f"  AWS Access Key ID: {aws_access_key[:8]}...{aws_access_key[-4:]}")
    print(f"  AWS Secret Key: {'*' * 36}...{aws_secret_key[-4:]}")
    print(f"  SES Sender Email: {ses_sender_email}")
    print(f"  AWS Region: {aws_region}")
    print("-" * 60)
    print()

    confirm = input("Create these secrets in Google Cloud Secret Manager? (y/n): ").lower()
    if confirm != 'y':
        print("❌ Cancelled")
        sys.exit(0)

    print()
    print("Creating secrets...")
    print()

    # Create secrets
    try:
        creator.create_or_update_secret("aws-access-key-id", aws_access_key)
        creator.create_or_update_secret("aws-secret-access-key", aws_secret_key)
        creator.create_or_update_secret("ses-sender-email", ses_sender_email)
        creator.create_or_update_secret("aws-region", aws_region)

        print()
        print("=" * 60)
        print("✅ All secrets created successfully!")
        print("=" * 60)
        print()

        # Optional: Grant service account access
        print("Optional: Grant Cloud Run service account access")
        grant = input("Do you want to grant access to a service account? (y/n): ").lower()

        if grant == 'y':
            sa_email = input("Service account email: ").strip()
            if sa_email:
                print()
                print("Granting access...")
                for secret_id in ["aws-access-key-id", "aws-secret-access-key",
                                 "ses-sender-email", "aws-region"]:
                    creator.grant_access(secret_id, sa_email)
                print()
                print("✅ Access granted!")

        print()
        print("Next steps:")
        print("1. Verify secrets: python3 scripts/production-secrets-validator.py")
        print("2. Update requirements: pip-compile backend/requirements.in")
        print("3. Deploy: ./scripts/deploy.sh staging")
        print()

    except Exception as e:
        print()
        print(f"❌ Error creating secrets: {e}")
        print()
        print("Troubleshooting:")
        print("1. Make sure you're authenticated to Google Cloud")
        print("2. Check you have Secret Manager permissions")
        print("3. Verify project ID is correct")
        sys.exit(1)


if __name__ == "__main__":
    main()

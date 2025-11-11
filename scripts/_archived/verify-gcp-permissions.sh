#!/bin/bash

echo "🔍 GCP Service Account Permissions Verification"
echo "=============================================="

STAGING_PROJECT="careercopilot-staging"
PROD_PROJECT="careercopilot-468811"

REQUIRED_ROLES=(
    "roles/run.admin"
    "roles/iam.serviceAccountUser"
    "roles/storage.admin"
    "roles/secretmanager.secretAccessor"
    "roles/cloudbuild.builds.builder"
    "roles/artifactregistry.writer"
    "roles/logging.logWriter"
    "roles/monitoring.metricWriter"
)

check_service_account_roles() {
    local project=$1
    local sa_email=$2

    echo ""
    echo "Checking service account: $sa_email in project: $project"

    if ! gcloud auth list --filter="account:$sa_email" --format="value(account)" | grep -q "$sa_email"; then
        echo "❌ Service account $sa_email is not authenticated"
        return 1
    fi

    echo "✅ Service account is authenticated"

    local missing_roles=()
    for role in "${REQUIRED_ROLES[@]}"; do
        if gcloud projects get-iam-policy "$project" \
           --flatten="bindings[].members" \
           --format="table(bindings.role)" \
           --filter="bindings.members:serviceAccount:$sa_email AND bindings.role:$role" | grep -q "$role"; then
            echo "✅ $role"
        else
            echo "❌ $role (MISSING)"
            missing_roles+=("$role")
        fi
    done

    if [ ${#missing_roles[@]} -gt 0 ]; then
        echo ""
        echo "❌ Missing roles for $sa_email:"
        printf '   - %s\n' "${missing_roles[@]}"
        return 1
    else
        echo "✅ All required roles are assigned"
        return 0
    fi
}

echo "Note: Run this script with appropriate gcloud credentials"
echo "Usage: ./scripts/verify-gcp-permissions.sh [staging|production|both]"

TARGET=${1:-both}

if [[ "$TARGET" == "staging" || "$TARGET" == "both" ]]; then
    echo ""
    echo "🔍 Checking STAGING permissions..."
    # Note: Replace with actual service account email from GitHub secrets
    echo "Please manually verify the staging service account has the required roles."
    echo "Project: $STAGING_PROJECT"
    printf 'Required roles:\n'
    printf '   - %s\n' "${REQUIRED_ROLES[@]}"
fi

if [[ "$TARGET" == "production" || "$TARGET" == "both" ]]; then
    echo ""
    echo "🔍 Checking PRODUCTION permissions..."
    # Note: Replace with actual service account email from GitHub secrets
    echo "Please manually verify the production service account has the required roles."
    echo "Project: $PROD_PROJECT"
    printf 'Required roles:\n'
    printf '   - %s\n' "${REQUIRED_ROLES[@]}"
fi

echo ""
echo "💡 To grant missing roles, use:"
echo "   gcloud projects add-iam-policy-binding PROJECT_ID \\"
echo "     --member='serviceAccount:SA_EMAIL' \\"
echo "     --role='ROLE_NAME'"

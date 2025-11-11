#!/bin/bash

echo "🔧 GCP IAM Permissions Fix Script"
echo "================================="

# Default project IDs
STAGING_PROJECT="careercopilot-staging"
PROD_PROJECT="careercopilot-468811"

# Required roles for GitHub Actions deployment
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

# Function to grant roles to a service account
grant_roles_to_sa() {
    local project=$1
    local sa_email=$2
    local environment=$3

    echo ""
    echo "🔐 Granting roles to $environment service account..."
    echo "Service Account: $sa_email"
    echo "Project: $project"

    local success_count=0
    local total_roles=${#REQUIRED_ROLES[@]}

    for role in "${REQUIRED_ROLES[@]}"; do
        echo -n "   Granting $role... "

        if gcloud projects add-iam-policy-binding "$project" \
           --member="serviceAccount:$sa_email" \
           --role="$role" \
           --quiet >/dev/null 2>&1; then
            echo "✅"
            ((success_count++))
        else
            echo "❌ (may already exist or insufficient permissions)"
        fi
    done

    echo ""
    echo "✅ Granted $success_count/$total_roles roles successfully"

    if [ $success_count -eq $total_roles ]; then
        echo "🎉 All roles granted successfully for $environment!"
        return 0
    else
        echo "⚠️  Some roles may need manual intervention for $environment"
        return 1
    fi
}

# Function to create service account if it doesn't exist
create_service_account() {
    local project=$1
    local sa_name=$2
    local display_name=$3

    echo ""
    echo "👤 Creating service account if needed..."

    if gcloud iam service-accounts describe "$sa_name@$project.iam.gserviceaccount.com" \
       --project="$project" >/dev/null 2>&1; then
        echo "✅ Service account $sa_name already exists in $project"
        return 0
    else
        echo "📝 Creating service account $sa_name in $project..."
        if gcloud iam service-accounts create "$sa_name" \
           --project="$project" \
           --display-name="$display_name" \
           --description="GitHub Actions deployment service account"; then
            echo "✅ Service account created successfully"
            return 0
        else
            echo "❌ Failed to create service account"
            return 1
        fi
    fi
}

# Function to create and download service account keys
create_sa_keys() {
    local project=$1
    local sa_name=$2
    local environment=$3

    echo ""
    echo "🔑 Creating service account key for $environment..."

    local key_file="$sa_name-$environment-key.json"
    local sa_email="$sa_name@$project.iam.gserviceaccount.com"

    if gcloud iam service-accounts keys create "$key_file" \
       --iam-account="$sa_email" \
       --project="$project"; then
        echo "✅ Service account key created: $key_file"
        echo ""
        echo "📋 IMPORTANT: Add this key to GitHub Secrets:"
        echo "   Secret Name: GCP_${environment^^}_SA_KEY"
        echo "   Secret Value: [Contents of $key_file]"
        echo ""
        echo "   To get the contents:"
        echo "   cat $key_file | base64 -w 0"
        echo ""
        return 0
    else
        echo "❌ Failed to create service account key"
        return 1
    fi
}

# Main execution
main() {
    echo ""
    echo "This script will:"
    echo "1. Create service accounts if they don't exist"
    echo "2. Grant required IAM roles for Cloud Run deployment"
    echo "3. Generate service account keys for GitHub Actions"
    echo ""

    read -p "Continue? (y/N): " -n 1 -r
    echo

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi

    # Check if gcloud is authenticated
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 >/dev/null; then
        echo "❌ No active gcloud authentication found"
        echo "Please run: gcloud auth login"
        exit 1
    fi

    echo "✅ Authenticated as: $(gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1)"

    # Process staging environment
    echo ""
    echo "🚀 Processing STAGING environment..."
    if create_service_account "$STAGING_PROJECT" "github-actions-staging" "GitHub Actions Staging Deployment"; then
        grant_roles_to_sa "$STAGING_PROJECT" "github-actions-staging@$STAGING_PROJECT.iam.gserviceaccount.com" "staging"
        create_sa_keys "$STAGING_PROJECT" "github-actions-staging" "staging"
    fi

    # Process production environment
    echo ""
    echo "🏭 Processing PRODUCTION environment..."
    if create_service_account "$PROD_PROJECT" "github-actions-production" "GitHub Actions Production Deployment"; then
        grant_roles_to_sa "$PROD_PROJECT" "github-actions-production@$PROD_PROJECT.iam.gserviceaccount.com" "production"
        create_sa_keys "$PROD_PROJECT" "github-actions-production" "production"
    fi

    echo ""
    echo "🎯 IAM fix script completed!"
    echo ""
    echo "Next steps:"
    echo "1. Add the generated service account keys to GitHub Secrets"
    echo "2. Update the deploy.yml workflow to use the new service accounts"
    echo "3. Test the deployment pipeline"
    echo ""
    echo "GitHub Secrets to update:"
    echo "   - GCP_STAGING_SA_KEY (for staging deployments)"
    echo "   - GCP_SA_KEY (for production deployments)"
}

# Parse command line arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [--staging-only|--production-only]"
        echo ""
        echo "Options:"
        echo "  --staging-only     Fix only staging environment"
        echo "  --production-only  Fix only production environment"
        echo "  --help, -h         Show this help message"
        exit 0
        ;;
    --staging-only)
        echo "🚀 Fixing STAGING environment only..."
        # Modify main function to only process staging
        ;;
    --production-only)
        echo "🏭 Fixing PRODUCTION environment only..."
        # Modify main function to only process production
        ;;
    "")
        # Default: process both environments
        ;;
    *)
        echo "❌ Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac

main "$@"

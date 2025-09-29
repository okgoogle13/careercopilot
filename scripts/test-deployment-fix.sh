#!/bin/bash

echo "🧪 Testing Deployment Pipeline Fix"
echo "================================="

# Test 1: Check if GitHub secrets are properly configured
test_github_secrets() {
    echo ""
    echo "Test 1: Checking GitHub secrets configuration..."

    local required_secrets=(
        "GCP_SA_KEY"
        "GCP_STAGING_SA_KEY"
        "GCP_PROJECT_ID"
        "GCP_STAGING_PROJECT_ID"
        "FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT"
        "FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT_STAGING"
    )

    echo "Checking if required secrets exist..."
    for secret in "${required_secrets[@]}"; do
        if gh secret list | grep -q "$secret"; then
            echo "   ✅ $secret"
        else
            echo "   ❌ $secret (MISSING)"
        fi
    done
}

# Test 2: Validate workflow syntax
test_workflow_syntax() {
    echo ""
    echo "Test 2: Validating workflow syntax..."

    if [ -f ".github/workflows/ci.yml" ]; then
        echo "   ✅ CI workflow exists"
    else
        echo "   ❌ CI workflow missing"
    fi

    if [ -f ".github/workflows/deploy.yml" ]; then
        echo "   ✅ Deploy workflow exists"
    else
        echo "   ❌ Deploy workflow missing"
    fi

    if [ -f ".github/actions/prepare-frontend-deploy/action.yml" ]; then
        echo "   ✅ Custom frontend deploy action exists"
    else
        echo "   ❌ Custom frontend deploy action missing"
    fi
}

# Test 3: Check local build capability
test_local_build() {
    echo ""
    echo "Test 3: Testing local build capability..."

    echo "   Testing yarn install..."
    if yarn install >/dev/null 2>&1; then
        echo "   ✅ Yarn install successful"
    else
        echo "   ❌ Yarn install failed"
        return 1
    fi

    echo "   Testing frontend build..."
    if yarn build:frontend >/dev/null 2>&1; then
        echo "   ✅ Frontend build successful"
    else
        echo "   ❌ Frontend build failed"
    fi
}

# Test 4: Trigger a test deployment
test_trigger_deployment() {
    echo ""
    echo "Test 4: Triggering test deployment..."

    echo "   This will trigger the deploy workflow with staging environment"
    read -p "   Proceed with test deployment? (y/N): " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "   Triggering deployment workflow..."
        if gh workflow run deploy.yml -f environment=staging; then
            echo "   ✅ Deployment workflow triggered"
            echo "   Monitor progress with: gh run list --workflow=deploy.yml"
        else
            echo "   ❌ Failed to trigger deployment workflow"
        fi
    else
        echo "   Skipped deployment trigger"
    fi
}

# Main test execution
main() {
    test_github_secrets
    test_workflow_syntax
    test_local_build
    test_trigger_deployment

    echo ""
    echo "🎯 Test completed!"
    echo ""
    echo "If any tests failed, run the fix script:"
    echo "   ./scripts/fix-deployment-pipeline.sh"
    echo ""
    echo "For IAM permissions, run:"
    echo "   ./scripts/fix-gcp-iam-permissions.sh"
}

main "$@"

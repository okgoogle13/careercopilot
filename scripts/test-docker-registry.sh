#!/bin/bash
# Test script for Docker Registry setup validation

set -e

PROJECT_ID="careercopilot-468811"
REGION="us-central1"
REGISTRY="us-central1-docker.pkg.dev"
REPOSITORY="careercopilot"

echo "🐳 Testing Docker Registry Setup for CareerCopilot"
echo "================================================="

echo "📋 Configuration:"
echo "  Project ID: $PROJECT_ID"
echo "  Region: $REGION"
echo "  Registry: $REGISTRY"
echo "  Repository: $REPOSITORY"
echo ""

# Check gcloud authentication
echo "🔐 Checking gcloud authentication..."
if gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 > /dev/null; then
    ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1)
    echo "✅ Authenticated as: $ACTIVE_ACCOUNT"
else
    echo "❌ Not authenticated with gcloud. Run: gcloud auth login"
    exit 1
fi

# Check project configuration
echo ""
echo "📊 Checking project configuration..."
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null || echo "")
if [ "$CURRENT_PROJECT" = "$PROJECT_ID" ]; then
    echo "✅ Project set correctly: $CURRENT_PROJECT"
else
    echo "⚠️  Project not set or incorrect. Current: $CURRENT_PROJECT"
    echo "   Setting project: $PROJECT_ID"
    gcloud config set project $PROJECT_ID
fi

# Check Artifact Registry repository
echo ""
echo "🗄️  Checking Artifact Registry repository..."
if gcloud artifacts repositories describe $REPOSITORY --location=$REGION > /dev/null 2>&1; then
    echo "✅ Repository '$REPOSITORY' exists in $REGION"
else
    echo "❌ Repository '$REPOSITORY' does not exist in $REGION"
    echo "   Create with: gcloud artifacts repositories create $REPOSITORY --repository-format=docker --location=$REGION"
    exit 1
fi

# Check Docker authentication
echo ""
echo "🔧 Checking Docker authentication..."
if grep -q "$REGISTRY" ~/.docker/config.json 2>/dev/null; then
    echo "✅ Docker configured for $REGISTRY"
else
    echo "❌ Docker not configured for $REGISTRY"
    echo "   Configure with: gcloud auth configure-docker $REGISTRY"
    exit 1
fi

# Test Docker authentication by attempting to get authentication token
echo ""
echo "🧪 Testing Docker authentication..."
if gcloud auth print-access-token > /dev/null 2>&1; then
    echo "✅ Can obtain access token"
else
    echo "❌ Cannot obtain access token"
    exit 1
fi

# Show example commands
echo ""
echo "📝 Example Docker commands for your setup:"
echo ""
echo "Build image:"
echo "  docker build -t $REGISTRY/$PROJECT_ID/$REPOSITORY/backend:latest ./backend"
echo ""
echo "Push image:"
echo "  docker push $REGISTRY/$PROJECT_ID/$REPOSITORY/backend:latest"
echo ""
echo "List images in registry:"
echo "  gcloud artifacts docker images list $REGISTRY/$PROJECT_ID/$REPOSITORY"
echo ""

echo "✅ Docker Registry setup validation complete!"

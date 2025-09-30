#!/bin/bash
# Deploys the CareerCopilot application to Google Cloud Run with AI optimization

set -e  # Exit on any error

echo "🚀 CareerCopilot AI Optimization - Production Deployment"
echo "======================================================="

# Configuration
PROJECT_ID="${GOOGLE_CLOUD_PROJECT:-careercopilot-468811}"
REGION="us-central1"
SERVICE_NAME="careercopilot-backend"

echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "Service: $SERVICE_NAME"
echo ""

echo "Deploying backend with AI cost optimization..."

# Deploy from backend directory
cd backend

# Deploy using Cloud Run with all required secrets
gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-secrets="REDIS_HOST=REDIS_HOST:latest,REDIS_PORT=REDIS_PORT:latest,OPENAI_API_KEY=OPENAI_API_KEY:latest,ANTHROPIC_API_KEY=ANTHROPIC_API_KEY:latest,GEMINI_API_KEY=GEMINI_API_KEY:latest" \
  --set-env-vars="ENVIRONMENT=production,ENABLE_AI_CACHE=true,ENABLE_GENKIT_FLOWS=true" \
  --memory=2Gi \
  --cpu=2 \
  --max-instances=10 \
  --timeout=300 \
  --project="$PROJECT_ID"

SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --project="$PROJECT_ID" --format="value(status.url)")

echo ""
echo "✅ Production deployment complete!"
echo "🎯 AI cost optimization is now live!"
echo "🌐 Service URL: $SERVICE_URL"
echo ""
echo "Test the deployment:"
echo "  curl $SERVICE_URL/health"
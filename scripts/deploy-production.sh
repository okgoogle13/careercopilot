#!/bin/bash
# Deploys the CareerCopilot application to Google Cloud Run with AI optimization

set -e  # Exit on any error

echo "🚀 CareerCopilot AI Optimization - Production Deployment"
echo "======================================================="

# Configuration from final.md
PROJECT_ID="${GOOGLE_CLOUD_PROJECT:-careercopilot-468811}"

echo "Deploying CareerCopilot with AI cost optimization..."

# Deploy using the exact command from final.md
gcloud run deploy careercopilot-service \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-secrets="REDIS_HOST=REDIS_HOST:latest,REDIS_PORT=REDIS_PORT:latest" \
  --set-env-vars="ENVIRONMENT=production,ENABLE_AI_CACHE=true" \
  --memory=2Gi \
  --cpu=2 \
  --max-instances=10 \
  --project="$PROJECT_ID"

echo "✅ Production deployment complete!"
echo "🎯 AI cost optimization is now live!"
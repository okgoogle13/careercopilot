#!/bin/bash

# Deploy Vertex AI Vector Search endpoints
# This script creates the necessary Vector Search index and endpoint

set -e

# Configuration
PROJECT_ID="careercopilot-468811"
PROJECT_NUMBER="867091085935"
REGION="us-central1"
INDEX_NAME="careercopilot-vector-index"
ENDPOINT_NAME="careercopilot-vector-endpoint"
DIMENSION=384
DISTANCE_MEASURE="COSINE_DISTANCE"

echo "🚀 Deploying Vertex AI Vector Search for project: $PROJECT_ID"
echo "Region: $REGION"
echo "Index Name: $INDEX_NAME"
echo "Endpoint Name: $ENDPOINT_NAME"
echo "Dimension: $DIMENSION"
echo

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "📋 Enabling required APIs..."
gcloud services enable aiplatform.googleapis.com
gcloud services enable storage.googleapis.com

# Create a GCS bucket for the index if it doesn't exist
BUCKET_NAME="${PROJECT_ID}-vector-index"
echo "🪣 Creating GCS bucket: gs://$BUCKET_NAME"
gsutil mb -p $PROJECT_ID -l $REGION gs://$BUCKET_NAME 2>/dev/null || echo "Bucket already exists"

# Create metadata file for the index
METADATA_FILE="/tmp/vector-index-metadata.json"
echo "📝 Creating index metadata file..."
cat > $METADATA_FILE << EOF
{
  "contentsDeltaUri": "gs://$BUCKET_NAME/index_data",
  "config": {
    "dimensions": $DIMENSION,
    "approximateNeighborsCount": 150,
    "distanceMeasureType": "$DISTANCE_MEASURE",
    "algorithmConfig": {
      "treeAhConfig": {
        "leafNodeEmbeddingCount": 500,
        "leafNodesToSearchPercent": 7
      }
    },
    "shardSize": "SHARD_SIZE_SMALL"
  }
}
EOF

# Create the Vector Search index
echo "🔍 Creating Vector Search Index..."
INDEX_CREATE_RESPONSE=$(gcloud ai indexes create \
  --region=$REGION \
  --display-name=$INDEX_NAME \
  --description="Vector search index for CareerCopilot RAG system" \
  --metadata-file=$METADATA_FILE \
  --format="value(name)")

echo "✅ Index created: $INDEX_CREATE_RESPONSE"

# Wait for index creation to complete
echo "⏳ Waiting for index creation to complete..."
gcloud ai indexes describe $INDEX_CREATE_RESPONSE --region=$REGION

# Create the Vector Search endpoint
echo "🔗 Creating Vector Search Endpoint..."
ENDPOINT_CREATE_RESPONSE=$(gcloud ai index-endpoints create \
  --region=$REGION \
  --display-name=$ENDPOINT_NAME \
  --description="Vector search endpoint for CareerCopilot RAG system" \
  --network="projects/$PROJECT_NUMBER/global/networks/default" \
  --format="value(name)")

echo "✅ Endpoint created: $ENDPOINT_CREATE_RESPONSE"

# Wait for endpoint creation to complete
echo "⏳ Waiting for endpoint creation to complete..."
gcloud ai index-endpoints describe $ENDPOINT_CREATE_RESPONSE --region=$REGION

# Deploy the index to the endpoint
echo "🚀 Deploying index to endpoint..."
DEPLOY_RESPONSE=$(gcloud ai index-endpoints deploy-index $ENDPOINT_CREATE_RESPONSE \
  --region=$REGION \
  --index=$INDEX_CREATE_RESPONSE \
  --deployed-index-id="default_index" \
  --display-name="Default Index Deployment" \
  --min-replica-count=1 \
  --max-replica-count=2 \
  --format="value(name)")

echo "✅ Index deployed to endpoint: $DEPLOY_RESPONSE"

# Extract the endpoint ID for configuration
ENDPOINT_ID=$(basename $ENDPOINT_CREATE_RESPONSE)
INDEX_ID=$(basename $INDEX_CREATE_RESPONSE)

echo
echo "🎉 Deployment Complete!"
echo "================================================"
echo "Index ID: $INDEX_ID"
echo "Endpoint ID: $ENDPOINT_ID"
echo "Full Index Name: $INDEX_CREATE_RESPONSE"
echo "Full Endpoint Name: $ENDPOINT_CREATE_RESPONSE"
echo
echo "💡 Add these to your environment variables:"
echo "export VERTEX_AI_INDEX_ENDPOINT='$ENDPOINT_CREATE_RESPONSE'"
echo "export VERTEX_AI_INDEX_ID='$INDEX_ID'"
echo
echo "Or add to your configuration:"
echo "VERTEX_AI_INDEX_ENDPOINT=$ENDPOINT_CREATE_RESPONSE"
echo "VERTEX_AI_INDEX_ID=$INDEX_ID"
echo

# Test the deployment
echo "🧪 Testing the deployment..."
python3 << EOF
import os
from google.cloud import aiplatform

try:
    # Initialize
    project_id = "$PROJECT_ID"
    region = "$REGION"
    endpoint_name = "$ENDPOINT_CREATE_RESPONSE"

    aiplatform.init(project=project_id, location=region)

    # Get the endpoint
    endpoint = aiplatform.MatchingEngineIndexEndpoint(endpoint_name)

    print(f"✅ Successfully connected to endpoint: {endpoint.display_name}")
    print(f"Endpoint resource name: {endpoint.resource_name}")

    # List deployed indexes
    deployed_indexes = endpoint.deployed_indexes
    print(f"Deployed indexes: {len(deployed_indexes)}")

    for idx in deployed_indexes:
        print(f"  - {idx.id}: {idx.display_name}")

    print("🎉 Vector Search deployment verified!")

except Exception as e:
    print(f"❌ Deployment verification failed: {e}")
EOF

echo "✅ Deployment script completed!"

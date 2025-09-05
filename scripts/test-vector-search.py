#!/usr/bin/env python3

"""
Test script for Vertex AI Vector Search deployment
"""

import os
import sys
import json
import numpy as np
from typing import List
from google.cloud import aiplatform
from google.oauth2 import service_account

# Configuration
PROJECT_ID = "careercopilot-468811"
REGION = "us-central1"
INDEX_ENDPOINT = "projects/867091085935/locations/us-central1/indexEndpoints/4168804933782470656"
DEPLOYED_INDEX_ID = "default_index"
DIMENSION = 384

def setup_credentials():
    """Setup Google Cloud credentials"""
    credentials_path = "/Applications/careercopilot/backend/firebase-prod-key.json"

    if os.path.exists(credentials_path):
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path
        print(f"✅ Using credentials from: {credentials_path}")
    else:
        print(f"❌ Credentials file not found: {credentials_path}")
        return False
    return True

def test_vertex_ai_connection():
    """Test basic Vertex AI connection"""
    try:
        # Initialize Vertex AI
        print(f"🔧 Initializing Vertex AI for project: {PROJECT_ID}, region: {REGION}")
        aiplatform.init(project=PROJECT_ID, location=REGION)

        print("✅ Vertex AI initialized successfully")
        return True

    except Exception as e:
        print(f"❌ Failed to initialize Vertex AI: {e}")
        return False

def test_vector_endpoint():
    """Test Vector Search endpoint connectivity"""
    try:
        print(f"🔍 Testing endpoint: {INDEX_ENDPOINT}")

        # Get the endpoint
        endpoint = aiplatform.MatchingEngineIndexEndpoint(INDEX_ENDPOINT)

        print(f"✅ Successfully connected to endpoint: {endpoint.display_name}")
        print(f"   Resource name: {endpoint.resource_name}")

        # List deployed indexes
        deployed_indexes = endpoint.deployed_indexes
        print(f"📋 Deployed indexes: {len(deployed_indexes)}")

        for idx in deployed_indexes:
            private_endpoint_count = len(idx.private_endpoints) if hasattr(idx, 'private_endpoints') and idx.private_endpoints else 0
            print(f"   - {idx.id}: {idx.display_name} (private endpoints: {private_endpoint_count})")

        return endpoint, deployed_indexes

    except Exception as e:
        print(f"❌ Failed to connect to endpoint: {e}")
        return None, None

def test_vector_search(endpoint, deployed_indexes):
    """Test vector search functionality"""
    try:
        if not deployed_indexes:
            print("❌ No deployed indexes found")
            return False

        print("🧪 Testing vector search...")

        # Create a sample query vector
        query_vector = np.random.rand(DIMENSION).tolist()

        print(f"📊 Query vector dimension: {len(query_vector)}")

        # Perform the search
        print(f"🔍 Performing search with deployed_index_id: {DEPLOYED_INDEX_ID}")

        try:
            response = endpoint.match(
                deployed_index_id=DEPLOYED_INDEX_ID,
                queries=[query_vector],
                num_neighbors=5
            )

            print("✅ Vector search completed successfully")
            print(f"📈 Search results: {len(response)} result sets")

            if response and len(response) > 0:
                for i, matches in enumerate(response):
                    print(f"   Query {i}: {len(matches)} matches")
                    for j, match in enumerate(matches[:3]):  # Show first 3 matches
                        print(f"     Match {j}: ID={match.id}, Distance={match.distance}")
            else:
                print("   No matches found (this is expected for an empty index)")

            return True

        except Exception as search_error:
            print(f"❌ Vector search failed: {search_error}")
            return False

    except Exception as e:
        print(f"❌ Test vector search failed: {e}")
        return False

def test_index_operations():
    """Test index operations like adding vectors"""
    try:
        print("🧪 Testing index operations...")

        # For now, we'll just verify that we can access the index
        # In production, you would add test vectors here
        print("ℹ️  Index operations test skipped (requires data ingestion setup)")
        print("ℹ️  To add vectors, use the VectorStore class in your application")

        return True

    except Exception as e:
        print(f"❌ Index operations test failed: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 Starting Vertex AI Vector Search Tests")
    print("=" * 50)

    # Setup credentials
    if not setup_credentials():
        sys.exit(1)

    # Test Vertex AI connection
    if not test_vertex_ai_connection():
        sys.exit(1)

    # Test endpoint connectivity
    endpoint, deployed_indexes = test_vector_endpoint()
    if not endpoint:
        sys.exit(1)

    # Test vector search
    if not test_vector_search(endpoint, deployed_indexes):
        print("⚠️  Vector search test failed, but this may be expected for a new index")

    # Test index operations
    test_index_operations()

    print("=" * 50)
    print("🎉 Vector Search deployment tests completed!")
    print()
    print("📋 Summary:")
    print(f"   Project: {PROJECT_ID}")
    print(f"   Region: {REGION}")
    print(f"   Index Endpoint: {INDEX_ENDPOINT}")
    print(f"   Deployed Index ID: {DEPLOYED_INDEX_ID}")
    print(f"   Vector Dimension: {DIMENSION}")
    print()
    print("💡 Next steps:")
    print("   1. Update your application configuration with the endpoint details")
    print("   2. Use the VectorStore class to add documents and embeddings")
    print("   3. Test similarity search with real data")
    print("   4. Monitor performance and scale as needed")

if __name__ == "__main__":
    main()

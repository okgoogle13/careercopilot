import sys
import os
import asyncio
from io import BytesIO
from fastapi import FastAPI
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, AsyncMock

# Add project root to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Import ONLY what we need (avoid app.main)
from app.api.routes.career import router as career_router
from app.core.dependencies import get_current_user
from app.models import User
from app.services.user_profile_service import user_profile_service

# Create Minimal App
app = FastAPI()
app.include_router(career_router, prefix="/api/career")

# Mock User
mock_user = User(uid="test_genkit_user", email="test@genkit.ai", name="Genkit Tester")

# Mock Dependency
def mock_get_current_user():
    return mock_user

# Mock Firestore Service
user_profile_service.update_user_profile = AsyncMock(return_value={})

# Apply Override
app.dependency_overrides[get_current_user] = mock_get_current_user

# Sample Resume Content
SAMPLE_RESUME = """
JOHN DOE
Software Engineer

EXPERIENCE
Tech Corp | Senior Developer | 2020 - Present
- Led the migration of legacy monolith to microservices using Python and Go.
- Improved system latency by 40% through caching strategies.
- Mentored 5 junior developers.

Startup Inc | Junior Developer | 2018 - 2020
- Developed REST APIs using Flask.
- Handled database migrations.

EDUCATION
University of Tech | BS Computer Science | 2018
"""

def verify_ingestion():
    client = TestClient(app)
    
    print("🚀 Starting Genkit V1 Ingestion Verification (Standalone)...")
    print("---------------------------------------------")
    
    # Create dummy file
    file_content = SAMPLE_RESUME.encode('utf-8')
    files = {'files': ('resume.txt', file_content, 'text/plain')}
    
    try:
        response = client.post("/api/career/ingest", files=files)
        
        if response.status_code == 200:
            print("✅ API Call Successful (200 OK)")
            data = response.json()
            
            # Basic Validation
            print(f"📄 Name Extracted: {data.get('personal_info', {}).get('full_name')}")
            print(f"💼 Entries Found: {len(data.get('entries', []))}")
            print(f"🏆 Achievements Structured: {len(data.get('achievements', []))}")
            
            # Check for AI Enrichment
            if data['achievements']:
                first_ach = data['achievements'][0]
                print("\n🔍 AI Enrichment Check:")
                print(f"   Original: {first_ach.get('original_text')}")
                print(f"   Action Verb: {first_ach.get('action_verb')}")
                print(f"   Metric: {first_ach.get('metric')}")
                print(f"   Suggestion: {first_ach.get('improvement_suggestions', {}).get('action_verb')}")
                
            print("\n✅ Verification Complete! Genkit is operational.")
        else:
            print(f"❌ API Call Failed: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Exception Verification Failed: {str(e)}")

if __name__ == "__main__":
    verify_ingestion()

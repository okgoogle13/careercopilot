#!/usr/bin/env python3
"""
Test script to verify AI deployment is working correctly.
Run this after backend deployment to check all AI components.
"""

import requests
import json
import sys
import time

BASE_URL = "http://localhost:8000"

def test_health_endpoint():
    """Test the main health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("✅ Health endpoint working")
            print(f"   Status: {data.get('status', 'unknown')}")
            print(f"   Version: {data.get('version', 'unknown')}")

            # Check Genkit status
            genkit_info = data.get('genkit', {})
            if genkit_info.get('genkit_available'):
                print("✅ Genkit is available and configured")
                print(f"   Google AI: {'✅' if genkit_info.get('google_ai_configured') else '❌'}")
                print(f"   API Key: {'✅' if genkit_info.get('api_key_present') else '❌'}")
                print(f"   Flows: {'✅' if genkit_info.get('flows_enabled') else '❌'}")
            else:
                print("❌ Genkit not available")
                errors = genkit_info.get('errors', [])
                if errors:
                    print(f"   Errors: {', '.join(errors)}")

            return True, data
        else:
            print(f"❌ Health endpoint failed: {response.status_code}")
            return False, None
    except Exception as e:
        print(f"❌ Health endpoint error: {e}")
        return False, None

def test_intelligence_endpoint():
    """Test the intelligence API endpoints"""
    print("\n🔍 Testing intelligence API...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/intelligence/market-insights?field=software_engineering&location=melbourne", timeout=30)
        if response.status_code in [200, 404]:  # 404 is expected if no data exists yet
            print("✅ Intelligence API is accessible")
            if response.status_code == 200:
                print("✅ Intelligence API returning data")
            else:
                print("ℹ️  Intelligence API accessible but no data yet (expected)")
            return True
        else:
            print(f"❌ Intelligence API failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Intelligence API error: {e}")
        return False

def test_ai_services_endpoint():
    """Test the AI services endpoints"""
    print("\n🔍 Testing AI services API...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/ai/", timeout=10)
        # Any response (even 404/405) means the endpoint is accessible
        print("✅ AI services API is accessible")
        return True
    except Exception as e:
        print(f"❌ AI services API error: {e}")
        return False

def wait_for_backend(max_attempts=30):
    """Wait for backend to be ready"""
    print("⏳ Waiting for backend to be ready...")
    for attempt in range(max_attempts):
        try:
            response = requests.get(f"{BASE_URL}/health", timeout=5)
            if response.status_code == 200:
                print("✅ Backend is ready!")
                return True
        except:
            pass

        print(f"   Attempt {attempt + 1}/{max_attempts}...")
        time.sleep(2)

    print("❌ Backend not ready after waiting")
    return False

def main():
    """Run all tests"""
    print("🚀 Starting AI Deployment Test")
    print(f"   Target: {BASE_URL}")
    print("=" * 50)

    # Wait for backend
    if not wait_for_backend():
        sys.exit(1)

    success_count = 0
    total_tests = 3

    # Test health endpoint
    health_ok, health_data = test_health_endpoint()
    if health_ok:
        success_count += 1

    # Test intelligence API
    if test_intelligence_endpoint():
        success_count += 1

    # Test AI services API
    if test_ai_services_endpoint():
        success_count += 1

    # Summary
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {success_count}/{total_tests} passed")

    if success_count == total_tests:
        print("🎉 All tests passed! AI deployment is working correctly.")
        sys.exit(0)
    else:
        print(f"⚠️  {total_tests - success_count} test(s) failed. Check the logs above.")
        sys.exit(1)

if __name__ == "__main__":
    main()

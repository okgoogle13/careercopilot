#!/usr/bin/env python3

"""
Simple test for Genkit functionality
"""

import os
import sys

# Load environment from backend/.env
def load_env():
    env_file = '/Applications/careercopilot/backend/.env'
    if os.path.exists(env_file):
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key] = value

def test_genkit_import():
    """Test basic Genkit import"""
    try:
        import genkit
        print("✅ Genkit import successful")
        return True
    except Exception as e:
        print(f"❌ Genkit import failed: {e}")
        return False

def test_google_ai_plugin():
    """Test Google AI plugin import"""
    try:
        from genkit.plugins import googleai
        print("✅ Google AI plugin import successful")
        return True
    except Exception as e:
        print(f"❌ Google AI plugin import failed: {e}")
        return False

def test_genkit_init():
    """Test Genkit initialization"""
    try:
        # Import the init function
        sys.path.append('/Applications/careercopilot')
        from backend.app.core.genkit_init import init_genkit
        
        # Test initialization
        result = init_genkit()
        if result:
            print("✅ Genkit initialization successful")
        else:
            print("❌ Genkit initialization failed")
        return result
        
    except Exception as e:
        print(f"❌ Genkit initialization test failed: {e}")
        return False

def test_environment():
    """Test environment variables"""
    required_vars = ['GEMINI_API_KEY', 'GOOGLE_CLOUD_PROJECT', 'ENABLE_GENKIT_FLOWS']
    all_good = True
    
    for var in required_vars:
        value = os.getenv(var)
        if value:
            if var == 'GEMINI_API_KEY':
                print(f"✅ {var}: {value[:10]}...")
            else:
                print(f"✅ {var}: {value}")
        else:
            print(f"❌ {var}: Not set")
            all_good = False
    
    return all_good

def main():
    print("🧪 Simple Genkit Test")
    print("=" * 30)
    
    # Load environment
    load_env()
    
    # Test environment
    print("\n📋 Environment Variables:")
    env_ok = test_environment()
    
    # Test imports
    print("\n📦 Import Tests:")
    genkit_ok = test_genkit_import()
    plugin_ok = test_google_ai_plugin()
    
    # Test initialization
    print("\n🔧 Initialization Test:")
    init_ok = test_genkit_init()
    
    # Summary
    print("\n" + "=" * 30)
    all_tests = [env_ok, genkit_ok, plugin_ok, init_ok]
    passed = sum(all_tests)
    total = len(all_tests)
    
    if passed == total:
        print(f"🎉 All tests passed! ({passed}/{total})")
        print("✅ Genkit is ready for use!")
        return True
    else:
        print(f"⚠️  Some tests failed ({passed}/{total})")
        print("❌ Genkit needs additional configuration")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
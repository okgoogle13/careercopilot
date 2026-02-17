#!/usr/bin/env python3

"""
Check Firebase Genkit AI configuration and identify gaps
"""

import os
import sys
import json
from pathlib import Path

def check_environment_variables():
    """Check required environment variables for Genkit"""
    required_vars = {
        'GEMINI_API_KEY': 'Gemini API key for Google AI',
        'GOOGLE_CLOUD_PROJECT': 'Google Cloud Project ID',
        'GOOGLE_CLOUD_REGION': 'Google Cloud Region',
        'ENABLE_GENKIT_FLOWS': 'Enable Genkit flows',
        'DEFAULT_AI_MODEL': 'Default AI model',
        'GENKIT_ENV': 'Genkit environment',
        'GENKIT_LOG_LEVEL': 'Genkit log level',
        'ENABLE_TELEMETRY': 'Enable telemetry'
    }

    env_status = {}
    for var, description in required_vars.items():
        value = os.getenv(var)
        env_status[var] = {
            'value': value if value else None,
            'present': bool(value),
            'description': description
        }

    return env_status

def check_genkit_installation():
    """Check if Genkit is properly installed"""
    try:
        import genkit
        genkit_version = getattr(genkit, '__version__', 'unknown')
        return {
            'installed': True,
            'version': genkit_version,
            'import_success': True
        }
    except ImportError as e:
        return {
            'installed': False,
            'error': str(e),
            'import_success': False
        }

def check_google_ai_plugin():
    """Check Google AI plugin availability"""
    try:
        from genkit.plugins.google_ai import googleai
        return {
            'available': True,
            'import_success': True
        }
    except ImportError as e:
        try:
            from genkit.plugins import googleai
            return {
                'available': True,
                'import_success': True,
                'note': 'Using alternate import path'
            }
        except ImportError as e2:
            return {
                'available': False,
                'error': str(e),
                'alternate_error': str(e2),
                'import_success': False
            }

def check_genkit_flows():
    """Check available Genkit flows"""
    flows_dir = Path(__file__).parent.parent / 'backend' / 'app' / 'genkit_flows'
    flows = []

    if flows_dir.exists():
        for py_file in flows_dir.glob('*.py'):
            if py_file.name != '__init__.py':
                flows.append(py_file.stem)

    return {
        'flows_directory_exists': flows_dir.exists(),
        'flows_count': len(flows),
        'flows': flows
    }

def check_firebase_config():
    """Check Firebase configuration"""
    firebase_key_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

    status = {
        'credentials_path_set': bool(firebase_key_path),
        'credentials_path': firebase_key_path
    }

    if firebase_key_path:
        key_file = Path(firebase_key_path)
        status.update({
            'credentials_file_exists': key_file.exists(),
            'credentials_readable': key_file.exists() and os.access(key_file, os.R_OK)
        })

    return status

def check_requirements():
    """Check if required dependencies are in requirements.txt"""
    req_file = Path(__file__).parent.parent / 'backend' / 'requirements.txt'

    if not req_file.exists():
        return {'requirements_file_exists': False}

    content = req_file.read_text()
    required_packages = [
        'genkit',
        'google-genai',
        'opencensus',
        'firebase-admin'
    ]

    package_status = {}
    for package in required_packages:
        package_status[package] = package in content

    return {
        'requirements_file_exists': True,
        'packages': package_status
    }

def identify_gaps(config_status):
    """Identify configuration gaps and issues"""
    gaps = []

    # Check environment variables
    env_vars = config_status['environment_variables']
    critical_vars = ['GEMINI_API_KEY', 'GOOGLE_CLOUD_PROJECT']

    for var in critical_vars:
        if not env_vars[var]['present']:
            gaps.append(f"❌ Critical: {var} is not set")

    if not env_vars['ENABLE_GENKIT_FLOWS']['present']:
        gaps.append("⚠️  ENABLE_GENKIT_FLOWS is not set (Genkit flows disabled)")

    # Check installation
    if not config_status['genkit_installation']['installed']:
        gaps.append("❌ Critical: Genkit is not installed")

    if not config_status['google_ai_plugin']['available']:
        gaps.append("❌ Critical: Google AI plugin not available")

    # Check Firebase
    firebase = config_status['firebase_config']
    if not firebase['credentials_path_set']:
        gaps.append("❌ Critical: GOOGLE_APPLICATION_CREDENTIALS not set")
    elif firebase['credentials_path_set'] and not firebase.get('credentials_file_exists'):
        gaps.append("❌ Critical: Firebase credentials file not found")

    # Check requirements
    requirements = config_status['requirements']
    if requirements['requirements_file_exists']:
        missing_packages = [pkg for pkg, present in requirements['packages'].items() if not present]
        if missing_packages:
            gaps.append(f"⚠️  Missing packages in requirements.txt: {', '.join(missing_packages)}")

    return gaps

def main():
    """Main function to check Genkit configuration"""
    print("🔍 Firebase Genkit AI Configuration Check")
    print("=" * 50)

    # Collect all status information
    config_status = {
        'environment_variables': check_environment_variables(),
        'genkit_installation': check_genkit_installation(),
        'google_ai_plugin': check_google_ai_plugin(),
        'genkit_flows': check_genkit_flows(),
        'firebase_config': check_firebase_config(),
        'requirements': check_requirements()
    }

    # Print detailed status
    print("\n📊 Configuration Status:")

    print("\n🌍 Environment Variables:")
    for var, info in config_status['environment_variables'].items():
        status = "✅" if info['present'] else "❌"
        value = info['value'] if info['present'] else "Not set"
        if var == 'GEMINI_API_KEY' and info['present']:
            value = f"{info['value'][:8]}..." if len(info['value']) > 8 else info['value']
        print(f"  {status} {var}: {value}")

    print(f"\n📦 Genkit Installation:")
    genkit = config_status['genkit_installation']
    status = "✅" if genkit['installed'] else "❌"
    version = genkit.get('version', 'N/A') if genkit['installed'] else genkit.get('error', 'Unknown')
    print(f"  {status} Genkit installed: {version}")

    print(f"\n🔌 Google AI Plugin:")
    plugin = config_status['google_ai_plugin']
    status = "✅" if plugin['available'] else "❌"
    details = "Available" if plugin['available'] else plugin.get('error', 'Not available')
    print(f"  {status} Google AI plugin: {details}")

    print(f"\n🔥 Firebase Configuration:")
    firebase = config_status['firebase_config']
    cred_status = "✅" if firebase.get('credentials_readable', False) else "❌"
    cred_details = firebase['credentials_path'] if firebase['credentials_path_set'] else "Not configured"
    print(f"  {cred_status} Firebase credentials: {cred_details}")

    print(f"\n⚡ Genkit Flows:")
    flows = config_status['genkit_flows']
    flows_status = "✅" if flows['flows_directory_exists'] else "❌"
    print(f"  {flows_status} Flows directory: {flows['flows_count']} flows found")
    if flows['flows']:
        for flow in sorted(flows['flows'][:5]):  # Show first 5 flows
            print(f"    • {flow}")
        if flows['flows_count'] > 5:
            print(f"    ... and {flows['flows_count'] - 5} more")

    # Identify gaps
    gaps = identify_gaps(config_status)

    print("\n🔍 Configuration Gaps & Issues:")
    if gaps:
        for gap in gaps:
            print(f"  {gap}")
    else:
        print("  ✅ No major configuration issues found!")

    # Recommendations
    print("\n💡 Recommendations:")

    if not config_status['environment_variables']['GEMINI_API_KEY']['present']:
        print("  1. Set GEMINI_API_KEY with your Google AI API key")
        print("     Get one at: https://makersuite.google.com/app/apikey")

    if not config_status['environment_variables']['ENABLE_GENKIT_FLOWS']['present']:
        print("  2. Set ENABLE_GENKIT_FLOWS=true to enable Genkit flows")

    if not config_status['firebase_config']['credentials_readable']:
        print("  3. Ensure Firebase credentials file exists and is readable")
        print("     Set GOOGLE_APPLICATION_CREDENTIALS to the correct path")

    if not config_status['genkit_installation']['installed']:
        print("  4. Install Genkit: pip install genkit[googleai]")

    # Generate configuration file
    print("\n📄 Full Configuration Report:")
    print(json.dumps(config_status, indent=2))

    return len(gaps) == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

#!/usr/bin/env python3

"""
Fix Genkit imports in all flow files
"""

import os
import re
from pathlib import Path

def fix_genkit_imports(file_path):
    """Fix genkit imports in a single file"""
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Track if file was modified
    original_content = content
    
    # Fix import statements
    content = re.sub(
        r'from genkit\.plugins import googleai',
        'from genkit.plugins import google_genai',
        content
    )
    
    # Fix plugin initialization
    content = re.sub(
        r'if not genkit\.get_plugin\("googleai"\):',
        'if not genkit.get_plugin("google_genai"):',
        content
    )
    
    # Fix plugin init call
    content = re.sub(
        r'genkit\.init\(plugins=\[googleai\.init\(api_key=os\.getenv\("GEMINI_API_KEY"\)\)\]\)',
        'genkit.init(plugins=[google_genai.GoogleAI().initialize(api_key=os.getenv("GEMINI_API_KEY"))])',
        content
    )
    
    # Fix model references
    content = re.sub(
        r'googleai\.gemini_pro',
        'google_genai.models.gemini.GEMINI_1_5_PRO',
        content
    )
    content = re.sub(
        r'gemini_pro = googleai\.gemini_pro',
        'gemini_pro = google_genai.models.gemini.GEMINI_1_5_PRO',
        content
    )
    
    # Fix GenerationConfig references
    content = re.sub(
        r'googleai\.GenerationConfig\(',
        '{',
        content
    )
    content = re.sub(
        r'config=googleai\.GenerationConfig\(',
        'config={',
        content
    )
    
    # Fix closing parentheses for config (simple case)
    content = re.sub(
        r'(\s+response_mime_type="application/json",?\s*)\)',
        r'\1}',
        content
    )
    
    # Save if modified
    if content != original_content:
        with open(file_path, 'w') as f:
            f.write(content)
        return True
    return False

def main():
    """Fix all genkit flow files"""
    flows_dir = Path('/Applications/careercopilot/backend/app/genkit_flows')
    
    if not flows_dir.exists():
        print(f"❌ Flows directory not found: {flows_dir}")
        return
    
    print("🔧 Fixing Genkit imports in flow files...")
    
    fixed_count = 0
    total_count = 0
    
    for py_file in flows_dir.glob('*.py'):
        if py_file.name in ['__init__.py', 'shared.py', 'shared_fixed.py']:
            continue
            
        total_count += 1
        print(f"   Checking {py_file.name}...", end=' ')
        
        try:
            if fix_genkit_imports(py_file):
                print("✅ Fixed")
                fixed_count += 1
            else:
                print("✓ No changes needed")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print(f"\n📊 Summary:")
    print(f"   Total files checked: {total_count}")
    print(f"   Files fixed: {fixed_count}")
    print(f"   Files unchanged: {total_count - fixed_count}")
    
    if fixed_count > 0:
        print(f"\n✅ Successfully updated {fixed_count} flow files with correct Genkit imports!")
    else:
        print(f"\n✓ All files already have correct imports")

if __name__ == "__main__":
    main()
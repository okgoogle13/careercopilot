#!/usr/bin/env python3
"""
Pre-Migration Code Usage Verification Script
Identifies unused components and functions in the codebase.
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, Set, List, Tuple
from collections import defaultdict

def find_exports(directory: str) -> Dict[str, List[str]]:
    """Find all exported components/functions in TypeScript/JavaScript files."""
    exports = defaultdict(list)
    
    for root, dirs, files in os.walk(directory):
        # Skip node_modules, .git, __tests__, .next, dist
        dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules' and d != '__tests__' and d != '.next' and d != 'dist']
        
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    # Find export statements
                    # Default exports
                    default_match = re.search(r'export\s+default\s+(?:function|const|class)?\s*(\w+)', content)
                    if default_match:
                        name = default_match.group(1)
                        exports[name].append(file_path)
                    
                    # Named exports
                    named_exports = re.findall(r'export\s+(?:function|const|class|interface|type)\s+(\w+)', content)
                    for name in named_exports:
                        exports[name].append(file_path)
                        
                    # Export { name }
                    brace_exports = re.findall(r'export\s*{\s*([^}]+)\s*}', content)
                    for export_list in brace_exports:
                        for name in export_list.split(','):
                            name = name.strip().split(' as ')[0]
                            if name and name != 'default':
                                exports[name].append(file_path)
                                
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
    
    return exports

def find_imports(directory: str) -> Set[str]:
    """Find all imported names in TypeScript/JavaScript files."""
    imports = set()
    
    for root, dirs, files in os.walk(directory):
        # Skip node_modules, .git, __tests__, .next, dist
        dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules' and d != '__tests__' and d != '.next' and d != 'dist']
        
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    # Find import statements
                    # import { name } from 'path'
                    named_imports = re.findall(r'import\s*{\s*([^}]+)\s*}\s*from', content)
                    for import_list in named_imports:
                        for name in import_list.split(','):
                            name = name.strip().split(' as ')[0]
                            if name and name != 'default':
                                imports.add(name)
                    
                    # import name from 'path'
                    default_imports = re.findall(r'import\s+(\w+)\s+from', content)
                    imports.update(default_imports)
                    
                    # import * as name from 'path'
                    star_imports = re.findall(r'import\s+\*\s+as\s+(\w+)\s+from', content)
                    imports.update(star_imports)
                    
                    # Dynamic imports
                    dynamic_imports = re.findall(r'import\s*\(\s*[\'"][^\'"]+[\'"]\s*\)', content)
                    # These are harder to track, so we'll skip them for now
                    
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
    
    return imports

def find_python_exports(directory: str) -> Dict[str, List[str]]:
    """Find all exported functions/classes in Python files."""
    exports = defaultdict(list)
    
    for root, dirs, files in os.walk(directory):
        # Skip __pycache__, .git, __tests__
        dirs[:] = [d for d in dirs if not d.startswith('.') and d != '__pycache__' and d != '__tests__']
        
        for file in files:
            if file.endswith('.py'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    # Find function definitions
                    functions = re.findall(r'^def\s+(\w+)\s*\(', content, re.MULTILINE)
                    for func in functions:
                        # Skip private functions (starting with _)
                        if not func.startswith('_'):
                            exports[func].append(file_path)
                    
                    # Find class definitions
                    classes = re.findall(r'^class\s+(\w+)', content, re.MULTILINE)
                    for cls in classes:
                        exports[cls].append(file_path)
                        
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
    
    return exports

def find_python_imports(directory: str) -> Set[str]:
    """Find all imported names in Python files."""
    imports = set()
    
    for root, dirs, files in os.walk(directory):
        # Skip __pycache__, .git, __tests__
        dirs[:] = [d for d in dirs if not d.startswith('.') and d != '__pycache__' and d != '__tests__']
        
        for file in files:
            if file.endswith('.py'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    # Find import statements
                    # from module import name
                    from_imports = re.findall(r'from\s+[^\\n]+\s+import\s+([^\\n]+)', content)
                    for import_list in from_imports:
                        for name in import_list.split(','):
                            name = name.strip().split(' as ')[0]
                            if name and name != '*':
                                imports.add(name)
                    
                    # import module
                    direct_imports = re.findall(r'^import\s+([^\\n]+)', content, re.MULTILINE)
                    for import_list in direct_imports:
                        for name in import_list.split(','):
                            name = name.strip().split(' as ')[0]
                            if name and name != '*':
                                imports.add(name)
                                
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
    
    return imports

def main():
    """Main execution function."""
    repo_root = Path('/Applications/careercopilot')
    
    print("🔍 Starting Pre-Migration Code Usage Verification...")
    print(f"Repository root: {repo_root}")
    
    # Frontend analysis
    frontend_src = repo_root / 'frontend' / 'src'
    if frontend_src.exists():
        print("\n📦 Analyzing frontend exports...")
        frontend_exports = find_exports(str(frontend_src))
        print(f"Found {len(frontend_exports)} exported items in frontend")
        
        print("\n🔍 Analyzing frontend imports...")
        frontend_imports = find_imports(str(frontend_src))
        print(f"Found {len(frontend_imports)} imported items in frontend")
        
        # Find unused frontend exports
        unused_frontend = []
        for name, files in frontend_exports.items():
            if name not in frontend_imports:
                unused_frontend.extend(files)
        
        print(f"Found {len(unused_frontend)} potentially unused frontend files")
    
    # Backend analysis
    backend_src = repo_root / 'backend' / 'app'
    if backend_src.exists():
        print("\n📦 Analyzing backend exports...")
        backend_exports = find_python_exports(str(backend_src))
        print(f"Found {len(backend_exports)} exported items in backend")
        
        print("\n🔍 Analyzing backend imports...")
        backend_imports = find_python_imports(str(backend_src))
        print(f"Found {len(backend_imports)} imported items in backend")
        
        # Find unused backend exports
        unused_backend = []
        for name, files in backend_exports.items():
            if name not in backend_imports:
                unused_backend.extend(files)
        
        print(f"Found {len(unused_backend)} potentially unused backend files")
    
    # Functions analysis
    functions_src = repo_root / 'functions' / 'src'
    if functions_src.exists():
        print("\n📦 Analyzing functions exports...")
        functions_exports = find_exports(str(functions_src))
        print(f"Found {len(functions_exports)} exported items in functions")
        
        print("\n🔍 Analyzing functions imports...")
        functions_imports = find_imports(str(functions_src))
        print(f"Found {len(functions_imports)} imported items in functions")
        
        # Find unused functions exports
        unused_functions = []
        for name, files in functions_exports.items():
            if name not in functions_imports:
                unused_functions.extend(files)
        
        print(f"Found {len(unused_functions)} potentially unused functions files")
    
    # Generate dead code list
    dead_code_list = []
    
    if 'unused_frontend' in locals():
        dead_code_list.extend(unused_frontend)
    if 'unused_backend' in locals():
        dead_code_list.extend(unused_backend)
    if 'unused_functions' in locals():
        dead_code_list.extend(unused_functions)
    
    # Remove duplicates and sort
    dead_code_list = sorted(list(set(dead_code_list)))
    
    # Write to file
    output_file = repo_root / 'DEAD_CODE_LIST.txt'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("DEAD CODE LIST\n")
        f.write("==============\n")
        f.write(f"Generated: {datetime.now().isoformat()}\n")
        f.write(f"Total unused files: {len(dead_code_list)}\n\n")
        
        for file_path in dead_code_list:
            f.write(f"{file_path}\n")
    
    print("\n✅ Analysis complete!")
    print(f"📄 Dead code list written to: {output_file}")
    print(f"🔢 Total unused components found: {len(dead_code_list)}")
    
    return len(dead_code_list)


if __name__ == "__main__":
    from datetime import datetime
    main()

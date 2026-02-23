
import json
import os
from pathlib import Path

def check_empty_packages():
    packages_dir = Path('asset-packages')
    if not packages_dir.exists():
        return

    empty_packages = []
    for pkg_dir in packages_dir.iterdir():
        if not pkg_dir.is_dir():
            continue
        
        entry_file = pkg_dir / 'manifest-entry.json'
        if entry_file.exists():
            with open(entry_file, 'r') as f:
                try:
                    entry = json.load(f)
                    file_path = entry.get('file_path')
                    if file_path:
                        full_path = Path('frontend/public') / file_path.lstrip('/')
                        if not full_path.exists():
                            empty_packages.append(pkg_dir.name)
                except:
                    pass
                    
    print(f"Empty Packages: {len(empty_packages)}")
    for pkg in sorted(empty_packages):
        print(f"  {pkg}")

if __name__ == "__main__":
    check_empty_packages()

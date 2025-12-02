#!/usr/bin/env python3
import os
import re
import shutil
from pathlib import Path
from datetime import datetime

def main():
    # Configuration
    BASE_DIR = Path("frontend/src")
    BACKUP_DIR = Path("frontend/.migration_backup")
    FILE_PATTERNS = ["*.tsx", "*.ts", "*.js", "*.jsx"]
    IGNORE_DIRS = ["node_modules", ".next", "_legacy", ".git"]
    
    # Patterns to match
    IMPORT_PATTERNS = [
        (r'@/components/ui/(\w+)', '@/components/design-system/\\1'),
        (r'@/components/electric/(\w+)', '@/components/design-system/\\1'),
    ]
    
    COMPONENT_PATTERNS = [
        # Match: import { ElectricButton } -> import { Button }
        (r'import\s+\{\s*Electric([A-Z]\w*)\s*\}', r'import { \1 }'),
        # Match: import { ElectricButton as Btn } -> import { Button as Btn }
        (r'import\s+\{\s*Electric([A-Z]\w*)\s+as\s+(\w+)\s*\}', r'import { \1 as \2 }'),
        # Match: <ElectricButton -> <Button
        (r'<Electric([A-Z]\w*)(?=[\s>])', r'<\1'),
        # Match: </ElectricButton> -> </Button>
        (r'</(Electric[A-Z]\w*)>', r'</\1>'.replace('Electric', ''))
    ]
    
    # Create backup
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = BACKUP_DIR / f"backup_{timestamp}"
    backup_path.mkdir(parents=True, exist_ok=True)
    
    # Find all relevant files
    files_to_update = []
    for pattern in FILE_PATTERNS:
        files_to_update.extend(BASE_DIR.rglob(pattern))
    
    # Filter out ignored directories
    files_to_update = [
        f for f in files_to_update
        if not any(part in IGNORE_DIRS for part in f.parts)
    ]
    
    # Process files
    updated_files = 0
    for file_path in files_to_update:
        try:
            # Read file content
            content = file_path.read_text(encoding='utf-8')
            original_content = content
            
            # Apply import path updates
            for pattern, replacement in IMPORT_PATTERNS:
                content = re.sub(pattern, replacement, content)
            
            # Apply component name updates
            for pattern, replacement in COMPONENT_PATTERNS:
                content = re.sub(pattern, replacement, content)
            
            # Skip if no changes
            if content == original_content:
                continue
                
            # Create backup
            rel_path = file_path.relative_to(BASE_DIR)
            backup_file = backup_path / rel_path
            backup_file.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(file_path, backup_file)
            
            # Write changes
            file_path.write_text(content, encoding='utf-8')
            updated_files += 1
            print(f"✅ Updated: {rel_path}")
            
        except Exception as e:
            print(f"❌ Error processing {file_path}: {str(e)}")
    
    print(f"\n✅ Updated {updated_files} files")
    print(f"📦 Backup saved to: {backup_path}")
    
    # Run TypeScript type checking
    print("\n🔍 Running TypeScript type checking...")
    os.chdir("frontend")
    os.system("yarn tsc --noEmit" if shutil.which("yarn") else "npx tsc --noEmit")

if __name__ == "__main__":
    main()

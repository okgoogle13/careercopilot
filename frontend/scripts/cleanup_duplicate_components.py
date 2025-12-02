#!/usr/bin/env python3
"""
Cleanup script to remove duplicate UI components that are now re-exported from Electric components.
"""
import os
import shutil
from pathlib import Path

# List of components to remove (now re-exported from Electric components)
COMPONENTS_TO_REMOVE = [
    "Button/Button.tsx",
    "Card.tsx",
    "Input.tsx",
    "Badge.tsx",
    "Avatar.tsx",
    "Select.tsx",
    "Switch.tsx",
    "Checkbox.tsx",
    "RadioGroup.tsx",
    "Textarea.tsx",
    "Table.tsx",
    "Dialog.tsx",
    "Popover.tsx",
    "Tooltip.tsx",
    "Tabs.tsx",
    "Progress.tsx",
    "Skeleton.tsx",
    "Alert.tsx",
    "SearchInput.tsx",
    "Separator.tsx",
    "DatePicker.tsx"
]

def main():
    ui_dir = Path("src/components/ui")
    
    print("🔍 Starting cleanup of duplicate components...")
    
    removed_count = 0
    
    for component_path in COMPONENTS_TO_REMOVE:
        full_path = ui_dir / component_path
        
        # Handle components in subdirectories (like Button/Button.tsx)
        if full_path.exists():
            try:
                if full_path.is_dir():
                    shutil.rmtree(full_path)
                else:
                    os.remove(full_path)
                print(f"✅ Removed: {full_path}")
                removed_count += 1
                
                # Also remove test and story files if they exist
                base_name = full_path.stem
                parent_dir = full_path.parent
                
                # Remove test files
                test_file = parent_dir / f"{base_name}.test.tsx"
                if test_file.exists():
                    os.remove(test_file)
                    print(f"   ↳ Removed test file: {test_file}")
                
                # Remove story files
                story_file = parent_dir / f"{base_name}.stories.tsx"
                if story_file.exists():
                    os.remove(story_file)
                    print(f"   ↳ Removed story file: {story_file}")
                
            except Exception as e:
                print(f"❌ Error removing {full_path}: {e}")
    
    print(f"\n✨ Cleanup complete! Removed {removed_count} duplicate components.")
    print("\nNext steps:")
    print("1. Run your tests to ensure everything still works")
    print("2. Commit the changes")
    print("3. Update any imports in your codebase to use the components from '@/components/ui'")


if __name__ == "__main__":
    main()

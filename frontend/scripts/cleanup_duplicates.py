import os
import shutil
from pathlib import Path

COMPONENTS_TO_REMOVE = [
    "Button/Button.tsx", "Input.tsx", "Textarea.tsx", "Checkbox.tsx", "RadioGroup.tsx",
    "Switch.tsx", "Select.tsx", "Slider.tsx", "Avatar.tsx", "Badge.tsx", "Card.tsx",
    "Table.tsx", "EmptyState.tsx", "Alert.tsx", "Progress.tsx", "Skeleton.tsx",
    "Tabs.tsx", "Breadcrumb.tsx", "Drawer.tsx", "Dialog.tsx", "Popover.tsx",
    "Tooltip.tsx", "Container.tsx", "Separator.tsx", "Grid.tsx", "DatePicker.tsx"
]

def main():
    ui_dir = Path("src/components/ui")
    removed_count = 0
    
    for component_path in COMPONENTS_TO_REMOVE:
        full_path = ui_dir / component_path
        if full_path.exists():
            try:
                if full_path.is_dir():
                    shutil.rmtree(full_path)
                    print(f"✅ Removed directory: {full_path}")
                else:
                    os.remove(full_path)
                    print(f"✅ Removed: {full_path}")
                removed_count += 1
                
                base_name = full_path.stem
                parent_dir = full_path.parent
                
                if component_path == "Button/Button.tsx":
                    base_name, parent_dir = "Button", ui_dir / "Button"
                
                for ext in [".test.tsx", ".stories.tsx"]:
                    file = parent_dir / f"{base_name}{ext}"
                    if file.exists():
                        os.remove(file)
                        print(f"   ↳ Removed {ext[1:]}: {file}")
                
                if parent_dir.is_dir() and not any(parent_dir.iterdir()):
                    parent_dir.rmdir()
                    print(f"   ↳ Removed empty directory: {parent_dir}")
                    
            except Exception as e:
                print(f"❌ Error removing {full_path}: {e}")
    
    print(f"\n✨ Cleanup complete! Removed {removed_count} duplicate components.")
    print("\nNext steps:")
    print("1. Run tests: npm test")
    print("2. Check for any remaining imports that need updating")
    print("3. Commit the changes: git add . && git commit -m 'chore: remove duplicate component files'")

if __name__ == "__main__":
    main()

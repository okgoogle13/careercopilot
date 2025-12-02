import os
import shutil

# --- CONFIGURATION ---
UI_DIR = "src/components/ui"

# FILES TO DELETE (Duplicates of Electric Components)
# Based on your upload list and our previous batches.
DUPLICATES = [
    "Button.tsx",
    "Card.tsx",
    "Input.tsx",
    "Select.tsx",
    "Badge.tsx",
    "Avatar.tsx",
    "Checkbox.tsx",
    "RadioGroup.tsx",
    "Switch.tsx",
    "Slider.tsx",
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
    "Separator.tsx",  # Duplicate of ElectricDivider
    "DatePicker.tsx"
]

def clean_ui_folder():
    print(f"🧹 Cleaning up duplicate components in {UI_DIR}...")
    
    deleted_count = 0
    
    for filename in DUPLICATES:
        file_path = os.path.join(UI_DIR, filename)
        
        if os.path.exists(file_path):
            try:
                # remove file or directory (if it was a folder component)
                if os.path.isdir(file_path):
                    shutil.rmtree(file_path)
                else:
                    os.remove(file_path)
                print(f"✅ Deleted duplicate: {filename}")
                deleted_count += 1
            except Exception as e:
                print(f"❌ Error deleting {filename}: {e}")
        else:
            print(f"⏭️  Skipped (Not found): {filename}")

    print("-" * 40)
    print(f"🎉 Cleanup complete. Deleted {deleted_count} files.")
    print("👉 NOW: Update src/components/ui/index.ts with the Bridge exports.")


if __name__ == "__main__":
    clean_ui_folder()

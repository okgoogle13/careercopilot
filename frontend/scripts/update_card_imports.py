import os
import re

def update_imports_in_file(file_path):
    with open(file_path, 'r') as file:
        content = file.read()

    # Pattern to match the old import
    pattern = r"from\s+['\"]@/components/ui/Card['\"]"

    # Check if the file contains the old import
    if re.search(pattern, content):
        # Replace with new import
        new_content = re.sub(pattern, "from '@/components/ui'", content)

        # Write the updated content back to the file
        with open(file_path, 'w') as file:
            file.write(new_content)
        return True
    return False

def main():
    # Get all TypeScript and TypeScript React files
    tsx_files = []
    for root, _, files in os.walk('src'):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                tsx_files.append(os.path.join(root, file))

    updated_count = 0
    for file_path in tsx_files:
        if update_imports_in_file(file_path):
            print(f"✅ Updated: {file_path}")
            updated_count += 1

    print(f"\n🎉 Updated {updated_count} files to use the new Card import path.")

if __name__ == "__main__":
    main()

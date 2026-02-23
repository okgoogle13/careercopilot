
import os
import shutil
from PIL import Image
import sys

# Configuration
SOURCE_DIR = 'assets/uncategorized'
BACKUP_DIR = 'assets/uncategorized/originals_backup'
NAMING_PREFIX = 'northcote-phase3-asset'
START_INDEX = 1

def process_assets():
    # Ensure source exists
    if not os.path.exists(SOURCE_DIR):
        print(f"Error: Source directory '{SOURCE_DIR}' not found.")
        sys.exit(1)

    # Create a backup directory inside uncategorized to be safe
    os.makedirs(BACKUP_DIR, exist_ok=True)
    print(f"Backup directory created at: {BACKUP_DIR}")

    # Get list of files
    files = [f for f in os.listdir(SOURCE_DIR) if os.path.isfile(os.path.join(SOURCE_DIR, f))]
    files.sort() # Ensure deterministic order

    print(f"Found {len(files)} files to process.")

    current_index = START_INDEX

    for filename in files:
        if filename.startswith('.'): continue # Skip hidden files

        file_path = os.path.join(SOURCE_DIR, filename)

        # 1. Backup
        shutil.copy2(file_path, os.path.join(BACKUP_DIR, filename))

        try:
            # 2. Open and Convert
            with Image.open(file_path) as img:
                # Determine new filename
                new_filename = f"{NAMING_PREFIX}-{current_index:03d}.png"
                new_path = os.path.join(SOURCE_DIR, new_filename)

                # Check if target already exists (unlikely with incrementing index but good to check)
                while os.path.exists(new_path):
                    current_index += 1
                    new_filename = f"{NAMING_PREFIX}-{current_index:03d}.png"
                    new_path = os.path.join(SOURCE_DIR, new_filename)

                print(f"Processing: {filename} -> {new_filename}")

                # Convert to RGBA if needed, otherwise RGB
                if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                    img = img.convert('RGBA')
                else:
                    img = img.convert('RGB')

                # Save as high-quality PNG
                img.save(new_path, 'PNG', optimize=True)

                # Increment index
                current_index += 1

            # 3. Remove original ONLY if it's different from the new one
            # (e.g. if original was already .png and we just renamed it,
            # we don't want to delete the new file if we wrote over it in a weird way,
            # but here we used a strictly new name pattern)
            if file_path != new_path:
                os.remove(file_path)

        except Exception as e:
            print(f"❌ Failed to process {filename}: {e}")

    print("\n=== Processing Complete ===")
    print(f"Processed files are in: {SOURCE_DIR}")
    print(f"Originals backed up in: {BACKUP_DIR}")
    print("You can verify the new assets and then delete the backup folder if satisfied.")

if __name__ == '__main__':
    process_assets()

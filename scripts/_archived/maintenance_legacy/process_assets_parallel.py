
import os
import shutil
from PIL import Image
import sys
import time
from concurrent.futures import ProcessPoolExecutor, as_completed

# Configuration
SOURCE_DIR = 'assets/uncategorized'
BACKUP_DIR = 'assets/uncategorized/originals_backup'
NAMING_PREFIX = 'northcote-phase3-asset'
START_INDEX = 1

# List of already processed new names to avoid
PROCESSED_PREFIX = NAMING_PREFIX

def process_single_file(args):
    filename, index, source_dir, backup_dir = args
    file_path = os.path.join(source_dir, filename)

    # Check if this is one of our new files (skip it)
    if filename.startswith(PROCESSED_PREFIX):
        return None

    # Backup logic is tricky in parallel if not careful,
    # but since filenames are unique, it's fine.
    backup_path = os.path.join(backup_dir, filename)
    if not os.path.exists(backup_path):
        try:
            shutil.copy2(file_path, backup_path)
        except Exception as e:
            return f"❌ Backup failed for {filename}: {e}"

    try:
        new_filename = f"{NAMING_PREFIX}-{index:03d}.png"
        new_path = os.path.join(source_dir, new_filename)

        # Open and Convert
        # We reuse the same logic
        with Image.open(file_path) as img:
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                img = img.convert('RGBA')
            else:
                img = img.convert('RGB')

            # Save as high-quality PNG
            # We turn off optimize=True for speed if it's too slow,
            # but user asked for "high quality", so let's keep it but gain speed via parallelism.
            img.save(new_path, 'PNG', optimize=True)

        # Remove original if different
        if file_path != new_path:
             os.remove(file_path)

        return f"✅ Processed {filename} -> {new_filename}"

    except Exception as e:
        return f"❌ Failed to process {filename}: {e}"

def process_assets_parallel():
    if not os.path.exists(SOURCE_DIR):
        print(f"Error: Source directory '{SOURCE_DIR}' not found.")
        sys.exit(1)

    os.makedirs(BACKUP_DIR, exist_ok=True)

    # Get list of files (Originals only)
    all_files = sorted([f for f in os.listdir(SOURCE_DIR) if os.path.isfile(os.path.join(SOURCE_DIR, f))])

    # Filter out hidden files and already converted files
    files_to_process = []

    # We need to restart numbering or continue?
    # Let's restart to be clean, deleting any partial 'northcote-phase3' files first?
    # User said "change name", so eventually only new names should exist.
    # To avoid collision, let's delete any EXISTING northcote-phase3 files in source
    # (assuming backup represents truth).

    # Just to be safe, let's process ONLY files that are NOT starting with NAMING_PREFIX
    # And we will overwrite any existing NAMING_PREFIX files if indices collide, which is fine.

    files_to_process = [f for f in all_files if not f.startswith('.') and not f.startswith(NAMING_PREFIX)]

    print(f"Found {len(files_to_process)} original files to process.")

    tasks = []
    current_index = START_INDEX

    # Prepare args
    for f in files_to_process:
        tasks.append((f, current_index, SOURCE_DIR, BACKUP_DIR))
        current_index += 1

    # Run in parallel
    # Limit workers to avoid OOM with large images? 4 workers seems safe.
    max_workers = 4
    print(f"Starting parallel processing with {max_workers} workers...")

    with ProcessPoolExecutor(max_workers=max_workers) as executor:
        future_to_file = {executor.submit(process_single_file, t): t[0] for t in tasks}

        for future in as_completed(future_to_file):
            result = future.result()
            if result:
                print(result)

    print("\n=== Parallel Processing Complete ===")

if __name__ == '__main__':
    process_assets_parallel()

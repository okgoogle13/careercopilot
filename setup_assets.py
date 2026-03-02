import os
import requests
import subprocess
import sys

# =================CONFIGURATION=================
# Define the target directory relative to where this script runs.
# Change this to match your project's structure.
TARGET_DIR = os.path.join("assets", "images", "northcote")

# Set this to True if you want the script to automatically
# run 'git add' on the downloaded files.
STAGE_IN_GIT = True

# The definitive map of project filenames to source URLs.
# These are the final, approved assets from the generation session.
ASSET_MAP = {
    "northcote-wallpaper-ui.png": "https://fal.media/files/rabbit/4g17g141h12c153655g7.png",
    "northcote-kookaburra-mascot.png": "https://fal.media/files/panda/3g55g224g2h135636h71.png",
    "northcote-vertical-echidna.png": "https://fal.media/files/kangaroo/2g6324g134c2152g71g7.png",
    "northcote-vertical-beetle.png": "https://fal.media/files/tiger/2g23g231c2g171176g61.png",
    "northcote-banksia-spinner.png": "https://fal.media/files/monkey/5g141g571c1133g26g16.png",
    "northcote-nav-icons.png": "https://fal.media/files/elephant/1g26g6743c172g5g65g.png",
    "northcote-pattern-tile.png": "https://fal.media/files/panda/3g466g711c52g1g13343.png",
    "northcote-footer-still-life.png": "https://fal.media/files/tiger/1g1523g446g747463765.png",
}
# ===============================================


def ensure_directory(path):
    """Checks if directory exists, creates it if not."""
    if not os.path.exists(path):
        try:
            os.makedirs(path)
            print(f"📁 Created directory: {path}")
        except OSError as e:
            print(f"❌ Error creating directory {path}: {e}")
            sys.exit(1)

def download_file(url, filepath):
    """Downloads a file from a URL to a specific path with a progress indicator."""
    print(f"⬇️  Downloading: {os.path.basename(filepath)}...")
    try:
        # Stream download to handle potential large files gracefully
        with requests.get(url, stream=True) as r:
            r.raise_for_status() # Raise an exception for bad status codes (4xx, 5xx)
            with open(filepath, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
        print(f"✅ Finished: {os.path.basename(filepath)}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to download {url}:\n   {e}")
        return False

def git_stage_file(filepath):
    """Runs 'git add' on the specified file."""
    try:
        # Check if git is even initialized
        subprocess.check_output(["git", "rev-parse", "--is-inside-work-tree"], stderr=subprocess.STDOUT)

        # Add the file
        subprocess.run(["git", "add", filepath], check=True)
        print(f"📝 Staged in Git: {filepath}")
    except subprocess.CalledProcessError:
        print(f"⚠️  Warning: Could not stage {filepath} in Git. Is this a Git repo?")
    except FileNotFoundError:
         print("⚠️  Warning: Git command not found. Skipping staging.")

def main():
<<<<<<< HEAD
    print("--- Starting Northcote Curio Asset Setup ---")
=======
    print("--- Starting Northcote [DEPRECATED_STYLE] Asset Setup ---")
>>>>>>> restoration-KR-Rage-Figma-v2.0

    # 1. Create target directory
    ensure_directory(TARGET_DIR)

    success_count = 0

    # 2. Iterate through assets and download
    for filename, url in ASSET_MAP.items():
        dest_path = os.path.join(TARGET_DIR, filename)

        if os.path.exists(dest_path):
             print(f"⏭️  Skipping {filename} (already exists).")
             success_count += 1
             continue

        if download_file(url, dest_path):
            success_count += 1
            # 3. Optional Git Staging
            if STAGE_IN_GIT:
                git_stage_file(dest_path)
        print("-" * 40)

    print(f"\n🎉 Setup complete! {success_count}/{len(ASSET_MAP)} assets ready in '{TARGET_DIR}'.")
    if STAGE_IN_GIT and success_count > 0:
        print("Don't forget to commit your changes!")

if __name__ == "__main__":
    main()

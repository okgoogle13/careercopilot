import json
import os
import subprocess

REPORT_PATH = "asset-triage-report.json"
SOURCE_ROOT = "frontend/public/assets"
ARCHIVE_ROOT = "archive/assets"

def purge():
    if not os.path.exists(REPORT_PATH):
        print(f"Error: {REPORT_PATH} not found.")
        return

    with open(REPORT_PATH, 'r') as f:
        data = json.load(f)

    actions = data.get("triage_actions", [])

    for action in actions:
        category = action.get("category")
        rel_path = action.get("file")

        if category in ["discard", "legacy"]:
            src = os.path.join(SOURCE_ROOT, rel_path)
            dst = os.path.join(ARCHIVE_ROOT, rel_path)

            if os.path.exists(src):
                # Ensure destination directory exists
                os.makedirs(os.path.dirname(dst), exist_ok=True)

                print(f"Moving {rel_path} ({category}) to archive...")
                try:
                    subprocess.run(["git", "mv", src, dst], check=True)
                except subprocess.CalledProcessError:
                    # Fallback to normal mv if not in git
                    os.rename(src, dst)
            else:
                print(f"Skipping {rel_path} (already removed or not found at {src})")

if __name__ == "__main__":
    purge()

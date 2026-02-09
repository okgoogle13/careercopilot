#!/bin/bash

# A script to perform initial cleanup of the CareerCopilot repository.
# It now includes a backup step before any files are moved or changed.
#
# WARNING: This script will MOVE files and directories. Review the lists
# carefully. It is highly recommended to run this on a clean git branch
# to ensure changes can be easily reverted.

# --- Configuration ---

# Create a timestamped backup directory name to avoid overwriting past backups
BACKUP_DIR="cleanup_backup_$(date +%Y%m%d_%H%M%S)"

# Files already cleaned up in previous commit - keeping for reference
FILES_TO_MOVE=(
    # These files were already cleaned up in the production readiness commit
    # Keeping this array empty as cleanup was already completed
)

# Redundant/abandoned UI directories to be backed up before you manually delete them.
REDUNDANT_UI_DIRS_TO_BACKUP=(
    "community_ui"
    # Note: Other UI directories were already cleaned up in production readiness commit
)

# Large, unwanted artifacts to remove from Git history entirely
LARGE_ARTIFACTS_TO_MOVE=(
    "backend/data/careercopilot.db"
    "data/careercopilot.db"
    "frontend/test-results/e2e-report/index.html"
    # Note: ZIP files were already cleaned up in production readiness commit
)

# --- Script Execution ---

echo "--- Meticulous Repository Cleanup Script (with Backup) ---"
echo "This script will help with the initial cleanup of your repository."
echo "It will back up specified files and directories before suggesting manual actions."
echo ""

# --- Step 1: Create Backup Directory ---
echo "Step 1: Creating backup directory..."
mkdir -p "$BACKUP_DIR"
if [ $? -ne 0 ]; then
    echo "Error: Could not create backup directory '$BACKUP_DIR'. Aborting."
    exit 1
fi
echo "Backup directory created at: ./$BACKUP_DIR"
echo ""

# --- Step 2: Back Up and Move Clutter Files (e.g., Reports, Notes) ---
echo "Step 2: Backing up and moving unnecessary root-level files..."
for f in "${FILES_TO_MOVE[@]}"; do
    if [ -f "$f" ]; then
        # Extract filename for destination, preserving directory structure up to the filename
        # This is a bit complex due to the unusual path structure, so we simplify the backup name
        FILE_BASENAME=$(basename "$f")
        echo "Moving: '$f' -> '$BACKUP_DIR/$FILE_BASENAME'"
        mv "$f" "$BACKUP_DIR/"
    else
        echo "Skipping (not found): '$f'"
    fi
done
echo "Root-level file backup and move complete."
echo ""

# --- Step 3: Back Up and Move Large Artifacts (Databases, Zips, HTML Reports) ---
echo "Step 3: Backing up and moving large artifacts for externalization..."
for f in "${LARGE_ARTIFACTS_TO_MOVE[@]}"; do
    if [ -f "$f" ]; then
        FILE_BASENAME=$(basename "$f")
        echo "Moving LARGE ARTIFACT: '$f' -> '$BACKUP_DIR/$FILE_BASENAME'"
        mv "$f" "$BACKUP_DIR/"
    else
        echo "Skipping (not found): '$f'"
    fi
done
echo "Large artifact backup and move complete."
echo ""


# --- Step 4: Back Up Redundant Directories ---
echo "Step 4: Backing up potentially redundant UI directories for manual review..."
for d in "${REDUNDANT_UI_DIRS_TO_BACKUP[@]}"; do
    if [ -d "$d" ]; then
        DIR_BASENAME=$(basename "$d")
        echo "Backing up directory: '$d' -> '$BACKUP_DIR/$DIR_BASENAME/'"
        # Using 'cp -r' to copy the directory for backup, leaving the original for manual deletion.
        cp -r "$d" "$BACKUP_DIR/"
    else
        echo "Skipping (not found): '$d'"
    fi
done
echo "Directory backup complete. Please review these in '$BACKUP_DIR' before proceeding."
echo ""

# --- Step 5: Clean up Redundant Environment Variables ---
echo "Step 5: Consolidating and cleaning redundant environment variable files..."
ENV_FILES_TO_REMOVE=(
    ".env.local.template"
    ".env.production.example"
    ".env.production.secure"
    ".env.production.template"
    ".env.template"
    "backend/vertex-ai-config.env"
    "frontend/.env.example"
    "functions/.env.example"
)

for f in "${ENV_FILES_TO_REMOVE[@]}"; do
    if [ -f "$f" ]; then
        echo "Moving redundant environment file: '$f' -> '$BACKUP_DIR/'"
        mv "$f" "$BACKUP_DIR/"
    else
        echo "Skipping (not found): '$f'"
    fi
done
echo "Environment file cleanup complete. Consolidate your secrets into .env.development and .env.production."
echo ""

# --- Step 6: Update .gitignore ---
echo "Step 6: Ensuring .gitignore is robust..."
GITIGNORE_ENTRIES=(
    ".env"
    ".env.*"
    "!.env.example"
    "*.db"
    "*.zip"
    "*.html"
    "node_modules/"
    ".vscode/"
    ".idea/"
    "cleanup_backup_*/" # Ignore all generated backup directories
    "/backend/data/" # Explicitly ignore local DB folder
    "/frontend/test-results/" # Ignore large test reports folder
)

for entry in "${GITIGNORE_ENTRIES[@]}"; do
    # Check if entry already exists before adding
    if ! grep -qF -- "$entry" .gitignore; then
        echo "Adding '$entry' to .gitignore"
        echo "$entry" >> .gitignore
    else
        echo "'$entry' already in .gitignore"
    fi
done
echo ".gitignore update complete."
echo ""


# --- Final Manual Action Required ---
echo "--- Final Manual Review and Action Required! ---"
echo "The script has completed its automated, safe tasks. Please follow these CRITICAL manual steps:"
echo ""
echo "1. **Delete Redundant UI Directories:**"
echo "   The following directories were *copied* to the backup folder. You must **manually delete** the originals from the root to finalize the cleanup:"
for d in "${REDUNDANT_UI_DIRS_TO_BACKUP[@]}"; do
    if [ -d "$d" ]; then
        echo "     - $d"
    fi
done
echo "   *(e.g., run 'rm -rf community_ui' after verifying the backup is complete)*"
echo ""
echo "2. **Apply BFG/Git Filter-Repo:**"
echo "   Since large artifacts (like the .db files and .zip archives) were moved, run a tool like **BFG Repo Cleaner** or **git filter-repo** to permanently remove these files from your git history. This is essential for proper bloat reduction."
echo ""
echo "3. **Code and Architecture Refactoring:**"
echo "   Now that the clutter is gone, focus on the code structure and cost reduction plan from your AI audit:"
echo "   - **Merge/Consolidate:** Review and merge duplicate utility files (e.g., multiple Genkit flows and AI core files)."
echo "   - **Implement Caching:** Configure caching (e.g., Redis, in-memory) for high-frequency or expensive AI calls."
echo "   - **Optimize Compute:** Review Cloud Functions/Cloud Run configuration for proper memory limits and CPU allocation, and implement asynchronous processing for long-running tasks."
echo "--- Cleanup Automation Complete ---"

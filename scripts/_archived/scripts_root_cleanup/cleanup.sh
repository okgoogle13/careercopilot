import os
import shutil
import datetime

def cleanup_repository(root_dir, dry_run=True):
    """
    Automates the cleanup of a Git repository by backing up, deleting, and
    consolidating specified files.

    :param root_dir: The root directory of the repository to clean up.
    :param dry_run: If True, only print the actions that would be taken.
    """
    print(f"--- Starting Repository Cleanup for '{root_dir}' ---")
    if dry_run:
        print("--- Running in Dry Run Mode (No changes will be made) ---")

    # --- Backup Step ---
    backup_dir = ""
    if not dry_run:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        backup_dir = os.path.join(root_dir, f"backup_{timestamp}")
        os.makedirs(backup_dir)
        print(f"+++ Created backup directory at: {backup_dir} +++")

    # A comprehensive list of redundant markdown/documentation files to be removed.
    files_to_delete = [
        "# Comprehensive AI-Powered QA & Review C.md",
        "Audit_Checklist.md", "CONFIGURATION_GUIDE.md",
        "FIRESTORE_RULES_REFACTORING_SUMMARY.md", "GENKIT_AI_CONFIG_REPORT.md",
        "GENKIT_CONFIG_STATUS.md", "GENKIT_FLOWS_FIXED.md",
        "PRE_PRODUCTION_AUDIT_REPORT.md", "REVERT.md", "SECURITY_AUDIT_REPORT.md",
        "SECURITY_STATUS_FINAL.md", "WORKFLOW_IMPLEMENTATION.md",
        "WORKFLOW_OPTIMIZATION_SUMMARY.md", "WORKSPACE.md", "agents.md",
        "audit_report.md", "claude_final_UI.md", "final-refactor.md",
        "readiness.md", "troubleshooting_runbook.md"
    ]

    # Shell scripts in the root to be consolidated into the '/scripts' directory.
    scripts_to_move = [
        "UI_setup.sh", "audit.sh", "cleanup.sh", "readiness.sh", "setup-api-keys.sh"
    ]

    scripts_dir = os.path.join(root_dir, "scripts")

    # 1. Create the scripts directory if it doesn't exist
    if not os.path.exists(scripts_dir) and not dry_run:
        os.makedirs(scripts_dir)
        print(f"Created directory: {scripts_dir}")

    # 2. Walk through the repository to find and process files
    for root, dirs, files in os.walk(root_dir):
        # Avoid descending into backup and .git directories
        if '.git' in dirs:
            dirs.remove('.git')
        if backup_dir and os.path.basename(backup_dir) in dirs:
            dirs.remove(os.path.basename(backup_dir))

        for file in files:
            file_path = os.path.join(root, file)

            # Action: Delete specified redundant files
            if file in files_to_delete:
                print(f"[Delete] Found '{file}' for deletion at '{file_path}'")
                if not dry_run:
                    # Backup before deleting
                    relative_path = os.path.relpath(root, root_dir)
                    backup_sub_dir = os.path.join(backup_dir, relative_path)
                    os.makedirs(backup_sub_dir, exist_ok=True)
                    shutil.copy2(file_path, backup_sub_dir)
                    print(f"  -> Backed up to {backup_sub_dir}")

                    os.remove(file_path)
                    print(f"  -> Deleted.")

            # Action: Move specified shell scripts if they are in the root directory
            if file in scripts_to_move and root == root_dir:
                destination_path = os.path.join(scripts_dir, file)
                print(f"[Move] Found script '{file}' to move to '{destination_path}'")
                if not dry_run:
                    # Backup before moving
                    shutil.copy2(file_path, backup_dir)
                    print(f"  -> Backed up to {backup_dir}")

                    shutil.move(file_path, destination_path)
                    print(f"  -> Moved.")

    # 3. Consolidate environment files
    consolidated_env_path = os.path.join(root_dir, ".env.example.consolidated")
    print(f"[Consolidate] Consolidating all '.env.example' files into '{consolidated_env_path}'")

    env_found = False
    for root, dirs, files in os.walk(root_dir):
        if '.git' in dirs:
            dirs.remove('.git')
        if backup_dir and os.path.basename(backup_dir) in dirs:
            dirs.remove(os.path.basename(backup_dir))

        if ".env.example" in files:
            if not env_found and not dry_run:
                 with open(consolidated_env_path, "w") as consolidated_file:
                    consolidated_file.write("# This is a consolidated .env.example file from across the repository.\n")

            env_found = True
            original_path = os.path.join(root, ".env.example")
            relative_path = os.path.relpath(root, root_dir)
            print(f"  -> Found: {original_path}")
            if not dry_run:
                 with open(original_path, "r") as f_in, open(consolidated_env_path, "a") as f_out:
                    f_out.write(f"\n# --- Contents from {relative_path}/.env.example ---\n")
                    f_out.write(f_in.read())

    if not env_found:
        print("  -> No '.env.example' files found to consolidate.")

    print("--- Cleanup Script Finished ---")


# --- Execution Instructions ---
# 1. Save this script as `cleanup.py` in the root of the "careercopilot" repository.
# 2. Run it in its default dry-run mode first to review the planned changes:
#    python cleanup.py
# 3. Once you are satisfied with the output, edit the script and set `DRY_RUN = False`.
# 4. Run the script again to apply the changes. A `backup_YYYY-MM-DD_HH-MM-SS` folder will be created.
#    python cleanup.py
# 5. After verifying the cleanup, you can manually delete the backup folder or add it to .gitignore.

DRY_RUN = False # <<<< Set to False to apply changes.
cleanup_repository('.', dry_run=DRY_RUN)

import subprocess
import os

def run_git_cmd(args):
    try:
        result = subprocess.run(args, capture_output=True, text=True, check=False)
        return f"CMD: {' '.join(args)}\nSTDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}\n{'-'*20}\n"
    except Exception as e:
        return f"CMD: {' '.join(args)}\nERROR: {str(e)}\n{'-'*20}\n"

commands = [
    ["git", "branch", "-a"],
    ["git", "rev-parse", "develop"],
    ["git", "rev-parse", "pre-northcote-backup"],
    ["git", "rev-parse", "backup/pre-feature-integration"],
    ["git", "rev-parse", "copilot/add-branch-consolidation-tools"],
    ["git", "cherry", "develop", "pre-northcote-backup"],
    ["git", "cherry", "develop", "backup/pre-feature-integration"],
    ["git", "cherry", "develop", "copilot/add-branch-consolidation-tools"],
    ["git", "merge-base", "--is-ancestor", "pre-northcote-backup", "develop"], # Exit code 0 if true
    ["git", "merge-base", "--is-ancestor", "backup/pre-feature-integration", "develop"],
    ["git", "merge-base", "--is-ancestor", "copilot/add-branch-consolidation-tools", "develop"]
]

output = "GIT BRANCH AUDIT\n================\n"

for cmd in commands:
    # Special handling for merge-base exit code check
    if "merge-base" in cmd:
        try:
            res = subprocess.run(cmd, capture_output=True, text=True)
            status = "ANCESTOR (MERGED)" if res.returncode == 0 else "NOT ANCESTOR"
            output += f"CMD: {' '.join(cmd)}\nSTATUS: {status}\nSTDOUT: {res.stdout}\nSTDERR: {res.stderr}\n{'-'*20}\n"
        except Exception as e:
            output += f"CMD: {' '.join(cmd)}\nERROR: {str(e)}\n{'-'*20}\n"
    else:
        output += run_git_cmd(cmd)

with open("branch_audit_report.txt", "w") as f:
    f.write(output)

print("Audit complete. Report written to branch_audit_report.txt")

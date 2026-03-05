import os
import re

def resolve_file(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()

    new_lines = []
    in_side_a = False
    in_side_b = False
    resolved = False

    for line in lines:
        if line.startswith('<<<<<<< HEAD'):
            in_side_a = True
            resolved = True
            continue
        if line.startswith('=======') and in_side_a:
            in_side_a = False
            in_side_b = True
            continue
        if line.startswith('>>>>>>>') and in_side_b:
            in_side_b = False
            continue

        if in_side_b:
            new_lines.append(line)
        elif not in_side_a:
            new_lines.append(line)

    if resolved:
        with open(filepath, 'w') as f:
            f.writelines(new_lines)
        print(f"Resolved conflicts in {filepath}")
        return True
    return False

import subprocess

def get_files_with_conflicts():
    result = subprocess.run(['git', 'grep', '-l', '<<<<<<<'], capture_output=True, text=True)
    if result.returncode == 0:
        return result.stdout.splitlines()
    return []

files_to_resolve = get_files_with_conflicts()

for f in files_to_resolve:
    if os.path.exists(f):
        resolve_file(f)
    else:
        print(f"File not found: {f}")

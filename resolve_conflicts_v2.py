import os
import subprocess

def resolve_file(filepath):
    print(f"Processing {filepath}...")
    with open(filepath, 'r') as f:
        lines = f.readlines()

    new_lines = []
    # State: 0=normal, 1=in side A, 2=in side B
    state = 0
    resolved = False

    for line in lines:
        if line.startswith('<<<<<<< HEAD'):
            state = 1
            resolved = True
            continue
        elif line.startswith('=======') and state == 1:
            state = 2
            continue
        elif line.startswith('>>>>>>>'):
            state = 0
            resolved = True
            continue

        if state == 0:
            new_lines.append(line)
        elif state == 2:
            new_lines.append(line)

    if resolved:
        with open(filepath, 'w') as f:
            f.writelines(new_lines)
        print(f"Cleaned {filepath}")
        return True
    return False

# Find ALL files with any marker
result = subprocess.run(['git', 'grep', '-l', '-E', '^<<<<<<< HEAD|^=======|^>>>>>>>'], capture_output=True, text=True)
files = result.stdout.splitlines()

for f in files:
    if os.path.exists(f):
        resolve_file(f)

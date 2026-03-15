import os
import glob

files = glob.glob('frontend/src/**/*.test.tsx', recursive=True)
files.append('frontend/src/test/setup.ts')

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    modified = False
    lines = content.split('\n')
    new_lines = []
    for line in lines:
        if "from 'vitest'" in line or 'from "vitest"' in line:
            # We skip this line
            modified = True
            continue
        new_lines.append(line)

    if modified:
        with open(file, 'w') as f:
            f.write('\n'.join(new_lines))
        print(f"Fixed {file}")

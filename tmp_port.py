import os
import shutil
import re

src_dir = 'docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/components'
dst_dir = 'frontend/src/features/analysis/components'

if not os.path.exists(dst_dir):
    os.makedirs(dst_dir)

def transform_file(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Fix types import
    content = re.sub(r'from [\'"](?:\.\./)+types[\'"]', "from '../../../types/career'", content)
    # Fix constants import
    content = re.sub(r'from [\'"](?:\.\./)+constants[\'"]', "from '../../../config/resume-constants'", content)
    # Fix hooks import (either ../hooks/ useAutoSave or useStudioMatch)
    content = re.sub(r'from [\'"](?:\.\./)+hooks/(.*?)[\'"]', r"from '../hooks/\1'", content)

    # Remove any missing module references or just replace to correct ones
    with open(file_path, 'w') as f:
        f.write(content)

for root, _, files in os.walk(src_dir):
    rel_path = os.path.relpath(root, src_dir)
    target_root = os.path.join(dst_dir, rel_path) if rel_path != '.' else dst_dir
    os.makedirs(target_root, exist_ok=True)

    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            src_file = os.path.join(root, file)
            dst_file = os.path.join(target_root, file)
            shutil.copy2(src_file, dst_file)
            transform_file(dst_file)

print("Extraction and transform complete.")

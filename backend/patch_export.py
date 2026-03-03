import sys
import re

file_path = "app/core/document_export_service.py"

with open(file_path, "r") as f:
    content = f.read()

# Remove the import line
content = re.sub(r'from app\.core\.supabase_repository import supabase_repo\n?', '', content)

# Remove the blocks calling supabase_repo.create_user_asset
pattern = r'[ \t]*# Persist to Supabase DB \(Phase 4\)\n[ \t]*supabase_repo\.create_user_asset\([^)]+\)\n'
content = re.sub(pattern, '', content)

# Alternative regex if the closing parenthesis is tricky:
pattern2 = r'[ \t]*# Persist to Supabase DB \(Phase 4\)\n[ \t]*supabase_repo\.create_user_asset\(.*?\)[\s]+'
content = re.sub(pattern2, '\n            ', content, flags=re.DOTALL)

with open(file_path, "w") as f:
    f.write(content)

print("Replaced supabase_repo calls from " + file_path)

import os
import xml.etree.ElementTree as ET

files = [
    "backend/app/models/document_export_schemas.py",
    "backend/app/core/ats_rules.py",
    "ai/flows/backend/resume_optimizer.py",
    "ai/flows/backend/cover_letter_generator.py",
    "ai/flows/backend/ats_scoring.py",
    "frontend/src/features/documents/components/ResumeBuilder.tsx",
    "ai/prompts/backend/format_rules.json"
]

root = ET.Element("repository")
for file_path in files:
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        file_elem = ET.SubElement(root, "file", path=file_path)
        file_elem.text = content
    except Exception as e:
        print(f"Failed to read {file_path}: {e}")

tree = ET.ElementTree(root)
tree.write("targeted_mvp_context.xml", encoding="utf-8", xml_declaration=True)
print("Created targeted_mvp_context.xml with 7 files.")

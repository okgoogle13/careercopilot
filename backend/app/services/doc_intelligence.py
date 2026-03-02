<<<<<<< HEAD
import os
import shutil
import zipfile
import tempfile
import random
import logging
import html
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
=======
import logging
import random
import tempfile
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
>>>>>>> restoration-KR-Rage-Figma-v2.0

# Requires: pip install defusedxml pypdf
try:
    from defusedxml import minidom
except ImportError:  # pragma: no cover - optional dependency in test/CI
    from xml.dom import minidom
try:
    from pypdf import PdfReader, PdfWriter
    from pypdf.generic import NameObject, TextStringObject
except ImportError:  # pragma: no cover - optional dependency in test/CI
    PdfReader = None
    PdfWriter = None
    NameObject = None
    TextStringObject = None

logger = logging.getLogger(__name__)

class DocumentIntelligenceService:
    """
    Core service for advanced document manipulation:
    1. DOCX Redlining (Tracked Changes)
    2. PDF Form Filling
    """

    def __init__(self, working_dir: str = "/tmp/careercopilot/docs"):
        self.working_dir = Path(working_dir)
        self.working_dir.mkdir(parents=True, exist_ok=True)

<<<<<<< HEAD
    def apply_redlines_to_docx(self, input_path: str, output_path: str, edits: List[Dict[str, str]], author: str = "CareerCopilot") -> bool:
=======
    def apply_redlines_to_docx(self, input_path: str, output_path: str, edits: list[dict[str, str]], author: str = "CareerCopilot") -> bool:
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """
        Applies a list of text replacements as native Word Tracked Changes.
        edits format: [{'original': 'text to find', 'replacement': 'new text'}]
        """
        try:
            with tempfile.TemporaryDirectory() as temp_dir:
                temp_path = Path(temp_dir)
<<<<<<< HEAD
                
                # 1. Unpack DOCX
                with zipfile.ZipFile(input_path, 'r') as zip_ref:
=======

                # 1. Unpack DOCX
                with zipfile.ZipFile(input_path, "r") as zip_ref:
>>>>>>> restoration-KR-Rage-Figma-v2.0
                    zip_ref.extractall(temp_path)

                # 2. Modify document.xml
                doc_xml_path = temp_path / "word" / "document.xml"
                if not doc_xml_path.exists():
                    raise FileNotFoundError("Invalid DOCX: word/document.xml not found")

                editor = _DocxXmlEditor(doc_xml_path, author=author)
<<<<<<< HEAD
                
                # 3. Apply edits
                for edit in edits:
                    original = edit.get('original')
                    replacement = edit.get('replacement')
                    
                    if not original or replacement is None:
                        continue
                        
=======

                # 3. Apply edits
                for edit in edits:
                    original = edit.get("original")
                    replacement = edit.get("replacement")

                    if not original or replacement is None:
                        continue

>>>>>>> restoration-KR-Rage-Figma-v2.0
                    # Simple heuristic finder
                    node = editor.find_run_containing_text(original)
                    if node:
                        editor.apply_tracked_change(node, original, replacement)
                    else:
                        logger.warning(f"Could not find text to replace: '{original}'")

                # 4. Save XML
                editor.save()

                # 5. Repack DOCX
<<<<<<< HEAD
                with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zip_out:
                    for file_path in temp_path.rglob('*'):
=======
                with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zip_out:
                    for file_path in temp_path.rglob("*"):
>>>>>>> restoration-KR-Rage-Figma-v2.0
                        if file_path.is_file():
                            arcname = file_path.relative_to(temp_path)
                            zip_out.write(file_path, arcname)
            return True
        except Exception as e:
<<<<<<< HEAD
            logger.error(f"DOCX Redlining failed: {str(e)}")
            return False

    def fill_pdf_form(self, input_path: str, output_path: str, field_data: Dict[str, Any]) -> bool:
=======
            logger.error(f"DOCX Redlining failed: {e!s}")
            return False

    def fill_pdf_form(self, input_path: str, output_path: str, field_data: dict[str, Any]) -> bool:
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """
        Fills Acrobat Forms (AcroForms) in a PDF.
        """
        try:
            if not PdfReader or not PdfWriter:
                logger.warning("pypdf not available; skipping PDF form fill")
                return False

            reader = PdfReader(input_path)
            writer = PdfWriter()
            writer.append(reader)
<<<<<<< HEAD
            
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
            fields = reader.get_fields()
            if not fields:
                logger.warning("No fillable fields found in PDF.")
                return False

            updates = {}
            for field_name, value in field_data.items():
                if field_name in fields:
<<<<<<< HEAD
                    field_type = fields[field_name].get('/FT')
                    
                    if field_type == '/Btn': # Checkbox
                        if isinstance(value, bool):
                            updates[field_name] = '/Yes' if value else '/Off'
=======
                    field_type = fields[field_name].get("/FT")

                    if field_type == "/Btn": # Checkbox
                        if isinstance(value, bool):
                            updates[field_name] = "/Yes" if value else "/Off"
>>>>>>> restoration-KR-Rage-Figma-v2.0
                        else:
                            updates[field_name] = value
                    else: # Text
                        updates[field_name] = str(value)

            for page in writer.pages:
                writer.update_page_form_field_values(page, updates)

            with open(output_path, "wb") as f:
                writer.write(f)
            return True
        except Exception as e:
<<<<<<< HEAD
            logger.error(f"PDF Filling failed: {str(e)}")
=======
            logger.error(f"PDF Filling failed: {e!s}")
>>>>>>> restoration-KR-Rage-Figma-v2.0
            return False

class _DocxXmlEditor:
    """Internal Helper for XML manipulation"""
    def __init__(self, xml_path: Path, author: str):
        self.xml_path = xml_path
        self.author = author
<<<<<<< HEAD
        with open(self.xml_path, 'r', encoding='utf-8') as f:
=======
        with open(self.xml_path, encoding="utf-8") as f:
>>>>>>> restoration-KR-Rage-Figma-v2.0
            self.dom = minidom.parseString(f.read())

    def find_run_containing_text(self, text: str):
        text_nodes = self.dom.getElementsByTagName("w:t")
        for node in text_nodes:
            if node.firstChild and node.firstChild.nodeValue and text in node.firstChild.nodeValue:
<<<<<<< HEAD
                return node.parentNode 
=======
                return node.parentNode
>>>>>>> restoration-KR-Rage-Figma-v2.0
        return None

    def apply_tracked_change(self, run_node, original_text: str, new_text: str):
        paragraph = run_node.parentNode
        if paragraph.nodeName != "w:p": return

        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        rsid = str(random.randint(100000, 999999))

        # 1. Deletion
        del_node = self.dom.createElement("w:del")
        del_node.setAttribute("w:id", rsid)
        del_node.setAttribute("w:author", self.author)
        del_node.setAttribute("w:date", timestamp)
        del_run = self.dom.createElement("w:r")
        del_text = self.dom.createElement("w:delText")
        del_text.appendChild(self.dom.createTextNode(original_text))
        del_run.appendChild(del_text)
        del_node.appendChild(del_run)

        # 2. Insertion
        ins_node = self.dom.createElement("w:ins")
        ins_node.setAttribute("w:id", str(int(rsid) + 1))
        ins_node.setAttribute("w:author", self.author)
        ins_node.setAttribute("w:date", timestamp)
        ins_run = self.dom.createElement("w:r")
        ins_text = self.dom.createElement("w:t")
        ins_text.appendChild(self.dom.createTextNode(new_text))
        ins_run.appendChild(ins_text)
        ins_node.appendChild(ins_run)

        # 3. Swap
        paragraph.replaceChild(ins_node, run_node)
        paragraph.insertBefore(del_node, ins_node)

    def save(self):
<<<<<<< HEAD
        with open(self.xml_path, 'w', encoding='utf-8') as f:
=======
        with open(self.xml_path, "w", encoding="utf-8") as f:
>>>>>>> restoration-KR-Rage-Figma-v2.0
            f.write(self.dom.toxml())

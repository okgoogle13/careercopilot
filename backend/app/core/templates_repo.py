import json
from pathlib import Path
from typing import Any, Dict, List, Optional

from app.core.ats_rules import validate_template_schema


class TemplateRepo:
    def __init__(self, root: Optional[Path] = None):
        if root is None:
            self.root = Path(__file__).parent.parent.parent.parent / "ai" / "templates" / "backend"
        else:
            self.root = root
        self._cache: Dict[str, dict] = {}
        self._manifest: Dict[str, Any] = {}
        self._load_manifest()

    def _load_manifest(self) -> None:
        manifest_path = self.root / "manifest.json"
        if manifest_path.exists():
            with manifest_path.open(encoding="utf-8") as f:
                self._manifest = json.load(f)

    def list_templates(self, doc_type: Optional[str] = None) -> List[Dict[str, Any]]:
        templates = self._manifest.get("templates", [])
        if doc_type:
            return [t for t in templates if t.get("docType") == doc_type]
        return templates

    def get(self, doc_type: str, template_id: str) -> dict:
        key = f"{doc_type}:{template_id}"
        if key not in self._cache:
            path = self.root / doc_type / f"{template_id}.json"
            if not path.exists():
                raise FileNotFoundError(f"Template not found at {path}")

            with path.open(encoding="utf-8") as f:
                raw = json.load(f)

            validate_template_schema(raw, doc_type)
            self._cache[key] = raw

        return self._cache[key]


# Global instance for easy access
template_repo = TemplateRepo()

import json
import hashlib
import os
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional, Any
import shutil

class AssetCurator:
    """
    Triage and curation engine for kr-solidarity assets.
    Inherits and enhances logic from the legacy Northcote Cataloger.
    """
    
    def __init__(self, manifest_path: str):
        self.manifest_path = Path(manifest_path)
        self.manifest = self._load_manifest()
        self.content_hashes = self._get_manifest_hashes()

    def _load_manifest(self) -> Dict[str, Any]:
        if not self.manifest_path.exists():
            return {"assets": []}
        with open(self.manifest_path, 'r') as f:
            return json.load(f)

    def _get_manifest_hashes(self) -> Dict[str, str]:
        """Maps content hashes to asset IDs from the manifest."""
        hashes = {}
        project_root = self.manifest_path.parent.parent.parent # Assuming manifest is in frontend/public/assets/
        for asset in self.manifest.get("assets", []):
            rel_path = asset.get("file_path", "").lstrip('/')
            full_path = project_root / rel_path
            if full_path.exists():
                file_hash = self._get_file_hash(full_path)
                hashes[file_hash] = asset.get("id")
        return hashes

    def _get_file_hash(self, file_path: Path) -> str:
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()

    def curate_batch(self, source_dir: str) -> Dict[str, Any]:
        """
        Processes a directory of untriaged images and generates a curation plan.
        """
        source_path = Path(source_dir)
        results = {
            "MANIFEST_MATCH": [],
            "DUPLICATE": [],
            "VARIANT": [],
            "NEW_CANDIDATE": [],
            "DISCARD": []
        }
        
        # Identify "Missing" gaps in manifest
        gaps = [a for a in self.manifest.get("assets", []) if a.get("status") == "Missing"]
        
        for img_path in source_path.rglob("*"):
            if img_path.suffix.lower() not in [".png", ".jpg", ".jpeg", ".webp"]:
                continue
                
            file_hash = self._get_file_hash(img_path)
            
            # 1. Check for Exact Duplicates
            if file_hash in self.content_hashes:
                existing_id = self.content_hashes[file_hash]
                results["DUPLICATE"].append({
                    "path": str(img_path),
                    "match": existing_id,
                    "action": f"rm {img_path}"
                })
                continue

            # 2. Check for Gap Matches (Heuristic-based for now)
            # In a full agentic loop, we'd use vision here.
            matched_gap = None
            for gap in gaps:
                if gap.get("name", "").lower() in img_path.name.lower():
                    matched_gap = gap
                    break
            
            if matched_gap:
                results["MANIFEST_MATCH"].append({
                    "path": str(img_path),
                    "target_id": matched_gap["id"],
                    "action": f"mv {img_path} to {matched_gap['file_path']}"
                })
                gaps.remove(matched_gap)
                continue

            # 3. Everything else is a New Candidate for now
            results["NEW_CANDIDATE"].append({
                "path": str(img_path),
                "action": f"process_and_move {img_path}"
            })

        return results

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: python asset_curator.py <manifest_path> <source_dir>")
        sys.exit(1)
        
    curator = AssetCurator(sys.argv[1])
    report = curator.curate_batch(sys.argv[2])
    print(json.dumps(report, indent=2))

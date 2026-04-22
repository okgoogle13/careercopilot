#!/usr/bin/env python3
"""
Manifest Reconciler MCP Server
Coordinates consistency checks across manifest, token map, hero registry
"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Set

class ManifestReconciler:
    def __init__(self):
        self.repo_root = Path(__file__).parent.parent.parent
        self.manifest_path = self.repo_root / 'frontend/public/assets/kr-solidarity-manifest.json'
        self.hero_registry_path = self.repo_root / 'frontend/public/assets/kr-solidarity-hero-registry.json'
        self.token_map_candidates = [
            self.repo_root / 'frontend/public/assets/kr-solidarity-hero-token-map.v2.json',
            self.repo_root / 'frontend/public/assets/kr-solidarity-ui-token-map.json',
        ]

    def load_json(self, path: Path) -> Dict:
        with open(path, 'r') as f:
            return json.load(f)

    def resolve_token_map_path(self) -> Path | None:
        for candidate in self.token_map_candidates:
            if candidate.exists():
                return candidate
        return None

    def get_manifest_ids(self) -> Set[str]:
        manifest = self.load_json(self.manifest_path)
        return {asset['id'] for asset in manifest.get('assets', [])}

    def get_token_map_ids(self) -> Set[str]:
        token_map_path = self.resolve_token_map_path()
        if token_map_path is None:
            return set()
        token_map = self.load_json(token_map_path)
        ids = set()
        for token in token_map.get('tokens', {}).values():
            if token.get('ref'):
                ids.add(token['ref'])
        for gap in token_map.get('ui_kit_gaps', []):
            ids.add(gap['id'])
        return ids

    def get_hero_registry_ids(self) -> Set[str]:
        registry = self.load_json(self.hero_registry_path)
        ids = set()
        for comp in registry.get('compositions', []):
            for layer in comp.get('layers', []):
                asset_id = layer.get('asset_id')
                if asset_id and asset_id != 'auto':
                    ids.add(asset_id)
        return ids

    def validate_file_paths(self) -> List[str]:
        """Check if all asset file paths in token map and manifest exist"""
        errors = []
        manifest_data = self.load_json(self.manifest_path)
        token_map_path = self.resolve_token_map_path()
        token_map = self.load_json(token_map_path) if token_map_path else {"tokens": {}, "ui_kit_gaps": []}

        # Check token map paths
        for token_name, token_data in token_map.get('tokens', {}).items():
            if token_data.get('status') == 'ready' and token_data.get('path'):
                asset_path = self.repo_root / 'frontend/public' / token_data['path'].lstrip('/')
                if not asset_path.exists():
                    errors.append(f"Missing Token Map file: {token_data['path']} (Ref: {token_data.get('ref')})")

        # Check manifest paths
        for asset in manifest_data.get('assets', []):
            asset_path = self.repo_root / 'frontend/public' / asset['file_path'].lstrip('/')
            if not asset_path.exists():
                errors.append(f"Missing Manifest file: {asset['file_path']} (ID: {asset['id']})")

        return errors

    def get_disk_files(self) -> Set[str]:
        """Get set of relative file paths from disk"""
        asset_root = self.repo_root / 'frontend/public/assets/kr-solidarity'
        paths = set()
        for root, _, files in os.walk(asset_root):
            for file in files:
                if file.endswith(('.png', '.svg', '.jpg', '.jpeg', '.webp')):
                    full_path = Path(root) / file
                    rel_path = f"/assets/kr-solidarity/{full_path.relative_to(asset_root)}"
                    paths.add(rel_path)
        return paths

    def reconcile(self) -> Dict:
        manifest_data = self.load_json(self.manifest_path)
        manifest_ids = {asset['id'] for asset in manifest_data.get('assets', [])}
        manifest_paths = {asset['file_path'] for asset in manifest_data.get('assets', [])}
        token_map_ids = self.get_token_map_ids()
        hero_registry_ids = self.get_hero_registry_ids()
        disk_paths = self.get_disk_files()
        token_map_path = self.resolve_token_map_path()

        result = {
            'timestamp': str(Path.cwd()),
            'status': 'valid',
            'issues': [],
            'stats': {
                'manifest_assets': len(manifest_ids),
                'token_map_entries': len(token_map_ids),
                'hero_registry_refs': len(hero_registry_ids),
                'token_map_path': str(token_map_path) if token_map_path else None,
            }
        }

        if token_map_path is None:
            result['status'] = 'invalid'
            result['issues'].append({
                'type': 'missing_token_map',
                'count': 1,
                'items': [str(candidate) for candidate in self.token_map_candidates],
            })

        # Orphaned references (in hero registry but not in manifest)
        orphaned = hero_registry_ids - manifest_ids - token_map_ids
        if orphaned:
            result['status'] = 'invalid'
            result['issues'].append({
                'type': 'orphaned_references',
                'count': len(orphaned),
                'items': list(orphaned),
            })

        # Missing token mappings (in manifest but not in token map)
        missing_tokens = manifest_ids - token_map_ids
        if missing_tokens:
            result['issues'].append({
                'type': 'missing_token_mappings',
                'count': len(missing_tokens),
                'items': list(missing_tokens),
            })

        # File path validation
        path_errors = self.validate_file_paths()
        if path_errors:
            result['status'] = 'invalid'
            result['issues'].append({
                'type': 'missing_files',
                'count': len(path_errors),
                'items': path_errors,
            })

        # Orphaned files on disk
        orphaned_files = disk_paths - manifest_paths
        if orphaned_files:
            result['issues'].append({
                'type': 'orphaned_disk_files',
                'count': len(orphaned_files),
                'items': list(orphaned_files),
            })

        return result

if __name__ == '__main__':
    reconciler = ManifestReconciler()
    result = reconciler.reconcile()
    print(json.dumps(result, indent=2))
    sys.exit(0 if result['status'] == 'valid' else 1)

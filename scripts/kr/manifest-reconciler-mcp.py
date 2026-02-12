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
        self.manifest_path = self.repo_root / 'frontend/public/assets/kerala-rage-kr-solidarity-manifest.json'
        self.token_map_path = self.repo_root / 'frontend/public/assets/kr-solidarity-ui-token-map.json'
        self.hero_registry_path = self.repo_root / 'frontend/public/assets/kr-solidarity/kr-solidarity.hero-registry.json'

    def load_json(self, path: Path) -> Dict:
        with open(path, 'r') as f:
            return json.load(f)

    def get_manifest_ids(self) -> Set[str]:
        manifest = self.load_json(self.manifest_path)
        return {asset['id'] for asset in manifest.get('assets', [])}

    def get_token_map_ids(self) -> Set[str]:
        token_map = self.load_json(self.token_map_path)
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
        """Check if all asset file paths in token map exist"""
        errors = []
        token_map = self.load_json(self.token_map_path)
        
        for token_name, token_data in token_map.get('tokens', {}).items():
            if token_data.get('status') == 'ready' and token_data.get('path'):
                asset_path = self.repo_root / 'frontend/public' / token_data['path'].lstrip('/')
                if not asset_path.exists():
                    errors.append(f"Missing file: {token_data['path']}")
        
        return errors

    def reconcile(self) -> Dict:
        manifest_ids = self.get_manifest_ids()
        token_map_ids = self.get_token_map_ids()
        hero_registry_ids = self.get_hero_registry_ids()

        result = {
            'timestamp': str(Path.cwd()),
            'status': 'valid',
            'issues': [],
            'stats': {
                'manifest_assets': len(manifest_ids),
                'token_map_entries': len(token_map_ids),
                'hero_registry_refs': len(hero_registry_ids),
            }
        }

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

        return result

if __name__ == '__main__':
    reconciler = ManifestReconciler()
    result = reconciler.reconcile()
    print(json.dumps(result, indent=2))
    sys.exit(0 if result['status'] == 'valid' else 1)

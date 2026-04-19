
import json
import os
from pathlib import Path

def full_reconciliation():
    repo_root = Path('/Users/okgoogle13/Projects/careercopilot')
    manifest_path = repo_root / 'frontend/public/assets/kr-solidarity-manifest.json'
    token_map_path = repo_root / 'frontend/public/assets/kr-solidarity-ui-token-map.json'
    hero_registry_path = repo_root / 'frontend/public/assets/kr-solidarity/kr-solidarity.hero-registry.json'

    # 1. Prune Manifest based on File Existence
    if manifest_path.exists():
        with open(manifest_path, 'r') as f:
            manifest = json.load(f)

        remaining_assets = []
        valid_ids = set()
        for asset in manifest.get('assets', []):
            if asset.get('priority') == 'RESERVED':
                remaining_assets.append(asset)
                valid_ids.add(asset['id'])
                continue

            file_path = asset.get('file_path')
            if file_path:
                full_path = repo_root / 'frontend/public' / file_path.lstrip('/')
                if full_path.exists():
                    remaining_assets.append(asset)
                    valid_ids.add(asset['id'])

        manifest['assets'] = remaining_assets
        manifest['total_assets'] = len(remaining_assets)
        with open(manifest_path, 'w') as f:
            json.dump(manifest, f, indent=2)
        print(f"Manifest Reconciled: {len(remaining_assets)} assets remaining.")
    else:
        print("Manifest missing.")
        return

    # 2. Prune Token Map based on Manifest IDs
    if token_map_path.exists():
        with open(token_map_path, 'r') as f:
            token_map = json.load(f)

        new_tokens = {}
        for key, token in token_map.get('tokens', {}).items():
            ref_id = token.get('ref')
            if ref_id in valid_ids:
                new_tokens[key] = token
            else:
                # Also check file path directly for tokens (some might be UI-kit specific)
                path_val = token.get('path')
                if path_val:
                    full_path = repo_root / 'frontend/public' / path_val.lstrip('/')
                    if full_path.exists():
                        new_tokens[key] = token

        token_map['tokens'] = new_tokens
        with open(token_map_path, 'w') as f:
            json.dump(token_map, f, indent=2)
        print(f"Token Map Reconciled: {len(new_tokens)} tokens remaining.")

    # 3. Prune Hero Registry based on Manifest IDs
    if hero_registry_path.exists():
        with open(hero_registry_path, 'r') as f:
            registry = json.load(f)

        new_compositions = []
        for comp in registry.get('compositions', []):
            comp_valid = True
            for layer in comp.get('layers', []):
                aid = layer.get('asset_id')
                if aid and aid != 'auto' and aid not in valid_ids:
                    comp_valid = False
                    break
            if comp_valid:
                new_compositions.append(comp)

        registry['compositions'] = new_compositions
        with open(hero_registry_path, 'w') as f:
            json.dump(registry, f, indent=2)
        print(f"Hero Registry Reconciled: {len(new_compositions)} compositions remaining.")

if __name__ == "__main__":
    full_reconciliation()

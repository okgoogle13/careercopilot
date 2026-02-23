
import json
import os

MANIFEST_PATH = '/Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/kerala-rage-kr-solidarity-manifest.json'
TOKEN_MAP_PATH = '/Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/kr-solidarity-ui-token-map.json'

def sync_token_map():
    print(f"Syncing {TOKEN_MAP_PATH} with {MANIFEST_PATH}")
    
    with open(MANIFEST_PATH, 'r') as f:
        manifest = json.load(f)
        
    with open(TOKEN_MAP_PATH, 'r') as f:
        token_map = json.load(f)
        
    # Build lookup: ID -> Path
    manifest_lookup = {asset['id']: asset['file_path'] for asset in manifest.get('assets', [])}
    
    updated_count = 0
    for token_id, token_data in token_map.get('tokens', {}).items():
        ref = token_data.get('ref')
        if ref in manifest_lookup:
            old_path = token_data.get('path')
            new_path = manifest_lookup[ref]
            if old_path != new_path:
                token_data['path'] = new_path
                # Also ensure status is 'ready' if path exists
                token_data['status'] = 'ready'
                updated_count += 1
                print(f"✅ Updated {token_id}: {old_path} -> {new_path}")
                
    if updated_count > 0:
        with open(TOKEN_MAP_PATH, 'w') as f:
            json.dump(token_map, f, indent=2)
        print(f"\n✨ Sync complete. Updated {updated_count} token paths.")
    else:
        print("\nℹ️ No updates needed. Token map is already in sync.")

if __name__ == '__main__':
    sync_token_map()

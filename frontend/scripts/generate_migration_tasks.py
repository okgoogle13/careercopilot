import os
import math

# --- CONFIGURATION ---
LEGACY_ROOT = "src/_legacy"
LIVE_ROOT = "src"
BATCH_SIZE = 10  # Smaller batches for final cleanup precision

# --- SMART FOLDER MAPPING ---
FOLDER_MAPPINGS = {
    "src/_legacy/components/common": "src/components/ui",
    "src/_legacy/components/ui": "src/components/ui",
    "src/_legacy/components/atoms": "src/components/ui",
    "src/_legacy/components/molecules": "src/components/ui",
    "src/_legacy/components/features": "src/features",
    "src/_legacy/features": "src/features",
    "src/_legacy/pages": "src/features",
    "src/_legacy/components/layout": "src/components/layout",
    "src/_legacy/layout": "src/components/layout",
    "DEFAULT": "src/components/legacy-ported"
}

IGNORE_PATTERNS = [".stories.", ".test.", "setupTests", "d.ts", ".spec.", "__snapshots__", ".d.ts"]

def get_existing_filenames():
    """
    Scans the LIVE_ROOT (excluding _legacy) to build a set of
    """
    existing = set()
    for root, _, files in os.walk(LIVE_ROOT):
        if "_legacy" in root: continue
        
        for file in files:
            if file.endswith(('.tsx', '.jsx', '.ts')):
                filename = file.lower()
                existing.add(filename)
                
                # MAGIC FIX: Map Electric* to Generic names
                if filename.startswith("electric"):
                    simple_name = filename.replace("electric", "")
                    existing.add(simple_name)
                    
    return existing


def resolve_target_path(legacy_path):
    filename = os.path.basename(legacy_path)
    legacy_dir = os.path.dirname(legacy_path)
    
    for legacy_key, live_target in FOLDER_MAPPINGS.items():
        if legacy_key in legacy_dir:
            return os.path.join(live_target, filename)
            
    if "Button" in filename or "Card" in filename:
        return os.path.join("src/components/ui", filename)
        
    return os.path.join(FOLDER_MAPPINGS["DEFAULT"], filename)


def generate_prompts():
    existing_files = get_existing_filenames()
    targets = []
    
    print(f"🕵️  Scanning {LEGACY_ROOT}...")
    
    for root, _, files in os.walk(LEGACY_ROOT):
        for file in files:
            if not file.endswith(('.tsx', '.jsx')): continue
            if any(p in file for p in IGNORE_PATTERNS): continue

            # If it's a known duplicate (e.g. Button), skip it
            if file.lower() in existing_files:
                continue
                
            legacy_path = os.path.join(root, file)
            live_path = resolve_target_path(legacy_path)
            targets.append((legacy_path, live_path))

    total_files = len(targets)
    batches = math.ceil(total_files / BATCH_SIZE)
    
    print(f"🔥 FOUND {total_files} FEATURES TO PORT.")
    print(f"📦 GENERATING {batches} BATCH PROMPTS.")
    print("="*60)

    for i in range(batches):
        batch = targets[i * BATCH_SIZE : (i + 1) * BATCH_SIZE]
        
        print(f"\n📄 --- BATCH {i + 1}/{batches} (Copy below this line) ---")
        print("Task: Port the following Feature components to Electric Alchemist.")
        print("\nREFERENCE CONTEXT (@):")
        print("@src/components/ui/index.ts (The Bridge)")
        print("@src/components/electric/card/ElectricCard.tsx")
        print("@src/theme/tokens.json")
        print("\nTARGET LEGACY FILES:")
        for legacy, _ in batch:
            print(f"@{legacy}")
            
        print("\nMIGRATION RULES:")
        print("1. IMPORTS: Import atoms from `@/components/ui` (e.g. `import { Button, Card }`).")
        print("2. LAYOUT: Use `<Card>` containers and `gap-tokens` for structure.")
        print("3. LOGIC: Preserve all original props/state logic.")
        print("4. CLEANUP: Remove all MUI/CSS imports.")
        print("="*60)


if __name__ == "__main__":
    generate_prompts()

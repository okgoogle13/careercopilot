import os
import math

# --- CONFIGURATION ---
LEGACY_ROOT = "src/_legacy"
LIVE_ROOT = "src"
BATCH_SIZE = 25

# --- SMART FOLDER MAPPING ---
FOLDER_MAPPINGS = {
    # Core UI Atoms (Consolidate into ui folder)
    "src/_legacy/components/common": "src/components/ui",
    "src/_legacy/components/ui": "src/components/ui",
    "src/_legacy/components/atoms": "src/components/ui",
    "src/_legacy/components/molecules": "src/components/ui",

    # Features (Move to feature-first structure)
    "src/_legacy/components/features": "src/features",
    "src/_legacy/features": "src/features",
    "src/_legacy/pages": "src/features",

    # Layout
    "src/_legacy/components/layout": "src/components/layout",
    "src/_legacy/layout": "src/components/layout",

    # Fallback
    "DEFAULT": "src/components/legacy-ported"
}

IGNORE_PATTERNS = [
    ".stories.",
    ".test.",
    "setupTests",
    "d.ts"
]

def resolve_target_path(legacy_path):
    filename = os.path.basename(legacy_path)
    legacy_dir = os.path.dirname(legacy_path)

    # Check strict mappings
    for legacy_key, live_target in FOLDER_MAPPINGS.items():
        if legacy_key in legacy_dir:
            return os.path.join(live_target, filename)

    # Safety net for UI components
    if "Button" in filename or "Card" in filename or "Input" in filename:
        return os.path.join("src/components/ui", filename)

    return os.path.join(FOLDER_MAPPINGS["DEFAULT"], filename)

def get_migration_targets():
    targets = []
    print(f"🕵️  Scanning {LEGACY_ROOT} for legacy components...")

    if not os.path.exists(LEGACY_ROOT):
        print(f"❌ Legacy root {LEGACY_ROOT} not found.")
        return targets

    for root, _, files in os.walk(LEGACY_ROOT):
        for file in files:
            if not file.endswith(('.tsx', '.jsx')):
                continue
            if any(p in file for p in IGNORE_PATTERNS):
                continue

            legacy_path = os.path.join(root, file)
            live_path = resolve_target_path(legacy_path)

            if os.path.exists(live_path):
                continue

            targets.append((legacy_path, live_path))

    return targets


def generate_prompts():
    targets = get_migration_targets()
    total_files = len(targets)

    if total_files == 0:
        print("🎉 No legacy components found to migrate.")
        return

    batches = math.ceil(total_files / BATCH_SIZE)

    print(f"🔨 FOUND {total_files} COMPONENTS TO PORT.")
    print(f"📦 GENERATING {batches} BATCH PROMPTS.")
    print("=" * 60)

    for i in range(batches):
        batch = targets[i * BATCH_SIZE : (i + 1) * BATCH_SIZE]

        print(f"\n📄 --- BATCH {i + 1}/{batches} ---")
        print("Task: Port Legacy components to Electric Alchemist Design System")
        print("\nREFERENCE CONTEXT:")
        print("@src/theme/tokens.json")
        print("@src/components/electric/button/ElectricButton.tsx")
        print("@src/components/electric/card/ElectricCard.tsx")
        print("\nLEGACY SOURCE FILES:")
        for legacy, _ in batch:
            print(f"@{legacy}")

        print("\nINSTRUCTIONS:")
        for legacy, live in batch:
            print(f"- Create `{live}` based on `{legacy}`")

        print("\nMIGRATION RULES:")
        print("1. Use Tailwind + Framer Motion (No MUI, No CSS Modules)")
        print("2. Use Electric* components where possible")
        print("3. Apply tactilePress physics to interactive elements")
        print("4. Use design tokens (bg-surface, text-human)")
        print("5. Keep original Props interface and business logic")
        print("6. Write complete code (no // ... placeholders)")
        print("=" * 60)

if __name__ == "__main__":
    generate_prompts()

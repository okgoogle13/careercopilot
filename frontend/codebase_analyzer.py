import os

# CONFIGURATION
SEARCH_DIR = "src"
OUTPUT_FILE = "CODEBASE_MAP.md"

# DEFINITIONS OF "SMELLS"
LEGACY_INDICATORS = [
    "@mui",
    "makeStyles",
    "styled-components",
    ".module.css",
    "React.Component",  # Class components
    "prop-types"
]

MODERN_INDICATORS = [
    "class-variance-authority",
    "cva",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
]

def analyze_file(filepath):
    """Scans a file to guess if it's Legacy or Modern."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        is_legacy = any(ind in content for ind in LEGACY_INDICATORS)
        is_modern = any(ind in content for ind in MODERN_INDICATORS)
        
        if is_modern and not is_legacy:
            return "✨ MODERN (Keep)"
        elif is_legacy:
            return "💀 LEGACY (Migrate/Delete)"
        else:
            return "❓ UNKNOWN (Review)"
            
    except Exception:
        return "⚠️ ERROR (Could not read)"

def generate_map():
    results = {}
    
    print(f"🕵️  Scanning {SEARCH_DIR} for components...")
    
    for root, _, files in os.walk(SEARCH_DIR):
        for file in files:
            if file.endswith(('.tsx', '.jsx', '.js', '.ts')) and not file.endswith('.d.ts'):
                path = os.path.join(root, file)
                # Skip node_modules just in case
                if "node_modules" in path:
                    continue
                
                status = analyze_file(path)
                
                # Group by folder
                folder = os.path.dirname(path)
                if folder not in results:
                    results[folder] = []
                results[folder].append((file, status))

    # Write Report
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("# 🗺️ Electric Alchemist Codebase Map\n\n")
        f.write("> **Legend:**\n")
        f.write("> * ✨ MODERN: Uses Tailwind/CVA/Framer (Good to go)\n")
        f.write("> * 💀 LEGACY: Uses MUI/CSS Modules (Needs migration)\n")
        f.write("> * ❓ UNKNOWN: Generic logic or utils\n\n")
        
        for folder in sorted(results.keys()):
            f.write(f"### 📂 `{folder}`\n")
            f.write("| File | Status | Action |\n")
            f.write("| :--- | :--- | :--- |\n")
            for filename, status in sorted(results[folder]):
                action = "**IGNORE**" if "MODERN" in status else "Refactor"
                f.write(f"| `{filename}` | {status} | {action} |\n")
            f.write("\n")

    print(f"✅ Map generated at: {OUTPUT_FILE}")


if __name__ == "__main__":
    generate_map()

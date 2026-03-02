#!/usr/bin/env python3
"""
Slop-Font Guardrail for Kerala Rage Design System
Scans the codebase for forbidden 'slop' fonts (Inter, Sora, Recursive, etc.)
to ensure typographic sovereignty.

Exit codes:
  0 = All clear
  1 = Slop fonts detected
"""
import os
import re
import sys
from pathlib import Path

# Configuration
FORBIDDEN_FONTS = [
    "Inter",
    "Sora",
    "Plus Jakarta Sans",
    "Recursive",
    "Amstelvar",
    "Roboto Flex",
    "Arial",
    "Helvetica",
    "Open Sans"
]

IGNORE_DIRS = [".git", "node_modules", "dist", ".turbo", "scripts"]
IGNORE_FILES = ["design-tokens.css", "kerala-rage.css", "tokens.json"]

# Regex for matching font names in CSS/Tailwind/React files
# Uses word boundaries \b to avoid matching keywords like 'interface' or 'Interview'
FONT_PATTERN = re.compile(rf"\b({'|'.join(FORBIDDEN_FONTS)})\b", re.IGNORECASE)

def scan_files(root_dir: str):
    violations = []
    
    for root, dirs, files in os.walk(root_dir):
        # Skip ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        
        for file in files:
            if file in IGNORE_FILES:
                continue
                
            file_path = Path(root) / file
            
            # Only scan relevant files
            if file_path.suffix not in [".tsx", ".ts", ".css", ".scss", ".html", ".js"]:
                continue
                
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    lines = f.readlines()
                    for line_num, line in enumerate(lines, 1):
                        match = FONT_PATTERN.search(line)
                        if match:
                            # Verify if it's a real violation or just a comment
                            if "// slop-ignore" in line or "/* slop-ignore */" in line:
                                continue
                                
                            violations.append({
                                "file": str(file_path),
                                "line": line_num,
                                "font": match.group(0),
                                "content": line.strip()
                            })
            except Exception as e:
                print(f"⚠️  Could not read {file_path}: {e}")
                
    return violations

def main():
    target = sys.argv[1] if len(sys.argv) > 1 else "frontend/src"
    print(f"🛡️  Scanning for Slop-Fonts in '{target}'...")
    
    violations = scan_files(target)
    
    if violations:
        print(f"\n❌ FAILED: Detected {len(violations)} Slop-Font violations!\n")
        print("The Kerala Rage design system FORBIDS the following fonts:")
        print(f"   {', '.join(FORBIDDEN_FONTS)}\n")
        
        # Group by file
        current_file = ""
        for v in violations:
            if v["file"] != current_file:
                print(f"📄 {v['file']}")
                current_file = v["file"]
            print(f"   L{v['line']}: Found '{v['font']}' -> {v['content']}")
            
        print("\n💡 ACTION: Replace with Kerala Rage standard fonts (Work Sans, Fraunces, Libre Bodoni).")
        print("💡 BYPASS: Add // slop-ignore to the end of the line if this is a false positive.")
        sys.exit(1)
    else:
        print("\n✨ SUCCESS: No slop-fonts detected. Typographic sovereignty maintained.")
        sys.exit(0)

if __name__ == "__main__":
    main()

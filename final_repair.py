import os
import re

# Expanded ROOTS to cover all relevant areas
ROOTS = ["frontend/src/legacy/ui", "frontend/src/stores", "frontend/src/components", "frontend/src/design"]
EXTENSIONS = ('.ts', '.tsx')

def final_repair(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # 1. Fix mode type definition collisions
    content = content.replace("'KrDark' | 'KrDark'", "'KrDark' | 'KrLight'")
    
    # 2. Fix duplicate keys in objects project-wide
    lines = content.splitlines()
    new_lines = []
    
    # Match strings like 'KrDark': or kr-dark: or KrDarkSpring = ...
    patterns = [
        r"['\"]?KrDark['\"]?\s*:",
        r"const\s+KrDarkSpring\s*=",
        r"export\s+const\s+KrDarkSpring\s*=",
        r"KrDarkSpring:\s*"
    ]
    
    # Keep track of counts for various terms to fix duplicates
    counts = {
        "KrDark": 0,
        "kr-dark": 0,
        "KrDarkSpring": 0
    }
    
    for line in lines:
        for term, count in counts.items():
            if term == "KrDarkSpring" and re.search(r"\bKrDarkSpring\b", line):
                counts[term] += 1
                if counts[term] > 1:
                    line = line.replace("KrDarkSpring", "KrLightSpring")
                    print(f"Fixed duplicate identifier {term} in {path}")
            elif (term == "KrDark" or term == "kr-dark"):
                regex = r"['\"]?" + re.escape(term) + r"['\"]?\s*:"
                if re.search(regex, line):
                    counts[term] += 1
                    if counts[term] > 1:
                        # Only replace the key part, be careful with quotes
                        replacement = term.replace("Dark", "Light").replace("dark", "light")
                        line = re.sub(regex, lambda m: m.group(0).replace(term, replacement), line)
                        print(f"Fixed duplicate key {term} in {path}")
        new_lines.append(line)
    
    content = "\n".join(new_lines)

    # 3. Fix specific isKrDarkMode collisions
    if "useModeStore.ts" in path:
        content = content.replace("isKrDarkMode: boolean;\n  isKrDarkMode: boolean;", "isKrDarkMode: boolean;\n  isKrLightMode: boolean;")

    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    for root in ROOTS:
        for root_dir, dirs, files in os.walk(root):
            for file in files:
                if file.endswith(EXTENSIONS):
                    path = os.path.join(root_dir, file)
                    if final_repair(path):
                        print(f"Corrected: {path}")

if __name__ == "__main__":
    main()

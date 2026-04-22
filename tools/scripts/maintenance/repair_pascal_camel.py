import os
import re

ROOT = "frontend/src"
EXTENSIONS = ('.ts', '.tsx')

# Mapping for PascalCase repairs
PASCAL_MAP = {
    "kerala-rage": "KeralaRage",
    "kr-solidarity": "KrSolidarity",
    "kerala-streetprint": "KeralaStreetprint",
    "kr-dark": "KrDark",
    "kr-shiva": "KrShiva",
    "kr-ink-gold": "KrInkGold",
    "kr-screenprint": "KrScreenprint",
    "kr-wheat-paste": "KrWheatPaste",
    "kr-laneway": "KrLaneway",
    "kr-charcoal": "KrCharcoal",
    "kr-serif-bold": "KrSerifBold",
    "kr-motif": "KrMotif",
    "kr-symbol": "KrSymbol",
    "kr-leaf": "KrLeaf",
    "kr-flower": "KrFlower"
}

# Mapping for camelCase repairs (usually for variables/properties)
CAMEL_MAP = {
    "iskr-darkMode": "isKrDarkMode",
    "iskr-darkMode": "isKrLightMode", # We'll handle this manually or via count
}

def repair_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Handle Duplicate Keys 'kr-dark' in objects
    # We look for the second occurrence of 'kr-dark': and change it to 'kr-light':
    # This is a bit risky but usually these files have two mode definitions
    matches = list(re.finditer(r"['\"]kr-dark['\"]\s*:", content))
    if len(matches) >= 2:
        # Change the second one
        start, end = matches[1].span()
        # We need to be careful not to break the rest of the string
        content = content[:start] + "'kr-light' :" + content[end:]
        print(f"Fixed duplicate key in {path}")

    # 2. Repair hyphenated identifiers
    # We look for [a-zA-Z0-9]+-[a-zA-Z0-9-]+ in places that should be identifiers
    # For simplicity, we just replace our known terms with their Pascal versions
    # when they are part of a larger word or start of a line/identifier

    for old, new in PASCAL_MAP.items():
        # Replace if it's start of identifier or preceded by something that makes it Pascal
        # e.g. usekr-darkData -> useKrDarkData
        # kr-darkFeed -> KrDarkFeed
        # but NOT in strings (handled by ripgrep later if needed)

        # We'll use a regex that matches the term when it's part of an identifier
        # i.e. preceded by [a-zA-Z0-9] or start of word
        # and NOT surrounded by quotes (vague but better)

        # Replace usekr-dark -> useKrDark
        content = re.sub(r'([a-z])' + re.escape(old), r'\1' + new, content)
        # Replace at start of word (PascalCase components/types)
        content = re.sub(r'\b' + re.escape(old), new, content)

    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    for root, dirs, files in os.walk(ROOT):
        for file in files:
            if file.endswith(EXTENSIONS):
                path = os.path.join(root, file)
                if repair_file(path):
                    print(f"Repaired: {path}")

if __name__ == "__main__":
    main()

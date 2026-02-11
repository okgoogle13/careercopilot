import os
import re

MAPPINGS = {
    # Botanical -> Urban/Political
    r'waratah[- ]?red': 'solidarity-red',
    r'Waratah[- ]?Red': 'Solidarity Red',
    r'waratahRed': 'solidarityRed',
    r'WARATAH_RED': 'SOLIDARITY_RED',
    r'waratah': 'solidarity',
    r'Waratah': 'Solidarity',

    r'wattle[- ]?gold': 'ink-gold',
    r'Wattle[- ]?Gold': 'Ink Gold',
    r'wattleGold': 'inkGold',
    r'WATTLE_GOLD': 'INK_GOLD',
    r'wattle': 'ink',
    r'Wattle': 'Ink',

    r'baru[- ]?gold': 'ink-gold',
    r'Baru[- ]?Gold': 'Ink Gold',
    r'baruGold': 'inkGold',
    r'BARU_GOLD': 'INK_GOLD',
    r'baru': 'primary',
    r'Baru': 'Primary',

    r'gum[- ]?leaf[- ]?yellow': 'stencil-yellow',
    r'Gum[- ]?Leaf[- ]?Yellow': 'Stencil Yellow',
    r'gumLeafYellow': 'stencilYellow',
    r'gum[- ]?leaf': 'stencil',
    r'Gum[- ]?Leaf': 'Stencil',

    r'kr-leafus[- ]?smoke': 'backwater-green',
    r'kr-leafus[- ]?Ash': 'worker-ash',
    r'kr-leafus': 'kr-activist',
    r'leafus': 'activist',
    r'Leafus': 'Activist',

    r'parrot[- ]?green': 'signal-green',
    r'Parrot[- ]?Green': 'Signal Green',
    r'parrotGreen': 'signalGreen',
    r'parrot': 'signal',
    r'Parrot': 'Signal',

    r'lab[- ]?wren[- ]?metal[- ]?blue': 'ripple-blue',
    r'lab[- ]?wren': 'ripple',
    r'Lab[- ]?Wren': 'Ripple',

    r'ghost[- ]?gum': 'solidarity-green',
    r'Ghost[- ]?Gum': 'Solidarity Green',
}

PATHS = [
    'docs/design',
    'frontend/src'
]

def purge_in_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for pattern, replacement in MAPPINGS.items():
            new_content = re.sub(pattern, replacement, new_content)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
    return False

def main():
    count = 0
    for root_path in PATHS:
        abs_root = os.path.join(os.getcwd(), root_path)
        for root, dirs, files in os.walk(abs_root):
            for file in files:
                if file.endswith(('.md', '.tsx', '.ts', '.css', '.json', '.html')):
                    file_path = os.path.join(root, file)
                    if purge_in_file(file_path):
                        count += 1
                        print(f"Updated: {file_path}")
    print(f"Total files updated: {count}")

if __name__ == "__main__":
    main()

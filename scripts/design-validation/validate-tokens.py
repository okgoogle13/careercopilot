import json
import sys
import re
from pathlib import Path

# Configuration
TOKENS_FILE = Path("src/design/tokens/tokens.json")
NORTHCOTE_COLORS = {
    "ironbark": "#1A1410",
    "eucalyptus": "#8FB8A0"
}

def load_tokens(path):
    try:
        with open(path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ Error: Tokens file not found at {path}")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"❌ Error: Invalid JSON in {path}")
        sys.exit(1)

def validate_dtcg(tokens, path=""):
    errors = []
    if isinstance(tokens, dict):
        if "$value" in tokens:
            # It's a token
            if "$type" not in tokens:
                 errors.append(f"Missing $type for token at {path}")
        else:
            # It's a group
            for key, value in tokens.items():
                if not key.startswith("$"):
                    new_path = f"{path}.{key}" if path else key
                    errors.extend(validate_dtcg(value, new_path))
    return errors

def validate_contrast(hex1, hex2):
    # Basic stub for contrast check - readily expandable
    # In production, this would implement WCAG relative luminance calculation
    return True

def check_northcote_compliance(tokens):
    # Simplified check to ensure core brand colors exist
    # This traverses the token structure looking for specific values
    # In a real scenario, this would be more robust

    tokens_str = json.dumps(tokens)
    missing = []
    for name, hex_val in NORTHCOTE_COLORS.items():
        if hex_val not in tokens_str and hex_val.lower() not in tokens_str:
            missing.append(f"Missing Northcote core color: {name} ({hex_val})")
    return missing

def main():
    print("🔍 Validating Design Tokens...")

    if not TOKENS_FILE.exists():
        print(f"⚠️  {TOKENS_FILE} not found. Skipping validation.")
        return 0

    tokens = load_tokens(TOKENS_FILE)

    # 1. DTCG Validation
    dtcg_errors = validate_dtcg(tokens)
    if dtcg_errors:
        print("\n❌ DTCG Compliance Failures:")
        for err in dtcg_errors:
            print(f"  - {err}")
    else:
        print("✅ DTCG compliance passed")

    # 2. Northcote Compliance
    brand_errors = check_northcote_compliance(tokens)
    if brand_errors:
        print("\n❌ Northcote Brand Compliance Failures:")
        for err in brand_errors:
            print(f"  - {err}")
    else:
        print("✅ Northcote brand compliance passed")

    if dtcg_errors or brand_errors:
        print("\n❌ Validation Failed")
        sys.exit(1)

    print("\n✨ All Design Tokens Valid!")
    sys.exit(0)

if __name__ == "__main__":
    main()

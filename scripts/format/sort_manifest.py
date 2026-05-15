import json
import pathlib
import re
import sys


def sort_key(asset):
    asset_id = asset.get("id", "")
    match = re.match(r"^(KR-SOLID|KR-UI)-(\d+)$", asset_id)
    if not match:
        return (2, 0, asset_id)

    group = 0 if match.group(1) == "KR-SOLID" else 1
    return (group, int(match.group(2)), asset_id)


def main():
    manifest_path = pathlib.Path(
        "frontend/public/assets/kr-solidarity-manifest.json"
    )
    if not manifest_path.is_file():
        print("Manifest not found", file=sys.stderr)
        sys.exit(1)

    data = json.loads(manifest_path.read_text())
    if "assets" not in data:
        print("No assets key", file=sys.stderr)
        sys.exit(1)

    data["assets"] = sorted(data["assets"], key=sort_key)
    manifest_path.write_text(json.dumps(data, indent=2) + "\n")
    print("Manifest sorted successfully")


if __name__ == "__main__":
    main()

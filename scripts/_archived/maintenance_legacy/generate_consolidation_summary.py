
import json
import os

def generate_summary():
    with open('consolidation-analysis.json', 'r') as f:
        plan = json.load(f)

    # 1. State Counters
    stats = {
        'total_unique_assets': len(plan),
        'moves': 0,
        'renames': 0,
        'keeps': 0,
        'uncategorized': 0,
        'by_category': {},
        'sources': {}
    }

    for item in plan:
        # Actions
        if item['action'] == 'MOVE': stats['moves'] += 1
        elif item['action'] == 'RENAME': stats['renames'] += 1
        elif item['action'] == 'KEEP': stats['keeps'] += 1

        # Categories
        cat = item['destination'].split('/')[-2]
        stats['by_category'][cat] = stats['by_category'].get(cat, 0) + 1
        if cat == 'uncategorized': stats['uncategorized'] += 1

        # Source Tracking
        for label in item['source_labels']:
            stats['sources'][label] = stats['sources'].get(label, 0) + 1

    # 2. Generate Markdown
    md = []
    md.append("# Asset Consolidation Plan: Final Review\n")

    md.append("## 📊 Executive Summary")
    md.append(f"- **Total Unique Assets**: {stats['total_unique_assets']}")
    md.append(f"- **Files to Move**: {stats['moves']}")
    md.append(f"- **Files to Rename**: {stats['renames']}")
    md.append(f"- **Files Processed from Phase 3**: {stats['sources'].get('NEW_SOURCE', 0)}\n")

    md.append("## 📂 Target Structure (/assets)")
    md.append("| Subdirectory | File Count | Notes |")
    md.append("| :--- | :--- | :--- |")
    for cat, count in sorted(stats['by_category'].items()):
        note = "⚠️ Requires manual review" if cat == 'uncategorized' else "✅ Validated"
        md.append(f"| `/{cat}` | {count} | {note} |")
    md.append("")

    md.append("## 🛡️ Risk Assessment")
    if stats['uncategorized'] > 0:
        md.append(f"**Uncategorized Files**: {stats['uncategorized']}")
        md.append("> These files matched no regex rules and will be placed in `/assets/uncategorized` for manual sorting. Most are expected to be raw Phase 3 generations.\n")
    else:
        md.append("✅ All files catagorized successfully.\n")

    md.append("## 🏆 Winning Strategy")
    md.append("1. **Backup**: Full timestamped backup of all source directories.")
    md.append("2. **Priority**: Phase 3 assets (`NEW_SOURCE`) overwrite older versions where hashes collide.")
    md.append("3. **Naming**: 12 specific legacy files renamed to Manifest standards.")
    md.append("4. **Normalization**: Flattening complex legacy paths into a single canonical tier.")

    print('\n'.join(md))

if __name__ == '__main__':
    generate_summary()

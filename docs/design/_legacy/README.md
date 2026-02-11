# Legacy Design Documentation

This folder contains deprecated design documentation that has been consolidated into the current Solidarity Mode design system.

## Deprecated Files

### `annotated-wireframes.md.deprecated`

- **Deprecated:** February 9, 2026
- **Reason:** Contained outdated botanical/naturalist language ("kr-activist", "Greenhouse", "Cultivation") from the pre-Solidarity Mode design system.
- **Consolidated Into:**
  - `06-wireframes.md` (layout and interaction specifications)
  - `06b-asset-placement.md` (asset integration details)
  - `06c-content-guide.md` (copy and microcopy)

### `07-wireframe-content-draft.md.deprecated`

- **Deprecated:** February 9, 2026
- **Reason:** Duplicate content specifications that overlapped with wireframe documentation. Mixed outdated font references (Bebas Neue instead of Recursive Variable).
- **Consolidated Into:**
  - `06c-content-guide.md` (all copy, error states, and empty states)
  - `06-wireframes.md` (typography token references)

## Current Design Documentation Structure

The Solidarity Mode wireframe documentation is now organized as follows:

```
docs/design/
├── 06-wireframes.md          → Core wireframe specifications (layout, interaction, tokens)
├── 06b-asset-placement.md    → Detailed asset integration guide (position, behavior, animation)
└── 06c-content-guide.md      → Complete copy and microcopy specifications (all UI text)
```

This structure eliminates duplication and provides clear separation of concerns:

- **06-wireframes.md**: What the interface looks like and how it behaves
- **06b-asset-placement.md**: Where assets go and how they animate
- **06c-content-guide.md**: What the interface says

## Migration Notes

If you need to reference the original content from these deprecated files, they are preserved here with the `.deprecated` extension. However, all useful content has been migrated to the current documentation with updates to align with Solidarity Mode design principles.

---

**Last Updated:** February 9, 2026

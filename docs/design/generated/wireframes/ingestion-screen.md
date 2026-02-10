# Wireframe: Ingestion (Screen)

<layout>
```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  "FEED THE ARCHIVE"                                         │
│  Slab Container (Z-1)                                        │
│                                                             │
│  Z-2: {kr-asset-screenprint-grit}                           │
│                                                             │
│         ┌───────────────────────────────┐                  │
│         │                               │                  │
│         │    [ DROP RESUME / DATA ]     │  Z-2             │
│         │    Pebble Dropzone            │                  │
│         │                               │                  │
│         └───────────────────────────────┘                  │
│                                                             │
│              ┌─────────────────┐                           │
│              │   Scan Archive  │  Z-2                      │
│              │   Pebble Button │                           │
│              └─────────────────┘                           │
│                                                             │
│  Z-1: {kr-asset-halo-disk} (behind dropzone)                │
│                                                             │
│ Z-0: {kr-asset-screenprint-substrate}                       │
└─────────────────────────────────────────────────────────────┘
```
</layout>

<tokens>
- **Ink**: `baruGold` (Accent), `kr-leafusAsh` (Body)
- **Shapes**: `radius-slab` (Headline), `radius-pebble` (Interactive)
- **Typography**: `Display Large` (72px, Recursive)
</tokens>

<assets>
- **Textures**: `screenprint-substrate` (Z-0), `screenprint-grit` (Z-2)
- **Motifs**: `halo-disk` (Z-1)
- **Register**: Defiance
</assets>

<components>
- **IngestionSlab** (slab)
  - Role: Page title container.
- **DropZone** (pebble)
  - Role: File upload / drag-and-drop area.
  - Assets: Glow on dragOver.
- **PrimaryAction** (pebble)
  - Role: Process button.
</components>

<annotations>
1 | drop_zone         | Action: onDrop → upload file, show preview; State: default, dragOver, uploading.
2 | btn_scan          | Action: onClick → POST /api/ingest; State: default, loading (spinner), success.
3 | progress_bar      | State: visible during upload; Style: baruGold stroke; Type: Linear.
4 | error_msg         | State: visible on invalid format; Content: "Invalid Substrate"; Style: text-red.
</annotations>

<notes>
- Goal: Securely upload resume/data for analysis.
</notes>

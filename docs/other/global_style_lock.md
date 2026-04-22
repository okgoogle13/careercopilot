# Urban Gallery Wall — Workspace Rule

Follow these rules for all hero asset generation tasks in this repo:

1. Use Antigravity's highest-fidelity generative image tool in the Nano Banana Pro family.
2. Generate exactly one image per asset.
3. Never create grids or collages unless explicitly requested.
4. Keep website copy as live HTML; do not bake UI text into assets.
5. Preserve this Global Style Lock across all assets:
   - Art style: premium gritty editorial street-poster collage, archival portrait energy, distressed but curated, cinematic contrast
   - Background rules: dark asphalt wall, no clean studio backdrops, no glossy surfaces
   - Palette: charcoal, soot black, dusty beige, faded tan paper, muted teal, oxidized yellow, brick red, restrained green
   - Texture rules: screenprint grain, paper wear, paste-shadow, soft mist, light paint splatter, mild surface erosion
   - Typography rules: no typography baked into generated assets unless part of source-poster look; keep website copy live in HTML
   - Hard exclusions: neon cyberpunk, glossy 3D, modern fashion models, collage grids, heavy face obstruction, clean corporate minimalism, extra objects, stickers, logos, white backgrounds

6. Stable filenames are mandatory.
7. Update `ai/queue.json` status after each asset:
   - PENDING
   - DONE
   - FAILED
   - SKIPPED
8. Save final image outputs into `public/hero/generated/`.
9. Do not rename or reorder asset IDs.
10. After generation, preserve integration file structure in `src/components/` and `src/hero/`.

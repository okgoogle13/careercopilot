# RUN ASSET BATCH

        Read:
        - `ai/style-lock.json`
        - `ai/queue.json`
        - all files in `ai/prompts/`

        Then execute this batch in order:

        - A01: `ai/prompts/A01_wall_base.md` → `public/hero/generated/urban_gallery_wall__A01_wall_base__1920x1080.png`
- A02: `ai/prompts/A02_grain_overlay.md` → `public/hero/generated/urban_gallery_wall__A02_grain_overlay__1920x1080.png`
- A03: `ai/prompts/A03_main_poster.md` → `public/hero/generated/urban_gallery_wall__A03_main_poster__900x1400.png`
- A04: `ai/prompts/A04_secondary_poster_upper.md` → `public/hero/generated/urban_gallery_wall__A04_secondary_poster_upper__780x1220.png`
- A05: `ai/prompts/A05_secondary_poster_lower.md` → `public/hero/generated/urban_gallery_wall__A05_secondary_poster_lower__760x1180.png`
- A06: `ai/prompts/A06_splatter_left_accent.md` → `public/hero/generated/urban_gallery_wall__A06_splatter_left_accent__1200x900.png`
- A07: `ai/prompts/A07_mist_drips_back.md` → `public/hero/generated/urban_gallery_wall__A07_mist_drips_back__1600x1000.png`
- A08: `ai/prompts/A08_shadow_paste_fx.md` → `public/hero/generated/urban_gallery_wall__A08_shadow_paste_fx__1400x900.png`

        Execution protocol:
        1. Open each prompt file in order.
        2. Use the generative image tool with the highest-fidelity Pro image model available.
        3. Generate one image only.
        4. Save the file with the exact filename.
        5. Mark the asset DONE in `ai/queue.json` after save.
        6. If generation fails, rewrite the prompt once and retry.
        7. If retry fails, mark FAILED and continue.
        8. When done, keep `src/components/HeroArt.tsx` and `src/components/HeroArt.css` intact unless asset paths changed.

        Do not alter the visual system or naming scheme.

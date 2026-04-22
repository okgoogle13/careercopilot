# RUN ASSET BATCH

        Read:
        - `ai/style-lock.json`
        - `ai/queue.json`
        - all files in `ai/prompts/`

        Then execute this batch in order:

        - A01: `ai/prompts/A01_wall_base.md` → `public/hero/generated/kr-solidarity__substrate__urban--wall-base--v1.png`
- A02: `ai/prompts/A02_grain_overlay.md` → `public/hero/generated/kr-solidarity__atmospheric__urban--grain-overlay--v1.png`
- A03: `ai/prompts/A03_main_poster.md` → `public/hero/generated/kr-solidarity__resistance__urban--main-poster--v1.png`
- A04: `ai/prompts/A04_secondary_poster_upper.md` → `public/hero/generated/kr-solidarity__resistance__urban--secondary-poster-upper--v1.png`
- A05: `ai/prompts/A05_secondary_poster_lower.md` → `public/hero/generated/kr-solidarity__resistance__urban--secondary-poster-lower--v1.png`
- A06: `ai/prompts/A06_splatter_left_accent.md` → `public/hero/generated/kr-solidarity__atmospheric__urban--splatter-accent--v1.png`
- A07: `ai/prompts/A07_mist_drips_back.md` → `public/hero/generated/kr-solidarity__atmospheric__urban--mist-drips--v1.png`
- A08: `ai/prompts/A08_shadow_paste_fx.md` → `public/hero/generated/kr-solidarity__atmospheric__urban--shadow-paste-fx--v1.png`

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

# Hero Asset Automation

## What this bootstrap creates
- `ai/style-lock.json`
- `ai/queue.json`
- `ai/prompts/*.md`
- `.antigravity/rules/*.md`
- `.antigravity/tasks/RUN_ASSET_BATCH.md`
- `src/hero/hero.layers.json`
- `src/components/HeroArt.tsx`
- `src/components/HeroArt.css`
- `scripts/generate_with_gemini.py`
- `.env.example`

## Recommended workflow
1. Run this bootstrap script.
2. In Antigravity, create or paste the generated rule markdown into your workspace rules if your setup does not auto-read local markdown.
3. Open `.antigravity/tasks/RUN_ASSET_BATCH.md` in the editor and ask the agent to execute it.
4. Generated images should be saved into `public/hero/generated/`.
5. Render `<HeroArt />` inside your landing-page hero container.

## Example layout
Use `position: relative` on the hero wrapper.
Keep the right 40% quiet for headline + CTA.

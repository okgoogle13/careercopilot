#!/usr/bin/env python3
from __future__ import annotations

import json
import textwrap
from pathlib import Path

PROJECT_SLUG = "urban_gallery_wall"

GLOBAL_STYLE_LOCK = {
    "art_style": "premium gritty editorial street-poster collage, archival portrait energy, distressed but curated, cinematic contrast",
    "background_rules": "dark asphalt wall, no clean studio backdrops, no glossy surfaces",
    "palette": [
        "charcoal",
        "soot black",
        "dusty beige",
        "faded tan paper",
        "muted teal",
        "oxidized yellow",
        "brick red",
        "restrained green",
    ],
    "texture_rules": [
        "screenprint grain",
        "paper wear",
        "paste-shadow",
        "soft mist",
        "light paint splatter",
        "mild surface erosion",
    ],
    "typography_rules": "no typography baked into generated assets unless part of source-poster look; keep website copy live in HTML",
    "hard_exclusions": [
        "neon cyberpunk",
        "glossy 3D",
        "modern fashion models",
        "collage grids",
        "heavy face obstruction",
        "clean corporate minimalism",
        "extra objects",
        "stickers",
        "logos",
        "white backgrounds",
    ],
}

ASSETS = [
    {
        "id": "A01",
        "asset_id": "KR-SOLID-042",
        "name": "wall_base",
        "category": "urban",
        "layer_type": "substrate",
        "filename": "kr-solidarity__substrate__urban--wall-base--v1.png",
        "size": "1920x1080",
        "aspect_ratio": "16:9",
        "image_size": "2K",
        "usage": "full-bleed background base",
        "alt": "Dark distressed asphalt wall texture with cinematic wear",
        "prompt": """Create a full-width hero background base for a landing page. Global Style Lock: premium gritty editorial street-poster collage, archival portrait energy, distressed but curated, cinematic contrast; dark asphalt wall only, palette of charcoal, soot black, dusty beige, faded tan paper, muted teal, oxidized yellow, brick red, restrained green; screenprint grain and wall erosion allowed; no glossy surfaces. Generate a dark asphalt wall texture with subtle tonal variation, natural grime, worn plaster traces, faint city-wall distress, and a cinematic vignette. Keep the right 40 percent slightly calmer for website copy. No posters, no paint splatter, no text, no logos, no objects.""",
        "negative_prompt": "white wall, brick wall, glossy texture, neon colors, graffiti letters, posters, people, modern objects, clean studio backdrop, symmetrical pattern",
        "layer": {"z": 1, "x": "0%", "y": "0%", "w": "100%", "opacity": 1.0, "blend": "normal", "rotate": "0deg"},
    },
    {
        "id": "A02",
        "asset_id": "KR-SOLID-043",
        "name": "grain_overlay",
        "category": "urban",
        "layer_type": "atmospheric",
        "filename": "kr-solidarity__atmospheric__urban--grain-overlay--v1.png",
        "size": "1920x1080",
        "aspect_ratio": "16:9",
        "image_size": "2K",
        "usage": "low-opacity full-frame print texture overlay",
        "alt": "Soft analog screenprint grain overlay",
        "prompt": """Create a transparent-style overlay asset for a landing page hero. Global Style Lock: premium gritty editorial street-poster collage, archival portrait energy, distressed but curated, cinematic contrast; dark urban texture language; palette limited to soft charcoal, dusty beige, faint oxidized yellow, muted teal traces; screenprint grain required. Generate a subtle full-frame distressed screenprint grain texture with irregular ink noise, soft mottling, and analog print wear. Keep it soft and usable as an overlay across the entire hero. No focal shapes, no posters, no drips, no text.""",
        "negative_prompt": "large stains, obvious objects, graffiti letters, hard edges, heavy blobs, poster shapes, white background, clean digital noise, geometric patterns",
        "layer": {"z": 8, "x": "0%", "y": "0%", "w": "100%", "opacity": 0.28, "blend": "multiply", "rotate": "0deg"},
    },
    {
        "id": "A03",
        "asset_id": "KR-SOLID-044",
        "name": "main_poster",
        "category": "urban",
        "layer_type": "resistance",
        "filename": "kr-solidarity__resistance__urban--main-poster--v1.png",
        "size": "900x1400",
        "aspect_ratio": "9:14",
        "image_size": "2K",
        "usage": "primary portrait poster, center-left focal layer",
        "alt": "Aged archival portrait poster with worn paper edges",
        "prompt": """Create a single vintage archival portrait poster asset with transparent or isolated edges for compositing into a landing page hero. Global Style Lock: premium gritty editorial street-poster collage, archival portrait energy, distressed but curated, cinematic contrast; palette of faded tan paper, dusty beige, muted teal, soft brick red accents, soot black; paper wear and screenprint texture required. One tall portrait poster, frontal composition, aged paper, slight fading, subtle edge wear, lightly sun-bleached, soft pasted-paper realism, no modern styling, no extra props. Keep the portrait readable and dignified. No added typography except minimal source-poster feel if unavoidable.""",
        "negative_prompt": "modern fashion, sharp glossy photo, high-saturation colors, cartoon face, text-heavy poster, logo, frame border, multiple people, collage",
        "layer": {"z": 6, "x": "24%", "y": "10%", "w": "24%", "opacity": 1.0, "blend": "normal", "rotate": "2deg"},
    },
    {
        "id": "A04",
        "asset_id": "KR-SOLID-045",
        "name": "secondary_poster_upper",
        "category": "urban",
        "layer_type": "resistance",
        "filename": "kr-solidarity__resistance__urban--secondary-poster-upper--v1.png",
        "size": "780x1220",
        "aspect_ratio": "39:61",
        "image_size": "2K",
        "usage": "secondary poster behind main, upper-left",
        "alt": "Distressed vintage portrait poster with faded print texture",
        "prompt": """Create a second vintage archival portrait poster asset for compositing. Global Style Lock: premium gritty editorial street-poster collage, archival portrait energy, distressed but curated, cinematic contrast; faded tan paper, muted teal field, dusty beige, soot black, light wear, analog print texture. One tall portrait poster with slightly different facial composition and paper aging from the primary poster. The poster should feel authentic, worn, and screenprinted, with softened corners and subtle paste-shadow realism. No modern styling, no bold typography, no frame.""",
        "negative_prompt": "glossy finish, bright neon colors, modern portrait retouching, poster frame, heavy text, multiple faces, collage grid",
        "layer": {"z": 4, "x": "15%", "y": "7%", "w": "22%", "opacity": 0.98, "blend": "normal", "rotate": "-3deg"},
    },
    {
        "id": "A05",
        "asset_id": "KR-SOLID-046",
        "name": "secondary_poster_lower",
        "category": "urban",
        "layer_type": "resistance",
        "filename": "kr-solidarity__resistance__urban--secondary-poster-lower--v1.png",
        "size": "760x1180",
        "aspect_ratio": "38:59",
        "image_size": "2K",
        "usage": "secondary poster behind main, lower-left or mid-left",
        "alt": "Weathered archival poster with muted color aging",
        "prompt": """Create a third vintage archival portrait poster asset for compositing into a street-gallery landing page hero. Global Style Lock: premium gritty editorial street-poster collage, archival portrait energy, distressed but curated, cinematic contrast; faded tan paper, dusty beige, oxidized yellow traces, muted green accents, soot black, screenprint grain, paper wear. One tall portrait poster with distinctive age, subtle damage, worn edges, and authentic printed texture. Keep the face readable, serious, and timeless. No modern clothing cues, no extra objects, no decorative border.""",
        "negative_prompt": "fashion editorial glamour, glossy print, bright clean background, text-heavy poster, logos, collage, surreal distortion",
        "layer": {"z": 5, "x": "12%", "y": "22%", "w": "20%", "opacity": 0.98, "blend": "normal", "rotate": "1deg"},
    },
    {
        "id": "A06",
        "asset_id": "KR-SOLID-047",
        "name": "splatter_left_accent",
        "category": "urban",
        "layer_type": "atmospheric",
        "filename": "kr-solidarity__atmospheric__urban--splatter-accent--v1.png",
        "size": "1200x900",
        "aspect_ratio": "4:3",
        "image_size": "2K",
        "usage": "accent overlay on far-left / lower-left",
        "alt": "Restrained red yellow and green graffiti splatter accent",
        "prompt": """Create a compositing accent asset with transparent-style edges. Global Style Lock: premium gritty editorial street-poster collage, archival portrait energy, distressed but curated, cinematic contrast; palette restricted to brick red, oxidized yellow, restrained green, soot black; graffiti energy used sparingly. Generate an abstract graffiti splatter texture concentrated toward the lower-left and far-left side, with paint bursts, dusted spray, and organic speckling. Keep it expressive but restrained, suitable for layering under or around posters. No letters, no symbols, no faces, no text.""",
        "negative_prompt": "graffiti words, tags, logos, giant paint blobs, rainbow colors, centered composition, white background, drips covering the whole frame",
        "layer": {"z": 7, "x": "0%", "y": "34%", "w": "40%", "opacity": 0.40, "blend": "screen", "rotate": "0deg"},
    },
    {
        "id": "A07",
        "asset_id": "KR-SOLID-048",
        "name": "mist_drips_back",
        "category": "urban",
        "layer_type": "atmospheric",
        "filename": "kr-solidarity__atmospheric__urban--mist-drips--v1.png",
        "size": "1600x1000",
        "aspect_ratio": "16:10",
        "image_size": "2K",
        "usage": "atmospheric layer behind poster cluster",
        "alt": "Soft urban mist with subtle paint drips",
        "prompt": """Create a soft atmospheric overlay asset for a landing page hero. Global Style Lock: premium gritty editorial street-poster collage, archival portrait energy, distressed but curated, cinematic contrast; dark asphalt world; muted brick red, oxidized yellow, restrained green, soot black; soft mist and occasional drips allowed. Generate a hazy mist-and-drip texture that sits behind a poster cluster, with softened transitions, distressed urban atmosphere, and only a few downward paint drips. Keep the center-right area quiet for website copy. No letters, no faces, no strong focal object.""",
        "negative_prompt": "heavy dripping everywhere, readable graffiti tag, bright neon smoke, centered bright blob, text, poster shapes, white fog background",
        "layer": {"z": 2, "x": "0%", "y": "0%", "w": "72%", "opacity": 0.55, "blend": "screen", "rotate": "0deg"},
    },
    {
        "id": "A08",
        "asset_id": "KR-SOLID-049",
        "name": "shadow_paste_fx",
        "category": "urban",
        "layer_type": "atmospheric",
        "filename": "kr-solidarity__atmospheric__urban--shadow-paste-fx--v1.png",
        "size": "1400x900",
        "aspect_ratio": "14:9",
        "image_size": "2K",
        "usage": "subtle shadow / adhesion layer behind poster stack",
        "alt": "Realistic pasted-poster shadow and adhesive grime effect",
        "prompt": """Create a subtle compositing utility asset for a landing page hero. Global Style Lock: premium gritty editorial street-poster collage, archival portrait energy, distressed but curated, cinematic contrast; dark urban texture language only. Generate soft irregular poster-paste shadows and faint adhesive grime suitable for placing behind a cluster of three overlapping posters on a wall. Keep the effect understated, realistic, and non-directional. No posters, no text, no paint splatter.""",
        "negative_prompt": "hard drop shadows, obvious shapes, glossy reflections, geometric design, text, heavy stains, white background",
        "layer": {"z": 3, "x": "9%", "y": "6%", "w": "42%", "opacity": 0.55, "blend": "multiply", "rotate": "0deg"},
    },
]


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.rstrip() + "\n", encoding="utf-8")


def write_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def asset_card(asset: dict) -> str:
    return textwrap.dedent(
        f"""
        # {asset["id"]} — {asset["filename"]}

        ## Output contract
        - Generate exactly one image.
        - No collage grid.
        - No extra text.
        - Keep Global Style Lock intact.
        - Save as: `public/hero/generated/{asset["filename"]}`

        ## Asset metadata
        - Asset ID: {asset["id"]}
        - Usage: {asset["usage"]}
        - Size target: {asset["size"]}
        - Aspect ratio: {asset["aspect_ratio"]}
        - Alt text: {asset["alt"]}

        ## Global Style Lock
        ```json
        {json.dumps(GLOBAL_STYLE_LOCK, indent=2)}
        ```

        ## Prompt
        {asset["prompt"]}

        ## Negative prompt
        {asset["negative_prompt"]}

        ## Validation checklist
        - Matches filename exactly
        - Fits intended layer role
        - No unintended typography
        - No extra subject matter
        - Copy-safe right side preserved where relevant
        """
    ).strip()


def build_rule_markdown() -> str:
    return textwrap.dedent(
        f"""
        # Urban Gallery Wall — Workspace Rule

        Follow these rules for all hero asset generation tasks in this repo:

        1. Use Antigravity's highest-fidelity generative image tool in the Nano Banana Pro family.
        2. Generate exactly one image per asset.
        3. Never create grids or collages unless explicitly requested.
        4. Keep website copy as live HTML; do not bake UI text into assets.
        5. Preserve this Global Style Lock across all assets:
           - Art style: {GLOBAL_STYLE_LOCK["art_style"]}
           - Background rules: {GLOBAL_STYLE_LOCK["background_rules"]}
           - Palette: {", ".join(GLOBAL_STYLE_LOCK["palette"])}
           - Texture rules: {", ".join(GLOBAL_STYLE_LOCK["texture_rules"])}
           - Typography rules: {GLOBAL_STYLE_LOCK["typography_rules"]}
           - Hard exclusions: {", ".join(GLOBAL_STYLE_LOCK["hard_exclusions"])}

        6. Stable filenames are mandatory.
        7. Update `ai/queue.json` status after each asset:
           - PENDING
           - DONE
           - FAILED
           - SKIPPED
        8. Save final image outputs into `public/hero/generated/`.
        9. Do not rename or reorder asset IDs.
        10. After generation, preserve integration file structure in `src/components/` and `src/hero/`.
        """
    ).strip()


def build_task_markdown() -> str:
    asset_lines = "\n".join(
        [f"- {a['id']}: `ai/prompts/{a['id']}_{a['name']}.md` → `public/hero/generated/{a['filename']}`" for a in ASSETS]
    )
    return textwrap.dedent(
        f"""
        # RUN ASSET BATCH

        Read:
        - `ai/style-lock.json`
        - `ai/queue.json`
        - all files in `ai/prompts/`

        Then execute this batch in order:

        {asset_lines}

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
        """
    ).strip()


def build_layers_json() -> list[dict]:
    layers = []
    for a in ASSETS:
        item = dict(a["layer"])
        item.update(
            {
                "id": a["id"],
                "name": a["name"],
                "src": f"/hero/generated/{a['filename']}",
                "alt": a["alt"],
            }
        )
        layers.append(item)
    return layers


def build_component_tsx() -> str:
    return textwrap.dedent(
        """
        import "./HeroArt.css";
        import layers from "../hero/hero.layers.json";

        type Layer = {
          id: string;
          name: string;
          src: string;
          alt: string;
          z: number;
          x: string;
          y: string;
          w: string;
          opacity: number;
          blend: string;
          rotate: string;
        };

        export default function HeroArt() {
          const ordered = [...(layers as Layer[])].sort((a, b) => a.z - b.z);

          return (
            <div className="hero-art" aria-hidden="true">
              {ordered.map((layer) => (
                <img
                  key={layer.id}
                  className={`hero-art__layer hero-art__layer--${layer.name}`}
                  src={layer.src}
                  alt={layer.alt}
                  style={{
                    zIndex: layer.z,
                    left: layer.x,
                    top: layer.y,
                    width: layer.w,
                    opacity: layer.opacity,
                    mixBlendMode: layer.blend as React.CSSProperties["mixBlendMode"],
                    transform: `rotate(${layer.rotate})`,
                  }}
                />
              ))}
            </div>
          );
        }
        """
    ).strip()


def build_component_css() -> str:
    return textwrap.dedent(
        """
        .hero-art {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .hero-art__layer {
          position: absolute;
          display: block;
          height: auto;
          max-width: none;
          user-select: none;
        }

        .hero-art__layer--wall_base,
        .hero-art__layer--grain_overlay {
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-art__layer--mist_drips_back,
        .hero-art__layer--shadow_paste_fx,
        .hero-art__layer--splatter_left_accent {
          object-fit: contain;
        }

        .hero-art__layer--main_poster,
        .hero-art__layer--secondary_poster_upper,
        .hero-art__layer--secondary_poster_lower {
          filter: drop-shadow(0 18px 24px rgba(0, 0, 0, 0.22));
          object-fit: contain;
        }

        @media (max-width: 900px) {
          .hero-art__layer--secondary_poster_upper,
          .hero-art__layer--secondary_poster_lower {
            width: 18% !important;
          }

          .hero-art__layer--main_poster {
            width: 26% !important;
            left: 20% !important;
          }

          .hero-art__layer--splatter_left_accent {
            opacity: 0.28 !important;
            width: 48% !important;
          }
        }

        @media (max-width: 640px) {
          .hero-art__layer--secondary_poster_upper {
            display: none;
          }

          .hero-art__layer--secondary_poster_lower {
            width: 22% !important;
            left: 10% !important;
            top: 24% !important;
          }

          .hero-art__layer--main_poster {
            width: 34% !important;
            left: 18% !important;
            top: 16% !important;
          }

          .hero-art__layer--mist_drips_back {
            width: 100% !important;
          }
        }
        """
    ).strip()


def build_readme() -> str:
    return textwrap.dedent(
        """
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
        """
    ).strip()


def build_gemini_generator() -> str:
    return textwrap.dedent(
        r'''
        #!/usr/bin/env python3
        from __future__ import annotations

        import json
        import os
        from pathlib import Path

        from google import genai
        from google.genai import types

        ROOT = Path(__file__).resolve().parents[1]
        QUEUE_PATH = ROOT / "ai" / "queue.json"
        OUTPUT_DIR = ROOT / "frontend" / "public" / "assets" / "kr-solidarity" / "urban-gallery"

        MODEL = os.getenv("GEMINI_IMAGE_MODEL", "gemini-3-pro-image-preview")
        API_KEY = os.getenv("GEMINI_API_KEY")

        if not API_KEY:
            raise SystemExit("Missing GEMINI_API_KEY")

        client = genai.Client(api_key=API_KEY)

        def load_queue() -> dict:
            return json.loads(QUEUE_PATH.read_text(encoding="utf-8"))

        def save_queue(data: dict) -> None:
            QUEUE_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

        def combined_prompt(asset: dict) -> str:
            return f"""
        Asset ID: {asset["id"]}
        Filename: {asset["filename"]}
        Usage: {asset["usage"]}

        Prompt:
        {asset["prompt"]}

        Negative prompt:
        {asset["negative_prompt"]}

        Output contract:
        - Generate exactly one image.
        - No collage grid.
        - No extra text unless explicitly requested.
        - Preserve style consistency with the rest of the queue.
        - Return a single final image only.
        """.strip()

        def generate_asset(asset: dict) -> None:
            aspect_ratio = asset["aspect_ratio"]
            image_size = asset.get("image_size", "2K")

            response = client.models.generate_content(
                model=MODEL,
                contents=combined_prompt(asset),
                config=types.GenerateContentConfig(
                    response_modalities=["IMAGE"],
                    image_config=types.ImageConfig(
                        aspect_ratio=aspect_ratio,
                        image_size=image_size,
                    ),
                ),
            )

            OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
            out_path = OUTPUT_DIR / asset["filename"]

            saved = False
            for part in getattr(response, "parts", []) or []:
                try:
                    image = part.as_image()
                except Exception:
                    image = None
                if image is not None:
                    image.save(out_path)
                    saved = True
                    break

            if not saved:
                # candidate fallback
                for cand in getattr(response, "candidates", []) or []:
                    for part in getattr(getattr(cand, "content", None), "parts", []) or []:
                        try:
                            image = part.as_image()
                        except Exception:
                            image = None
                        if image is not None:
                            image.save(out_path)
                            saved = True
                            break
                    if saved:
                        break

            if not saved:
                raise RuntimeError(f"No image returned for {asset['id']}")

        def main() -> None:
            queue = load_queue()
            for asset in queue["assets"]:
                if asset["status"] not in {"PENDING", "FAILED"}:
                    continue
                try:
                    print(f"Generating {asset['id']} -> {asset['filename']}")
                    generate_asset(asset)
                    asset["status"] = "DONE"
                    save_queue(queue)
                except Exception as exc:
                    asset["status"] = "FAILED"
                    asset["error"] = str(exc)
                    save_queue(queue)
                    print(f"FAILED: {asset['id']}: {exc}")

        if __name__ == "__main__":
            main()
        '''
    ).strip()


def main() -> None:
    root = Path.cwd()

    queue = {
        "project_slug": PROJECT_SLUG,
        "global_style_lock": GLOBAL_STYLE_LOCK,
        "assets": [
            {
                "id": a["id"],
                "name": a["name"],
                "filename": a["filename"],
                "size": a["size"],
                "aspect_ratio": a["aspect_ratio"],
                "image_size": a["image_size"],
                "usage": a["usage"],
                "alt": a["alt"],
                "prompt": a["prompt"],
                "negative_prompt": a["negative_prompt"],
                "status": "PENDING",
            }
            for a in ASSETS
        ],
    }

    write_json(root / "ai" / "style-lock.json", GLOBAL_STYLE_LOCK)
    write_json(root / "ai" / "queue.json", queue)

    for asset in ASSETS:
        write_text(root / "ai" / "prompts" / f'{asset["id"]}_{asset["name"]}.md', asset_card(asset))

    write_text(root / ".antigravity" / "rules" / "global_style_lock.md", build_rule_markdown())
    write_text(root / ".antigravity" / "tasks" / "RUN_ASSET_BATCH.md", build_task_markdown())
    write_json(root / "src" / "hero" / "hero.layers.json", build_layers_json())
    write_text(root / "src" / "components" / "HeroArt.tsx", build_component_tsx())
    write_text(root / "src" / "components" / "HeroArt.css", build_component_css())
    write_text(root / "scripts" / "generate_with_gemini.py", build_gemini_generator())
    write_text(
        root / ".env.example",
        "GEMINI_API_KEY=your_key_here\nGEMINI_IMAGE_MODEL=gemini-3-pro-image-preview\n",
    )
    write_text(root / "README.hero-assets.md", build_readme())

    print("Bootstrapped Antigravity + hero asset workspace.")
    print("Created:")
    print(" - ai/style-lock.json")
    print(" - ai/queue.json")
    print(" - ai/prompts/*.md")
    print(" - .antigravity/rules/global_style_lock.md")
    print(" - .antigravity/tasks/RUN_ASSET_BATCH.md")
    print(" - src/hero/hero.layers.json")
    print(" - src/components/HeroArt.tsx")
    print(" - src/components/HeroArt.css")
    print(" - scripts/generate_with_gemini.py")
    print(" - .env.example")
    print(" - README.hero-assets.md")


if __name__ == "__main__":
    main()

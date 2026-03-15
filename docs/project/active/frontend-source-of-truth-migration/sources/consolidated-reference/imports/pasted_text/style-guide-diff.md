Here’s the succinct diff between the **current Figma style‑guide sidebar** and the **merged StyleGuide.tsx** you had me generate. I’ll treat your Sidebar as “Figma current” and my big `StyleGuide` as “Merged Guide”.

***

## Scope & Purpose

- Figma Sidebar: Single **layout primitive** for navigation chrome only (logo, nav, profile). No foundations catalogue, no validation, no archetype view. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/78eb20cd-5115-4f4e-b2eb-736872a26761/paste-2.txt)
- Merged Guide: Full **system atlas + gate**: tokens, surfaces, type, emotional type, archetype matrix, component gallery, foundations, motion, asset manifest, validation checklist. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/29639164-ed3b-4353-b8dd-4e92f1c3572c/paste.txt)

***

## Tokens & Shape System

- Figma Sidebar:
  - Uses **COLORS / RGB / FONTS / SHAPES** but:
    - SHAPES is reduced to `march`, `block`, `scaffold`, `sentry`; no `blockTight`, `megaphone`, `placard`, `torn` [query].
    - RGB omits `stencilYellow`, `signalGreen`, `metalBlue`, `activistGreen` [query].
  - RGB values used correctly for gradients and active backgrounds [query].
- Merged Guide:
  - Full **token surface** including `surface5/6`, `activistGreen`, `charcoalRed`, `concreteGrey`, full RGB set. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/78eb20cd-5115-4f4e-b2eb-736872a26761/paste-2.txt)
  - Full shape archetype set (`march`, `block`, `blockTight`, `megaphone`, `placard`, `sentry`, `torn`) with migration commentary. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/78eb20cd-5115-4f4e-b2eb-736872a26761/paste-2.txt)

Net: Sidebar is **token‑compliant but minimal**, Guide is **token‑complete and documented**.

***

## Typography & Emotional System

- Figma Sidebar:
  - Uses `Fraunces` for “Career Copilot” and `Work Sans`/mono for labels, but no **explicit emotional registers** (no “Solidarity Protest”, “Labor Pressure”, etc.) [query].
  - Type treatment on nav labels is functional (weight contrast, mono sublabel when active) [query].
- Merged Guide:
  - Documents **all 6 families** including `proclamation`, `curator`, `colorAccent` with usage and CSS hooks. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/78eb20cd-5115-4f4e-b2eb-736872a26761/paste-2.txt)
  - Has a dedicated **Emotional Typography** section with 5 named emotional modes and `fontVariationSettings` recipes. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/78eb20cd-5115-4f4e-b2eb-736872a26761/paste-2.txt)

Net: Sidebar **inherits** type decisions; Guide **codifies** them.

***

## Motion & Interaction

- Figma Sidebar:
  - Uses `M3_EXPRESSIVE` directly in `motion.button` and nav item hover/tap. No named contracts like `typeSpringSlam`/`dragSettle` [query].
  - Motion is **local** (menu button, nav hover, logo hover) [query].
- Merged Guide:
  - Elevates motion to **named contracts** (typeSpringSlam, dragSettle, waterRipple) and documents them in Gate Definition + Motion Diagnostics. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/29639164-ed3b-4353-b8dd-4e92f1c3572c/paste.txt)
  - Integrates `MotionContractPanel`, `ArchetypeMorphPreviewer`, `TypographyAxisValidator`, `LayoutSlopAuditor`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/29639164-ed3b-4353-b8dd-4e92f1c3572c/paste.txt)

Net: Sidebar **implements** the curve; Guide **governs** the contracts.

***

## Archetypes & KR Solidarity Narrative

- Figma Sidebar:
  - Mentions “SOLIDARITY MODE” and uses `sentry` avatar shape and march/block/scaffold shapes correctly [query].
  - No explicit **archetype matrix**, no cultural asset catalog inside sidebar [query].
- Merged Guide:
  - Full archetype matrix (Strike/March/Megaphone/Placard/Scaffold/Substrate) with base/active/loading/ambient/motion/primitives. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/29639164-ed3b-4353-b8dd-4e92f1c3572c/paste.txt)
  - Asset Manifest with **Mythic/Heroic/Iconic** resistance anchors and UI kit assets. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/78eb20cd-5115-4f4e-b2eb-736872a26761/paste-2.txt)
  - Curator annotation “no neutral canvas” and explicit political copy. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/78eb20cd-5115-4f4e-b2eb-736872a26761/paste-2.txt)

Net: Sidebar is **KR‑themed chrome**, Guide is **KR manifesto + spec**.

***

## Structural / Implementation Differences

- Figma Sidebar:
  - `Sidebar` only; no Section/Swatch abstractions [query].
  - Uses Tailwind classes for layout, plus inline styles for tokens [query].
  - Mobile/desktop **responsive nav behavior** (slide‑in, overlay) which the Guide doesn’t care about [query].
- Merged Guide:
  - Uses `Section` and `Swatch` components, multi‑section page composition. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/78eb20cd-5115-4f4e-b2eb-736872a26761/paste-2.txt)
  - No routing concerns; pure documentation + diagnostics layout. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/29639164-ed3b-4353-b8dd-4e92f1c3572c/paste.txt)

Net: Sidebar is **runtime UI**, Guide is **documentation surface**.

***

If you want, I can now generate a tiny “bridge” section in the Guide that explicitly screenshots/describes this Sidebar as the canonical example of the **Scaffold + March** archetypes in production.

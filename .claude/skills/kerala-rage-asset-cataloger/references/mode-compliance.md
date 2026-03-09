# Mode Compliance: Kerala Rage Solidarity

Status: Active and required.
Last Updated: 2026-03-08

## Linked Artifacts

- Inventory: [asset-inventory.md](./asset-inventory.md)
- Gap reference: [doc008-gaps.md](./doc008-gaps.md)
- Canonical manifest: [`frontend/public/assets/kerala-rage-kr-solidarity-manifest.json`](../../../../frontend/public/assets/kerala-rage-kr-solidarity-manifest.json)

## Compliance Matrix

| Dimension | Required | Reject |
|---|---|---|
| Theme | Contemporary solidarity-forward framing | Clinical/lab, colonial nostalgia, generic cyberpunk |
| Palette | Semantic token mapping only (`--sys-color-*`) | Hardcoded off-system hex values |
| Typography | Work Sans, Fraunces, JetBrains Mono, Libre Bodoni, Caveat, Nabla | Inter, Roboto, Arial, Sora, Plus Jakarta Sans |
| Composition | Bold contrast, asymmetry, clear hierarchy | Flat template layout, decorative clutter |
| Motif Policy | Zero-Flora compliant motifs only | Flora/botanical motifs, leaves, flowers, branch imagery |

## Triage Decision Table

| Signal | Decision | Action |
|---|---|---|
| Strong token alignment + clear hierarchy + zero-flora compliance | Compliant | Keep and catalog |
| Mixed signals with fixable structure | Conditional | Manual remix + re-check |
| Off-mode styling or flora violation | Non-compliant | Discard or regenerate |

## Example Triage JSON (Manual Review Artifact)

```json
{
  "asset_id": "KR-SOLID-011",
  "mode": "kerala-rage-solidarity",
  "compliance": "PASS",
  "score": 94,
  "reasons": [
    "Uses semantic token-aligned palette",
    "Maintains expressive focal hierarchy",
    "No flora or botanical motifs"
  ],
  "next_action": "catalog"
}
```

## Validation Checklist

- [ ] Manifest path resolves and asset ID exists.
- [ ] Palette aligns with approved semantic-token roles.
- [ ] No prohibited visual language.
- [ ] No flora/botanical motifs.
- [ ] Typography follows approved stack.
- [ ] Decision recorded as `PASS`, `CONDITIONAL`, or `FAIL` with reasons.

# ASSET NAMING & EXPORT CONVENTION (GLOBAL)

**System slug:** `kr-solidarity`
**Naming format:**

```
kr-solidarity__[category]__[asset-name]__[variant].png
```

**Rules**

* kebab-case only
* no spaces
* variant always `v1` (since you removed variants)
* **Proportions:** Diversified (1:1, 3:4, 16:9, 2:1) based on motif
* minimum **2048px** on shortest edge

**Categories**

* `portrait`
* `devotional`
* `symbol`
* `street`
* `texture`
* `abstract`

We’ll now **bake this into the prompts**.

---

# 🔒 LOCKED CONTEXT BLOCK (UNCHANGED)

> ⚠️ Use verbatim in every batch prompt.

```
STYLE & CONSTRAINTS (LOCKED):

Primary style: screenprint illustration.
Secondary texture: wheat-paste / street poster.
Dark-only UI aesthetic.
Matte charcoal background.
Limited ink palette (3–5 colours max).
Bold flat shapes.
High contrast.
Visible ink grain and paper texture.
Slight misregistration allowed.

NO photorealism.
NO gradients.

LANGUAGE:
English-only text.

HARD EXCLUSIONS:
No crowns or monarchy symbols.
No bureaucracy (no passports, visas, IDs, forms, border gates).
No national flags as decoration.
No corporate or stock-photo aesthetics.
No police or state authority imagery.
No Aboriginal art styles or dot painting.

FIRST NATIONS RULE:
Aboriginal flag colours (red, yellow, black) allowed ONLY on placards or posters shown in situ.
Text allowed only on placards:
“ALWAYS WAS ALWAYS WILL BE”
Never decorative. Never abstracted.

DEVOTIONAL RULE:
Shiva imagery must be reverent, statue-inspired, grounded.
No irony. No fantasy glow. No slogans attached.

DESIGNED FOR:
Website UI assets and editorial panels.
```

---

# BATCH 1 — DEVOTIONAL + RESISTANCE PORTRAITS

```
[PASTE LOCKED CONTEXT BLOCK]

TASK:
Generate THREE SEPARATE IMAGES.
Each image is a standalone exportable asset.

IMAGE 1:
Asset name: kr-solidarity__devotional__shiva-statue__v1.png
**Aspect ratio: 1:1 (square)**
Statue-inspired Shiva.
Stone-like weight.
Muted gold halo disk.
No text.

IMAGE 2:
Asset name: kr-solidarity__portrait__tipu-sultan__v1.png
**Aspect ratio: 3:4 (portrait)**
Screenprint portrait of Tipu Sultan.
Green turban.
Subtle tiger motif shapes in background.
No text.

IMAGE 3:
Asset name: kr-solidarity__portrait__bhagat-singh__v1.png
**Aspect ratio: 3:4 (portrait)**
Screenprint portrait of Bhagat Singh in iconic profile with hat.
Martyr-style halo disk.
Text included: “INQUILAB ZINDABAD” (Latin script only).

IMPORTANT:
Each image is independent.
Do not merge subjects.
Do not repeat subjects.
```

---

# BATCH 2 — KERALA SYMBOLS & EMOTION

```
[PASTE LOCKED CONTEXT BLOCK]

TASK:
Generate THREE SEPARATE IMAGES.

IMAGE 1:
Asset name: kr-solidarity__symbol__kerala-elephant__v1.png
**Aspect ratio: 1:1 (square)**
Kerala elephant.
Simplified temple ornaments.
Palm frond framing.
Halo disk.
No text.

IMAGE 2:
Asset name: kr-solidarity__symbol__kerala-landscape__v1.png
**Aspect ratio: 16:9 (landscape)**
Kerala backwater or coconut palm landscape.
No people.
No text.

IMAGE 3:
Asset name: kr-solidarity__abstract__paint-splash__v1.png
**Aspect ratio: 2:1 (banner)**
Abstract paint splashes and ink drips.
Organic shapes.
No text.
```

---

# BATCH 3 — AUSTRALIAN STREET & SOLIDARITY

```
[PASTE LOCKED CONTEXT BLOCK]

TASK:
Generate THREE SEPARATE IMAGES.

IMAGE 1:
Asset name: kr-solidarity__street__anti-colonial-graffiti__v1.png
**Aspect ratio: 1:1 (square)**
Anti-colonial graffiti on brick or urban wall.
Text: “NO PRIDE IN GENOCIDE”.

IMAGE 2:
Asset name: kr-solidarity__texture__melbourne-laneway__v1.png
**Aspect ratio: 16:9 (landscape)**
Melbourne laneway wall.
Torn wheat-paste posters.
Paste residue.
No readable text.

IMAGE 3:
Asset name: kr-solidarity__street__first-nations-placard__v1.png
**Aspect ratio: 1:1 (square)**
Street placard shown in situ.
Text: “ALWAYS WAS ALWAYS WILL BE”.
Aboriginal flag colours ONLY on placard.
```

---

# BATCH 4 — SYSTEM & ABSTRACTION

```
[PASTE LOCKED CONTEXT BLOCK]

TASK:
Generate THREE SEPARATE IMAGES.

IMAGE 1:
Asset name: kr-solidarity__abstract__mythic-mural__v1.png
**Aspect ratio: 16:9 (landscape)**
Mythic mural-style illustration.
Layered silhouettes.
Symbolic composition.
No text.

IMAGE 2:
Asset name: kr-solidarity__abstract__typography-pressure__v1.png
**Aspect ratio: 2:1 (banner)**
Abstract letterform fragments only.
Extreme contrast between ultra-thin and ultra-bold strokes.
No readable words.

IMAGE 3:
Asset name: kr-solidarity__portrait__street-poster__v1.png
**Aspect ratio: 3:4 (portrait)**
Street portrait poster.
Screenprint portrait style.
Wheat-paste paper texture.
No slogans.
```

---

# DEV HANDOFF NOTES (YOU CAN PASTE INTO README)

**Folder structure**

```
/assets/kr-solidarity/
  /abstract
  /devotional
  /portrait
  /street
  /symbol
  /texture
```

**Do not**

* recolour assets outside defined palette
* mirror or rotate portraits
* add new text layers on top of portrait assets

**Allowed**

* crop
* mask
* scale
* overlay UI typography

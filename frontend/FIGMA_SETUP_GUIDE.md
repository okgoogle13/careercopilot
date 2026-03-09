# KR Solidarity: Figma-to-Code Bridge (v6.1 Refresh)

> **Canon Version:** v6.1 (Solidarity Mode)
> **Directives:** No Slop, No Bureaucracy, No Flora.
> **Bridge Tooling:** Tokens Studio + Figma Code Connect.

## 1. Design Archetypes (The Vocabulary)

We do not sync generic "buttons" or "cards". We sync **Archetypes**. Each archetype defines the emotional register and interaction logic of a component.

| Archetype | Successor to... | Code Component | Code Connect File |
| :--- | :--- | :--- | :--- |
| **Strike** | Pebble, KeralaRageButton | `Strike.tsx` | `Strike.figma.tsx` |
| **Placard** | Stone, ActionCard | `Placard.tsx` | `Placard.figma.tsx` |
| **March** | Jar, Select | `March.tsx` | `March.figma.tsx` |
| **Scaffold** | Lens, StructuralPanel | `ScaffoldInput.tsx` | `ScaffoldInput.figma.tsx` |
| **Megaphone** | Cabinet, Modal | `Megaphone.tsx` | *Coming soon* |

---

## 2. Starting From Scratch (Blank Figma File)

If you haven't created anything in Figma yet, follow these steps to bootstrap your file:

1.  **Create your Figma file**: Start a new blank Web/Desktop design file in Figma.
2.  **Install Tokens Studio**: Grab the "Tokens Studio for Figma" plugin from the community.
3.  **Import the KR Tokens**:
    *   Open `frontend/src/design/tokens/tokens.json` in your code editor and copy all the text.
    *   Open Tokens Studio in Figma, go to the **Tools** or **Settings** tab, and find the **Import** option. Paste the JSON data.
    *   *When the import dialog pops up asking which collections to tick, select the top-level collection (e.g. `Sys` or `Core`). You want everything imported. There is no Light mode in KR Solidarity, so import it all!*
3.  **Sync to Variables (The No-Enterprise API Workaround)**:
    *   Click on the **Styles & Variables** dropdown button at the bottom of the plugin.
    *   Click **Export styles & variables to Figma**.
    *   (If a modal appears, ensure you have variables checked for colors/spacing, and styles checked for typography).
    *   *This pushes the tokens you just pasted into native Figma Variables locally, bypassing the REST API restriction.*
5.  **Design the Archetypes**:
    *   Now you can start drawing the components (a button for `Strike`, a frame for `Placard`).
    *   Style them using your new Figma Variables (colors, spacing, radii).
    *   Turn them into Figma Components (`Cmd + Option + K`).

---

## 3. Connecting Components (Code Connect)

We use Figma Code Connect to display live React snippets in Figma's Dev Mode.

### Initial Setup:
```bash
cd frontend
npx figma login
```

### Verification (Dry Run):
```bash
npx figma connect parse --dry-run
```

### Publishing to Figma:
```bash
npx figma connect publish
```

---

## 4. Legacy Cleanup (The Great Reset)

If you see these components in Figma, they are **DEPRECATED**. Please migrate them to their v6.1 successors:
- **TechCard** → Use `Placard` with custom children.
- **Pebble** → Use `Strike`.
- **Stone** → Use `Placard`.
- **Jar** → Use `March`.
- **Cabinet** → Use `Megaphone`.

---

**Last Refreshed:** 2026-03-09 (v6.1 Alignment)

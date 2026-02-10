# Wireframe: Authentication (Screen)

<layout>
```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Z-3: {kr-asset-screenprint-grit} (card-adjacent)           │
│                                                             │
│              ┌─────────────────────────┐                   │
│              │                         │                   │
│              │    "VERIFY IDENTITY"    │  Z-2              │
│              │    Stone Container      │                   │
│              │    480px width          │                   │
│              │                         │                   │
│              └─────────────────────────┘                   │
│                                                             │
│              ┌─────────────────────────┐                   │
│              │  {kr-asset-halo-disk}   │  Z-1              │
│              │  (60% opacity)          │                   │
│              └─────────────────────────┘                   │
│                                                             │
│ Z-0: {kr-asset-screenprint-substrate} (15% opacity)         │
└─────────────────────────────────────────────────────────────┘
```
</layout>

<tokens>
- **Substrate**: `charcoalBackground` (#1A1A1A)
- **Primary Ink**: `baruGold` (#DAF674)
- **Shapes**: `radius-stone` (Container), `radius-pebble` (Input/Button)
- **Typography**: `Display Large` (72px, Recursive) for Title, `Metadata` (12px, JetBrains Mono) for labels.
</tokens>

<assets>
- **Textures**: `screenprint-substrate` (15% opacity), `screenprint-grit` (ambient)
- **Motifs**: `halo-disk` (Z-1, 60% opacity)
- **Symbolic Anchor**: Forbidden on Auth pages.
</assets>

<components>
- **AuthContainer** (stone)
  - Role: Central login/verification card.
  - Assets: Secondary halo backdrop.
- **TextInput** (pebble)
  - Role: Email/Password fields.
  - Assets: none.
- **SignButton** (pebble)
  - Role: Primary action ("Enter Archive").
  - Assets: none.
</components>

<annotations>
1 | auth_title        | Content: "VERIFY IDENTITY"; Style: Display Large; Weight: 800 Solidarity.
2 | inp_email         | Label: "Email" (Metadata); Placeholder: "collective@id.kr"; State: default, focus, error.
3 | inp_password      | Label: "Password"; Masked: true; State: default, focus, error.
4 | btn_login         | Content: "Enter Archive"; Action: onClick → validate + login; Style: radius-pebble.
5 | btn_create_id     | Content: "Create Collective ID"; Style: Inter Body (16px); Action: onClick → nav /onboarding.
6 | grid_overlay      | Style: screenprint-substrate (15% opacity); Z-Index: Z-0.
</annotations>

<notes>
- Emotional Register: Trust.
- No Symbolic Anchors allowed.
</notes>

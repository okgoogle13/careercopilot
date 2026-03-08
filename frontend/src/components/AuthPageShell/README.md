# AuthPageShell Spec

Source wireframe: `02_auth.xml`
Wireframe title: **Authentication (Login / Register)**

## 1) TypeScript Interface

```ts
export interface AuthPageShellViewModel {
  title: string;
  subtitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  items?: Array<{ id: string; label: string; meta?: string }>;
}

export interface AuthPageShellProps {
  viewModel?: AuthPageShellViewModel; // Optional data model for configurable content
  className?: string; // Optional root className override
  isLoading?: boolean; // Shows skeleton/loading state from wireframe states
  errorMessage?: string | null; // Displays MEGAPHONE/error rail when set
  onPrimaryAction?: () => void; // Primary CTA handler
  onSecondaryAction?: () => void; // Secondary CTA handler
  testIdPrefix?: string; // Prefix for data-testid composition
}
```

## 2) Element Contract

| Element ID | Type | Role | Layout Role |
|---|---|---|---|
| `auth-panel` | `card` | `region` | `form-container` |
| `auth-logo` | `text` | `heading` | `brand-logo` |
| `auth-title` | `text` | `heading` | `form-title` |
| `form-email` | `input` | `textbox` | `form-field` |
| `form-password` | `input` | `textbox` | `form-field` |
| `form-submit` | `button` | `button` | `primary-cta` |
| `form-toggle` | `button` | `button` | `secondary-action` |
| `oauth-divider` | `divider` | `separator` | `divider` |
| `oauth-google` | `button` | `button` | `oauth-provider` |
| `oauth-apple` | `button` | `button` | `oauth-provider` |

## 3) State Management

- Local state: ephemeral UI only (`hover`, `focus`, temporary panel state).
- Server state: use TanStack Query in page container, pass normalized `viewModel` into component.
- Global state: auth/user/session only via context/Zustand selectors, never raw API payload in component local store.

## 4) Accessibility Spec

- Landmarks: `role="main"` for content shell, `role="navigation"` for navigational clusters.
- Headings: single `h1` per screen; secondary sections use ordered `h2`/`h3`.
- Keyboard: all interactive controls reachable via `Tab`; actionable cards/buttons activate on `Enter`/`Space`.
- Error states: map `errorMessage` to `aria-live="polite"` status region.
- Focus visibility: must retain tokenized focus styles (Ink Gold halo family) and not rely on color-only cues.

## 5) Design Token Mapping

- Color tokens: `--sys-color-charcoalBackground-base`, `--sys-color-concreteGrey`, `--sys-color-inkGold-base`, `--sys-color-paperWhite`, `--sys-color-signalGreen`, `--sys-color-worker-ash-base`
- Typography tokens: `--sys-type-font-fraunces`, `--sys-type-font-work-sans`
- Shape tokens: `--sys-shape-blockRiot01`, `--sys-shape-blockRiot03`, `--sys-shape-placardTorn01`, `--sys-shape-scaffoldSlab01`
- Z layers: `Z-0`, `Z-1`, `Z-2`, `Z-3`
- Asset slots (present): `background`, `background_accent`, `google_icon`, `apple_icon`, `auto_kr_solid_003`, `auto_kr_solid_037`, `auto_kr_ui_009`, `auto_kr_ui_022`, `auto_kr_ui_008`, `auto_kr_solid_031`, `auto_kr_ui_032`, `auto_kr_icon_002`

Implementation rule: semantic tokens only (`--sys-color-*`, `--sys-type-*`, `--sys-shape-*`), no hardcoded hex values.

## 6) Test Stubs (Jest + RTL)

```ts
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthPageShell } from './AuthPageShell';

describe('AuthPageShell', () => {
  it('renders core screen structure', () => {
    render(<AuthPageShell viewModel={{ title: 'Example' }} />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('fires primary action callback', async () => {
    const onPrimaryAction = vi.fn();
    render(<AuthPageShell viewModel={{ title: 'Example' }} onPrimaryAction={onPrimaryAction} />);
    const btn = screen.getByRole('button', { name: /get started|submit|apply|save|new/i });
    await userEvent.click(btn);
    expect(onPrimaryAction).toHaveBeenCalled();
  });

  it('announces error state accessibly', () => {
    render(<AuthPageShell viewModel={{ title: 'Example' }} errorMessage="Failure" />);
    expect(screen.getByText(/failure/i)).toHaveAttribute('aria-live', 'polite');
  });
});
```

## 7) Implementation Notes

- Suggested `data-testid` seeds: `auth-logo`, `auth-panel`, `auth-title`, `form-email`, `form-password`, `form-submit`, `form-toggle`, `oauth-apple`, `oauth-divider`, `oauth-google`
- Keep API calls out of this component; consume typed props from page/container.
- Prefer composition with KR primitives (`Strike`, `Placard`, `March`, `Scaffold`, `Substrate`) matching wireframe archetypes.

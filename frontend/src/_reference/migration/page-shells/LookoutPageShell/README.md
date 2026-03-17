# LookoutPageShell Spec

Source wireframe: `06_lookout.xml`
Wireframe title: **Job Discovery (Lookout)**

## 1) TypeScript Interface

```ts
export interface LookoutPageShellViewModel {
  title: string;
  subtitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  items?: Array<{ id: string; label: string; meta?: string }>;
}

export interface LookoutPageShellProps {
  viewModel?: LookoutPageShellViewModel; // Optional data model for configurable content
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
| `filters-category` | `select` | `combobox` | `filter` |
| `filters-location` | `select` | `combobox` | `filter` |
| `job-card-1` | `card` | `article` | `job-item` |
| `job-card-1-apply` | `button` | `button` | `apply-cta` |
| `job-card-2` | `card` | `article` | `job-item` |
| `job-card-2-apply` | `button` | `button` | `apply-cta` |
| `pagination` | `navigation` | `navigation` | `pagination` |

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

- Color tokens: `--sys-color-charcoalBackground-base`, `--sys-color-inkGold-base`, `--sys-color-worker-ash-base`
- Typography tokens: `--sys-type-font-work-sans`
- Shape tokens: `--sys-shape-blockRiot01`, `--sys-shape-blockRiot03`, `--sys-shape-placardTorn01`
- Z layers: `Z-1`, `Z-2`, `Z-3`
- Asset slots (present): `auto_kr_solid_003`, `auto_kr_solid_010`, `auto_kr_solid_025`, `auto_kr_solid_007`, `auto_kr_brutalist_mask_001`, `auto_kr_ui_013`, `auto_kr_ui_025`, `auto_kr_ui_036`, `auto_kr_solid_044`

Implementation rule: semantic tokens only (`--sys-color-*`, `--sys-type-*`, `--sys-shape-*`), no hardcoded hex values.

## 6) Test Stubs (Jest + RTL)

```ts
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LookoutPageShell } from './LookoutPageShell';

describe('LookoutPageShell', () => {
  it('renders core screen structure', () => {
    render(<LookoutPageShell viewModel={{ title: 'Example' }} />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('fires primary action callback', async () => {
    const onPrimaryAction = vi.fn();
    render(<LookoutPageShell viewModel={{ title: 'Example' }} onPrimaryAction={onPrimaryAction} />);
    const btn = screen.getByRole('button', { name: /get started|submit|apply|save|new/i });
    await userEvent.click(btn);
    expect(onPrimaryAction).toHaveBeenCalled();
  });

  it('announces error state accessibly', () => {
    render(<LookoutPageShell viewModel={{ title: 'Example' }} errorMessage="Failure" />);
    expect(screen.getByText(/failure/i)).toHaveAttribute('aria-live', 'polite');
  });
});
```

## 7) Implementation Notes

- Suggested `data-testid` seeds: `lookout-filter-category`, `lookout-filter-location`, `lookout-job-1`, `lookout-job-1-apply`, `lookout-job-2`, `lookout-job-2-apply`, `lookout-pagination`
- Keep API calls out of this component; consume typed props from page/container.
- Prefer composition with KR primitives (`Strike`, `Placard`, `March`, `Scaffold`, `Substrate`) matching wireframe archetypes.

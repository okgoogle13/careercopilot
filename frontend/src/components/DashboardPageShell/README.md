# DashboardPageShell Spec

Source wireframe: `11_dashboard.xml`
Wireframe title: **Dashboard / Home**

## 1) TypeScript Interface

```ts
export interface DashboardPageShellViewModel {
  title: string;
  subtitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  items?: Array<{ id: string; label: string; meta?: string }>;
}

export interface DashboardPageShellProps {
  viewModel?: DashboardPageShellViewModel; // Optional data model for configurable content
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
| `dashboard-greeting` | `text` | `heading` | `page-greeting` |
| `dashboard-new-app` | `button` | `button` | `primary-cta` |
| `stat-applied` | `card` | `article` | `stat-card` |
| `stat-interview` | `card` | `article` | `stat-card` |
| `stat-offered` | `card` | `article` | `stat-card` |
| `dashboard-actions-title` | `text` | `heading` | `section-title` |
| `action-1` | `card` | `article` | `action-item` |
| `action-2` | `card` | `article` | `action-item` |
| `dashboard-activity-title` | `text` | `heading` | `section-title` |
| `dashboard-timeline` | `list` | `list` | `activity-timeline` |

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

- Color tokens: `--sys-color-charcoalBackground-base`, `--sys-color-inkGold-base`, `--sys-color-paperWhite`, `--sys-color-worker-ash-base`
- Typography tokens: `--sys-type-font-fraunces`, `--sys-type-font-work-sans`
- Shape tokens: `--sys-shape-blockRiot01`, `--sys-shape-blockRiot03`, `--sys-shape-placardTorn01`
- Z layers: `Z-0`, `Z-1`, `Z-2`, `Z-3`
- Asset slots (present): `auto_kr_solid_008`, `auto_kr_solid_022`, `auto_kr_solid_035`, `auto_kr_ui_007`, `auto_kr_ui_020`, `auto_kr_ui_030`, `auto_kr_logo_003`

Implementation rule: semantic tokens only (`--sys-color-*`, `--sys-type-*`, `--sys-shape-*`), no hardcoded hex values.

## 6) Test Stubs (Jest + RTL)

```ts
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardPageShell } from './DashboardPageShell';

describe('DashboardPageShell', () => {
  it('renders core screen structure', () => {
    render(<DashboardPageShell viewModel={{ title: 'Example' }} />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('fires primary action callback', async () => {
    const onPrimaryAction = vi.fn();
    render(<DashboardPageShell viewModel={{ title: 'Example' }} onPrimaryAction={onPrimaryAction} />);
    const btn = screen.getByRole('button', { name: /get started|submit|apply|save|new/i });
    await userEvent.click(btn);
    expect(onPrimaryAction).toHaveBeenCalled();
  });

  it('announces error state accessibly', () => {
    render(<DashboardPageShell viewModel={{ title: 'Example' }} errorMessage="Failure" />);
    expect(screen.getByText(/failure/i)).toHaveAttribute('aria-live', 'polite');
  });
});
```

## 7) Implementation Notes

- Suggested `data-testid` seeds: `dashboard-action-1`, `dashboard-action-2`, `dashboard-actions-title`, `dashboard-activity-title`, `dashboard-greeting`, `dashboard-new-app`, `dashboard-stat-applied`, `dashboard-stat-interview`, `dashboard-stat-offered`, `dashboard-timeline`
- Keep API calls out of this component; consume typed props from page/container.
- Prefer composition with KR primitives (`Strike`, `Placard`, `March`, `Scaffold`, `Substrate`) matching wireframe archetypes.

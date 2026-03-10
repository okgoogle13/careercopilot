# WorkbenchPageShell Spec

Source wireframe: `08_workbench.xml`
Wireframe title: **Document Workbench (Resume / Cover Letter Editor)**

## 1) TypeScript Interface

```ts
export interface WorkbenchPageShellViewModel {
  title: string;
  subtitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  items?: Array<{ id: string; label: string; meta?: string }>;
}

export interface WorkbenchPageShellProps {
  viewModel?: WorkbenchPageShellViewModel; // Optional data model for configurable content
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
| `workbench-title` | `text` | `heading` | `document-title` |
| `workbench-editor` | `textarea` | `textbox` | `document-editor` |
| `workbench-toolbar` | `toolbar` | `toolbar` | `format-controls` |
| `workbench-preview` | `region` | `region` | `document-preview` |
| `workbench-export` | `button-group` | `group` | `export-actions` |

## 3) State Management

- Local state: ephemeral UI only (`hover`, `focus`, temporary panel state).
- Server state: use TanStack Query in page container, pass normalized `viewModel` into component.
- Global state: auth/user/session only via context/Zustand selectors, never raw API payload in component local store.
- Keep editor draft in debounced local state; persist through API mutation hooks.

## 4) Accessibility Spec

- Landmarks: `role="main"` for content shell, `role="navigation"` for navigational clusters.
- Headings: single `h1` per screen; secondary sections use ordered `h2`/`h3`.
- Keyboard: all interactive controls reachable via `Tab`; actionable cards/buttons activate on `Enter`/`Space`.
- Error states: map `errorMessage` to `aria-live="polite"` status region.
- Focus visibility: must retain tokenized focus styles (Ink Gold halo family) and not rely on color-only cues.

## 5) Design Token Mapping

- Color tokens: `--sys-color-charcoalBackground-base`, `--sys-color-inkGold-base`, `--sys-color-paperWhite`, `--sys-color-worker-ash-base`
- Typography tokens: `--sys-type-font-fraunces`, `--sys-type-font-work-sans`
- Shape tokens: `--sys-shape-blockRiot03`, `--sys-shape-scaffoldFrame01`, `--sys-shape-substrateTile02`
- Z layers: `Z-0`, `Z-1`, `Z-2`, `Z-3`
- Asset slots (present): `auto_kr_solid_005`, `auto_kr_solid_012`, `auto_kr_solid_027`, `auto_kr_solid_022`, `auto_kr_ui_001`, `auto_kr_ui_015`, `auto_kr_ui_027`, `auto_kr_ui_038`, `auto_kr_solid_046`

Implementation rule: semantic tokens only (`--sys-color-*`, `--sys-type-*`, `--sys-shape-*`), no hardcoded hex values.

## 6) Test Stubs (Jest + RTL)

```ts
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkbenchPageShell } from './WorkbenchPageShell';

describe('WorkbenchPageShell', () => {
  it('renders core screen structure', () => {
    render(<WorkbenchPageShell viewModel={{ title: 'Example' }} />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('fires primary action callback', async () => {
    const onPrimaryAction = vi.fn();
    render(<WorkbenchPageShell viewModel={{ title: 'Example' }} onPrimaryAction={onPrimaryAction} />);
    const btn = screen.getByRole('button', { name: /get started|submit|apply|save|new/i });
    await userEvent.click(btn);
    expect(onPrimaryAction).toHaveBeenCalled();
  });

  it('announces error state accessibly', () => {
    render(<WorkbenchPageShell viewModel={{ title: 'Example' }} errorMessage="Failure" />);
    expect(screen.getByText(/failure/i)).toHaveAttribute('aria-live', 'polite');
  });
});
```

## 7) Implementation Notes

- Suggested `data-testid` seeds: `workbench-editor`, `workbench-export`, `workbench-preview`, `workbench-title`, `workbench-toolbar`
- Keep API calls out of this component; consume typed props from page/container.
- Prefer composition with KR primitives (`Strike`, `Placard`, `March`, `Scaffold`, `Substrate`) matching wireframe archetypes.

# KanbanBoardShell Spec

Source wireframe: `07_kanban.xml`
Wireframe title: **Application Kanban Board**

## 1) TypeScript Interface

```ts
export interface KanbanBoardShellViewModel {
  title: string;
  subtitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  items?: Array<{ id: string; label: string; meta?: string }>;
}

export interface KanbanBoardShellProps {
  viewModel?: KanbanBoardShellViewModel; // Optional data model for configurable content
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
| `kanban-column-applied` | `region` | `region` | `kanban-column` |
| `kanban-card-1` | `card` | `article` | `application-card` |
| `kanban-column-interview` | `region` | `region` | `kanban-column` |
| `kanban-card-2` | `card` | `article` | `application-card` |
| `kanban-column-offered` | `region` | `region` | `kanban-column` |
| `kanban-card-3` | `card` | `article` | `application-card` |
| `kanban-column-rejected` | `region` | `region` | `kanban-column` |
| `kanban-card-detail` | `button` | `button` | `card-detail-trigger` |

## 3) State Management

- Local state: ephemeral UI only (`hover`, `focus`, temporary panel state).
- Server state: use TanStack Query in page container, pass normalized `viewModel` into component.
- Global state: auth/user/session only via context/Zustand selectors, never raw API payload in component local store.
- Use controlled drag/drop state from parent store; keep card mutation logic outside presentation shell.

## 4) Accessibility Spec

- Landmarks: `role="main"` for content shell, `role="navigation"` for navigational clusters.
- Headings: single `h1` per screen; secondary sections use ordered `h2`/`h3`.
- Keyboard: all interactive controls reachable via `Tab`; actionable cards/buttons activate on `Enter`/`Space`.
- Error states: map `errorMessage` to `aria-live="polite"` status region.
- Focus visibility: must retain tokenized focus styles (Ink Gold halo family) and not rely on color-only cues.

## 5) Design Token Mapping

- Color tokens: `--sys-color-charcoalBackground-base`
- Typography tokens: `--sys-type-font-work-sans`
- Shape tokens: `--sys-shape-megaphoneCut01`, `--sys-shape-placardTorn01`, `--sys-shape-scaffoldSlab01`
- Z layers: `Z-0`, `Z-1`, `Z-2`, `Z-3`
- Asset slots (present): `auto_kr_solid_004`, `auto_kr_solid_011`, `auto_kr_solid_026`, `auto_kr_solid_009`, `auto_kr_ui_017`, `auto_kr_ui_014`, `auto_kr_ui_026`, `auto_kr_ui_037`, `auto_kr_solid_045`

Implementation rule: semantic tokens only (`--sys-color-*`, `--sys-type-*`, `--sys-shape-*`), no hardcoded hex values.

## 6) Test Stubs (Jest + RTL)

```ts
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KanbanBoardShell } from './KanbanBoardShell';

describe('KanbanBoardShell', () => {
  it('renders core screen structure', () => {
    render(<KanbanBoardShell viewModel={{ title: 'Example' }} />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('fires primary action callback', async () => {
    const onPrimaryAction = vi.fn();
    render(<KanbanBoardShell viewModel={{ title: 'Example' }} onPrimaryAction={onPrimaryAction} />);
    const btn = screen.getByRole('button', { name: /get started|submit|apply|save|new/i });
    await userEvent.click(btn);
    expect(onPrimaryAction).toHaveBeenCalled();
  });

  it('announces error state accessibly', () => {
    render(<KanbanBoardShell viewModel={{ title: 'Example' }} errorMessage="Failure" />);
    expect(screen.getByText(/failure/i)).toHaveAttribute('aria-live', 'polite');
  });
});
```

## 7) Implementation Notes

- Suggested `data-testid` seeds: `kanban-card-1`, `kanban-card-2`, `kanban-card-3`, `kanban-card-detail`, `kanban-column-applied`, `kanban-column-interview`, `kanban-column-offered`, `kanban-column-rejected`
- Keep API calls out of this component; consume typed props from page/container.
- Prefer composition with KR primitives (`Strike`, `Placard`, `March`, `Scaffold`, `Substrate`) matching wireframe archetypes.

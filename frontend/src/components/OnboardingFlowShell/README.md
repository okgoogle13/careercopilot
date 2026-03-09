# OnboardingFlowShell Spec

Source wireframe: `03_onboarding.xml`
Wireframe title: **Onboarding Flow (3 Steps)**

## 1) TypeScript Interface

```ts
export interface OnboardingFlowShellViewModel {
  title: string;
  subtitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  items?: Array<{ id: string; label: string; meta?: string }>;
}

export interface OnboardingFlowShellProps {
  viewModel?: OnboardingFlowShellViewModel; // Optional data model for configurable content
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
| `progress-indicator` | `progress` | `progressbar` | `progress-indicator` |
| `step-title` | `text` | `heading` | `step-title` |
| `step-description` | `text` | `region` | `step-description` |
| `step1-name` | `input` | `textbox` | `form-field` |
| `step1-role` | `select` | `combobox` | `form-field` |
| `step2-skills` | `chips` | `group` | `skill-selector` |
| `step3-goals` | `textarea` | `textbox` | `form-field` |
| `onboarding-next` | `button` | `button` | `primary-cta` |
| `onboarding-back` | `button` | `button` | `secondary-cta` |
| `onboarding-skip` | `button` | `button` | `secondary-action` |

## 3) State Management

- Local state: ephemeral UI only (`hover`, `focus`, temporary panel state).
- Server state: use TanStack Query in page container, pass normalized `viewModel` into component.
- Global state: auth/user/session only via context/Zustand selectors, never raw API payload in component local store.
- Local reducer recommended for multi-step form state (`currentStep`, validation map, dirty flags).

## 4) Accessibility Spec

- Landmarks: `role="main"` for content shell, `role="navigation"` for navigational clusters.
- Headings: single `h1` per screen; secondary sections use ordered `h2`/`h3`.
- Keyboard: all interactive controls reachable via `Tab`; actionable cards/buttons activate on `Enter`/`Space`.
- Error states: map `errorMessage` to `aria-live="polite"` status region.
- Focus visibility: must retain tokenized focus styles (Ink Gold halo family) and not rely on color-only cues.

## 5) Design Token Mapping

- Color tokens: `--sys-color-charcoalBackground-base`, `--sys-color-concreteGrey`, `--sys-color-inkGold-base`, `--sys-color-paperWhite`, `--sys-color-worker-ash-base`
- Typography tokens: `--sys-type-font-fraunces`, `--sys-type-font-work-sans`
- Shape tokens: `--sys-shape-blockRiot01`, `--sys-shape-blockRiot03`, `--sys-shape-scaffoldSlab01`, `--sys-shape-substrateTile02`
- Z layers: `Z-0`, `Z-1`, `Z-2`, `Z-3`
- Asset slots (present): `step1_background`, `step1_accent`, `role_icons`, `skill_icons`, `auto_kr_solid_004`, `auto_kr_solid_038`, `auto_kr_ui_010`, `auto_kr_ui_009`, `auto_kr_solid_032`, `auto_kr_ui_033`, `auto_kr_icon_003`

Implementation rule: semantic tokens only (`--sys-color-*`, `--sys-type-*`, `--sys-shape-*`), no hardcoded hex values.

## 6) Test Stubs (Jest + RTL)

```ts
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OnboardingFlowShell } from './OnboardingFlowShell';

describe('OnboardingFlowShell', () => {
  it('renders core screen structure', () => {
    render(<OnboardingFlowShell viewModel={{ title: 'Example' }} />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('fires primary action callback', async () => {
    const onPrimaryAction = vi.fn();
    render(<OnboardingFlowShell viewModel={{ title: 'Example' }} onPrimaryAction={onPrimaryAction} />);
    const btn = screen.getByRole('button', { name: /get started|submit|apply|save|new/i });
    await userEvent.click(btn);
    expect(onPrimaryAction).toHaveBeenCalled();
  });

  it('announces error state accessibly', () => {
    render(<OnboardingFlowShell viewModel={{ title: 'Example' }} errorMessage="Failure" />);
    expect(screen.getByText(/failure/i)).toHaveAttribute('aria-live', 'polite');
  });
});
```

## 7) Implementation Notes

- Suggested `data-testid` seeds: `onboarding-back`, `onboarding-next`, `onboarding-progress`, `onboarding-skip`, `onboarding-step-description`, `onboarding-step-title`, `onboarding-step1-name`, `onboarding-step1-role`, `onboarding-step2-skills`, `onboarding-step3-goals`
- Keep API calls out of this component; consume typed props from page/container.
- Prefer composition with KR primitives (`Strike`, `Placard`, `March`, `Scaffold`, `Substrate`) matching wireframe archetypes.

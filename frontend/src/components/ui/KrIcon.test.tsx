import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { KrIcon, KR_ICON_PATHS, resolveKrIconPath } from './KrIcon';

describe('KrIcon', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        '<svg viewBox="0 0 24 24"><title>Icon</title><path d="M0 0h24v24H0z" fill="var(--sys-color-inkGold-base)"/></svg>',
    } as Response);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('maps icon names to the correct public asset paths', () => {
    expect(resolveKrIconPath('stencil')).toBe(KR_ICON_PATHS.stencil);
    expect(resolveKrIconPath('tram')).toBe(KR_ICON_PATHS.tram);
    expect(resolveKrIconPath('seal')).toBe(KR_ICON_PATHS.seal);
    expect(resolveKrIconPath('wheat')).toBe(KR_ICON_PATHS.wheat);
  });

  it('renders an accessible inline svg wrapper', async () => {
    render(
      <KrIcon
        name="stencil"
        ariaLabel="Stencil motif"
        testId="kr-icon"
      />
    );

    const icon = screen.getByTestId('kr-icon');

    await waitFor(() => {
      expect(icon.innerHTML).toContain('<svg');
    });

    expect(icon.getAttribute('role')).toBe('img');
    expect(icon.getAttribute('aria-label')).toBe('Stencil motif');
    expect(icon.getAttribute('data-icon-path')).toBe(KR_ICON_PATHS.stencil);
    expect(icon.querySelector('svg')).not.toBeNull();
    expect(icon.querySelector('title')).toBeNull();
  });
});

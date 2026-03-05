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
    expect(resolveKrIconPath('leaf')).toBe(KR_ICON_PATHS.leaf);
    expect(resolveKrIconPath('tram')).toBe(KR_ICON_PATHS.tram);
    expect(resolveKrIconPath('lotus')).toBe(KR_ICON_PATHS.lotus);
    expect(resolveKrIconPath('wheat')).toBe(KR_ICON_PATHS.wheat);
  });

  it('renders an accessible inline svg wrapper', async () => {
    render(
      <KrIcon
        name="leaf"
        ariaLabel="Leaf motif"
        testId="kr-icon"
      />
    );

    const icon = screen.getByTestId('kr-icon');

    await waitFor(() => {
      expect(icon.innerHTML).toContain('<svg');
    });

    expect(icon).toHaveAttribute('role', 'img');
    expect(icon).toHaveAttribute('aria-label', 'Leaf motif');
    expect(icon).toHaveAttribute('data-icon-path', KR_ICON_PATHS.leaf);
    expect(icon.querySelector('svg')).not.toBeNull();
    expect(icon.querySelector('title')).toBeNull();
  });
});

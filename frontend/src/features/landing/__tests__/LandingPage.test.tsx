import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { jest, describe, it, expect } from '@jest/globals';

(jest as any).unstable_mockModule('@/components/ui/Logo', () => ({
  Logo: () => <div data-testid="logo" />,
}));

const { default: LandingPage } = await import('../LandingPage');

describe('LandingPage', () => {
  it('uses donor-aligned landing typography and canonical archetype tokens', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const subtitle = screen.getByText('Your career, re-documented for the collective future.');
    expect(subtitle.className).toContain('font-display');
    expect(subtitle.className).toContain('text-ink-gold-base');

    const primaryCta = screen.getByRole('link', { name: /build your story/i });
    expect(primaryCta).toHaveStyle({
      borderRadius: 'var(--kr-archetypes-strike-shape-base)',
    });

    const statValue = screen
      .getAllByText('127')
      .find((element) => element.className.includes('font-display-ultra'));
    expect(statValue).toBeDefined();
    expect(statValue.className).toContain('font-display-ultra');

    const statAccent = screen.getByText('3×');
    expect(statAccent.style.color).toContain('var(--kr-color-ink-gold-base)');
  });
});

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

    const subtitle = screen.getByText(
      'For social workers. Advocates. People who change systems, not just survive them.'
    );
    expect(subtitle.className).toContain('font-display');

    const primaryCta = screen.getByRole('link', { name: /create account/i });
    expect(primaryCta).toHaveStyle({
      borderRadius: 'var(--kr-archetypes-strike-shape-base)',
    });

    expect(screen.getByRole('link', { name: /explore opportunities/i })).toHaveStyle({
      borderRadius: 'var(--kr-archetypes-strike-shape-base)',
    });

    const statValue = screen
      .getAllByText('127')
      .find((element) => element.className.includes('font-display-ultra'));
    expect(statValue).toBeDefined();
    expect(statValue.className).toContain('font-display-ultra');

    const statAccent = screen.getByText('1:1');
    expect(statAccent.style.color).toContain('var(--kr-color-ink-gold-base)');

    expect(screen.getByText('ADVOCACY STORIES')).toBeInTheDocument();
  });

  it('uses March archetype styling for landing feature cards', () => {
    const { container } = render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const featureCard = screen.getByText('Build Your Story').closest('div');
    expect(featureCard).not.toBeNull();
    expect(featureCard?.className).toContain('rounded-march');
    expect(featureCard?.className).not.toContain('rounded-placard');

    expect(container.querySelectorAll('.rounded-march').length).toBeGreaterThan(0);
  });
});

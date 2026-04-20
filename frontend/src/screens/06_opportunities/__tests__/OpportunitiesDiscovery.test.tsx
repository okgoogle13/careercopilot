import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest, describe, it, expect } from '@jest/globals';

(jest as any).unstable_mockModule('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get:
        () =>
        ({ children, ...props }: any) => <div {...props}>{children}</div>,
    }
  ),
}));

(jest as any).unstable_mockModule('@/components/kerala-rage/NexusInput', () => ({
  NexusInput: ({
    label,
    placeholder,
    value,
    onChange,
    className,
  }: {
    label: string;
    placeholder: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
  }) => (
    <label>
      {label}
      <input
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={className}
      />
    </label>
  ),
}));

(jest as any).unstable_mockModule('lucide-react', () => ({
  MapPin: () => <span />,
  Clock: () => <span />,
}));

const { OpportunitiesDiscovery } = await import('../OpportunitiesDiscovery');

describe('OpportunitiesDiscovery', () => {
  it('uses the canonical signal-green token in the hero and inkGold-base in the active filter state', () => {
    render(<OpportunitiesDiscovery />);

    const eyebrow = screen.getByText('OPPORTUNITIES // CLANDESTINE INTELLIGENCE FEED');
    expect(eyebrow.className).toContain('kr-color-signal-green-base');
    expect(eyebrow.className).not.toContain('kr-color-kr-activist-smoke-green-base');

    const highlight = screen.getByText('OPPORTUNITIES', { selector: 'span' });
    expect(highlight.style.color).toContain('kr-color-signal-green-base');
    expect(highlight.style.color).not.toContain('kr-activist-smoke-green-base');

    const activeFilter = screen.getByRole('button', { name: /ALL INTERCEPTS 8/i });
    expect(activeFilter.className).toContain('var(--kr-color-ink-gold-base)');
    expect(activeFilter.className).not.toContain('signal-green-base');
  });

  it('uses worker-ash token text and primary typography for the intercept title and inactive filters', () => {
    render(<OpportunitiesDiscovery />);

    const interceptTitle = screen.getByText('Senior Case Manager');
    expect(interceptTitle.className).toContain('font-primary');
    expect(interceptTitle.className).not.toContain('font-mono');

    const heroSummary = screen.getByText(/intercepted job dispatches/i);
    expect(heroSummary.className).not.toContain('text-white/45');

    const inactiveFilter = screen.getByRole('button', { name: /VERIFIED 4/i });
    expect(inactiveFilter.className).not.toContain('border-white/15');
    expect(inactiveFilter.className).not.toContain('text-white/40');
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';

(jest as any).unstable_mockModule('lucide-react', () => ({
  Clock: () => <span>Clock</span>,
  Loader2: () => <span>Loader2</span>,
  MapPin: () => <span>MapPin</span>,
  Search: () => <span>Search</span>,
  Sparkles: () => <span>Sparkles</span>,
  X: () => <span>X</span>,
}));

const { OpportunitiesDiscovery } = await import('../OpportunitiesDiscovery');

describe('OpportunitiesDiscovery', () => {
  it('avoids signal-green tokens in the hero and active filter state', () => {
    render(<OpportunitiesDiscovery />);

    const eyebrow = screen.getByText(/OPPORTUNITIES \/\/ CLANDESTINE INTELLIGENCE FEED/i);
    const heroHighlight = screen.getByText('OPPORTUNITIES');
    const activeFilter = screen.getByRole('button', { name: /ALL INTERCEPTS 8/i });

    expect(eyebrow.className).not.toContain('--kr-color-signal-green-base');
    expect(heroHighlight.getAttribute('style')).not.toContain('--kr-color-signal-green-base');
    expect(activeFilter.className).not.toContain('--kr-color-signal-green-base');

    expect(screen.getByText('THE')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /VERIFIED 4/i })).toBeInTheDocument();
  });
});

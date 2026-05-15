import React from 'react';
import { render, screen } from '@testing-library/react';

(jest as any).unstable_mockModule('@/stores/useModeStore', () => ({
  useModeStore: (selector: (state: { mode: 'KrDark' }) => unknown) => selector({ mode: 'KrDark' }),
}));

const { OnboardFlow } = await import('../OnboardFlow');

describe('OnboardFlow', () => {
  it('does not render the debug footer by default', () => {
    render(<OnboardFlow />);

    expect(
      screen.queryByText(/Slots: 3 \| Density ratio: 0\.36 \| Max focal CTA: 1/)
    ).not.toBeInTheDocument();
  });

  it('uses canonical KR token namespaces for slot colors', () => {
    const { container } = render(<OnboardFlow />);

    const slotNodes = Array.from(container.querySelectorAll('[data-slot]'));
    expect(slotNodes).toHaveLength(3);

    slotNodes.forEach((node) => {
      expect(node.getAttribute('style')).toContain('var(--kr-color-');
      expect(node.getAttribute('style')).not.toContain('var(--sys-');
    });
  });
});

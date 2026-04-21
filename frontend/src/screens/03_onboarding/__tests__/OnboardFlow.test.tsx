import React from 'react';
import { render, screen } from '@testing-library/react';

(jest as any).unstable_mockModule('@/stores/useModeStore', () => ({
  useModeStore: (selector: (state: { mode: string }) => unknown) => selector({ mode: 'solidarity' }),
}));

const { OnboardFlow } = await import('../OnboardFlow');

describe('OnboardFlow', () => {
  it('does not render the debug footer in runtime UI', () => {
    render(
      <OnboardFlow title="Choose Your Focus Area">
        <div>Body</div>
      </OnboardFlow>
    );

    expect(screen.queryByText(/Slots:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Density ratio:/i)).not.toBeInTheDocument();
  });
});

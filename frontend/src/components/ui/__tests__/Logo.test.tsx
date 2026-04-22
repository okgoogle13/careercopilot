import React from 'react';
import { render, screen } from '@testing-library/react';

import { Logo } from '../Logo';

describe('Logo', () => {
  it('uses collective copy instead of AI-hype branding', () => {
    render(<Logo />);

    expect(screen.getByText('CareerCopilot')).toBeInTheDocument();
    expect(screen.getByText('TOOLS FOR THE COLLECTIVE')).toBeInTheDocument();
    expect(screen.queryByText('YOUR AI JOB PARTNER')).not.toBeInTheDocument();
  });
});

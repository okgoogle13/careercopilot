import { render, screen } from '@testing-library/react';
import { ProfileHeader } from '../ProfileHeader';
import React from 'react';

describe('ProfileHeader', () => {
  const props = {
    name: 'Nishant Dougall',
    bio: 'Architect',
    identityTags: ['Engineer', 'Auditor']
  };

  it('renders name and bio', () => {
    render(<ProfileHeader {...props} />);
    expect(screen.getByText('Nishant Dougall')).toBeDefined();
    expect(screen.getByText('Architect')).toBeDefined();
  });

  it('renders identity tags', () => {
    render(<ProfileHeader {...props} />);
    expect(screen.getByText('Engineer')).toBeDefined();
    expect(screen.getByText('Auditor')).toBeDefined();
  });
});

import { render, screen } from '@testing-library/react';
import { SkillBreakdownCard } from '../SkillBreakdownCard';
import React from 'react';

describe('SkillBreakdownCard', () => {
  const props = {
    overallScore: 85,
    categories: [
      { label: 'Technical Mastery', value: 90 },
      { label: 'Solidarity', value: 80 }
    ],
    onAction: jest.fn()
  };

  it('renders overall score and categories', () => {
    render(<SkillBreakdownCard {...props} />);
    expect(screen.getByText('85%')).toBeDefined();
    expect(screen.getByText('Technical Mastery')).toBeDefined();
    expect(screen.getByText('90%')).toBeDefined();
    expect(screen.getByText('Solidarity')).toBeDefined();
    expect(screen.getByText('80%')).toBeDefined();
  });
});

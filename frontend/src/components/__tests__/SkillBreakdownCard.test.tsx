import { fireEvent, render, screen } from '@testing-library/react';
import { SkillBreakdownCard } from '../SkillBreakdownCard';
import React from 'react';

describe('SkillBreakdownCard', () => {
  const createProps = () => ({
    overallScore: 85,
    categories: [
      { label: 'Technical Mastery', value: 90 },
      { label: 'Solidarity', value: 80 },
    ],
    onAction: jest.fn(),
  });

  it('renders overall score and categories', () => {
    const props = createProps();

    render(<SkillBreakdownCard {...props} />);
    expect(screen.getByText('85%')).toBeDefined();
    expect(screen.getByText('Technical Mastery')).toBeDefined();
    expect(screen.getByText('90%')).toBeDefined();
    expect(screen.getByText('Solidarity')).toBeDefined();
    expect(screen.getByText('80%')).toBeDefined();
  });

  it('calls onAction for both button actions', () => {
    const props = createProps();

    render(<SkillBreakdownCard {...props} />);

    fireEvent.click(screen.getByRole('button', { name: 'STRENGTHEN' }));
    fireEvent.click(screen.getByRole('button', { name: 'ARCHIVE' }));

    expect(props.onAction).toHaveBeenNthCalledWith(1, 'strengthen');
    expect(props.onAction).toHaveBeenNthCalledWith(2, 'archive');
  });

  it('renders action buttons even when categories are empty', () => {
    render(
      <SkillBreakdownCard
        overallScore={10}
        categories={[]}
        onAction={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'STRENGTHEN' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ARCHIVE' })).toBeInTheDocument();
  });
});

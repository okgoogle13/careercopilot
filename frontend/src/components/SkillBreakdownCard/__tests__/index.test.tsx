import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SkillBreakdownCard, type SkillCategory } from '../index';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    circle: ({ animate: _animate, initial: _initial, className }: any) => (
      <circle
        className={className}
        data-testid="motion-circle"
      />
    ),
    div: ({ children, style, className }: any) => (
      <div
        style={style}
        className={className}
        data-testid="motion-div"
      >
        {children}
      </div>
    ),
    button: ({ children, onClick, className }: any) => (
      <button
        onClick={onClick}
        className={className}
      >
        {children}
      </button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockCategories: SkillCategory[] = [
  { label: 'Technical Proficiency', value: 85 },
  { label: 'Communication', value: 70 },
];

describe('SkillBreakdownCard', () => {
  const onAction = jest.fn();

  it('renders overall score and categories', () => {
    render(
      <SkillBreakdownCard
        overallScore={92}
        categories={mockCategories}
        onAction={onAction}
      />
    );

    expect(screen.getByText('92%')).toBeInTheDocument();
    expect(screen.getByText('Technical Proficiency')).toBeInTheDocument();
    expect(screen.getByText('Communication')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('calls onAction when strengthen button is clicked', () => {
    render(
      <SkillBreakdownCard
        overallScore={92}
        categories={mockCategories}
        onAction={onAction}
      />
    );

    fireEvent.click(screen.getByText('STRENGTHEN'));
    expect(onAction).toHaveBeenCalledWith('strengthen');
  });

  it('calls onAction when archive button is clicked', () => {
    render(
      <SkillBreakdownCard
        overallScore={92}
        categories={mockCategories}
        onAction={onAction}
      />
    );

    fireEvent.click(screen.getByText('ARCHIVE'));
    expect(onAction).toHaveBeenCalledWith('archive');
  });

  it('renders the display title correctly', () => {
    render(
      <SkillBreakdownCard
        overallScore={92}
        categories={mockCategories}
        onAction={onAction}
      />
    );
    expect(screen.getByText('SOLIDARITY ANALYSIS')).toBeInTheDocument();
  });
});

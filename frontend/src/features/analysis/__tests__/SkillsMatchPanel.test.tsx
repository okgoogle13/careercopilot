import { render, screen } from '@testing-library/react';
import { SkillsMatchPanel } from '../SkillsMatchPanel';
import type { SkillsGap } from '../../../services/aiInterface';

const FULL_GAP: SkillsGap = {
  matched: ['Python', 'React', 'AWS'],
  missing: ['Docker', 'FastAPI'],
  adjacent: ['Django'],
  match_score: 67,
};

const PERFECT_MATCH: SkillsGap = {
  matched: ['Python', 'React'],
  missing: [],
  adjacent: [],
  match_score: 100,
};

const NO_MATCH: SkillsGap = {
  matched: [],
  missing: ['Python', 'Docker'],
  adjacent: [],
  match_score: 0,
};

describe('SkillsMatchPanel', () => {
  it('renders the panel with header', () => {
    render(<SkillsMatchPanel skillsGap={FULL_GAP} />);
    expect(screen.getByTestId('skills-match-panel')).toBeInTheDocument();
    expect(screen.getByText('Skills Match')).toBeInTheDocument();
  });

  it('shows the correct match_score', () => {
    render(<SkillsMatchPanel skillsGap={FULL_GAP} />);
    expect(screen.getByTestId('match-score')).toHaveTextContent('67%');
  });

  it('shows 100% for a perfect match', () => {
    render(<SkillsMatchPanel skillsGap={PERFECT_MATCH} />);
    expect(screen.getByTestId('match-score')).toHaveTextContent('100%');
  });

  it('shows 0% when nothing matches', () => {
    render(<SkillsMatchPanel skillsGap={NO_MATCH} />);
    expect(screen.getByTestId('match-score')).toHaveTextContent('0%');
  });

  it('renders matched skills as chips', () => {
    render(<SkillsMatchPanel skillsGap={FULL_GAP} />);
    expect(screen.getByTestId('chip-matched-0')).toHaveTextContent('Python');
    expect(screen.getByTestId('chip-matched-1')).toHaveTextContent('React');
    expect(screen.getByTestId('chip-matched-2')).toHaveTextContent('AWS');
  });

  it('renders missing skills as chips', () => {
    render(<SkillsMatchPanel skillsGap={FULL_GAP} />);
    expect(screen.getByTestId('chip-missing-0')).toHaveTextContent('Docker');
    expect(screen.getByTestId('chip-missing-1')).toHaveTextContent('FastAPI');
  });

  it('renders adjacent skills as chips', () => {
    render(<SkillsMatchPanel skillsGap={FULL_GAP} />);
    expect(screen.getByTestId('chip-adjacent-0')).toHaveTextContent('Django');
  });

  it('shows "None identified" when matched list is empty', () => {
    render(<SkillsMatchPanel skillsGap={NO_MATCH} />);
    // All three sections should show "None identified" for empty lists
    const noneMessages = screen.getAllByText('None identified');
    expect(noneMessages.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the progress bar with correct aria attributes', () => {
    render(<SkillsMatchPanel skillsGap={FULL_GAP} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '67');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('shows counts next to section labels', () => {
    render(<SkillsMatchPanel skillsGap={FULL_GAP} />);
    // Matched count
    expect(screen.getByText('3')).toBeInTheDocument();
    // Missing count
    expect(screen.getByText('2')).toBeInTheDocument();
    // Adjacent count
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});

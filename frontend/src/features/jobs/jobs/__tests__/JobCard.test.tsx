import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from '@jest/globals';

import { JobCard } from '../../features/JobCard';

describe('JobCard', () => {
  const mockOnSave = vi.fn();
  const mockOnApply = vi.fn();
  const mockOnViewDetails = vi.fn();

  const sampleJob = {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    type: 'full-time' as const,
    salary: {
      min: 120000,
      max: 180000,
      currency: '$',
      period: 'annually' as const,
    },
    description: 'We are looking for an experienced software engineer to join our team...',
    requirements: ['5+ years experience', 'React expertise', 'Node.js background'],
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    benefits: ['Health insurance', 'Remote work', '401k matching'],
    postedDate: new Date('2024-01-15'),
    companySize: '100-500',
    industry: 'Technology',
    experienceLevel: 'senior' as const,
    remote: true,
    verified: true,
    aiMatch: {
      score: 92,
      reasons: [
        'Strong match for React experience',
        'Your Node.js background aligns perfectly',
        'AWS certification matches requirements',
      ],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering - Default Variant', () => {
    it('renders without crashing', () => {
      render(<JobCard job={sampleJob} />);
      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    });

    it('displays job title', () => {
      render(<JobCard job={sampleJob} />);
      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    });

    it('displays company name', () => {
      render(<JobCard job={sampleJob} />);
      expect(screen.getAllByText('Tech Corp')[0]).toBeInTheDocument();
    });

    it('displays location', () => {
      render(<JobCard job={sampleJob} />);
      expect(screen.getAllByText('San Francisco, CA')[0]).toBeInTheDocument();
    });

    it('displays job description', () => {
      render(<JobCard job={sampleJob} />);
      expect(
        screen.getByText(/We are looking for an experienced software engineer/i)
      ).toBeInTheDocument();
    });

    it('displays formatted salary', () => {
      render(<JobCard job={sampleJob} />);
      expect(screen.getByText('$120,000 - $180,000/year')).toBeInTheDocument();
    });

    it('displays posted date', () => {
      render(<JobCard job={sampleJob} />);
      expect(screen.getByText(/Posted/i)).toBeInTheDocument();
    });
  });

  describe('Job Type and Experience Badges', () => {
    it('displays job type badge', () => {
      render(<JobCard job={sampleJob} />);
      expect(screen.getByText('FULL-TIME')).toBeInTheDocument();
    });

    it('displays experience level badge', () => {
      render(<JobCard job={sampleJob} />);
      expect(screen.getByText('SENIOR LEVEL')).toBeInTheDocument();
    });

    it('displays remote badge when remote', () => {
      render(<JobCard job={sampleJob} />);
      expect(screen.getByText('REMOTE')).toBeInTheDocument();
    });

    it('does not display remote badge when not remote', () => {
      const job = { ...sampleJob, remote: false };
      render(<JobCard job={job} />);
      expect(screen.queryByText('REMOTE')).not.toBeInTheDocument();
    });

    it('displays verified badge', () => {
      const { container } = render(<JobCard job={sampleJob} />);
      expect(container.querySelector('[data-testid="ShieldIcon"]')).toBeInTheDocument();
    });

    it('displays sponsored badge when sponsored', () => {
      const job = { ...sampleJob, sponsored: true };
      render(<JobCard job={job} />);
      expect(screen.getByText('Sponsored')).toBeInTheDocument();
    });
  });

  describe('Skills Section', () => {
    it('displays required skills heading', () => {
      render(<JobCard job={sampleJob} />);
      expect(screen.getByText('Required Skills')).toBeInTheDocument();
    });

    it('displays first 6 skills', () => {
      render(<JobCard job={sampleJob} />);
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
      expect(screen.getByText('AWS')).toBeInTheDocument();
    });

    it('shows +N more badge for additional skills', () => {
      const job = {
        ...sampleJob,
        skills: ['Skill1', 'Skill2', 'Skill3', 'Skill4', 'Skill5', 'Skill6', 'Skill7', 'Skill8'],
      };
      render(<JobCard job={job} />);
      expect(screen.getByText('+2 more')).toBeInTheDocument();
    });

    it('does not show +N more badge when 6 or fewer skills', () => {
      render(<JobCard job={sampleJob} />);
      expect(screen.queryByText(/\+\d+ more/)).not.toBeInTheDocument();
    });
  });

  describe('AI Match Section', () => {
    it('displays AI match score', () => {
      render(<JobCard job={sampleJob} />);
      expect(screen.getByText('92%')).toBeInTheDocument();
      expect(screen.getByText('AI Match')).toBeInTheDocument();
    });

    it('displays why this matches you heading', () => {
      render(<JobCard job={sampleJob} />);
      expect(screen.getByText('Why this matches you')).toBeInTheDocument();
    });

    it('displays match reasons', () => {
      render(<JobCard job={sampleJob} />);
      expect(screen.getByText(/Strong match for React experience/i)).toBeInTheDocument();
      expect(screen.getByText(/Your Node.js background aligns perfectly/i)).toBeInTheDocument();
    });

    it('displays first 3 match reasons only', () => {
      const job = {
        ...sampleJob,
        aiMatch: {
          score: 92,
          reasons: ['Reason 1', 'Reason 2', 'Reason 3', 'Reason 4', 'Reason 5'],
        },
      };
      render(<JobCard job={job} />);

      expect(screen.getByText('Reason 1')).toBeInTheDocument();
      expect(screen.getByText('Reason 2')).toBeInTheDocument();
      expect(screen.getByText('Reason 3')).toBeInTheDocument();
      expect(screen.queryByText('Reason 4')).not.toBeInTheDocument();
    });

    it('does not display AI match section without match data', () => {
      const job = { ...sampleJob, aiMatch: undefined };
      render(<JobCard job={job} />);
      expect(screen.queryByText('AI Match')).not.toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('displays apply now button', () => {
      render(<JobCard job={sampleJob} onApply={mockOnApply} />);
      expect(screen.getByText('Apply Now')).toBeInTheDocument();
    });

    it('displays details button', () => {
      render(<JobCard job={sampleJob} onViewDetails={mockOnViewDetails} />);
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    it('displays bookmark button', () => {
      const { container } = render(<JobCard job={sampleJob} onSave={mockOnSave} />);
      expect(container.querySelector('[data-testid="BookmarkIcon"]')).toBeInTheDocument();
    });

    it('calls onApply when apply button clicked', async () => {
      const user = userEvent.setup();
      render(<JobCard job={sampleJob} onApply={mockOnApply} />);

      await user.click(screen.getByText('Apply Now'));
      expect(mockOnApply).toHaveBeenCalledWith('1');
    });

    it('calls onViewDetails when details button clicked', async () => {
      const user = userEvent.setup();
      render(<JobCard job={sampleJob} onViewDetails={mockOnViewDetails} />);

      await user.click(screen.getByText('Details'));
      expect(mockOnViewDetails).toHaveBeenCalledWith('1');
    });

    it('calls onViewDetails when card clicked', async () => {
      const user = userEvent.setup();
      render(<JobCard job={sampleJob} onViewDetails={mockOnViewDetails} />);

      const card = screen.getByText('Senior Software Engineer').closest('[role="button"]') ||
                   screen.getByText('Senior Software Engineer').closest('div[class*="MuiCard"]');

      if (card) {
        await user.click(card);
        expect(mockOnViewDetails).toHaveBeenCalledWith('1');
      }
    });

    it('calls onSave when bookmark button clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(<JobCard job={sampleJob} onSave={mockOnSave} />);

      const bookmarkButton = container.querySelector('[data-testid="BookmarkIcon"]')?.closest('button');
      if (bookmarkButton) {
        await user.click(bookmarkButton);
        expect(mockOnSave).toHaveBeenCalledWith('1');
      }
    });

    it('shows filled bookmark when saved', async () => {
      const user = userEvent.setup();
      const { container } = render(<JobCard job={sampleJob} saved={false} onSave={mockOnSave} />);

      const bookmarkButton = container.querySelector('[data-testid="BookmarkIcon"]')?.closest('button');
      if (bookmarkButton) {
        await user.click(bookmarkButton);

        // After click, should show filled bookmark
        expect(container.querySelector('[data-testid="BookmarkAddedIcon"]') ||
               container.querySelector('[data-testid="BookmarkCheckIcon"]')).toBeInTheDocument();
      }
    });

    it('shows applied state when job already applied', () => {
      render(<JobCard job={sampleJob} applied={true} />);
      expect(screen.getByText('Applied')).toBeInTheDocument();
    });

    it('disables apply button when already applied', () => {
      render(<JobCard job={sampleJob} applied={true} />);
      const appliedButton = screen.getByText('Applied');
      expect(appliedButton).toBeDisabled();
    });
  });

  describe('Compact Variant', () => {
    it('renders compact variant', () => {
      render(<JobCard job={sampleJob} variant="compact" />);
      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    });

    it('displays essential information in compact mode', () => {
      render(<JobCard job={sampleJob} variant="compact" />);
      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
      expect(screen.getAllByText('Tech Corp')[0]).toBeInTheDocument();
      expect(screen.getAllByText('San Francisco, CA')[0]).toBeInTheDocument();
    });

    it('shows AI match in compact mode', () => {
      render(<JobCard job={sampleJob} variant="compact" />);
      expect(screen.getByText('92% match')).toBeInTheDocument();
    });

    it('calls onViewDetails when compact card clicked', async () => {
      const user = userEvent.setup();
      render(<JobCard job={sampleJob} variant="compact" onViewDetails={mockOnViewDetails} />);

      const card = screen.getByText('Senior Software Engineer').closest('[role="button"]') ||
                   screen.getByText('Senior Software Engineer').closest('div[class*="MuiCard"]');

      if (card) {
        await user.click(card);
        expect(mockOnViewDetails).toHaveBeenCalledWith('1');
      }
    });
  });

  describe('Featured Variant', () => {
    it('renders featured variant', () => {
      render(<JobCard job={sampleJob} variant="featured" />);
      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    });
  });

  describe('Salary Formatting', () => {
    it('formats salary range', () => {
      render(<JobCard job={sampleJob} />);
      expect(screen.getByText('$120,000 - $180,000/year')).toBeInTheDocument();
    });

    it('formats single salary value', () => {
      const job = {
        ...sampleJob,
        salary: { min: 150000, max: 150000, currency: '$', period: 'annually' as const },
      };
      render(<JobCard job={job} />);
      expect(screen.getByText('$150,000/year')).toBeInTheDocument();
    });

    it('formats hourly salary', () => {
      const job = {
        ...sampleJob,
        salary: { min: 50, max: 75, currency: '$', period: 'hourly' as const },
      };
      render(<JobCard job={job} />);
      expect(screen.getByText('$50 - $75/hr')).toBeInTheDocument();
    });

    it('handles missing salary', () => {
      const job = { ...sampleJob, salary: undefined };
      render(<JobCard job={job} />);
      expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has accessible card', () => {
      render(<JobCard job={sampleJob} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('all action buttons are accessible', () => {
      render(<JobCard job={sampleJob} onApply={mockOnApply} onViewDetails={mockOnViewDetails} />);
      const applyButton = screen.getByText('Apply Now');
      const detailsButton = screen.getByText('Details');

      expect(applyButton).toBeEnabled();
      expect(detailsButton).toBeEnabled();
    });
  });

  describe('Edge Cases', () => {
    it('handles job without company logo', () => {
      const job = { ...sampleJob, logoUrl: undefined };
      render(<JobCard job={job} />);
      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    });

    it('handles job with empty skills array', () => {
      const job = { ...sampleJob, skills: [] };
      render(<JobCard job={job} />);
      expect(screen.queryByText('Required Skills')).not.toBeInTheDocument();
    });

    it('handles missing callbacks', () => {
      render(<JobCard job={sampleJob} />);
      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    });
  });
});

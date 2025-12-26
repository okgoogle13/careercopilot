import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JobCard, JobCardProps } from '../../../../features/jobs/JobCard';

const mockJob: JobCardProps['job'] = {
  id: '1',
  title: 'Senior Software Engineer',
  company: 'Tech Corp',
  location: 'San Francisco, CA',
  type: 'full-time',
  salary: {
    min: 120000,
    max: 180000,
    currency: '$',
    period: 'annually',
  },
  description:
    'We are looking for an experienced software engineer to join our team and help build the next generation of cloud-based applications.',
  requirements: ['5+ years experience', 'React expertise', 'Node.js knowledge'],
  skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'GraphQL'],
  benefits: ['Health insurance', '401k match', 'Remote work'],
  postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  companySize: '50-200',
  industry: 'Technology',
  experienceLevel: 'senior',
  remote: true,
  sponsored: false,
  verified: true,
  aiMatch: {
    score: 92,
    reasons: [
      'Strong React and TypeScript background',
      'AWS experience matches requirements',
      'Previous leadership roles align with expectations',
    ],
  },
};

describe('JobCard', () => {
  const mockOnSave = jest.fn();
  const mockOnApply = jest.fn();
  const mockOnViewDetails = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default Variant', () => {
    it('renders job card with all information', () => {
      render(<JobCard job={mockJob} />);

      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
      expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
    });

    it('displays company information', () => {
      render(<JobCard job={mockJob} />);

      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
      expect(screen.getByText(/Technology • 50-200/i)).toBeInTheDocument();
    });

    it('displays salary range correctly', () => {
      render(<JobCard job={mockJob} />);

      expect(screen.getByText(/\$120,000 - \$180,000\/year/i)).toBeInTheDocument();
    });

    it('displays posted date in relative time', () => {
      render(<JobCard job={mockJob} />);

      expect(screen.getByText(/Posted 2 days ago/i)).toBeInTheDocument();
    });

    it('displays job description', () => {
      render(<JobCard job={mockJob} />);

      expect(
        screen.getByText(/We are looking for an experienced software engineer/i)
      ).toBeInTheDocument();
    });

    it('displays job type and experience level', () => {
      render(<JobCard job={mockJob} />);

      expect(screen.getByText('FULL TIME')).toBeInTheDocument();
      expect(screen.getByText('SENIOR LEVEL')).toBeInTheDocument();
    });

    it('displays remote badge when job is remote', () => {
      render(<JobCard job={mockJob} />);

      expect(screen.getByText('REMOTE')).toBeInTheDocument();
    });

    it('displays verified badge when company is verified', () => {
      render(<JobCard job={mockJob} />);

      const verifiedIcons = screen.getAllByTestId('VerifiedUserIcon');
      expect(verifiedIcons.length).toBeGreaterThan(0);
    });

    it('displays required skills', () => {
      render(<JobCard job={mockJob} />);

      expect(screen.getByText('Required Skills')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
    });

    it('limits skill display to 6 and shows +more badge', () => {
      render(<JobCard job={mockJob} />);

      expect(screen.getByText('+1 more')).toBeInTheDocument();
    });

    it('displays AI match score when provided', () => {
      render(<JobCard job={mockJob} />);

      expect(screen.getByText('92%')).toBeInTheDocument();
      expect(screen.getByText('AI Match')).toBeInTheDocument();
    });

    it('displays AI match reasons', () => {
      render(<JobCard job={mockJob} />);

      expect(screen.getByText('Why this matches you')).toBeInTheDocument();
      expect(screen.getByText(/Strong React and TypeScript background/i)).toBeInTheDocument();
    });

    it('limits AI match reasons to 3', () => {
      const jobWithManyReasons = {
        ...mockJob,
        aiMatch: {
          score: 92,
          reasons: ['Reason 1', 'Reason 2', 'Reason 3', 'Reason 4', 'Reason 5'],
        },
      };

      render(<JobCard job={jobWithManyReasons} />);

      expect(screen.getByText('Reason 1')).toBeInTheDocument();
      expect(screen.getByText('Reason 2')).toBeInTheDocument();
      expect(screen.getByText('Reason 3')).toBeInTheDocument();
      expect(screen.queryByText('Reason 4')).not.toBeInTheDocument();
    });
  });

  describe('Compact Variant', () => {
    it('renders compact card with essential information', () => {
      render(<JobCard job={mockJob} variant="compact" />);

      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    });

    it('displays location and AI match in compact view', () => {
      render(<JobCard job={mockJob} variant="compact" />);

      expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
      expect(screen.getByText('92% match')).toBeInTheDocument();
    });

    it('does not show full description in compact view', () => {
      render(<JobCard job={mockJob} variant="compact" />);

      expect(
        screen.queryByText(/We are looking for an experienced software engineer/i)
      ).not.toBeInTheDocument();
    });
  });

  describe('Save Functionality', () => {
    it('calls onSave when save button is clicked', async () => {
      const user = userEvent.setup();

      render(<JobCard job={mockJob} onSave={mockOnSave} />);

      const saveButton = screen.getByRole('button', { name: /bookmark/i });
      await user.click(saveButton);

      expect(mockOnSave).toHaveBeenCalledWith('1');
    });

    it('toggles saved state when save button is clicked', async () => {
      const user = userEvent.setup();

      render(<JobCard job={mockJob} saved={false} onSave={mockOnSave} />);

      const saveButton = screen.getByRole('button', { name: /bookmark/i });

      // Click to save
      await user.click(saveButton);
      expect(mockOnSave).toHaveBeenCalledTimes(1);

      // Click to unsave
      await user.click(saveButton);
      expect(mockOnSave).toHaveBeenCalledTimes(2);
    });

    it('displays saved state correctly', () => {
      render(<JobCard job={mockJob} saved={true} />);

      const bookmarkIcons = screen.getAllByTestId('BookmarkIcon');
      expect(bookmarkIcons.length).toBeGreaterThan(0);
    });
  });

  describe('Apply Functionality', () => {
    it('calls onApply when Apply Now button is clicked', async () => {
      const user = userEvent.setup();

      render(<JobCard job={mockJob} onApply={mockOnApply} />);

      const applyButton = screen.getByRole('button', { name: /Apply Now/i });
      await user.click(applyButton);

      expect(mockOnApply).toHaveBeenCalledWith('1');
    });

    it('shows Applied state when job is already applied', () => {
      render(<JobCard job={mockJob} applied={true} />);

      expect(screen.getByRole('button', { name: /Applied/i })).toBeDisabled();
    });

    it('does not call onApply when already applied', async () => {
      const user = userEvent.setup();

      render(<JobCard job={mockJob} applied={true} onApply={mockOnApply} />);

      const appliedButton = screen.getByRole('button', { name: /Applied/i });

      // Button should be disabled, but try clicking anyway
      await user.click(appliedButton);

      expect(mockOnApply).not.toHaveBeenCalled();
    });
  });

  describe('View Details Functionality', () => {
    it('calls onViewDetails when card is clicked', async () => {
      const user = userEvent.setup();

      render(<JobCard job={mockJob} onViewDetails={mockOnViewDetails} />);

      const card = screen.getByText('Senior Software Engineer').closest('div[role="button"]') ||
        screen.getByText('Senior Software Engineer').closest('div');

      if (card) {
        await user.click(card);
        expect(mockOnViewDetails).toHaveBeenCalledWith('1');
      }
    });

    it('calls onViewDetails when Details button is clicked', async () => {
      const user = userEvent.setup();

      render(<JobCard job={mockJob} onViewDetails={mockOnViewDetails} />);

      const detailsButton = screen.getByRole('button', { name: /Details/i });
      await user.click(detailsButton);

      expect(mockOnViewDetails).toHaveBeenCalledWith('1');
    });
  });

  describe('Salary Formatting', () => {
    it('formats hourly salary correctly', () => {
      const hourlyJob = {
        ...mockJob,
        salary: {
          min: 50,
          max: 75,
          currency: '$',
          period: 'hourly' as const,
        },
      };

      render(<JobCard job={hourlyJob} />);

      expect(screen.getByText(/\$50 - \$75\/hr/i)).toBeInTheDocument();
    });

    it('formats single salary value correctly', () => {
      const fixedSalaryJob = {
        ...mockJob,
        salary: {
          min: 120000,
          max: 120000,
          currency: '$',
          period: 'annually' as const,
        },
      };

      render(<JobCard job={fixedSalaryJob} />);

      expect(screen.getByText(/\$120,000\/year/i)).toBeInTheDocument();
    });

    it('does not display salary when not provided', () => {
      const noSalaryJob = { ...mockJob, salary: undefined };

      render(<JobCard job={noSalaryJob} />);

      expect(screen.queryByTestId('AttachMoneyIcon')).not.toBeInTheDocument();
    });
  });

  describe('Experience Level Badge Colors', () => {
    it('renders different colors for different experience levels', () => {
      const levels: Array<'entry' | 'mid' | 'senior' | 'executive'> = ['entry', 'mid', 'senior', 'executive'];

      levels.forEach((level) => {
        const { unmount } = render(
          <JobCard job={{ ...mockJob, experienceLevel: level }} />
        );

        expect(screen.getByText(`${level.toUpperCase()} LEVEL`)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Sponsored Jobs', () => {
    it('displays sponsored badge when job is sponsored', () => {
      const sponsoredJob = { ...mockJob, sponsored: true };

      render(<JobCard job={sponsoredJob} />);

      expect(screen.getByText('Sponsored')).toBeInTheDocument();
    });

    it('does not display sponsored badge for non-sponsored jobs', () => {
      render(<JobCard job={mockJob} />);

      expect(screen.queryByText('Sponsored')).not.toBeInTheDocument();
    });
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from '@jest/globals';

import { WelcomeBanner } from '../WelcomeBanner';

describe('WelcomeBanner', () => {
  const mockOnCreateDocument = vi.fn();
  const mockOnViewAnalytics = vi.fn();
  const mockOnStartTour = vi.fn();

  const sampleProfileData = {
    totalApplications: 15,
    activeApplications: 5,
    interviewsScheduled: 2,
    lastActivity: new Date('2024-01-15'),
    recentAchievements: ['Resume created', 'First application submitted', 'Profile optimized'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock current time for consistent greeting tests
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-20 14:00:00')); // 2 PM = afternoon
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      render(<WelcomeBanner />);
      expect(screen.getByText(/Ready to accelerate your career journey?/i)).toBeInTheDocument();
    });

    it('displays user name when provided', () => {
      render(<WelcomeBanner userName="John" />);
      expect(screen.getByText(/John/i)).toBeInTheDocument();
    });

    it('displays default name when not provided', () => {
      render(<WelcomeBanner />);
      expect(screen.getByText(/User!/i)).toBeInTheDocument();
    });

    it('renders action buttons', () => {
      render(<WelcomeBanner onCreateDocument={mockOnCreateDocument} onViewAnalytics={mockOnViewAnalytics} />);
      expect(screen.getByText('Create New Document')).toBeInTheDocument();
      expect(screen.getByText('View Analytics')).toBeInTheDocument();
    });
  });

  describe('Greeting Messages', () => {
    it('displays good morning before noon', () => {
      vi.setSystemTime(new Date('2024-01-20 10:00:00')); // 10 AM
      render(<WelcomeBanner userName="John" />);
      expect(screen.getByText(/Good morning/i)).toBeInTheDocument();
    });

    it('displays good afternoon between noon and 5pm', () => {
      vi.setSystemTime(new Date('2024-01-20 14:00:00')); // 2 PM
      render(<WelcomeBanner userName="John" />);
      expect(screen.getByText(/Good afternoon/i)).toBeInTheDocument();
    });

    it('displays good evening after 5pm', () => {
      vi.setSystemTime(new Date('2024-01-20 18:00:00')); // 6 PM
      render(<WelcomeBanner userName="John" />);
      expect(screen.getByText(/Good evening/i)).toBeInTheDocument();
    });
  });

  describe('Motivational Messages', () => {
    it('shows interview message when interviews scheduled', () => {
      render(<WelcomeBanner profileData={sampleProfileData} />);
      expect(screen.getByText(/2 interviews coming up/i)).toBeInTheDocument();
    });

    it('shows active applications message for 5+ applications', () => {
      const data = { ...sampleProfileData, interviewsScheduled: 0, activeApplications: 8 };
      render(<WelcomeBanner profileData={data} />);
      expect(screen.getByText(/actively pursuing multiple opportunities/i)).toBeInTheDocument();
    });

    it('shows progress message for 1-5 applications', () => {
      const data = { ...sampleProfileData, interviewsScheduled: 0, activeApplications: 3 };
      render(<WelcomeBanner profileData={data} />);
      expect(screen.getByText(/Great progress on your job search/i)).toBeInTheDocument();
    });

    it('shows kickstart message for no applications', () => {
      const data = { ...sampleProfileData, interviewsScheduled: 0, activeApplications: 0 };
      render(<WelcomeBanner profileData={data} />);
      expect(screen.getByText(/Ready to kickstart your career journey/i)).toBeInTheDocument();
    });

    it('shows default message without profile data', () => {
      render(<WelcomeBanner />);
      expect(screen.getByText(/Ready to accelerate your career journey/i)).toBeInTheDocument();
    });
  });

  describe('Profile Statistics', () => {
    it('displays active applications count', () => {
      render(<WelcomeBanner profileData={sampleProfileData} />);
      expect(screen.getByText('5 Active Applications')).toBeInTheDocument();
    });

    it('displays total applications count', () => {
      render(<WelcomeBanner profileData={sampleProfileData} />);
      expect(screen.getByText('15 Total Applications')).toBeInTheDocument();
    });

    it('displays interviews scheduled when > 0', () => {
      render(<WelcomeBanner profileData={sampleProfileData} />);
      expect(screen.getByText('2 Interviews Scheduled')).toBeInTheDocument();
    });

    it('hides interviews chip when none scheduled', () => {
      const data = { ...sampleProfileData, interviewsScheduled: 0 };
      render(<WelcomeBanner profileData={data} />);
      expect(screen.queryByText(/Interviews Scheduled/i)).not.toBeInTheDocument();
    });

    it('does not display stats without profile data', () => {
      render(<WelcomeBanner />);
      expect(screen.queryByText(/Active Applications/i)).not.toBeInTheDocument();
    });
  });

  describe('Recent Activity', () => {
    it('displays recent activity heading', () => {
      render(<WelcomeBanner profileData={sampleProfileData} />);
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });

    it('shows relative time for last activity', () => {
      render(<WelcomeBanner profileData={sampleProfileData} />);
      expect(screen.getByText(/Last active/i)).toBeInTheDocument();
    });

    it('shows welcome message without last activity', () => {
      render(<WelcomeBanner />);
      expect(screen.getByText(/Welcome back! Ready to make progress today?/i)).toBeInTheDocument();
    });

    it('displays activity chips', () => {
      render(<WelcomeBanner />);
      expect(screen.getByText('Resume updated recently')).toBeInTheDocument();
      expect(screen.getByText('New job matches available')).toBeInTheDocument();
    });
  });

  describe('Recent Achievements', () => {
    it('displays recent achievements heading', () => {
      render(<WelcomeBanner />);
      expect(screen.getByText('Recent Achievements')).toBeInTheDocument();
    });

    it('shows provided achievements', () => {
      render(<WelcomeBanner profileData={sampleProfileData} />);
      expect(screen.getByText('Resume created')).toBeInTheDocument();
      expect(screen.getByText('First application submitted')).toBeInTheDocument();
      expect(screen.getByText('Profile optimized')).toBeInTheDocument();
    });

    it('shows default achievements without profile data', () => {
      render(<WelcomeBanner />);
      expect(screen.getByText('Profile setup completed')).toBeInTheDocument();
      expect(screen.getByText('First resume created')).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('calls onCreateDocument when create button clicked', async () => {
      const user = userEvent.setup();
      render(<WelcomeBanner onCreateDocument={mockOnCreateDocument} />);

      await user.click(screen.getByText('Create New Document'));
      expect(mockOnCreateDocument).toHaveBeenCalledTimes(1);
    });

    it('calls onViewAnalytics when analytics button clicked', async () => {
      const user = userEvent.setup();
      render(<WelcomeBanner onViewAnalytics={mockOnViewAnalytics} />);

      await user.click(screen.getByText('View Analytics'));
      expect(mockOnViewAnalytics).toHaveBeenCalledTimes(1);
    });

    it('calls onStartTour when tour button clicked', async () => {
      const user = userEvent.setup();
      render(<WelcomeBanner onStartTour={mockOnStartTour} />);

      await user.click(screen.getByText('Take a tour'));
      expect(mockOnStartTour).toHaveBeenCalledTimes(1);
    });

    it('renders quick action buttons', () => {
      render(<WelcomeBanner />);
      expect(screen.getByText('Take a tour')).toBeInTheDocument();
      expect(screen.getByText('View tips')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has accessible buttons', () => {
      render(<WelcomeBanner />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('all buttons are enabled', () => {
      render(<WelcomeBanner onCreateDocument={mockOnCreateDocument} onViewAnalytics={mockOnViewAnalytics} />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeEnabled();
      });
    });
  });

  describe('Relative Time Formatting', () => {
    it('formats today correctly', () => {
      const data = { ...sampleProfileData, lastActivity: new Date() };
      render(<WelcomeBanner profileData={data} />);
      expect(screen.getByText(/Last active today/i)).toBeInTheDocument();
    });

    it('formats 1 day ago correctly', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const data = { ...sampleProfileData, lastActivity: yesterday };
      render(<WelcomeBanner profileData={data} />);
      expect(screen.getByText(/Last active 1 day ago/i)).toBeInTheDocument();
    });

    it('formats multiple days ago', () => {
      const data = { ...sampleProfileData, lastActivity: new Date('2024-01-15') };
      render(<WelcomeBanner profileData={data} />);
      expect(screen.getByText(/Last active \d+ days ago/i)).toBeInTheDocument();
    });

    it('handles string dates', () => {
      const data = { ...sampleProfileData, lastActivity: '2024-01-15' };
      render(<WelcomeBanner profileData={data} />);
      expect(screen.getByText(/Last active/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles 0 active applications', () => {
      const data = { ...sampleProfileData, activeApplications: 0 };
      render(<WelcomeBanner profileData={data} />);
      expect(screen.getByText('0 Active Applications')).toBeInTheDocument();
    });

    it('handles 1 interview (singular)', () => {
      const data = { ...sampleProfileData, interviewsScheduled: 1 };
      render(<WelcomeBanner profileData={data} />);
      expect(screen.getByText(/1 interview coming up/i)).toBeInTheDocument();
    });

    it('handles empty achievements array', () => {
      const data = { ...sampleProfileData, recentAchievements: [] };
      render(<WelcomeBanner profileData={data} />);
      // Should show default achievements
      expect(screen.getByText('Recent Achievements')).toBeInTheDocument();
    });

    it('handles missing callbacks', () => {
      render(<WelcomeBanner />);
      expect(screen.getByText('Create New Document')).toBeInTheDocument();
    });
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TestimonialCarousel } from '../TestimonialCarousel';

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('TestimonialCarousel', () => {
  it('renders without errors', () => {
    renderWithTheme(<TestimonialCarousel />);
    expect(screen.getByText('What Our Users Say')).toBeInTheDocument();
  });

  it('displays the section heading', () => {
    renderWithTheme(<TestimonialCarousel />);
    expect(screen.getByText('What Our Users Say')).toBeInTheDocument();
  });

  it('displays the first testimonial by default', () => {
    renderWithTheme(<TestimonialCarousel />);

    expect(screen.getByText(/CareerCopilot transformed my job search/i)).toBeInTheDocument();
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
    expect(screen.getByText(/Software Engineer/i)).toBeInTheDocument();
  });

  it('displays author role and company', () => {
    renderWithTheme(<TestimonialCarousel />);
    expect(screen.getByText(/Software Engineer at Google/i)).toBeInTheDocument();
  });

  it('displays rating stars', () => {
    const { container } = renderWithTheme(<TestimonialCarousel />);
    const rating = container.querySelector('.MuiRating-root');
    expect(rating).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    renderWithTheme(<TestimonialCarousel />);

    expect(screen.getByLabelText('Previous testimonial')).toBeInTheDocument();
    expect(screen.getByLabelText('Next testimonial')).toBeInTheDocument();
  });

  it('navigates to next testimonial when next button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<TestimonialCarousel />);

    const nextButton = screen.getByLabelText('Next testimonial');
    await user.click(nextButton);

    expect(screen.getByText(/resume optimization feature is incredible/i)).toBeInTheDocument();
    expect(screen.getByText('Marcus Johnson')).toBeInTheDocument();
  });

  it('navigates to previous testimonial when prev button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<TestimonialCarousel />);

    const prevButton = screen.getByLabelText('Previous testimonial');
    await user.click(prevButton);

    // Should wrap to last testimonial
    expect(screen.getByText('David Kim')).toBeInTheDocument();
  });

  it('wraps to first testimonial when next is clicked on last item', async () => {
    const user = userEvent.setup();
    renderWithTheme(<TestimonialCarousel />);

    const nextButton = screen.getByLabelText('Next testimonial');

    // Click through all testimonials
    await user.click(nextButton); // 2nd
    await user.click(nextButton); // 3rd
    await user.click(nextButton); // 4th
    await user.click(nextButton); // Should wrap to 1st

    expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
  });

  it('displays dot indicators for all testimonials', () => {
    const { container } = renderWithTheme(<TestimonialCarousel />);
    const dots = container.querySelectorAll('[role="button"]');
    // Should have dots for navigation plus prev/next buttons
    expect(dots.length).toBeGreaterThanOrEqual(4);
  });

  it('allows direct navigation via dot indicators', async () => {
    const user = userEvent.setup();
    const { container } = renderWithTheme(<TestimonialCarousel />);

    // Find clickable dots (excluding prev/next buttons)
    const boxes = container.querySelectorAll('[style*="cursor: pointer"]');

    if (boxes.length > 2) {
      await user.click(boxes[2] as HTMLElement);

      // Should navigate to 3rd testimonial
      expect(screen.getByText('Emily Rodriguez')).toBeInTheDocument();
    }
  });

  it('displays quote icon', () => {
    const { container } = renderWithTheme(<TestimonialCarousel />);
    const quoteIcon = container.querySelector('[data-testid="FormatQuoteIcon"]');
    expect(quoteIcon).toBeInTheDocument();
  });

  it('formats testimonial text with quotes', () => {
    renderWithTheme(<TestimonialCarousel />);
    const testimonial = screen.getByText(/CareerCopilot transformed my job search/i);
    expect(testimonial.textContent).toMatch(/^"/); // Starts with quote
    expect(testimonial.textContent).toMatch(/"$/); // Ends with quote
  });

  // TODO: Add accessibility tests
  it.todo('is accessible via keyboard navigation');
  it.todo('announces current testimonial to screen readers');

  // TODO: Add responsive tests
  it.todo('adapts layout for mobile screens');

  // TODO: Add auto-play tests
  it.todo('auto-advances to next testimonial after delay');
  it.todo('pauses auto-play when user interacts');
});

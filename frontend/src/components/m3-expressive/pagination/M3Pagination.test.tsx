import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { M3Pagination } from './M3Pagination';

describe('M3Pagination Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders pagination controls', () => {
      render(<M3Pagination page={1} totalPages={10} onChange={() => {}} />);
      expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(
        <M3Pagination page={1} totalPages={10} onChange={() => {}} />
      );
      const element = container.querySelector('.m3-pagination');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Pagination page={1} totalPages={10} onChange={() => {}} className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    test('does not render when totalPages is 1 or less', () => {
      const { container } = render(
        <M3Pagination page={1} totalPages={1} onChange={() => {}} />
      );
      expect(container.querySelector('.m3-pagination')).not.toBeInTheDocument();
    });
  });

  // Page Navigation Tests
  describe('Page Navigation', () => {
    test('calls onChange when page button is clicked', () => {
      const handleChange = jest.fn();
      render(<M3Pagination page={1} totalPages={10} onChange={handleChange} />);
      const page2Button = screen.getByLabelText('Page 2');
      fireEvent.click(page2Button);
      expect(handleChange).toHaveBeenCalledWith(2);
    });

    test('calls onChange when next button is clicked', () => {
      const handleChange = jest.fn();
      render(<M3Pagination page={1} totalPages={10} onChange={handleChange} />);
      const nextButton = screen.getByLabelText('Next page');
      fireEvent.click(nextButton);
      expect(handleChange).toHaveBeenCalledWith(2);
    });

    test('calls onChange when previous button is clicked', () => {
      const handleChange = jest.fn();
      render(<M3Pagination page={2} totalPages={10} onChange={handleChange} />);
      const prevButton = screen.getByLabelText('Previous page');
      fireEvent.click(prevButton);
      expect(handleChange).toHaveBeenCalledWith(1);
    });

    test('disables previous button on first page', () => {
      render(<M3Pagination page={1} totalPages={10} onChange={() => {}} />);
      const prevButton = screen.getByLabelText('Previous page');
      expect(prevButton).toBeDisabled();
    });

    test('disables next button on last page', () => {
      render(<M3Pagination page={10} totalPages={10} onChange={() => {}} />);
      const nextButton = screen.getByLabelText('Next page');
      expect(nextButton).toBeDisabled();
    });
  });

  // First/Last Page Tests
  describe('First/Last Page Buttons', () => {
    test('shows first/last buttons by default', () => {
      render(<M3Pagination page={5} totalPages={10} onChange={() => {}} />);
      expect(screen.getByLabelText('First page')).toBeInTheDocument();
      expect(screen.getByLabelText('Last page')).toBeInTheDocument();
    });

    test('hides first/last buttons when showFirstLast is false', () => {
      render(
        <M3Pagination page={5} totalPages={10} onChange={() => {}} showFirstLast={false} />
      );
      expect(screen.queryByLabelText('First page')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Last page')).not.toBeInTheDocument();
    });

    test('calls onChange when first page button is clicked', () => {
      const handleChange = jest.fn();
      render(<M3Pagination page={5} totalPages={10} onChange={handleChange} />);
      const firstButton = screen.getByLabelText('First page');
      fireEvent.click(firstButton);
      expect(handleChange).toHaveBeenCalledWith(1);
    });

    test('calls onChange when last page button is clicked', () => {
      const handleChange = jest.fn();
      render(<M3Pagination page={5} totalPages={10} onChange={handleChange} />);
      const lastButton = screen.getByLabelText('Last page');
      fireEvent.click(lastButton);
      expect(handleChange).toHaveBeenCalledWith(10);
    });
  });

  // Ellipsis Tests
  describe('Ellipsis', () => {
    test('shows ellipsis when there are many pages', () => {
      const { container } = render(
        <M3Pagination page={5} totalPages={20} onChange={() => {}} />
      );
      const ellipsis = container.querySelector('.m3-pagination__ellipsis');
      expect(ellipsis).toBeInTheDocument();
    });
  });

  // Color Variants Tests
  describe('Color Variants', () => {
    const colors = ['primary', 'secondary', 'tertiary', 'error'] as const;

    colors.forEach((color) => {
      test(`applies ${color} color class`, () => {
        const { container } = render(
          <M3Pagination page={1} totalPages={10} onChange={() => {}} color={color} />
        );
        const pagination = container.querySelector(`.m3-pagination--${color}`);
        expect(pagination).toBeInTheDocument();
      });
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has nav element with aria-label', () => {
      const { container } = render(
        <M3Pagination page={1} totalPages={10} onChange={() => {}} />
      );
      const nav = container.querySelector('nav[aria-label="Pagination"]');
      expect(nav).toBeInTheDocument();
    });

    test('current page has aria-current="page"', () => {
      render(<M3Pagination page={3} totalPages={10} onChange={() => {}} />);
      const page3Button = screen.getByLabelText('Page 3');
      expect(page3Button).toHaveAttribute('aria-current', 'page');
    });
  });
});

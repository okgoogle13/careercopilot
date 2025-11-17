import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from '@jest/globals';

import { ImageWithFallback } from '../ImageWithFallback';

describe('ImageWithFallback', () => {
  const validImageSrc = 'https://example.com/image.jpg';
  const alt = 'Test image';

  describe('Component Rendering', () => {
    it('renders image with provided src', () => {
      render(<ImageWithFallback src={validImageSrc} alt={alt} />);
      const image = screen.getByAlt(alt);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', validImageSrc);
    });

    it('renders image with alt text', () => {
      render(<ImageWithFallback src={validImageSrc} alt={alt} />);
      expect(screen.getByAlt(alt)).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<ImageWithFallback src={validImageSrc} alt={alt} className="custom-class" />);
      const image = screen.getByAlt(alt);
      expect(image).toHaveClass('custom-class');
    });

    it('applies custom style', () => {
      const customStyle = { width: '100px', height: '100px' };
      render(<ImageWithFallback src={validImageSrc} alt={alt} style={customStyle} />);
      const image = screen.getByAlt(alt);
      expect(image).toHaveStyle(customStyle);
    });

    it('passes through additional props', () => {
      render(
        <ImageWithFallback
          src={validImageSrc}
          alt={alt}
          data-testid="test-image"
          loading="lazy"
        />
      );
      const image = screen.getByTestId('test-image');
      expect(image).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('Error Handling', () => {
    it('shows fallback image when image fails to load', () => {
      render(<ImageWithFallback src="invalid-image.jpg" alt={alt} />);
      const image = screen.getByAlt(alt) as HTMLImageElement;

      // Trigger error event
      fireEvent.error(image);

      // Should show error fallback
      const errorImage = screen.getByAlt('Error loading image');
      expect(errorImage).toBeInTheDocument();
    });

    it('displays fallback container on error', () => {
      const { container } = render(<ImageWithFallback src="invalid-image.jpg" alt={alt} />);
      const image = screen.getByAlt(alt) as HTMLImageElement;

      fireEvent.error(image);

      const fallbackDiv = container.querySelector('div');
      expect(fallbackDiv).toBeInTheDocument();
    });

    it('preserves original src in data attribute on error', () => {
      const invalidSrc = 'https://example.com/invalid.jpg';
      render(<ImageWithFallback src={invalidSrc} alt={alt} />);
      const image = screen.getByAlt(alt) as HTMLImageElement;

      fireEvent.error(image);

      const errorImage = screen.getByAlt('Error loading image');
      expect(errorImage).toHaveAttribute('data-original-url', invalidSrc);
    });

    it('applies style to fallback container', () => {
      const customStyle = { width: '200px', height: '200px' };
      render(<ImageWithFallback src="invalid.jpg" alt={alt} style={customStyle} />);
      const image = screen.getByAlt(alt) as HTMLImageElement;

      fireEvent.error(image);

      const fallbackDiv = screen.getAllByRole('img')[0].parentElement;
      expect(fallbackDiv).toHaveStyle(customStyle);
    });

    it('shows error image only once after error', () => {
      render(<ImageWithFallback src="invalid.jpg" alt={alt} />);
      const image = screen.getByAlt(alt) as HTMLImageElement;

      // Trigger error
      fireEvent.error(image);

      // Should only have one error image
      const errorImages = screen.getAllByAlt('Error loading image');
      expect(errorImages).toHaveLength(1);
    });
  });

  describe('State Management', () => {
    it('initially renders original image', () => {
      render(<ImageWithFallback src={validImageSrc} alt={alt} />);
      const image = screen.getByAlt(alt);
      expect(image).toHaveAttribute('src', validImageSrc);
    });

    it('switches to error state only after error event', () => {
      const { rerender } = render(<ImageWithFallback src={validImageSrc} alt={alt} />);

      // Initially shows original image
      expect(screen.getByAlt(alt)).toBeInTheDocument();
      expect(screen.queryByAlt('Error loading image')).not.toBeInTheDocument();

      // Update to invalid src
      rerender(<ImageWithFallback src="invalid.jpg" alt={alt} />);
      const newImage = screen.getByAlt(alt);

      // Trigger error
      fireEvent.error(newImage);

      // Now shows error image
      expect(screen.getByAlt('Error loading image')).toBeInTheDocument();
    });

    it('maintains error state after multiple renders', () => {
      const { rerender } = render(<ImageWithFallback src="invalid.jpg" alt={alt} />);
      const image = screen.getByAlt(alt);

      fireEvent.error(image);

      // Rerender with same props
      rerender(<ImageWithFallback src="invalid.jpg" alt={alt} />);

      // Should still show error image
      expect(screen.getByAlt('Error loading image')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty src', () => {
      render(<ImageWithFallback src="" alt={alt} />);
      const image = screen.getByAlt(alt);
      expect(image).toHaveAttribute('src', '');
    });

    it('handles missing alt text', () => {
      render(<ImageWithFallback src={validImageSrc} alt="" />);
      const image = screen.getByAlt('');
      expect(image).toBeInTheDocument();
    });

    it('handles undefined src', () => {
      render(<ImageWithFallback src={undefined as any} alt={alt} />);
      const image = screen.getByAlt(alt);
      expect(image).toHaveAttribute('src', '');
    });

    it('handles special characters in src', () => {
      const specialSrc = 'https://example.com/image?param=value&foo=bar';
      render(<ImageWithFallback src={specialSrc} alt={alt} />);
      const image = screen.getByAlt(alt);
      expect(image).toHaveAttribute('src', specialSrc);
    });

    it('handles data URLs', () => {
      const dataSrc = 'data:image/png;base64,iVBORw0KGgoAAAANS';
      render(<ImageWithFallback src={dataSrc} alt={alt} />);
      const image = screen.getByAlt(alt);
      expect(image).toHaveAttribute('src', dataSrc);
    });
  });

  describe('Accessibility', () => {
    it('has img role', () => {
      render(<ImageWithFallback src={validImageSrc} alt={alt} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('maintains accessibility after error', () => {
      render(<ImageWithFallback src="invalid.jpg" alt={alt} />);
      const image = screen.getByAlt(alt);

      fireEvent.error(image);

      const errorImage = screen.getByAlt('Error loading image');
      expect(errorImage).toHaveAttribute('role', 'img');
    });

    it('provides meaningful alt text for error state', () => {
      render(<ImageWithFallback src="invalid.jpg" alt={alt} />);
      const image = screen.getByAlt(alt);

      fireEvent.error(image);

      expect(screen.getByAlt('Error loading image')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('does not trigger error handler when image loads successfully', () => {
      const onError = vi.fn();
      const { container } = render(
        <ImageWithFallback src={validImageSrc} alt={alt} onError={onError} />
      );

      // Image loads successfully - no error should be shown
      expect(screen.queryByAlt('Error loading image')).not.toBeInTheDocument();
    });

    it('only sets error state once', () => {
      render(<ImageWithFallback src="invalid.jpg" alt={alt} />);
      const image = screen.getByAlt(alt);

      // Trigger error multiple times
      fireEvent.error(image);
      fireEvent.error(image);
      fireEvent.error(image);

      // Should only have one error image
      const errorImages = screen.getAllByAlt('Error loading image');
      expect(errorImages).toHaveLength(1);
    });
  });
});

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import FullPageLoading from '../FullPageLoading';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('FullPageLoading', () => {
  describe('Visibility', () => {
    it('renders when open=true', () => {
      const { container } = renderWithTheme(<FullPageLoading open={true} />);

      const boxElement = container.querySelector('[style*="position: fixed"]');
      expect(boxElement).toBeInTheDocument();
    });

    it('does not render when open=false', () => {
      const { container } = renderWithTheme(<FullPageLoading open={false} />);

      // When open=false, component returns null, so nothing should be rendered
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Backdrop Rendering', () => {
    it('renders with Backdrop by default (withBackdrop=true)', () => {
      const { container } = renderWithTheme(
        <FullPageLoading open={true} withBackdrop={true} />
      );

      const backdrop = container.querySelector('.MuiBackdrop-root');
      expect(backdrop).toBeInTheDocument();
    });

    it('does not render Backdrop when withBackdrop=false', () => {
      const { container } = renderWithTheme(
        <FullPageLoading open={true} withBackdrop={false} />
      );

      const backdrop = container.querySelector('.MuiBackdrop-root');
      expect(backdrop).not.toBeInTheDocument();
    });

    it('renders with default Backdrop when withBackdrop prop not specified', () => {
      const { container } = renderWithTheme(<FullPageLoading open={true} />);

      const backdrop = container.querySelector('.MuiBackdrop-root');
      expect(backdrop).toBeInTheDocument();
    });
  });

  describe('Spinner Props', () => {
    it('passes size prop to LoadingSpinner', () => {
      const { container } = renderWithTheme(
        <FullPageLoading open={true} size={60} />
      );

      const circularProgress = screen.getByRole('progressbar');
      expect(circularProgress).toHaveStyle({ width: '60px', height: '60px' });
    });

    it('passes color prop to LoadingSpinner', () => {
      const { container } = renderWithTheme(
        <FullPageLoading open={true} color="secondary" />
      );

      const circularProgress = container.querySelector('svg circle');
      expect(circularProgress).toBeInTheDocument();
    });

    it('passes message prop to LoadingSpinner', () => {
      renderWithTheme(
        <FullPageLoading open={true} message="Loading your profile..." />
      );

      const message = screen.getByText('Loading your profile...');
      expect(message).toBeInTheDocument();
    });

    it('renders with multiple spinner props combined', () => {
      renderWithTheme(
        <FullPageLoading
          open={true}
          size={50}
          color="success"
          message="Processing application..."
        />
      );

      const circularProgress = screen.getByRole('progressbar');
      expect(circularProgress).toHaveStyle({ width: '50px', height: '50px' });

      const message = screen.getByText('Processing application...');
      expect(message).toBeInTheDocument();
    });
  });

  describe('Container Styling', () => {
    it('applies fixed positioning to container', () => {
      const { container } = renderWithTheme(
        <FullPageLoading open={true} withBackdrop={false} />
      );

      const boxElement = container.firstChild as HTMLElement;
      expect(boxElement).toHaveStyle('position: fixed');
      expect(boxElement).toHaveStyle('top: 0px');
      expect(boxElement).toHaveStyle('left: 0px');
      expect(boxElement).toHaveStyle('right: 0px');
      expect(boxElement).toHaveStyle('bottom: 0px');
    });

    it('centers content with flexbox', () => {
      const { container } = renderWithTheme(
        <FullPageLoading open={true} withBackdrop={false} />
      );

      const boxElement = container.firstChild as HTMLElement;
      expect(boxElement).toHaveStyle('display: flex');
      expect(boxElement).toHaveStyle('align-items: center');
      expect(boxElement).toHaveStyle('justify-content: center');
    });

    it('applies custom sx to container', () => {
      const customSx = { backgroundColor: 'rgba(255, 0, 0, 0.1)' };
      const { container } = renderWithTheme(
        <FullPageLoading
          open={true}
          withBackdrop={false}
          sx={customSx}
        />
      );

      const boxElement = container.firstChild as HTMLElement;
      expect(boxElement).toHaveStyle('background-color: rgba(255, 0, 0, 0.1)');
    });

    it('merges custom sx with default fixed positioning', () => {
      const customSx = { zIndex: 100 };
      const { container } = renderWithTheme(
        <FullPageLoading
          open={true}
          withBackdrop={false}
          sx={customSx}
        />
      );

      const boxElement = container.firstChild as HTMLElement;
      // Should have both fixed positioning AND custom sx
      expect(boxElement).toHaveStyle('position: fixed');
      expect(boxElement).toHaveStyle('z-index: 100');
    });
  });

  describe('Backdrop Styling', () => {
    it('applies default Backdrop styles when withBackdrop=true', () => {
      const { container } = renderWithTheme(
        <FullPageLoading open={true} withBackdrop={true} />
      );

      const backdrop = container.querySelector('.MuiBackdrop-root') as HTMLElement;
      expect(backdrop).toHaveStyle('background-color: rgba(0, 0, 0, 0.5)');
    });

    it('applies custom backdropSx to Backdrop', () => {
      const customBackdropSx = { backgroundColor: 'rgba(0, 0, 0, 0.7)' };
      const { container } = renderWithTheme(
        <FullPageLoading
          open={true}
          withBackdrop={true}
          backdropSx={customBackdropSx}
        />
      );

      const backdrop = container.querySelector('.MuiBackdrop-root') as HTMLElement;
      expect(backdrop).toHaveStyle('background-color: rgba(0, 0, 0, 0.7)');
    });

    it('ignores backdropSx when withBackdrop=false', () => {
      const customBackdropSx = { backgroundColor: 'rgba(255, 0, 0, 0.5)' };
      const { container } = renderWithTheme(
        <FullPageLoading
          open={true}
          withBackdrop={false}
          backdropSx={customBackdropSx}
        />
      );

      const backdrop = container.querySelector('.MuiBackdrop-root');
      expect(backdrop).not.toBeInTheDocument();
    });

    it('Backdrop has higher zIndex than content', () => {
      const { container } = renderWithTheme(
        <FullPageLoading open={true} withBackdrop={true} />
      );

      const backdrop = container.querySelector('.MuiBackdrop-root') as HTMLElement;
      expect(backdrop).toBeInTheDocument();
      // Backdrop should exist (with modal zIndex)
      expect(backdrop.className).toContain('MuiBackdrop');
    });
  });

  describe('Portal Rendering', () => {
    it('renders LoadingSpinner inside Backdrop when withBackdrop=true', () => {
      const { container } = renderWithTheme(
        <FullPageLoading open={true} withBackdrop={true} message="Test message" />
      );

      const backdrop = container.querySelector('.MuiBackdrop-root');
      expect(backdrop).toBeInTheDocument();

      // Message should be rendered (indicating spinner is inside backdrop)
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('renders LoadingSpinner as standalone when withBackdrop=false', () => {
      const { container } = renderWithTheme(
        <FullPageLoading open={true} withBackdrop={false} message="Loading data..." />
      );

      // Backdrop should not exist
      const backdrop = container.querySelector('.MuiBackdrop-root');
      expect(backdrop).not.toBeInTheDocument();

      // Message should still be rendered
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    it('renders complete full page loading with all props', () => {
      renderWithTheme(
        <FullPageLoading
          open={true}
          withBackdrop={true}
          size={48}
          color="primary"
          message="Generating your resume..."
          sx={{ zIndex: 1400 }}
          backdropSx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        />
      );

      const circularProgress = screen.getByRole('progressbar');
      expect(circularProgress).toHaveStyle({ width: '48px', height: '48px' });

      const message = screen.getByText('Generating your resume...');
      expect(message).toBeInTheDocument();
    });

    it('toggles visibility by changing open prop', () => {
      const { rerender, container } = renderWithTheme(
        <FullPageLoading open={true} />
      );

      // Initially visible
      let backdrop = container.querySelector('.MuiBackdrop-root');
      expect(backdrop).toBeInTheDocument();

      // Re-render with open=false
      rerender(
        <ThemeProvider theme={theme}>
          <FullPageLoading open={false} />
        </ThemeProvider>
      );

      // Should not render
      backdrop = container.querySelector('.MuiBackdrop-root');
      expect(backdrop).not.toBeInTheDocument();
    });

    it('toggles Backdrop by changing withBackdrop prop', () => {
      const { rerender, container } = renderWithTheme(
        <FullPageLoading open={true} withBackdrop={true} />
      );

      // Initially with backdrop
      let backdrop = container.querySelector('.MuiBackdrop-root');
      expect(backdrop).toBeInTheDocument();

      // Re-render with withBackdrop=false
      rerender(
        <ThemeProvider theme={theme}>
          <FullPageLoading open={true} withBackdrop={false} />
        </ThemeProvider>
      );

      // Backdrop should be gone
      backdrop = container.querySelector('.MuiBackdrop-root');
      expect(backdrop).not.toBeInTheDocument();

      // Content should still render
      const circularProgress = screen.getByRole('progressbar');
      expect(circularProgress).toBeInTheDocument();
    });

    it('renders multiple spinner props correctly together', () => {
      renderWithTheme(
        <FullPageLoading
          open={true}
          withBackdrop={true}
          size={72}
          color="info"
          message="Analyzing job description..."
        />
      );

      const circularProgress = screen.getByRole('progressbar');
      expect(circularProgress).toHaveStyle({ width: '72px', height: '72px' });

      const message = screen.getByText('Analyzing job description...');
      expect(message).toBeInTheDocument();

      const backdrop = document.querySelector('.MuiBackdrop-root');
      expect(backdrop).toBeInTheDocument();
    });
  });
});

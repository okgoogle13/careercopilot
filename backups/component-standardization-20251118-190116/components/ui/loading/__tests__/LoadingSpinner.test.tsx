import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LoadingSpinner from '../LoadingSpinner';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('LoadingSpinner', () => {
  it('renders CircularProgress with default size 40', () => {
    renderWithTheme(<LoadingSpinner />);

    const circularProgress = screen.getByRole('progressbar');
    expect(circularProgress).toBeInTheDocument();
    expect(circularProgress).toHaveStyle({ width: '40px', height: '40px' });
  });

  it('renders CircularProgress with custom size', () => {
    renderWithTheme(<LoadingSpinner size={60} />);

    const circularProgress = screen.getByRole('progressbar');
    expect(circularProgress).toBeInTheDocument();
    expect(circularProgress).toHaveStyle({ width: '60px', height: '60px' });
  });

  it('applies primary color variant', () => {
    const { container } = renderWithTheme(<LoadingSpinner color="primary" />);

    const circularProgress = container.querySelector('svg circle');
    expect(circularProgress).toBeInTheDocument();
  });

  it('applies secondary color variant', () => {
    const { container } = renderWithTheme(<LoadingSpinner color="secondary" />);

    const circularProgress = container.querySelector('svg circle');
    expect(circularProgress).toBeInTheDocument();
  });

  it('applies success color variant', () => {
    const { container } = renderWithTheme(<LoadingSpinner color="success" />);

    const circularProgress = container.querySelector('svg circle');
    expect(circularProgress).toBeInTheDocument();
  });

  it('applies error color variant', () => {
    const { container } = renderWithTheme(<LoadingSpinner color="error" />);

    const circularProgress = container.querySelector('svg circle');
    expect(circularProgress).toBeInTheDocument();
  });

  it('applies inherit color variant', () => {
    const { container } = renderWithTheme(<LoadingSpinner color="inherit" />);

    const circularProgress = container.querySelector('svg circle');
    expect(circularProgress).toBeInTheDocument();
  });

  it('displays message when provided', () => {
    renderWithTheme(<LoadingSpinner message="Loading..." />);

    const message = screen.getByText('Loading...');
    expect(message).toBeInTheDocument();
  });

  it('does not display message when not provided', () => {
    const { container } = renderWithTheme(<LoadingSpinner />);

    const messageBox = container.querySelector('span');
    expect(messageBox).not.toBeInTheDocument();
  });

  it('applies custom sx styles', () => {
    const customSx = { padding: 4, backgroundColor: 'red' };
    const { container } = renderWithTheme(<LoadingSpinner sx={customSx} />);

    const boxElement = container.firstChild as HTMLElement;
    expect(boxElement).toHaveStyle('padding: 32px');
  });

  it('centers content using flexbox', () => {
    const { container } = renderWithTheme(<LoadingSpinner />);

    const boxElement = container.firstChild as HTMLElement;
    expect(boxElement).toHaveStyle('display: flex');
    expect(boxElement).toHaveStyle('flex-direction: column');
    expect(boxElement).toHaveStyle('align-items: center');
    expect(boxElement).toHaveStyle('justify-content: center');
  });
});

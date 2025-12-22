import React from 'react';
import { render, screen } from '@testing-library/react';
import { M3Appshell } from './M3Appshell';

describe('M3Appshell Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders with children', () => {
      render(<M3Appshell>Main Content</M3Appshell>);
      expect(screen.getByText('Main Content')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Appshell>Test</M3Appshell>);
      const appshell = container.querySelector('.m3-appshell');
      expect(appshell).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Appshell className="custom-class">Test</M3Appshell>
      );
      const appshell = container.querySelector('.custom-class');
      expect(appshell).toBeInTheDocument();
    });

    test('renders main content area', () => {
      render(<M3Appshell>Content</M3Appshell>);
      const main = screen.getByTestId('m3-appshell-main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveTextContent('Content');
    });

    test('renders container element', () => {
      const { container } = render(<M3Appshell>Test</M3Appshell>);
      const containerEl = container.querySelector('.m3-appshell__container');
      expect(containerEl).toBeInTheDocument();
    });
  });

  // Layout Structure Tests
  describe('Layout Structure', () => {
    test('renders appshell with correct structure', () => {
      const { container } = render(<M3Appshell>Test</M3Appshell>);
      const appshell = container.querySelector('.m3-appshell');
      expect(appshell).toBeInTheDocument();
    });

    test('renders container element', () => {
      const { container } = render(<M3Appshell>Test</M3Appshell>);
      const containerEl = container.querySelector('.m3-appshell__container');
      expect(containerEl).toBeInTheDocument();
    });

    test('renders main content element', () => {
      const { container } = render(<M3Appshell>Test</M3Appshell>);
      const main = container.querySelector('.m3-appshell__main');
      expect(main).toBeInTheDocument();
    });

    test('container has correct class', () => {
      const { container } = render(<M3Appshell>Test</M3Appshell>);
      const containerEl = container.querySelector('.m3-appshell__container');
      expect(containerEl).toHaveClass('m3-appshell__container');
    });
  });

  // Navbar Slot Tests
  describe('Navbar Slot', () => {
    test('renders navbar when provided', () => {
      render(
        <M3Appshell navbar={<div>Navbar Content</div>}>
          Main Content
        </M3Appshell>
      );
      expect(screen.getByText('Navbar Content')).toBeInTheDocument();
    });

    test('navbar has correct test id', () => {
      render(
        <M3Appshell navbar={<div>Navbar</div>}>
          Content
        </M3Appshell>
      );
      expect(screen.getByTestId('m3-appshell-navbar')).toBeInTheDocument();
    });

    test('does not render navbar when not provided', () => {
      render(<M3Appshell>Content</M3Appshell>);
      expect(screen.queryByTestId('m3-appshell-navbar')).not.toBeInTheDocument();
    });

    test('navbar is positioned before main content', () => {
      const { container } = render(
        <M3Appshell navbar={<div>Navbar</div>}>
          Content
        </M3Appshell>
      );
      const navbar = container.querySelector('.m3-appshell__navbar');
      const main = container.querySelector('.m3-appshell__main');
      expect(navbar?.compareDocumentPosition(main!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });
  });

  // Sidebar Slot Tests
  describe('Sidebar Slot', () => {
    test('renders sidebar when provided', () => {
      render(
        <M3Appshell sidebar={<div>Sidebar Content</div>}>
          Main Content
        </M3Appshell>
      );
      expect(screen.getByText('Sidebar Content')).toBeInTheDocument();
    });

    test('sidebar has correct test id', () => {
      render(
        <M3Appshell sidebar={<div>Sidebar</div>}>
          Content
        </M3Appshell>
      );
      expect(screen.getByTestId('m3-appshell-sidebar')).toBeInTheDocument();
    });

    test('does not render sidebar when not provided', () => {
      render(<M3Appshell>Content</M3Appshell>);
      expect(screen.queryByTestId('m3-appshell-sidebar')).not.toBeInTheDocument();
    });

    test('sidebar has correct width', () => {
      const { container } = render(
        <M3Appshell sidebar={<div>Sidebar</div>} sidebarWidth="320px">
          Content
        </M3Appshell>
      );
      const sidebar = container.querySelector('.m3-appshell__sidebar');
      expect(sidebar).toHaveStyle({ width: '320px' });
    });

    test('sidebar uses default width when not specified', () => {
      const { container } = render(
        <M3Appshell sidebar={<div>Sidebar</div>}>
          Content
        </M3Appshell>
      );
      const sidebar = container.querySelector('.m3-appshell__sidebar');
      expect(sidebar).toHaveStyle({ width: '280px' });
    });

    test('applies fixed-sidebar class when fixedSidebar is true', () => {
      const { container } = render(
        <M3Appshell sidebar={<div>Sidebar</div>} fixedSidebar>
          Content
        </M3Appshell>
      );
      const appshell = container.querySelector('.m3-appshell--fixed-sidebar');
      expect(appshell).toBeInTheDocument();
    });

    test('does not apply fixed-sidebar class when fixedSidebar is false', () => {
      const { container } = render(
        <M3Appshell sidebar={<div>Sidebar</div>} fixedSidebar={false}>
          Content
        </M3Appshell>
      );
      const appshell = container.querySelector('.m3-appshell--fixed-sidebar');
      expect(appshell).not.toBeInTheDocument();
    });
  });

  // Main Content Tests
  describe('Main Content', () => {
    test('renders children in main content area', () => {
      render(
        <M3Appshell>
          <div>Page Content</div>
          <div>More Content</div>
        </M3Appshell>
      );
      expect(screen.getByText('Page Content')).toBeInTheDocument();
      expect(screen.getByText('More Content')).toBeInTheDocument();
    });

    test('main content has proper class', () => {
      const { container } = render(<M3Appshell>Content</M3Appshell>);
      const main = container.querySelector('.m3-appshell__main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass('m3-appshell__main');
    });

    test('main content renders children correctly', () => {
      render(<M3Appshell>Content</M3Appshell>);
      const main = screen.getByTestId('m3-appshell-main');
      expect(main).toHaveTextContent('Content');
    });
  });

  // Slot Combination Tests
  describe('Slot Combinations', () => {
    test('renders with navbar and sidebar', () => {
      render(
        <M3Appshell
          navbar={<div>Navbar</div>}
          sidebar={<div>Sidebar</div>}
        >
          Content
        </M3Appshell>
      );
      expect(screen.getByText('Navbar')).toBeInTheDocument();
      expect(screen.getByText('Sidebar')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    test('renders with navbar only', () => {
      render(
        <M3Appshell navbar={<div>Navbar</div>}>
          Content
        </M3Appshell>
      );
      expect(screen.getByText('Navbar')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.queryByTestId('m3-appshell-sidebar')).not.toBeInTheDocument();
    });

    test('renders with sidebar only', () => {
      render(
        <M3Appshell sidebar={<div>Sidebar</div>}>
          Content
        </M3Appshell>
      );
      expect(screen.getByText('Sidebar')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.queryByTestId('m3-appshell-navbar')).not.toBeInTheDocument();
    });

    test('renders with all slots', () => {
      render(
        <M3Appshell
          navbar={<div>Navbar</div>}
          sidebar={<div>Sidebar</div>}
        >
          <div>Main Content</div>
        </M3Appshell>
      );
      expect(screen.getByTestId('m3-appshell-navbar')).toBeInTheDocument();
      expect(screen.getByTestId('m3-appshell-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('m3-appshell-main')).toBeInTheDocument();
    });
  });

  // Ref Forwarding Tests
  describe('Ref Forwarding', () => {
    test('forwards ref to root element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<M3Appshell ref={ref}>Content</M3Appshell>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass('m3-appshell');
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('main content has main role', () => {
      render(<M3Appshell>Content</M3Appshell>);
      const main = screen.getByTestId('m3-appshell-main');
      expect(main.tagName).toBe('MAIN');
    });

    test('sidebar has aside role', () => {
      render(
        <M3Appshell sidebar={<div>Sidebar</div>}>
          Content
        </M3Appshell>
      );
      const sidebar = screen.getByTestId('m3-appshell-sidebar');
      expect(sidebar.tagName).toBe('ASIDE');
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    test('handles empty children', () => {
      render(<M3Appshell>{null}</M3Appshell>);
      const main = screen.getByTestId('m3-appshell-main');
      expect(main).toBeInTheDocument();
    });

    test('handles multiple children', () => {
      render(
        <M3Appshell>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </M3Appshell>
      );
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });

    test('handles complex nested content', () => {
      render(
        <M3Appshell>
          <div>
            <h1>Title</h1>
            <p>Paragraph</p>
          </div>
        </M3Appshell>
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
    });
  });
});

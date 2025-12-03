/**
 * M3 Expressive AppShell Component
 * Implements Material Design 3 AppShell for CareerCopilot
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 * - Motion: --md-sys-motion-*
 * - Elevation: --md-sys-elevation-*
 *
 * NOTE: CSS styles (M3Appshell.css) must be imported in the application root
 * or in pages that use this component.
 */

import React from 'react';
import './M3Appshell.css';

export interface M3AppshellProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Main content to render in the content area
   */
  children: React.ReactNode;

  /**
   * Optional navbar content (rendered at the top)
   */
  navbar?: React.ReactNode;

  /**
   * Optional sidebar content (rendered on the left side)
   */
  sidebar?: React.ReactNode;

  /**
   * Sidebar width
   * @default '280px'
   */
  sidebarWidth?: string;

  /**
   * If true, sidebar is fixed on desktop
   * @default true
   */
  fixedSidebar?: boolean;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive AppShell component using design tokens.
 *
 * Provides a page wrapper with slots for navbar, sidebar, and main content.
 * Uses flex layout for responsive design.
 *
 * Example usage:
 * ```tsx
 * <M3Appshell
 *   navbar={<M3Navbar />}
 *   sidebar={<M3Sidebar />}
 * >
 *   <MainContent />
 * </M3Appshell>
 * ```
 */
export const M3Appshell = React.forwardRef<
  HTMLDivElement,
  M3AppshellProps
>(
  (
    {
      children,
      navbar,
      sidebar,
      sidebarWidth = '280px',
      fixedSidebar = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-appshell',
      fixedSidebar && 'm3-appshell--fixed-sidebar',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const containerStyle = fixedSidebar && sidebar
      ? { '--sidebar-width': sidebarWidth } as React.CSSProperties
      : undefined;

    return (
      <div
        ref={ref}
        className={classNames}
        data-testid="m3-appshell"
        {...props}
      >
        {/* Navbar Slot */}
        {navbar && (
          <div className="m3-appshell__navbar" data-testid="m3-appshell-navbar">
            {navbar}
          </div>
        )}

        {/* Main Layout Container */}
        <div className="m3-appshell__container" style={containerStyle}>
          {/* Sidebar Slot */}
          {sidebar && (
            <aside
              className="m3-appshell__sidebar"
              data-testid="m3-appshell-sidebar"
              style={{ width: sidebarWidth }}
            >
              {sidebar}
            </aside>
          )}

          {/* Main Content Area */}
          <main className="m3-appshell__main" data-testid="m3-appshell-main">
            {children}
          </main>
        </div>
      </div>
    );
  }
);

M3Appshell.displayName = 'M3Appshell';

export default M3Appshell;

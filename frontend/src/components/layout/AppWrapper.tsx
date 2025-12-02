/**
 * ELECTRIC ALCHEMIST: APP WRAPPER
 *
 * Root wrapper component that provides global styles and architectural shell.
 * Uses Electric Alchemist design system tokens.
 */

import React from 'react';

export interface AppWrapperProps {
  children: React.ReactNode;
}

/**
 * AppWrapper Component
 *
 * Provides the architectural shell (Deep Violet Void + dot grid + noise)
 * and global design system context.
 */
export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return (
    <div className="architectural-shell min-h-screen bg-surface">
      {children}
    </div>
  );
};

export default AppWrapper;


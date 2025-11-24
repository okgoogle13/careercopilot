/**
 * M3 Expressive FullPageLoading Component
 * Full-page loading overlay with centered spinner
 */
import React from 'react';
import { M3LoadingSpinner } from './M3LoadingSpinner';
import './M3FullPageLoading.css';

export interface M3FullPageLoadingProps {
  /**
   * If true, shows the loading overlay
   */
  open?: boolean;

  /**
   * Loading message to display
   */
  message?: string;
}

export const M3FullPageLoading: React.FC<M3FullPageLoadingProps> = ({
  open = true,
  message,
}) => {
  if (!open) return null;

  return (
    <div className="m3-full-page-loading" data-testid="m3-full-page-loading">
      <div className="m3-full-page-loading__backdrop" />
      <div className="m3-full-page-loading__content">
        <M3LoadingSpinner size="large" />
        {message && <p className="m3-full-page-loading__message">{message}</p>}
      </div>
    </div>
  );
};

M3FullPageLoading.displayName = 'M3FullPageLoading';

export default M3FullPageLoading;

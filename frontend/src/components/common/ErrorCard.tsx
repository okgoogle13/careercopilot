/**
 * ELECTRIC ALCHEMIST: ERROR CARD COMPONENT
 *
 * Error state card using Electric Alchemist Design System v4.4.
 * Composed of Card and Button atoms.
 */

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from '@/components';
import { Button } from '@/components/electric/button';

export interface ErrorCardProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
}

export function ErrorCard({
  title = 'Failed to Load',
  message = 'Unable to load profile data. Please check your connection and try again.',
  onRetry,
  showRetryButton = true,
}: ErrorCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-error-container rounded-lg">
          <AlertCircle className="h-5 w-5 text-error" />
        </div>
        <h3 className="text-hero text-lg font-medium text-error">{title}</h3>
      </div>

      <p className="text-human text-sm text-on-surface-variant mb-4 leading-relaxed">
        {message}
      </p>

      {showRetryButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="w-full border-error-container text-error hover:bg-error-container"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </Card>
  );
}

export function ErrorProfileCard(props: ErrorCardProps) {
  return (
    <ErrorCard
      title="Profile Load Error"
      message="Unable to load this profile. There may be a connection issue or the profile data is corrupted."
      {...props}
    />
  );
}

export default ErrorCard;




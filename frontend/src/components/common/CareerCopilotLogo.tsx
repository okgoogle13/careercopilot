/**
 * ELECTRIC ALCHEMIST: CAREER COPILOT LOGO COMPONENT
 *
 * Logo component with design system tokens.
 */

import React from 'react';
import { Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CareerCopilotLogoProps {
  className?: string;
  size?: number;
  variant?: 'full' | 'compact';
}

export function CareerCopilotLogo({
  className = '',
  size = 32,
  variant = 'full',
}: CareerCopilotLogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Briefcase className="text-primary" style={{ fontSize: size }} />
      {variant === 'full' && (
        <span
          className="text-hero font-semibold text-primary"
          style={{ fontSize: size / 2 }}
        >
          Career Copilot
        </span>
      )}
    </div>
  );
}

export default CareerCopilotLogo;


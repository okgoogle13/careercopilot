import React, { ReactNode } from 'react';
import { cn } from '../ui/utils';

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  maxWidth = '2xl',
  padding = 'md',
  fullWidth = false,
}) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-2 py-4 sm:px-4',
    md: 'px-4 py-6 sm:px-6',
    lg: 'px-6 py-8 sm:px-8',
    xl: 'px-8 py-10 sm:px-10',
  };

  return (
    <div
      className={cn(
        'w-full mx-auto',
        !fullWidth && maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageContainer;

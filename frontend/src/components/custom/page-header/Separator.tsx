import React from 'react';
import './Separator.css';

interface SeparatorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const Separator: React.FC<SeparatorProps> = ({
  className = '',
  orientation = 'horizontal',
}) => {
  return (
    <div
      className={`separator separator-${orientation} ${className}`}
      role="separator"
      aria-orientation={orientation}
    />
  );
};

export default Separator;

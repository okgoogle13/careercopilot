import * as React from 'react';
import { cn } from '../../lib/utils';

export type LeafRole = 'hero' | 'title' | 'body' | 'data';

export interface LeafProps {
  role?: LeafRole;
  label?: string;
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

const roleClasses: Record<LeafRole, string> = {
  hero: 'text-4xl md:text-5xl font-bloom',
  title: 'text-2xl font-bloom',
  body: 'text-base font-field-note',
  data: 'text-sm font-mono',
};

export const Leaf: React.FC<LeafProps> = ({
  role = 'body',
  label,
  as,
  className,
  children,
}) => {
  const Tag = as ?? (role === 'hero' ? 'h1' : role === 'title' ? 'h2' : role === 'data' ? 'code' : 'p');

  return (
    <Tag className={cn('text-on-surface', roleClasses[role], className)}>
      {label && role === 'hero' ? (
        <span className="block text-xs uppercase tracking-widest font-annotation text-secondary-flannel-flower">
          {label}
        </span>
      ) : null}
      {children}
    </Tag>
  );
};

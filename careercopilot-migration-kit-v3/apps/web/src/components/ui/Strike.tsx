import type { PropsWithChildren } from 'react';

export interface StrikeProps extends PropsWithChildren {
  eyebrow?: string;
  className?: string;
}

export function Strike({ children, eyebrow, className = '' }: StrikeProps) {
  return (
    <header className={`strike ${className}`.trim()}>
      {eyebrow ? <p className="strike__eyebrow">{eyebrow}</p> : null}
      <p className="strike__copy">{children}</p>
    </header>
  );
}

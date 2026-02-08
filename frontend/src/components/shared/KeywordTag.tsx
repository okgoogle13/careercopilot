interface KeywordTagProps {
  keyword: string;
  variant?: 'matched' | 'missing';
  className?: string;
}

export function KeywordTag({ keyword, variant = 'matched', className = '' }: KeywordTagProps) {
  return (
    <span
      className={`
        px-4 py-2 rounded-pebble text-xs uppercase tracking-wider font-mono font-bold
        ${variant === 'matched'
          ? 'bg-secondary-container text-on-secondary-container border border-secondary'
          : 'bg-error-container text-on-error-container border border-error'
        }
        ${className}
      `}
    >
      {keyword}
    </span>
  );
}
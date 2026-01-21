interface PageHeaderProps {
  title: string;
  highlightedWord?: string;
  description?: string;
  className?: string;
}

export function PageHeader({
  title,
  highlightedWord,
  description,
  className = '',
}: PageHeaderProps) {
  const renderTitle = () => {
    if (!highlightedWord) {
      return <span>{title}</span>;
    }

    const parts = title.split(highlightedWord);
    return (
      <>
        {parts[0]}
        <span className="text-primary-wattle-gold italic font-light font-bloom-soft">{highlightedWord}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="mb-2 text-display-large-gallery font-bloom font-black text-on-surface-parchment uppercase tracking-tight">
        {renderTitle()}
      </h2>
      {description && <p className="text-on-surface-variant text-body-large-gallery font-field-note">{description}</p>}
    </div>
  );
}

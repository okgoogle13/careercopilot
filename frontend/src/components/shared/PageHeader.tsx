interface PageHeaderProps {
  title: string;
  highlightedWord?: string;
  description?: string;
  annotation?: string;
  cursiveAnnotation?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  highlightedWord,
  description,
  annotation,
  cursiveAnnotation = true,
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
        <span className="text-secondary-waratah-crimson cursive text-curator-large px-1">{highlightedWord}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className={`mb-8 ${className} flex flex-col items-start`}>
      <h2 className="mb-2 text-bloom-ultra text-3xl md:text-4xl uppercase tracking-tight">
        {renderTitle()}
      </h2>

      {annotation && (
        <div className="mb-2">
          <span className={cursiveAnnotation ? "text-curator-annotation rotate-quirky-ccw" : "text-annotation-data"}>
            → {annotation}
          </span>
        </div>
      )}

      {description && (
        <p className="text-on-surface-variant text-lg font-field-note italic opacity-80">
          {description}
        </p>
      )}
    </div>
  );
}

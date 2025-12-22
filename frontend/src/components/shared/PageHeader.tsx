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
  className = ''
}: PageHeaderProps) {
  const renderTitle = () => {
    if (!highlightedWord) {
      return <span>{title}</span>;
    }

    const parts = title.split(highlightedWord);
    return (
      <>
        {parts[0]}
        <span className="text-[#D0BCFF] italic font-light">{highlightedWord}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="mb-2 text-[4.5rem] leading-[1.1] font-[800] text-[#E6E1E5] uppercase tracking-tight">
        {renderTitle()}
      </h2>
      {description && (
        <p className="text-[#CAC4D0] text-base">{description}</p>
      )}
    </div>
  );
}

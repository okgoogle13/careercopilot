import React from 'react';

interface KeywordsListProps {
  title: string;
  keywords: string[];
  variant: 'matched' | 'missing';
}

/**
 * Displays a list of keywords with appropriate styling based on match status
 */
export const KeywordsList: React.FC<KeywordsListProps> = ({
  title,
  keywords,
  variant,
}) => {
  const variantStyles = {
    matched: {
      container: 'bg-green-50 border-green-200',
      badge: 'bg-green-100 text-green-800',
      icon: '✓',
      iconColor: 'text-green-600',
    },
    missing: {
      container: 'bg-red-50 border-red-200',
      badge: 'bg-red-100 text-red-800',
      icon: '✗',
      iconColor: 'text-red-600',
    },
  };

  const styles = variantStyles[variant];

  if (!keywords || keywords.length === 0) {
    return (
      <div className={`p-4 rounded-lg border ${styles.container}`}>
        <h3 className="text-xl font-semibold mb-3 text-gray-900 flex items-center">
          <span className={`mr-2 ${styles.iconColor}`}>{styles.icon}</span>
          {title}
        </h3>
        <p className="text-sm text-gray-600">
          {variant === 'matched'
            ? 'No specific keywords were identified as matches.'
            : 'No missing keywords identified - great job!'}
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg border ${styles.container}`}>
      <h3 className="text-xl font-semibold mb-3 text-gray-900 flex items-center">
        <span className={`mr-2 ${styles.iconColor}`}>{styles.icon}</span>
        {title}
        <span className="ml-2 text-sm font-normal text-gray-600">
          ({keywords.length})
        </span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <span
            key={index}
            className={`${styles.badge} text-xs font-medium px-2.5 py-1 rounded-full`}
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
};

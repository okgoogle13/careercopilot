import React from 'react';

interface ScoreBreakdownProps {
  breakdown: {
    keywordScore: number;
    semanticScore: number;
    formattingScore: number;
  };
}

/**
 * Displays the detailed breakdown of ATS scores by category
 */
export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ breakdown }) => {
  const scoreItems = [
    { label: 'Keyword Match', value: breakdown.keywordScore, color: 'text-blue-600' },
    { label: 'Semantic Relevance', value: breakdown.semanticScore, color: 'text-green-600' },
    { label: 'Formatting Compliance', value: breakdown.formattingScore, color: 'text-purple-600' },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">Score Breakdown</h3>
      <ul className="space-y-3">
        {scoreItems.map((item, index) => (
          <li key={index} className="flex justify-between items-center">
            <span className="text-gray-700">{item.label}:</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-current ${item.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
              <strong className={`${item.color} min-w-[3rem] text-right`}>
                {item.value.toFixed(1)}%
              </strong>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
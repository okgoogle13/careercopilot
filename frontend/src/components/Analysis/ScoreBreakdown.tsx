import React from 'react';

interface ScoreBreakdownProps {
  breakdown: {
    keywordScore: number;
    semanticScore: number;
    formattingScore: number;
  };
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ breakdown }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">Score Breakdown</h3>
      <ul className="space-y-2">
        <li className="flex justify-between">
          <span>Keyword Match:</span>{' '}
          <strong>{breakdown.keywordScore.toFixed(1)}%</strong>
        </li>
        <li className="flex justify-between">
          <span>Semantic Relevance:</span>{' '}
          <strong>{breakdown.semanticScore.toFixed(1)}%</strong>
        </li>
        <li className="flex justify-between">
          <span>Formatting Compliance:</span>{' '}
          <strong>{breakdown.formattingScore.toFixed(1)}%</strong>
        </li>
      </ul>
    </div>
  );
};

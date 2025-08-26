import React from 'react';

interface ScoreBreakdownProps {
  breakdown: {
    keywordScore: number;
    semanticScore: number;
    formattingScore: number;
  };
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ breakdown }) => {
  const {
    keywordScore = 0,
    semanticScore = 0,
    formattingScore = 0,
  } = breakdown || {};
  const fmt = (n: number) =>
    `${Math.min(100, Math.max(0, Number.isFinite(n) ? n : 0)).toFixed(1)}%`;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">Score Breakdown</h3>
      <ul className="space-y-2">
        <li className="flex justify-between">
          <span>Keyword Match:</span>{' '}
          <strong>{fmt(keywordScore)}</strong>
        </li>
        <li className="flex justify-between">
          <span>Semantic Relevance:</span>{' '}
          <strong>{fmt(semanticScore)}</strong>
        </li>
        <li className="flex justify-between">
          <span>Formatting Compliance:</span>{' '}
          <strong>{fmt(formattingScore)}</strong>
        </li>
      </ul>
    </div>
  );
};
  );
};

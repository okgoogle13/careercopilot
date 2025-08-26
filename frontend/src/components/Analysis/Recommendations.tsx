import React from 'react';

interface RecommendationsProps {
  recommendations: string[];
}

export const Recommendations: React.FC<RecommendationsProps> = ({
  recommendations,
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">Top Recommendations</h3>
      <ul className="list-disc list-inside space-y-2 text-sm">
        {recommendations.map((rec, i) => (
          <li key={rec}>{rec}</li>
        ))}
      </ul>
    </div>
  );
};

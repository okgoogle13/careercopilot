import React from 'react';

interface RecommendationsListProps {
  recommendations: string[];
}

/**
 * Displays a list of actionable recommendations for improving ATS score
 */
export const RecommendationsList: React.FC<RecommendationsListProps> = ({ 
  recommendations 
}) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div>
        <h3 className="text-xl font-semibold mb-3 text-gray-900">Recommendations</h3>
        <p className="text-gray-600 text-sm">
          Great work! Your resume looks well-optimized for this position.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">Top Recommendations</h3>
      <ul className="space-y-2">
        {recommendations.map((recommendation, index) => (
          <li key={index} className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <span className="text-sm text-gray-700 leading-relaxed">
              {recommendation}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};